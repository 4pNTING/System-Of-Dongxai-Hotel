'use client'

import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// Components
import SwiperImage from '@views/apps/components/customer/Home/Swiper'
import OurServices from '@views/apps/components/customer/Home/components/hotel/OurServices'
import ConnectWithUs from '@views/apps/components/customer/Home/components/hotel/ConnectWithUs'

const Home = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      {/* <Box
        sx={{
          height: '60vh',
          background: 'linear-gradient(135deg, rgba(212, 133, 28, 0.8), rgba(0, 0, 0, 0.6)), url(/images/rooms/hotel1.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          mb: 4
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 300, 
              letterSpacing: 2, 
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Welcome to Dongxai Hotel
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3, 
              opacity: 0.9,
              fontSize: { xs: '1.1rem', md: '1.3rem' }
            }}
          >
            Experience luxury and comfort in the heart of Thakhaek, Khammuan Province
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: '#d4851c',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: '50px',
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 1,
              boxShadow: '0 10px 30px rgba(212, 133, 28, 0.3)',
              '&:hover': {
                bgcolor: '#b8731a',
                transform: 'translateY(-3px)',
                boxShadow: '0 15px 40px rgba(212, 133, 28, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Book Your Stay
          </Button>
        </Container>
      </Box> */}

      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>
        <Grid container spacing={6}>
          {/* Image Slider Section */}
          <Grid item xs={12}>
            <SwiperImage />
            <Divider sx={{ my: 4 }} />
          </Grid>

          {/* About Section */}
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography 
                variant="h3" 
                component="h2" 
                sx={{ 
                  fontWeight: 300, 
                  color: '#333', 
                  mb: 2 
                }}
              >
                About Dongxai Hotel
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#666', 
                  maxWidth: 600, 
                  mx: 'auto' 
                }}
              >
                Located in the vibrant city of Thakhaek, we offer exceptional hospitality and modern amenities
              </Typography>
            </Box>
            
            <Grid container spacing={4} sx={{ mb: 6 }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ pr: { md: 2 } }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: '#d4851c', 
                      mb: 2, 
                      fontWeight: 600 
                    }}
                  >
                    ກ່ຽວກັບໂຮງແຮມ
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontSize: '1.1rem', 
                      lineHeight: 1.8, 
                      color: '#555', 
                      mb: 2 
                    }}
                  >
                    ສະຖານທີ່ໃນຕົວເມືອງທ່າແຂກ, ບ້ານ ນາບົງ, ເມືອງ ທ່າແຂກ, ແຂວງ ຄຳມ່ວນ. 
                    ເປັນໂຮງແຮມທີ່ໄດ້ຮັບຄວາມນິຍົມຫຼາຍໃນເມືອງທ່າແຂກ, ຫ້ອງສະອາດ ແລະ ກ້ວາງຂວາງ.
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontSize: '1.1rem', 
                      lineHeight: 1.8, 
                      color: '#555', 
                      mb: 3 
                    }}
                  >
                    Our hotel provides a perfect blend of traditional Lao hospitality and modern comfort. 
                    Located in Nabong Village, Thakhaek District, Khammuan Province.
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: '#d4851c', fontWeight: 500 }}>
                        <Box component="i" className="fas fa-wifi" sx={{ mr: 1 }} />
                        Free WiFi
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: '#d4851c', fontWeight: 500 }}>
                        <Box component="i" className="fas fa-car" sx={{ mr: 1 }} />
                        Free Parking
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: '#d4851c', fontWeight: 500 }}>
                        <Box component="i" className="fas fa-concierge-bell" sx={{ mr: 1 }} />
                        24/7 Service
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: '#d4851c', fontWeight: 500 }}>
                        <Box component="i" className="fas fa-utensils" sx={{ mr: 1 }} />
                        Restaurant
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(212, 133, 28, 0.1), rgba(0, 0, 0, 0.05))',
                      zIndex: 1
                    }
                  }}
                >
                  <Box
                    component="img"
                    src="/images/hotel1.jpeg"
                    alt="Dongxai Hotel"
                    sx={{
                      width: '100%',
                      height: 400,
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Our Services Section */}
          <Grid item xs={12}>
            <OurServices />
            <Divider sx={{ my: 4 }} />
          </Grid>

          {/* Connect With Us Section */}
          <Grid item xs={12}>
            <ConnectWithUs />
          </Grid>

          {/* Contact Section */}
          <Grid item xs={12}>
            <Box
              sx={{
                background: 'linear-gradient(135deg, #2c3e50, #34495e)',
                color: 'white',
                borderRadius: '20px',
                p: 6,
                textAlign: 'center',
                mb: 4
              }}
            >
              <Typography 
                variant="h3" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 300,
                  color: 'white'
                }}
              >
                ຕິດຕໍ່
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 4, 
                  opacity: 0.9,
                  color: 'white'
                }}
              >
                Get in touch with us for reservations and inquiries
              </Typography>
              
              <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box component="i" className="fas fa-map-marker-alt" sx={{ fontSize: '2rem', color: '#d4851c', mb: 2, display: 'block' }} />
                    <Typography variant="h6" sx={{ color: '#d4851c', mb: 1, fontWeight: 600 }}>
                      Location
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'white', lineHeight: 1.6 }}>
                      Nabong Village, Thakhaek District<br />
                      Khammuan Province, Lao P.D.R.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box component="i" className="fas fa-phone" sx={{ fontSize: '2rem', color: '#d4851c', mb: 2, display: 'block' }} />
                    <Typography variant="h6" sx={{ color: '#d4851c', mb: 1, fontWeight: 600 }}>
                      Phone
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                      +856 20 7776 3575
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box component="i" className="fas fa-envelope" sx={{ fontSize: '2rem', color: '#d4851c', mb: 2, display: 'block' }} />
                    <Typography variant="h6" sx={{ color: '#d4851c', mb: 1, fontWeight: 600 }}>
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                      info@dongxaihotel.com
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box component="i" className="fas fa-globe" sx={{ fontSize: '2rem', color: '#d4851c', mb: 2, display: 'block' }} />
                    <Typography variant="h6" sx={{ color: '#d4851c', mb: 1, fontWeight: 600 }}>
                      Website
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                      www.dongxaihotel.com
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Quick Contact Bar */}
              <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'white' }}>
                  Quick Contact
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <Box component="i" className="fas fa-phone" sx={{ color: '#d4851c' }} />
                      <Typography variant="body1" sx={{ fontWeight: 500, color: 'white' }}>
                        +856 20 7776 3575
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <Box component="i" className="fas fa-envelope" sx={{ color: '#d4851c' }} />
                      <Typography variant="body1" sx={{ fontWeight: 500, color: 'white' }}>
                        info@dongxaihotel.com
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <Box component="i" className="fas fa-map-marker-alt" sx={{ color: '#d4851c' }} />
                      <Typography variant="body1" sx={{ fontWeight: 500, color: 'white' }}>
                        Thakhaek, Laos
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
                <Box
                  component="a"
                  href="https://facebook.com/dongxaihotel"
                  target="_blank"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    height: 50,
                    bgcolor: 'rgba(212, 133, 28, 0.2)',
                    color: '#d4851c',
                    borderRadius: '50%',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: '#d4851c',
                      color: 'white',
                      transform: 'translateY(-3px)'
                    }
                  }}
                >
                  <Box component="i" className="fab fa-facebook-f" />
                </Box>
                <Box
                  component="a"
                  href="https://wa.me/8562077763575"
                  target="_blank"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    height: 50,
                    bgcolor: 'rgba(212, 133, 28, 0.2)',
                    color: '#d4851c',
                    borderRadius: '50%',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: '#d4851c',
                      color: 'white',
                      transform: 'translateY(-3px)'
                    }
                  }}
                >
                  <Box component="i" className="fab fa-whatsapp" />
                </Box>
                <Box
                  component="a"
                  href="https://tiktok.com/@dongxaihotel"
                  target="_blank"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    height: 50,
                    bgcolor: 'rgba(212, 133, 28, 0.2)',
                    color: '#d4851c',
                    borderRadius: '50%',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: '#d4851c',
                      color: 'white',
                      transform: 'translateY(-3px)'
                    }
                  }}
                >
                  <Box component="i" className="fab fa-tiktok" />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Home