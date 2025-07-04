'use client'

import {
  Box,
  Typography,
  Container,
  Grid,
  Link,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Facebook,
  Instagram,
  WhatsApp,
  Phone,
  Email,
  LocationOn,
  Language
} from '@mui/icons-material'

const CustomerFooter = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #2c3e50, #34495e)',
        color: 'white',
        mt: 'auto'
      }}
    >
      {/* Main Footer Content */}
      <Container maxWidth="xl">
        <Box sx={{ py: 6 }}>
          <Grid container spacing={4}>
            {/* Hotel Info */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      background: 'linear-gradient(135deg, #d4851c, #f4a261)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.5rem'
                    }}
                  >
                    D
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#d4851c' }}>
                      Dongxai Hotel
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#bbb' }}>
                      Luxury & Comfort
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#bbb', lineHeight: 1.6, mb: 2 }}>
                  Experience exceptional hospitality in the heart of Thakhaek. 
                  We provide luxury accommodation with traditional Lao warmth and modern amenities.
                </Typography>
                <Typography variant="body2" sx={{ color: '#d4851c', fontWeight: 500 }}>
                  ສະຖານທີ່ໃນຕົວເມືອງທ່າແຂກ ພ້ອມບໍລິການຄຸນນະພາບສູງ
                </Typography>
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#d4851c', mb: 2 }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {['Home', 'Rooms', 'Services', 'About Us', 'Contact'].map((item) => (
                  <Link
                    key={item}
                    href="#"
                    sx={{
                      color: '#bbb',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      '&:hover': {
                        color: '#d4851c',
                        transform: 'translateX(5px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {item}
                  </Link>
                ))}
              </Box>
            </Grid>

            {/* Services */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#d4851c', mb: 2 }}>
                Services
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {['Luxury Rooms', 'Restaurant', 'Business Center', 'Spa & Wellness', 'Transportation'].map((item) => (
                  <Link
                    key={item}
                    href="#"
                    sx={{
                      color: '#bbb',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      '&:hover': {
                        color: '#d4851c',
                        transform: 'translateX(5px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {item}
                  </Link>
                ))}
              </Box>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#d4851c', mb: 2 }}>
                Contact Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <LocationOn sx={{ color: '#d4851c', fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                      Nabong Village, Thakhaek District
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#bbb' }}>
                      Khammuan Province, Lao P.D.R.
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Phone sx={{ color: '#d4851c', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                    +856 20 7776 3575
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Email sx={{ color: '#d4851c', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                    info@dongxaihotel.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Language sx={{ color: '#d4851c', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                    www.dongxaihotel.com
                  </Typography>
                </Box>
              </Box>

              {/* Social Media */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ color: '#d4851c', mb: 1, fontWeight: 600 }}>
                  Follow Us
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {[
                    { icon: <Facebook />, color: '#1877F2', url: 'https://facebook.com/dongxaihotel' },
                    { icon: <WhatsApp />, color: '#25D366', url: 'https://wa.me/8562077763575' },
                    { icon: <Instagram />, color: '#E4405F', url: 'https://instagram.com/dongxaihotel' }
                  ].map((social, index) => (
                    <IconButton
                      key={index}
                      component="a"
                      href={social.url}
                      target="_blank"
                      sx={{
                        color: social.color,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        width: 40,
                        height: 40,
                        '&:hover': {
                          backgroundColor: social.color,
                          color: 'white',
                          transform: 'translateY(-3px)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Divider sx={{ borderColor: 'rgba(212, 133, 28, 0.2)' }} />

      {/* Bottom Footer */}
      <Container maxWidth="xl">
        <Box 
          sx={{ 
            py: 3,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant="body2" sx={{ color: '#bbb' }}>
            © {new Date().getFullYear()} Dongxai Hotel. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="#" sx={{ color: '#bbb', textDecoration: 'none', fontSize: '0.9rem', '&:hover': { color: '#d4851c' } }}>
              Privacy Policy
            </Link>
            <Link href="#" sx={{ color: '#bbb', textDecoration: 'none', fontSize: '0.9rem', '&:hover': { color: '#d4851c' } }}>
              Terms of Service
            </Link>
            <Link href="#" sx={{ color: '#bbb', textDecoration: 'none', fontSize: '0.9rem', '&:hover': { color: '#d4851c' } }}>
              Site Map
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default CustomerFooter