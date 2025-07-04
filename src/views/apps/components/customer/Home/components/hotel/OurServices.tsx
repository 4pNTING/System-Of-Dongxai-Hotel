'use client'

import React from 'react'
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
  Rating
} from '@mui/material'
import {
  RoomService,
  Restaurant,
  BusinessCenter,
  AirportShuttle,
  Spa,
  Build
} from '@mui/icons-material'

interface Service {
  id: number
  title: string
  titleLao: string
  description: string
  descriptionLao: string
  icon: React.ReactNode
  image: string
  price?: string
  rating: number
  features: string[]
  available24h: boolean
}

const OurServices: React.FC = () => {
  const services: Service[] = [
    {
      id: 1,
      title: "Luxury Rooms",
      titleLao: "ຫ້ອງພັກຫຼູຫຼາ",
      description: "Spacious and comfortable rooms with modern amenities",
      descriptionLao: "ຫ້ອງພັກກ້ວາງຂວາງ ແລະ ສະດວກສະບາຍ ພ້ອມສິ່ງອຳນວຍຄວາມສະດວກທີ່ທັນສະໄໝ",
      icon: <RoomService sx={{ fontSize: 40, color: '#d4851c' }} />,
      image: "/images/room1.jpg",
      price: "From $45/night",
      rating: 4.8,
      features: ["Free WiFi", "Air Conditioning", "Private Bathroom", "Mini Bar"],
      available24h: true
    },
    {
      id: 2,
      title: "Restaurant & Bar",
      titleLao: "ຮ້ານອາຫານ ແລະ ບາ",
      description: "Authentic Lao cuisine and international dishes",
      descriptionLao: "ອາຫານລາວແທ້ ແລະ ອາຫານນາໆຊາດ",
      icon: <Restaurant sx={{ fontSize: 40, color: '#d4851c' }} />,
      image: "/images/room2.jpg",
      rating: 4.6,
      features: ["Local Cuisine", "International Menu", "Room Service", "Bar"],
      available24h: false
    },
    {
      id: 3,
      title: "Business Center",
      titleLao: "ສູນທຸລະກິດ",
      description: "Modern facilities for business travelers",
      descriptionLao: "ສິ່ງອຳນວຍຄວາມສະດວກທັນສະໄໝສຳລັບນັກທ່ອງທ່ຽວທຸລະກິດ",
      icon: <BusinessCenter sx={{ fontSize: 40, color: '#d4851c' }} />,
      image: "/images/TEST.jpg",
      rating: 4.5,
      features: ["Meeting Rooms", "High-Speed Internet", "Printing Services", "Conference Hall"],
      available24h: true
    },
    {
      id: 4,
      title: "Transportation",
      titleLao: "ການຂົນສົ່ງ",
      description: "Airport shuttle and local transportation services",
      descriptionLao: "ບໍລິການລົດຮັບສົ່ງສະໜາມບິນ ແລະ ການຂົນສົ່ງທ້ອງຖິ່ນ",
      icon: <AirportShuttle sx={{ fontSize: 40, color: '#d4851c' }} />,
      image: "/images/dongxai10.jpg",
      rating: 4.7,
      features: ["Airport Pickup", "City Tours", "Car Rental", "Motorbike Rental"],
      available24h: true
    },
    {
      id: 5,
      title: "Spa & Wellness",
      titleLao: "ສະປາ ແລະ ສຸຂະພາບ",
      description: "Traditional Lao massage and wellness treatments",
      descriptionLao: "ນວດແບບລາວພື້ນເມືອງ ແລະ ການປິ່ນປົວສຸຂະພາບ",
      icon: <Spa sx={{ fontSize: 40, color: '#d4851c' }} />,
      image: "/images/1.jpg",
      price: "From $20/session",
      rating: 4.9,
      features: ["Traditional Massage", "Herbal Treatment", "Relaxation", "Wellness Packages"],
      available24h: false
    },
    {
      id: 6,
      title: "Additional Services",
      titleLao: "ບໍລິການເພີ່ມເຕີມ",
      description: "Laundry, security, and other convenience services",
      descriptionLao: "ບໍລິການຊັກຜ້າ, ຄວາມປອດໄພ, ແລະ ບໍລິການສະດວກອື່ນໆ",
      icon: <Build sx={{ fontSize: 40, color: '#d4851c' }} />,
      image: "/images/room1.jpg",
      rating: 4.4,
      features: ["Laundry Service", "24/7 Security", "Concierge", "Luggage Storage"],
      available24h: true
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
          Our Services
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
          ບໍລິການຄຸນນະພາບສູງສຳລັບການພັກຜ່ອນທີ່ສົມບູນແບບ
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(212, 133, 28, 0.3)'
                }
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={service.image}
                  alt={service.title}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '50%',
                    p: 1,
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  {service.icon}
                </Box>
                {service.available24h && (
                  <Chip
                    label="24/7"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      bgcolor: '#d4851c',
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                )}
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      sx={{ 
                        fontWeight: 600,
                        color: '#333',
                        mb: 0.5
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#d4851c',
                        fontWeight: 500,
                        fontSize: '0.9rem'
                      }}
                    >
                      {service.titleLao}
                    </Typography>
                  </Box>
                  {service.price && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#d4851c',
                        fontWeight: 600,
                        fontSize: '0.9rem'
                      }}
                    >
                      {service.price}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating 
                    value={service.rating} 
                    precision={0.1} 
                    size="small" 
                    readOnly 
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                    {service.rating}
                  </Typography>
                </Box>

                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#555',
                    mb: 2,
                    lineHeight: 1.6
                  }}
                >
                  {service.description}
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
                  {service.descriptionLao}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  {service.features.map((feature, idx) => (
                    <Chip
                      key={idx}
                      label={feature}
                      size="small"
                      variant="outlined"
                      sx={{
                        mr: 0.5,
                        mb: 0.5,
                        borderColor: '#d4851c',
                        color: '#d4851c',
                        fontSize: '0.75rem',
                        '&:hover': {
                          bgcolor: 'rgba(212, 133, 28, 0.1)'
                        }
                      }}
                    />
                  ))}
                </Box>

                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderColor: '#d4851c',
                    color: '#d4851c',
                    fontWeight: 600,
                    py: 1,
                    borderRadius: '12px',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: '#d4851c',
                      color: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 16px rgba(212, 133, 28, 0.3)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default OurServices