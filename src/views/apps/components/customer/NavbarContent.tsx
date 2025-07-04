'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Divider
} from '@mui/material'
import { Menu, Close, Phone, Email } from '@mui/icons-material'
import classnames from 'classnames'
import { APP_ROUTES } from '../../../../@core/infrastructure/api/config/app-routes.config'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@/configs/i18n'
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import UserDropdown from './UserDropdown'
import ModeDropdown from '@components/layout/shared/ModeDropdown'

const NavbarContent = () => {
  const { lang: locale } = useParams() as { lang: Locale }
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const navigationItems = [
    { label: 'HOME', href: APP_ROUTES.CUSTOMER_HOME },
    { label: 'BOOK NOW', href: APP_ROUTES.CUSTOMER_BOOK_NOW.BASE_URL },
    { label: 'MY BOOKINGS', href: APP_ROUTES.CUSTOMER_BOOKING.BASE_URL },
    { label: 'CONTACT', href: '#contact' }
  ]

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <Container maxWidth="xl">
      <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
        <Toolbar 
          disableGutters
          sx={{ 
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: { xs: '64px', md: '80px' },
            py: 1
          }}
        >
          {/* Left section: Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: { xs: 40, md: 50 },
                height: { xs: 40, md: 50 },
                background: 'linear-gradient(135deg, #d4851c, #f4a261)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                boxShadow: '0 4px 12px rgba(212, 133, 28, 0.3)'
              }}
            >
              D
            </Box>
            <Box>
              <Typography 
                variant="h5" 
                component="div"
                sx={{ 
                  fontWeight: 700,
                  color: '#d4851c',
                  fontSize: { xs: '1.3rem', md: '1.8rem' },
                  letterSpacing: '0.5px',
                  lineHeight: 1
                }}
              >
                Dongxai Hotel
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#666',
                  fontSize: { xs: '0.7rem', md: '0.8rem' },
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}
              >
                Luxury & Comfort
              </Typography>
            </Box>
          </Box>
          
          {/* Center section: Navigation Links (Desktop) */}
          {!isMobile && (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                flexGrow: 1,
                mx: 4
              }}
            >
              {navigationItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  href={item.href.startsWith('#') ? item.href : getLocalizedUrl(item.href, locale)}
                  sx={{ 
                    color: '#333', 
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    mx: 1.5,
                    px: 2,
                    py: 1,
                    borderRadius: '8px',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(212, 133, 28, 0.1), transparent)',
                      transition: 'left 0.5s ease'
                    },
                    '&:hover': {
                      color: '#d4851c',
                      backgroundColor: 'rgba(212, 133, 28, 0.05)',
                      '&::before': {
                        left: '100%'
                      }
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: '50%',
                      bottom: 0,
                      transform: 'translateX(-50%) scaleX(0)',
                      transformOrigin: 'center',
                      width: '80%',
                      height: '2px',
                      bgcolor: '#d4851c',
                      transition: 'transform 0.3s ease'
                    },
                    '&:hover::after': {
                      transform: 'translateX(-50%) scaleX(1)'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Right section: Contact info and User controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Contact Info (Desktop only) */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Phone sx={{ fontSize: 16, color: '#d4851c' }} />
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                    +856 20 7776 3575
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ height: 24, mx: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Email sx={{ fontSize: 16, color: '#d4851c' }} />
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                    info@dongxaihotel.com
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Mode and User Dropdown */}
            <ModeDropdown />
            <UserDropdown />

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                onClick={handleMobileMenuToggle}
                sx={{
                  ml: 1,
                  color: '#d4851c',
                  '&:hover': {
                    backgroundColor: 'rgba(212, 133, 28, 0.1)'
                  }
                }}
              >
                <Menu />
              </IconButton>
            )}
          </Box>
        </Toolbar>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={mobileMenuOpen}
          onClose={handleMobileMenuToggle}
          PaperProps={{
            sx: {
              width: 280,
              background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
              borderLeft: '3px solid #d4851c'
            }
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#d4851c' }}>
                Menu
              </Typography>
              <IconButton onClick={handleMobileMenuToggle} sx={{ color: '#d4851c' }}>
                <Close />
              </IconButton>
            </Box>
            
            <List>
              {navigationItems.map((item) => (
                <ListItem
                  key={item.label}
                  component={Link}
                  href={item.href.startsWith('#') ? item.href : getLocalizedUrl(item.href, locale)}
                  onClick={handleMobileMenuToggle}
                  sx={{
                    borderRadius: '8px',
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(212, 133, 28, 0.1)'
                    }
                  }}
                >
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: 600,
                      color: '#333'
                    }}
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Mobile Contact Info */}
            <Box sx={{ px: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#d4851c', mb: 1 }}>
                Contact Us
              </Typography>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  📞 +856 20 7776 3575
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  ✉️ info@dongxaihotel.com
                </Typography>
              </Box>
            </Box>
          </Box>
        </Drawer>
      </div>
    </Container>
  )
}

export default NavbarContent