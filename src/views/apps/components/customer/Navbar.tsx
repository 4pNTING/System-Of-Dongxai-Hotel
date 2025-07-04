'use client'

import { useTheme } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import classnames from 'classnames'
import type { CSSObject } from '@emotion/styled'
import type { ChildrenType } from '@core/types'
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

type Props = ChildrenType & {
  overrideStyles?: CSSObject
}

const Navbar = (props: Props) => {
  const { children, overrideStyles } = props
  const theme = useTheme()

  const headerFixed = true
  const headerFloating = false
  const headerDetached = true
  const headerBlur = true
  const headerContentCompact = false
  const headerContentWide = true

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(212, 133, 28, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        zIndex: 1100,
        ...overrideStyles
      }}
      className={classnames(verticalLayoutClasses.header, {
        [verticalLayoutClasses.headerFixed]: headerFixed,
        [verticalLayoutClasses.headerFloating]: headerFloating,
        [verticalLayoutClasses.headerDetached]: !headerFloating && headerDetached,
        [verticalLayoutClasses.headerBlur]: headerBlur,
        [verticalLayoutClasses.headerContentCompact]: headerContentCompact,
        [verticalLayoutClasses.headerContentWide]: headerContentWide
      })}
    >
      <div className={classnames(verticalLayoutClasses.navbar, 'flex bs-full')}>
        {children}
      </div>
    </AppBar>
  )
}

export default Navbar