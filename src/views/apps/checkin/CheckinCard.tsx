import Grid from '@mui/material/Grid'
import type { ThemeColor } from '@core/types'
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

export type CheckInCardDataType = {
  title: string
  stats: string
  avatarIcon: string
  avatarColor?: ThemeColor
  trend: string
  trendNumber: string
  subtitle: string
}

interface CheckInCardsProps {
  totalCount: number
  pendingCount: number  // bookings พร้อม check-in
  checkedInCount: number  // check-ins ที่กำลังพัก
  customLabels?: {
    pending?: string
    confirmed?: string
  }
}

const CheckInCards = ({ 
  totalCount, 
  pendingCount, 
  checkedInCount,
  customLabels = {}
}: CheckInCardsProps) => {
  
  const pendingPercentage = totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0
  const checkedInPercentage = totalCount > 0 ? Math.round((checkedInCount / totalCount) * 100) : 0
  
  const data: CheckInCardDataType[] = [
    {
      title: 'ທັງໝົດ',
      stats: totalCount.toString(),
      avatarIcon: 'tabler-home',
      avatarColor: 'primary',
      trend: 'positive',
      trendNumber: '100%',
      subtitle: 'ລາຍການທັງໝົດ'
    },
    {
      title: customLabels.pending || 'ພ້ອມເຊັກອິນ',
      stats: pendingCount.toString(),
      avatarIcon: 'tabler-clock-hour-2',
      avatarColor: 'warning',
      trend: 'positive',
      trendNumber: `${pendingPercentage}%`,
      subtitle: 'ຮໍຖ້າການເຊັກອິນ'
    },
    {
      title: customLabels.confirmed || 'ເຊັກອິນແລ້ວ',
      stats: checkedInCount.toString(),
      avatarIcon: 'tabler-door-enter',
      avatarColor: 'success',
      trend: 'positive',
      trendNumber: `${checkedInPercentage}%`,
      subtitle: 'ກຳລັງພັກ'
    }
  ]

  return (
    <Grid container spacing={6}>
      {data.map((item, i) => (
        <Grid key={i} item xs={12} sm={6} md={4}>
          <HorizontalWithSubtitle {...item} />
        </Grid>
      ))}
    </Grid>
  )
}

export default CheckInCards