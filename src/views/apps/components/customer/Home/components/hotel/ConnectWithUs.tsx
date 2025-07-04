'use client'

import React from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  Chip
} from '@mui/material'
import {
  Facebook,
  WhatsApp,
  VideoLibrary,
  Phone,
  Email,
  LocationOn
} from '@mui/icons-material'

interface SocialPlatform {
  id: number
  name: string
  nameLao: string
  icon: React.ReactNode
  color: string
  followers: string
  description: string
  descriptionLao: string
  url: string
  verified: boolean
  contentType: string[]
}

const ConnectWithUs: React.FC = () => {
  const socialPlatforms: SocialPlatform[] = [
    {
      id: 1,
      name: "Facebook",
      nameLao: "ເຟສບຸກ",
      icon: <Facebook sx={{ fontSize: 40 }} />,
      color: "#1877F2",
      followers: "5.2K",
      description: "Latest updates, photos, and customer reviews",
      descriptionLao: "ຂ່າວສານລ່າສຸດ, ຮູບພາບ, ແລະ ຄຳຄິດເຫັນຂອງລູກຄ້າ",
      url: "https://facebook.com/dongxaihotel",
      verified: true,
      contentType: ["Photos", "Reviews", "Events"]
    },
    {
      id: 2,
      name: "TikTok",
      nameLao: "ທິກທອກ",
      icon: <VideoLibrary sx={{ fontSize: 40 }} />,
      color: "#000000",
      followers: "2.1K",
      description: "Fun videos showcasing hotel life and local culture",
      descriptionLao: "ວິດີໂອສະນຸກສະໜານສະແດງຊີວິດໂຮງແຮມ ແລະ ວັດທະນະທຳທ້ອງຖິ່ນ",
      url: "https://tiktok.com/@dongxaihotel",
      verified: false,
      contentType: ["Videos", "Tours", "Culture"]
    },
    {
      id: 3,
      name: "WhatsApp",
      nameLao: "ວອດແອັບ",
      icon: <WhatsApp sx={{ fontSize: 40 }} />,
      color: "#25D366",
      followers: "Chat",
      description: "Direct messaging for instant booking assistance",
      descriptionLao: "ສົ່ງຂໍ້ຄວາມໂດຍກົງສຳລັບການຊ່ວຍເຫຼືອການຈອງທັນທີ",
      url: "https://wa.me/8562077763575",
      verified: true,
      contentType: ["Chat", "Booking", "Support"]
    }
  ]

  return (
    <Box sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          sx={{ 
            fontWeight: 600, 
            color: '#d4851c', 
            mb: 2,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          Connect With Us
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#666', 
            maxWidth: 600, 
            mx: 'auto',
            fontSize: { xs: '1rem', md: '1.1rem' }
          }}
        >
          ຕິດຕໍ່ກັບພວກເຮົາຜ່ານແພລັດຟອມຕ່າງໆ ສຳລັບການອັບເດດ ແລະ ການບໍລິການ
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {socialPlatforms.map((platform) => (
          <Grid item xs={12} sm={6} md={4} key={platform.id}>
            <Card
              sx={{
                height: '100%',
                borderRadius: '20px',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                border: `2px solid ${platform.color}20`,
                background: `linear-gradient(135deg, ${platform.color}10, ${platform.color}05)`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 20px 40px ${platform.color}30`,
                  border: `2px solid ${platform.color}50`
                }
              }}
              onClick={() => window.open(platform.url, '_blank')}
            >
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: platform.color,
                      color: 'white',
                      width: 56,
                      height: 56,
                      mr: 2
                    }}
                  >
                    {platform.icon}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          color: '#333'
                        }}
                      >
                        {platform.name}
                      </Typography>
                      {platform.verified && (
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            bgcolor: '#1976d2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '12px'
                          }}
                        >
                          ✓
                        </Box>
                      )}
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#d4851c',
                        fontWeight: 500
                      }}
                    >
                      {platform.nameLao}
                    </Typography>
                  </Box>
                  <Chip
                    label={platform.followers}
                    size="small"
                    sx={{
                      bgcolor: `${platform.color}20`,
                      color: platform.color,
                      fontWeight: 600,
                      border: `1px solid ${platform.color}40`
                    }}
                  />
                </Box>

                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#555',
                    mb: 1.5,
                    lineHeight: 1.6
                  }}
                >
                  {platform.description}
                </Typography>

                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#777',
                    mb: 3,
                    fontSize: '0.85rem',
                    lineHeight: 1.5
                  }}
                >
                  {platform.descriptionLao}
                </Typography>

                <Box sx={{ mb: 3, flexGrow: 1 }}>
                  {platform.contentType.map((type, idx) => (
                    <Chip
                      key={idx}
                      label={type}
                      size="small"
                      variant="outlined"
                      sx={{
                        mr: 0.5,
                        mb: 0.5,
                        borderColor: platform.color,
                        color: platform.color,
                        fontSize: '0.75rem',
                        '&:hover': {
                          bgcolor: `${platform.color}15`
                        }
                      }}
                    />
                  ))}
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={platform.icon}
                  sx={{
                    bgcolor: platform.color,
                    color: 'white',
                    fontWeight: 600,
                    py: 1.2,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    '&:hover': {
                      bgcolor: platform.color,
                      opacity: 0.9,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 16px ${platform.color}50`
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {platform.name === 'WhatsApp' ? 'Chat Now' : `Follow on ${platform.name}`}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Contact Bar */}
      <Box
        sx={{
          mt: 6,
          p: 4,
          background: 'linear-gradient(135deg, #2c3e50, #34495e)',
          borderRadius: '20px',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Quick Contact
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Phone sx={{ color: '#d4851c' }} />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                +856 20 7776 3575
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Email sx={{ color: '#d4851c' }} />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                info@dongxaihotel.com
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <LocationOn sx={{ color: '#d4851c' }} />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Thakhaek, Laos
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default ConnectWithUs