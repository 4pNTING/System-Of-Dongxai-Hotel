'use client'

import { useState, useEffect } from 'react'
import AppBar from '@mui/material/AppBar'
import { alpha } from '@mui/material/styles'
import classnames from 'classnames'
import NavbarContent from './NavbarContent'
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const CustomerHeader = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AppBar 
      position="fixed" 
      color="transparent" 
      elevation={0}
      className={classnames(verticalLayoutClasses.header, {
        [verticalLayoutClasses.headerDetached]: true,
        [verticalLayoutClasses.headerContentWide]: true
      })}
      sx={{ 
        backgroundColor: scrolled 
          ? alpha('#ffffff', 0.95)
          : alpha('#ffffff', 0.9),
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled 
          ? '1px solid rgba(212, 133, 28, 0.1)'
          : 'none',
        boxShadow: scrolled 
          ? '0 8px 32px rgba(0, 0, 0, 0.1)'
          : '0 4px 20px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 1100,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #d4851c, #f4a261, #d4851c)',
          opacity: scrolled ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }
      }}
    >
      <NavbarContent />
    </AppBar>
  )
}

export default CustomerHeader