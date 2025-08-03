import Grid from '@mui/material/Grid'
import type { ThemeColor } from '@core/types'
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

export type PaymentCardDataType = {
  title: string
  stats: string
  avatarIcon: string
  avatarColor?: ThemeColor
  trend: string
  trendNumber: string
  subtitle: string
}

interface PaymentCardsProps {
  totalCount: number
  paidCount: number  // payments ที่ชำระแล้ว
  pendingCount: number  // payments ที่รอชำระ
  refundedCount: number  // payments ที่คืนเงินแล้ว
  totalAmount: number  // ยอดเงินรวม
  customLabels?: {
    paid?: string
    pending?: string
    refunded?: string
  }
}

const PaymentCards = ({ 
  totalCount, 
  paidCount, 
  pendingCount,
  refundedCount,
  totalAmount,
  customLabels = {}
}: PaymentCardsProps) => {
  
  const paidPercentage = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0
  const pendingPercentage = totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0
  const refundedPercentage = totalCount > 0 ? Math.round((refundedCount / totalCount) * 100) : 0
  
  const formatCurrency = (amount: number): string => {
    if (!amount) return '0 ₭';
    return new Intl.NumberFormat('lo-LA', {
      style: 'currency',
      currency: 'LAK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  const data: PaymentCardDataType[] = [
    {
      title: 'ທັງໝົດ',
      stats: totalCount.toString(),
      avatarIcon: 'tabler-receipt',
      avatarColor: 'primary',
      trend: 'positive',
      trendNumber: '100%',
      subtitle: 'ລາຍການທັງໝົດ'
    },
    {
      title: customLabels.paid || 'ຊຳລະແລ້ວ',
      stats: paidCount.toString(),
      avatarIcon: 'tabler-check',
      avatarColor: 'success',
      trend: 'positive',
      trendNumber: `${paidPercentage}%`,
      subtitle: 'ການຊຳລະສຳເລັດ'
    },
    {
      title: customLabels.pending || 'ລໍຖ້າຊຳລະ',
      stats: pendingCount.toString(),
      avatarIcon: 'tabler-clock-hour-2',
      avatarColor: 'warning',
      trend: 'negative',
      trendNumber: `${pendingPercentage}%`,
      subtitle: 'ຍັງບໍ່ໄດ້ຊຳລະ'
    },
    {
      title: customLabels.refunded || 'ຄືນເງິນແລ້ວ',
      stats: refundedCount.toString(),
      avatarIcon: 'tabler-refresh',
      avatarColor: 'info',
      trend: 'neutral',
      trendNumber: `${refundedPercentage}%`,
      subtitle: 'ຄືນເງິນສຳເລັດ'
    },
    {
      title: 'ຍອດເງິນລວມ',
      stats: formatCurrency(totalAmount),
      avatarIcon: 'tabler-currency-kip',
      avatarColor: 'secondary',
      trend: 'positive',
      trendNumber: '₭',
      subtitle: 'ລາຍຮັບທັງໝົດ'
    }
  ]

  return (
    <Grid container spacing={6}>
      {data.map((item, index) => (
        <Grid key={index} item xs={12} sm={6} md={2.4}>
          <HorizontalWithSubtitle {...item} />
        </Grid>
      ))}
    </Grid>
  )
}

export default PaymentCards
