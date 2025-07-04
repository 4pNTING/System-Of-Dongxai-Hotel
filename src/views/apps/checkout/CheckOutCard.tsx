import Grid from '@mui/material/Grid'
import type { ThemeColor } from '@core/types'
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

export type CheckOutCardDataType = {
  title: string
  stats: string
  avatarIcon: string
  avatarColor?: ThemeColor
  trend: string
  trendNumber: string
  subtitle: string
}

interface CheckOutCardsProps {
  totalCheckOuts: number
  checkOutsToday: number
  averageStayDuration: number
  totalRevenue: number
}

const CheckOutCards = ({ 
  totalCheckOuts, 
  checkOutsToday, 
  averageStayDuration,
  totalRevenue
}: CheckOutCardsProps) => {
  
  const todayPercentage = totalCheckOuts > 0 ? Math.round((checkOutsToday / totalCheckOuts) * 100) : 0
  
  const data: CheckOutCardDataType[] = [
    {
      title: 'ທັງໝົດ',
      stats: totalCheckOuts.toString(),
      avatarIcon: 'tabler-door-exit',
      avatarColor: 'primary',
      trend: 'positive',
      trendNumber: '100%',
      subtitle: 'ເຊັກເອົາທັງໝົດ'
    },
    {
      title: 'ວັນນີ້',
      stats: checkOutsToday.toString(),
      avatarIcon: 'tabler-calendar-today',
      avatarColor: 'success',
      trend: 'positive',
      trendNumber: `${todayPercentage}%`,
      subtitle: 'ເຊັກເອົາວັນນີ້'
    },
    {
      title: 'ເວລາພັກເຉລີ່ຍ',
      stats: `${averageStayDuration}`,
      avatarIcon: 'tabler-clock-hour-4',
      avatarColor: 'info',
      trend: 'positive',
      trendNumber: 'ຄືນ',
      subtitle: 'ຈຳນວນຄືນເຉລີ່ຍ'
    },
    {
      title: 'ລາຍໄດ້ລວມ',
      stats: totalRevenue.toLocaleString(),
      avatarIcon: 'tabler-currency-kip',
      avatarColor: 'warning',
      trend: 'positive',
      trendNumber: 'ກີບ',
      subtitle: 'ຈາກການເຊັກເອົາ'
    }
  ]

  return (
    <Grid container spacing={6}>
      {data.map((item, i) => (
        <Grid key={i} item xs={12} sm={6} md={3}>
          <HorizontalWithSubtitle {...item} />
        </Grid>
      ))}
    </Grid>
  )
}

export default CheckOutCards