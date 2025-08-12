// src/libs/auth.ts
import CredentialProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import type { NextAuthOptions } from 'next-auth'
import type { Adapter } from 'next-auth/adapters'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,

  providers: [
    CredentialProvider({
      name: 'Credentials',
      type: 'credentials',
      credentials: {},
      async authorize(credentials) {
        const { userName, password } = credentials as { userName: string; password: string }

        try {
          console.log("Authenticating user:", userName);
          console.log("Backend API URL:", process.env.NEXT_PUBLIC_BACKEND_API_URL);

          // ใช้ NEXT_PUBLIC_BACKEND_API_URL แทน API_URL เพื่อเชื่อมต่อกับ backend โดยตรง
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userName, password })
          })

          console.log("Login response status:", res.status);

          if (!res.ok) {
            const contentType = res.headers.get('content-type');
            let errorMessage = 'Authentication failed';

            if (contentType?.includes('application/json')) {
              const errorData = await res.json();
              console.log("Login error data:", errorData);
              errorMessage = errorData.message || 'Invalid credentials';
            }

            throw new Error(JSON.stringify({ message: [errorMessage] }));
          }

          const data = await res.json();
          console.log("Login response:", data);

          // ตรวจสอบประเภทผู้ใช้จาก response
          // หากไม่มีฟิลด์ type ให้ดูจากฟิลด์อื่นๆ เช่น user ID
          // เช่น ถ้ามี StaffId จะถือว่าเป็น staff, ถ้ามี CustomerId จะถือว่าเป็น customer
          let userType;

          if (data.data.user?.type) {
            userType = data.data.user.type;
          } else if (data.data.type) {
            userType = data.data.type;
          } else if (data.data.user?.StaffId || data.data.StaffId) {
            userType = 'staff';
          } else if (data.data.user?.CustomerId || data.data.CustomerId) {
            userType = 'customer';
          } else {
            userType = 'staff'; // ค่าเริ่มต้นหากไม่สามารถระบุประเภทได้
          }

          // ข้อมูลที่จะส่งกลับเข้าสู่ NextAuth
          return {
            id: String(data.data.user?.id || data.data.user?.StaffId || data.data.user?.CustomerId || '1'),
            name: data.data.user?.userName || data.data.userName || userName,
            email: `${userName}@example.com`,
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
            role: data.data.user?.role || 'user',
            userName: data.data.user?.userName || data.data.userName || userName,
            roleId: data.data.user?.roleId || null,
            customerId: data.data.user?.CustomerId || data.data.CustomerId || null,
            type: userType // เพิ่มข้อมูลประเภทผู้ใช้
          }
        } catch (e: any) {
          console.error("Login error:", e);
          throw new Error(e.message);
        }
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1 day
  },

  pages: {
    signIn: '/login',
    error: '/auth/error',
    signOut: '/auth/signout'
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // เมื่อล็อกอินครั้งแรก
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        // token.role = user.roleId;
        token.roleId = user.roleId;
        token.userName = user.userName;
        token.type = user.type;
        token.customerId = user.customerId;
      }

      // ตรวจสอบว่า token ใกล้หมดอายุหรือไม่ (ถ้าต้องการทำ refresh token)
      const tokenExpiry = token.exp as number;
      const currentTime = Math.floor(Date.now() / 1000);
      if (tokenExpiry && currentTime > tokenExpiry - 300) {
        try {
          const refreshedTokens = await refreshAccessToken(token.refreshToken as string);
          if (refreshedTokens) {
            token.accessToken = refreshedTokens.accessToken;
            token.refreshToken = refreshedTokens.refreshToken;
            token.exp = refreshedTokens.exp;
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
          // ถ้าไม่สามารถ refresh ได้ ให้ทำเครื่องหมายว่า token หมดอายุ
          token.error = "RefreshAccessTokenError";
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.accessToken = token.accessToken as string;
        session.user.refreshToken = token.refreshToken as string;
        // session.user.role = token.role as string;
        session.user.userName = token.userName as string;
        session.user.id = token.sub as string;
        session.user.roleId = token.roleId as number | null;
        session.user.type = token.type as string;
        session.user.customerId = token.customerId as number | null;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      // ถ้า URL เป็น URL ภายใน ให้นำทางไปยัง URL นั้น
      if (url.startsWith(baseUrl)) return url;
      // อนุญาตให้นำทางกลับไปยัง origin URL
      if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      // ถ้าไม่ใช่ URL ภายใน ให้นำทางไปยังหน้าหลัก
      return baseUrl;
    }
  },

  events: {
    async signOut({ token }) {
      // สามารถเพิ่มโค้ดเพื่อเรียก API logout ของ backend เพื่อยกเลิก refresh token
      if (token?.refreshToken) {
        try {
          // ใช้ NEXT_PUBLIC_BACKEND_API_URL แทน API_URL
          await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken: token.refreshToken })
          });
        } catch (error) {
          console.error("Error during logout:", error);
        }
      }
    }
  }
}

// ฟังก์ชันสำหรับ refresh access token (ใช้ถ้าต้องการ)
async function refreshAccessToken(refreshToken: string) {
  try {
    // ใช้ NEXT_PUBLIC_BACKEND_API_URL แทน API_URL
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    console.log("Login response full structure:", JSON.stringify(data, null, 2));

    return {
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 // 1 hour
    };
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}

// ประกาศ type สำหรับ session ที่มี custom properties
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string;
      refreshToken?: string;
      // role?: string;
      roleId?: number | null;
      userName?: string;
      type?: string;
      customerId?: number | null;
    }
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessToken?: string;
    refreshToken?: string;
    // role?: string;
    userName?: string;
    roleId?: number | null;
    type?: string;
    customerId?: number | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    roleId?: number | null;
    userName?: string;
    type?: string;
    customerId?: number | null;
    exp?: number;
    error?: string;
  }
}