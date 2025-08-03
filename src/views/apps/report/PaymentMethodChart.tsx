// src/views/apps/payments/report/PaymentMethodChart.tsx
import React, { useMemo } from 'react';

// MUI Imports
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';
import { useTheme } from '@mui/material/styles';

// Chart Imports
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

// Icon Imports
import CreditCard from '@mui/icons-material/CreditCard';
import AccountBalance from '@mui/icons-material/AccountBalance';
import Money from '@mui/icons-material/Money';
import PhoneAndroid from '@mui/icons-material/PhoneAndroid';
import QrCode from '@mui/icons-material/QrCode';

// Types
import { PaymentModel } from '@core/domain/models/payments/list.model';

// Utils  
import { formatCurrency } from '@core/utils/formatters';

interface PaymentMethodChartProps {
  paymentItems: any[]; // Allow any array type for compatibility
}

const PaymentMethodChart: React.FC<PaymentMethodChartProps> = ({
  paymentItems
}) => {
  const theme = useTheme();

  // Payment method configuration
  const paymentMethodConfig = {
    'credit_card': {
      label: 'ບັດເຄຣດິດ',
      icon: CreditCard,
      color: '#1976D2'
    },
    'debit_card': {
      label: 'ບັດເດບິດ',
      icon: CreditCard,
      color: '#388E3C'
    },
    'bank_transfer': {
      label: 'ໂອນເງິນ',
      icon: AccountBalance,
      color: '#F57C00'
    },
    'cash': {
      label: 'ເງິນສົດ',
      icon: Money,
      color: '#7B1FA2'
    },
    'mobile_payment': {
      label: 'ຈ່າຍຜ່ານມືຖື',
      icon: PhoneAndroid,
      color: '#C2185B'
    },
    'qr_payment': {
      label: 'ຈ່າຍດ້ວຍ QR',
      icon: QrCode,
      color: '#00796B'
    }
  };

  // Process payment data by method
  const paymentMethodData = useMemo(() => {
    if (!paymentItems || paymentItems.length === 0) return [];

    const methodStats: { [key: string]: { count: number; amount: number; } } = {};

    // All payments from backend are valid payments (no status filtering needed)
    paymentItems.forEach(payment => {
      const method = payment.PaymentType || 'BOOKING_CONFIRMATION';
      
      if (!methodStats[method]) {
        methodStats[method] = { count: 0, amount: 0 };
      }
      
      methodStats[method].count += 1;
      methodStats[method].amount += payment.PaymentPrice || 0;
    });

    const totalAmount = Object.values(methodStats).reduce((sum, stat) => sum + stat.amount, 0);
    const totalCount = Object.values(methodStats).reduce((sum, stat) => sum + stat.count, 0);

    return Object.entries(methodStats)
      .map(([method, stats]) => ({
        method,
        label: paymentMethodConfig[method as keyof typeof paymentMethodConfig]?.label || method,
        count: stats.count,
        amount: stats.amount,
        percentage: totalAmount > 0 ? (stats.amount / totalAmount) * 100 : 0,
        countPercentage: totalCount > 0 ? (stats.count / totalCount) * 100 : 0,
        color: paymentMethodConfig[method as keyof typeof paymentMethodConfig]?.color || '#666666',
        icon: paymentMethodConfig[method as keyof typeof paymentMethodConfig]?.icon || Money
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [paymentItems]);

  // Colors for the pie chart
  const COLORS = paymentMethodData.map(item => item.color);

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            p: 2,
            boxShadow: 2
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            {data.label}
          </Typography>
          <Typography variant="body2">
            ຈຳນວນ: {data.count} ຄັ້ງ
          </Typography>
          <Typography variant="body2">
            ຈຳນວນເງິນ: {formatCurrency(data.amount)}
          </Typography>
          <Typography variant="body2">
            ອັດຕາສ່ວນ: {data.percentage.toFixed(1)}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    if (percentage < 5) return null; // Don't show labels for small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${percentage.toFixed(0)}%`}
      </text>
    );
  };

  const totalTransactions = paymentMethodData.reduce((sum, item) => sum + item.count, 0);
  const totalAmount = paymentMethodData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="ວິທີການຊໍາລະ"
        subheader={`ທັງໝົດ: ${totalTransactions} ຄັ້ງ • ${formatCurrency(totalAmount)}`}
      />
      <CardContent>
        {paymentMethodData.length > 0 ? (
          <>
            {/* Pie Chart */}
            <Box height={200} mb={3}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Method List with Details */}
            <List dense>
              {paymentMethodData.map((method, index) => {
                const IconComponent = method.icon;
                return (
                  <ListItem key={method.method} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <IconComponent 
                        sx={{ 
                          color: method.color,
                          fontSize: 20
                        }} 
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" fontWeight="medium">
                              {method.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {method.percentage.toFixed(1)}%
                            </Typography>
                          </Box>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                            <Typography variant="caption" color="text.secondary">
                              {method.count} ຄັ້ງ • {formatCurrency(method.amount)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ເຉລີ່ຍ: {formatCurrency(method.count > 0 ? method.amount / method.count : 0)}
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={method.percentage}
                            sx={{
                              height: 4,
                              borderRadius: 2,
                              mt: 1,
                              backgroundColor: 'action.hover',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: method.color,
                                borderRadius: 2
                              }
                            }}
                          />
                        </>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>

            {/* Summary Stats */}
            <Box 
              mt={3} 
              pt={2} 
              borderTop={1} 
              borderColor="divider"
              display="flex" 
              justifyContent="space-between"
            >
              <Box textAlign="center">
                <Typography variant="h6" color="primary.main">
                  {paymentMethodData.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ວິທີການ
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h6" color="success.main">
                  {paymentMethodData.length > 0 ? paymentMethodData[0].label : '-'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ນິຍົມສຸດ
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h6" color="info.main">
                  {formatCurrency(totalTransactions > 0 ? totalAmount / totalTransactions : 0)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ຄ່າເຉລີ່ຍ
                </Typography>
              </Box>
            </Box>
          </>
        ) : (
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            height={200}
          >
            <Typography variant="body2" color="text.secondary">
              ບໍ່ມີຂໍ້ມູນວິທີການຊໍາລະ
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodChart;
