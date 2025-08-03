// src/views/apps/payments/report/FinancialOverviewCards.tsx
import React from 'react';

// MUI Imports
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';

// Icon Imports
import TrendingUp from '@mui/icons-material/TrendingUp';
import TrendingDown from '@mui/icons-material/TrendingDown';
import AttachMoney from '@mui/icons-material/AttachMoney';
import Receipt from '@mui/icons-material/Receipt';
import Undo from '@mui/icons-material/Undo';
import Schedule from '@mui/icons-material/Schedule';
import CheckCircle from '@mui/icons-material/CheckCircle';
// import Refund from '@mui/icons-material/Refund'; // Refund icon not available in Material-UI

// Types
import { PaymentModel } from '@core/domain/models/payments/list.model';

// Utils
import { formatCurrency } from '@core/utils/formatters';

interface FinancialOverviewCardsProps {
  stats: {
    totalPayments: number;
    paidPayments: number;
    pendingPayments: number;
    refundedPayments: number;
    totalAmount: number;
  };
  dateRange: string;
  paymentItems: any[]; // Allow any array type for compatibility
}

const FinancialOverviewCards: React.FC<FinancialOverviewCardsProps> = ({
  stats,
  dateRange,
  paymentItems
}) => {
  // Calculate additional metrics
  const calculateMetrics = () => {
    const totalRevenue = stats.totalAmount;
    const paidPercentage = stats.totalPayments > 0 ? (stats.paidPayments / stats.totalPayments) * 100 : 0;
    const pendingPercentage = stats.totalPayments > 0 ? (stats.pendingPayments / stats.totalPayments) * 100 : 0;
    const refundedPercentage = stats.totalPayments > 0 ? (stats.refundedPayments / stats.totalPayments) * 100 : 0;
    
    // Calculate average transaction value
    const averageTransaction = stats.paidPayments > 0 ? totalRevenue / stats.paidPayments : 0;
    
    // Calculate growth (mock data - in real app, compare with previous period)
    const revenueGrowth = 12.5; // Mock growth percentage
    const transactionGrowth = 8.3; // Mock growth percentage
    
    return {
      totalRevenue,
      paidPercentage,
      pendingPercentage,
      refundedPercentage,
      averageTransaction,
      revenueGrowth,
      transactionGrowth
    };
  };

  const metrics = calculateMetrics();

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case 'today': return 'ມື້ນີ້';
      case 'week': return 'ອາທິດນີ້';
      case 'month': return 'ເດືອນນີ້';
      case 'quarter': return 'ໄຕມາດນີ້';
      case 'year': return 'ປີນີ້';
      default: return 'ໄລຍະທີ່ເລືອກ';
    }
  };

  const cards = [
    {
      title: 'ລາຍໄດ້ທັງໝົດ',
      value: formatCurrency(metrics.totalRevenue),
      change: metrics.revenueGrowth,
      changeLabel: `${metrics.revenueGrowth > 0 ? '+' : ''}${metrics.revenueGrowth}%`,
      icon: AttachMoney,
      color: '#4CAF50',
      bgColor: '#E8F5E8'
    },
    {
      title: 'ການຊໍາລະທັງໝົດ',
      value: stats.totalPayments.toString(),
      change: metrics.transactionGrowth,
      changeLabel: `${metrics.transactionGrowth > 0 ? '+' : ''}${metrics.transactionGrowth}%`,
      icon: Receipt,
      color: '#2196F3',
      bgColor: '#E3F2FD'
    },
    {
      title: 'ຊໍາລະສຳເລັດ',
      value: stats.paidPayments.toString(),
      percentage: metrics.paidPercentage,
      icon: CheckCircle,
      color: '#4CAF50',
      bgColor: '#E8F5E8'
    },
    {
      title: 'ລໍຖ້າຊໍາລະ',
      value: stats.pendingPayments.toString(),
      percentage: metrics.pendingPercentage,
      icon: Schedule,
      color: '#FF9800',
      bgColor: '#FFF3E0'
    },
    {
      title: 'ຄືນເງິນ',
      value: stats.refundedPayments.toString(),
      percentage: metrics.refundedPercentage,
      icon: Undo,
      color: '#F44336',
      bgColor: '#FFEBEE'
    },
    {
      title: 'ຄ່າເຉລີ່ຍຕໍ່ຄັ້ງ',
      value: formatCurrency(metrics.averageTransaction),
      change: 5.2,
      changeLabel: '+5.2%',
      icon: TrendingUp,
      color: '#9C27B0',
      bgColor: '#F3E5F5'
    }
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          ພາບລວມການເງິນ - {getDateRangeLabel()}
        </Typography>
        <Chip 
          label={`ອັບເດດລ່າສຸດ: ${new Date().toLocaleTimeString('lo-LA')}`}
          variant="outlined"
          size="small"
        />
      </Box>

      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                position: 'relative',
                overflow: 'visible',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h5" component="div" fontWeight="bold" mb={1}>
                      {card.value}
                    </Typography>
                    
                    {card.change !== undefined && (
                      <Box display="flex" alignItems="center">
                        {card.change > 0 ? (
                          <TrendingUp sx={{ fontSize: 16, color: '#4CAF50', mr: 0.5 }} />
                        ) : (
                          <TrendingDown sx={{ fontSize: 16, color: '#F44336', mr: 0.5 }} />
                        )}
                        <Typography 
                          variant="caption" 
                          color={card.change > 0 ? '#4CAF50' : '#F44336'}
                          fontWeight="medium"
                        >
                          {card.changeLabel}
                        </Typography>
                      </Box>
                    )}

                    {card.percentage !== undefined && (
                      <Box mt={1}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                          <Typography variant="caption" color="text.secondary">
                            ອັດຕາສ່ວນ
                          </Typography>
                          <Typography variant="caption" fontWeight="medium">
                            {card.percentage.toFixed(1)}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={card.percentage}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#f0f0f0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: card.color,
                              borderRadius: 3
                            }
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                  
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: card.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      ml: 1
                    }}
                  >
                    <card.icon sx={{ color: card.color, fontSize: 24 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FinancialOverviewCards;
