// src/views/apps/booking/BookingCards.tsx
import Grid from '@mui/material/Grid'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

// Types
export type BookingCardDataType = {
  title: string
  stats: string
  avatarIcon: string
  avatarColor?: ThemeColor
  trend: string
  trendNumber: string
  subtitle: string
}

interface BookingCardsProps {
  totalCount: number
  pendingCount: number
  confirmedCount: number
  cancelledCount: number
}

const BookingCards = ({ 
  totalCount, 
  pendingCount, 
  confirmedCount,
  cancelledCount
}: BookingCardsProps) => {
  
  const pendingPercentage = totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0
  const confirmedPercentage = totalCount > 0 ? Math.round((confirmedCount / totalCount) * 100) : 0
  const cancelledPercentage = totalCount > 0 ? Math.round((cancelledCount / totalCount) * 100) : 0
  
  const data: BookingCardDataType[] = [
    {
      title: 'ທັງໝົດ',
      stats: totalCount.toString(),
      avatarIcon: 'tabler-calendar-event',
      avatarColor: 'primary',
      trend: 'positive',
      trendNumber: '100%',
      subtitle: 'ລາຍການທັງໝົດ'
    },
    {
      title: 'ລໍຖ້າຢືນຢັນ',
      stats: pendingCount.toString(),
      avatarIcon: 'tabler-clock-hour-2',
      avatarColor: 'warning',
      trend: 'positive',
      trendNumber: `${pendingPercentage}%`,
      subtitle: 'ຮໍຖ້າການຢືນຢັນ'
    },
    {
      title: 'ຢືນຢັນແລ້ວ',
      stats: confirmedCount.toString(),
      avatarIcon: 'tabler-check-circle',
      avatarColor: 'success',
      trend: 'positive',
      trendNumber: `${confirmedPercentage}%`,
      subtitle: 'ພ້ອມເຊັກອິນ'
    },
    {
      title: 'ຍົກເລີກ',
      stats: cancelledCount.toString(),
      avatarIcon: 'tabler-x-circle',
      avatarColor: 'error',
      trend: cancelledCount > 0 ? 'negative' : 'positive',
      trendNumber: `${cancelledPercentage}%`,
      subtitle: 'ຍົກເລີກການຈອງ'
    }
  ]

  return (
    <Grid container spacing={3}>
      {data.map((item, i) => (
        <Grid key={i} item xs={12} sm={6} md={3} lg={3}>
          <HorizontalWithSubtitle {...item} />
        </Grid>
      ))}
    </Grid>
  )
}

export default BookingCards