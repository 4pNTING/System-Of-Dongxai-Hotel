'use client'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { Box } from '@mui/material'

const SwiperAutoSwitch = () => {
  // Hooks
  const [ref] = useKeenSlider<HTMLDivElement>(
    {
      loop: true
    },
    [
      slider => {
        let mouseOver = false
        let timeout: number | ReturnType<typeof setTimeout>
        const clearNextTimeout = () => {
          clearTimeout(timeout as number)
        }
        const nextTimeout = () => {
          clearTimeout(timeout as number)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 3000) // Changed to 3 seconds
        }

        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true
            clearNextTimeout()
          })
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false
            nextTimeout()
          })
          nextTimeout()
        })
        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      }
    ]
  )

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        mb: 4
      }}
    >
      <div 
        ref={ref} 
        className='keen-slider'
        style={{
          width: '100%',
          aspectRatio: '16/6',
          overflow: 'hidden',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          background: 'linear-gradient(45deg, #f5f5f5, #e8e8e8)'
        }}
      >
        <div className='keen-slider__slide'>
          <img 
            src='/images/room1.jpg' 
            alt='Dongxai Hotel Room 1'
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </div>
        <div className='keen-slider__slide'>
          <img 
            src='/images/room2.jpg' 
            alt='Dongxai Hotel Room 2'
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </div>
        <div className='keen-slider__slide'>
          <img 
            src='/images/TEST.jpg' 
            alt='Dongxai Hotel Lobby'
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </div>
        <div className='keen-slider__slide'>
          <img 
            src='/images/1.jpg' 
            alt='Dongxai Hotel Exterior'
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </div>
        <div className='keen-slider__slide'>
          <img 
            src='/images/dongxai10.jpg' 
            alt='Dongxai Hotel Premium Room'
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </div>
      </div>
    </Box>
  )
}

export default SwiperAutoSwitch