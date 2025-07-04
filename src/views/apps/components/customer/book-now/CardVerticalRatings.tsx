// CardVerticalRatings.tsx
'use client'

import { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Rating from '@mui/material/Rating'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { LocationOn, RateReview, Star, Verified } from '@mui/icons-material'

const CardVerticalRatings = () => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(212, 133, 28, 0.1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(212, 133, 28, 0.2)',
          border: '1px solid rgba(212, 133, 28, 0.3)'
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Header with Verified Badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography 
            variant='h5' 
            sx={{ 
              fontWeight: 600,
              color: '#d4851c',
              flexGrow: 1
            }}
          >
            Customer Reviews
          </Typography>
          <Chip
            icon={<Verified sx={{ fontSize: 16 }} />}
            label="Verified"
            size="small"
            sx={{
              bgcolor: '#d4851c',
              color: 'white',
              fontWeight: 500,
              '& .MuiChip-icon': {
                color: 'white'
              }
            }}
          />
        </Box>

        {/* Rating Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Rating 
              name="hotel-rating" 
              value={4.8} 
              precision={0.1}
              readOnly
              sx={{
                '& .MuiRating-iconFilled': {
                  color: '#d4851c'
                },
                '& .MuiRating-iconEmpty': {
                  color: '#d4851c',
                  opacity: 0.3
                }
              }}
            />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                color: '#d4851c' 
              }}
            >
              4.8
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666',
              fontWeight: 500
            }}
          >
            <Star sx={{ fontSize: 16, color: '#d4851c', mr: 0.5 }} />
            Excellent Rating | 247 reviews
          </Typography>
        </Box>

        {/* Review Content */}
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#555',
            lineHeight: 1.6,
            mb: 2,
            fontSize: '0.95rem'
          }}
        >
          "Exceptional hospitality at Dongxai Hotel! The staff provided outstanding service, 
          and the rooms were immaculate with modern amenities. Perfect location in Thakhaek."
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#777',
            lineHeight: 1.5,
            fontSize: '0.85rem',
            fontStyle: 'italic'
          }}
        >
          ບໍລິການດີເລີດ ຫ້ອງພັກສະອາດ ແລະ ທີ່ຕັ້ງດີໃນໃຈກາງເມືອງທ່າແຂກ. 
          ແນະນຳສຳລັບນັກທ່ອງທ່ຽວທຸກຄົນ.
        </Typography>

        {/* Rating Breakdown */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(212, 133, 28, 0.05)', borderRadius: '12px' }}>
          <Typography variant="subtitle2" sx={{ color: '#d4851c', fontWeight: 600, mb: 1 }}>
            Rating Breakdown
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {[
              { label: 'Service', rating: 4.9 },
              { label: 'Cleanliness', rating: 4.8 },
              { label: 'Location', rating: 4.7 },
              { label: 'Value', rating: 4.6 }
            ].map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="caption" sx={{ minWidth: 70, color: '#666' }}>
                  {item.label}
                </Typography>
                <Rating
                  value={item.rating}
                  precision={0.1}
                  size="small"
                  readOnly
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: '#d4851c'
                    },
                    '& .MuiRating-iconEmpty': {
                      color: '#d4851c',
                      opacity: 0.2
                    }
                  }}
                />
                <Typography variant="caption" sx={{ color: '#d4851c', fontWeight: 500 }}>
                  {item.rating}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>

      <CardActions 
        sx={{ 
          p: 3, 
          pt: 0,
          gap: 1
        }}
      >
        <Button
          startIcon={<LocationOn />}
          variant="outlined"
          sx={{
            borderColor: '#d4851c',
            color: '#d4851c',
            fontWeight: 500,
            borderRadius: '8px',
            textTransform: 'none',
            flex: 1,
            '&:hover': {
              borderColor: '#d4851c',
              backgroundColor: 'rgba(212, 133, 28, 0.1)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Location
        </Button>
        <Button
          startIcon={<RateReview />}
          variant="contained"
          sx={{
            bgcolor: '#d4851c',
            color: 'white',
            fontWeight: 500,
            borderRadius: '8px',
            textTransform: 'none',
            flex: 1,
            boxShadow: '0 4px 12px rgba(212, 133, 28, 0.3)',
            '&:hover': {
              bgcolor: '#b8731a',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(212, 133, 28, 0.4)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Reviews
        </Button>
      </CardActions>
    </Card>
  )
}

export default CardVerticalRatings