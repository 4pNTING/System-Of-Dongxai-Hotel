'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'

// Third-party Imports
import { signIn,getSession  } from 'next-auth/react'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, minLength, string, pipe, nonEmpty } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'
import type { InferInput } from 'valibot'
import classnames from 'classnames'

// Type Imports
import type { SystemMode } from '@core/types'
import type { Locale } from '@/configs/i18n'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { APP_ROUTES } from '@core/infrastructure/api/config/app-routes.config';
// Styled Custom Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

type ErrorType = {
  message: string[]
}

type FormData = InferInput<typeof schema>

// เปลี่ยน schema จาก email เป็น userName
const schema = object({
  userName: pipe(string(), minLength(1, 'This field is required')),
  password: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(5, 'Password must be at least 5 characters long')
  )
})

const Login = ({ mode }: { mode: SystemMode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errorState, setErrorState] = useState<ErrorType | null>(null)

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-login-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

  // Hooks
  const router = useRouter()
  const searchParams = useSearchParams()
  const { lang: locale } = useParams()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      userName: '',
      password: ''
    }
  })

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  // ฟังก์ชัน handleClickShowPassword
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  // ฟังก์ชัน onSubmit ใช้ NextAuth

// app/[lang]/login/page.tsx หรือไฟล์ Login.tsx ที่มีอยู่แล้ว
const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
  try {
    // ตัด whitespace ของ userName
    const trimmedUserName = data.userName.trim();
    
    console.log("Attempting login with 1:", { userName: trimmedUserName, password: data.password });
    
    const res = await signIn('credentials', {
      userName: trimmedUserName,
      password: data.password,
      redirect: false
    });

    console.log("Login response:", res);

    if (res && res.ok && !res.error) {
      // ดึงข้อมูล session เพื่อตรวจสอบประเภทผู้ใช้
      const session = await getSession();
      console.log("Session after login:", session);
      console.log("CustomerId:", session?.user?.customerId);
      
      // กำหนดหน้าที่จะนำทางไปตามประเภทผู้ใช้
      let redirectURL;
      
      if (session?.user?.roleId === 1) {
        // ถ้าเป็น customer นำทางไปยังหน้า home
        redirectURL = '/home';
      } else {
        // ถ้าเป็น staff หรือประเภทอื่น นำทางไปยังหน้า dashboard
        redirectURL = APP_ROUTES.DASHBOARD_ROUTE;
      }
      
      router.replace(getLocalizedUrl(redirectURL, locale as Locale));
    } else {
      // จัดการกรณีเกิดข้อผิดพลาด
      if (res?.error) {
        try {
          const error = JSON.parse(res.error);
          setErrorState(error);
        } catch (parseError) {
          setErrorState({ message: [res.error || 'Login failed'] });
        }
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    setErrorState({ message: ['An unexpected error occurred'] });
  }
}

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <LoginIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && <MaskImg alt='mask' src={authBackground} />}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}! 👋🏻`}</Typography>
            <Typography>Please sign-in to your account and start the adventure</Typography>
          </div>
          <Alert icon={false} className='bg-[var(--mui-palette-primary-lightOpacity)]'>
            <Typography variant='body2' color='primary'>
              Username: <span className='font-medium'>somchai5</span> / Pass:{' '}
              <span className='font-medium'>12345678</span>
            </Typography>
          </Alert>
          <form
            noValidate
            autoComplete='off'
            action={() => {}}
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-6'
          >
            <Controller
              name='userName'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  autoFocus
                  fullWidth
                  label='Username'
                  placeholder='Enter your username'
                  onChange={e => {
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  {...((errors.userName || errorState !== null) && {
                    error: true,
                    helperText: errors?.userName?.message || errorState?.message[0]
                  })}
                />
              )}
            />
            <Controller
              name='password'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Password'
                  placeholder='············'
                  id='login-password'
                  type={isPasswordShown ? 'text' : 'password'}
                  onChange={e => {
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                          <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  {...(errors.password && { error: true, helperText: errors.password.message })}
                />
              )}
            />
            <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
              <FormControlLabel control={<Checkbox defaultChecked />} label='Remember me' />
              <Typography
                className='text-end'
                color='primary'
                component={Link}
                href={getLocalizedUrl('/forgot-password', locale as Locale)}
              >
                Forgot password?
              </Typography>
            </div>
            <Button fullWidth variant='contained' type='submit'>
              Login
            </Button>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>New on our platform?</Typography>
              <Typography component={Link} href={getLocalizedUrl('/register', locale as Locale)} color='primary'>
                Create an account
              </Typography>
            </div>
           
        
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login