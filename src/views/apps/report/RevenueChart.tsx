// src/views/apps/payments/report/RevenueChart.tsx
import React, { useMemo } from 'react';

// MUI Imports
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useTheme } from '@mui/material/styles';

// Chart Imports
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Types
import { PaymentModel } from '@core/domain/models/payments/list.model';

// Utils
import { formatCurrency } from '@core/utils/formatters';

interface RevenueChartProps {
  paymentItems: any[]; // Allow any array type for compatibility
  dateRange: string;
  reportType: 'summary' | 'detailed' | 'trends';
}

const RevenueChart: React.FC<RevenueChartProps> = ({
  paymentItems,
  dateRange,
  reportType
}) => {
  const theme = useTheme();
  const [chartType, setChartType] = React.useState<'line' | 'area' | 'bar'>('area');

  // Process data for charts
  const chartData = useMemo(() => {
    if (!paymentItems || paymentItems.length === 0) return [];

    // Group payments by date
    const groupedData: { [key: string]: { revenue: number; count: number; refunds: number } } = {};

    paymentItems.forEach(payment => {
      const date = new Date(payment.PaymentDate);
      let dateKey: string;

      // Format date based on date range
      switch (dateRange) {
        case 'today':
          dateKey = date.getHours().toString().padStart(2, '0') + ':00';
          break;
        case 'week':
          dateKey = ['ອາທິດ', 'ຈັນ', 'ອັງຄານ', 'ພຸດ', 'ພະຫັດ', 'ສຸກ', 'ເສົາ'][date.getDay()];
          break;
        case 'month':
          dateKey = `${date.getDate()}/${date.getMonth() + 1}`;
          break;
        case 'quarter':
        case 'year':
          dateKey = `${date.getMonth() + 1}/${date.getFullYear()}`;
          break;
        default:
          dateKey = `${date.getDate()}/${date.getMonth() + 1}`;
      }

      if (!groupedData[dateKey]) {
        groupedData[dateKey] = { revenue: 0, count: 0, refunds: 0 };
      }

      // Since all payments from backend are valid payments (no status filtering needed)
      groupedData[dateKey].revenue += payment.PaymentPrice || 0;
      groupedData[dateKey].count += 1;
    });

    // Convert to array and sort
    return Object.entries(groupedData)
      .map(([date, data]) => ({
        date,
        revenue: data.revenue,
        count: data.count,
        refunds: data.refunds,
        net: data.revenue - data.refunds
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [paymentItems, dateRange]);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
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
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: entry.color }}
            >
              {entry.name}: {entry.name.includes('ລາຍໄດ້') || entry.name.includes('ເງິນ') 
                ? formatCurrency(entry.value) 
                : entry.value}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  const renderChart = (): React.ReactElement => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey="date" 
              stroke={theme.palette.text.secondary}
              fontSize={12}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              fontSize={12}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke={theme.palette.primary.main}
              strokeWidth={3}
              dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 6 }}
              name="ລາຍໄດ້"
            />
            <Line
              type="monotone"
              dataKey="refunds"
              stroke={theme.palette.error.main}
              strokeWidth={2}
              dot={{ fill: theme.palette.error.main, strokeWidth: 2, r: 4 }}
              name="ເງິນຄືນ"
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey="date" 
              stroke={theme.palette.text.secondary}
              fontSize={12}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              fontSize={12}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={theme.palette.primary.main}
              fillOpacity={1}
              fill="url(#revenueGradient)"
              strokeWidth={2}
              name="ລາຍໄດ້"
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey="date" 
              stroke={theme.palette.text.secondary}
              fontSize={12}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              fontSize={12}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="revenue" 
              fill={theme.palette.primary.main}
              name="ລາຍໄດ້"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="refunds" 
              fill={theme.palette.error.main}
              name="ເງິນຄືນ"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey="date" 
              stroke={theme.palette.text.secondary}
              fontSize={12}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              fontSize={12}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke={theme.palette.primary.main}
              strokeWidth={3}
              dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 6 }}
              name="ລາຍໄດ້"
            />
          </LineChart>
        );
    }
  };

  // Calculate summary stats
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalRefunds = chartData.reduce((sum, item) => sum + item.refunds, 0);
  const netRevenue = totalRevenue - totalRefunds;
  const averageDaily = chartData.length > 0 ? totalRevenue / chartData.length : 0;

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="ກຣາຟລາຍໄດ້"
        subheader={`ລາຍໄດ້ສຸດທິ: ${formatCurrency(netRevenue)}`}
        action={
          <Tabs
            value={chartType}
            onChange={(_, newValue) => setChartType(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="ເສັ້ນໂຄ້ງ" value="line" />
            <Tab label="ພື້ນທີ່" value="area" />
            <Tab label="ຖັນ" value="bar" />
          </Tabs>
        }
      />
      <CardContent>
        {/* Summary Stats */}
        <Box display="flex" justifyContent="space-around" mb={3}>
          <Box textAlign="center">
            <Typography variant="h6" color="primary.main">
              {formatCurrency(totalRevenue)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ລາຍໄດ້ທັງໝົດ
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h6" color="error.main">
              {formatCurrency(totalRefunds)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ເງິນຄືນ
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h6" color="success.main">
              {formatCurrency(averageDaily)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ຄ່າເຉລີ່ຍຕໍ່ວັນ
            </Typography>
          </Box>
        </Box>

        {/* Chart */}
        <Box height={300}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          ) : (
            <Box 
              display="flex" 
              alignItems="center" 
              justifyContent="center" 
              height="100%"
            >
              <Typography variant="body2" color="text.secondary">
                ບໍ່ມີຂໍ້ມູນສະແດງ
              </Typography>
            </Box>
          )}
        </Box>

        {/* Trend Analysis */}
        {chartData.length > 1 && (
          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              ວິເຄາະແນວໂນ້ມ
            </Typography>
            <Box display="flex" gap={2}>
              {(() => {
                const latest = chartData[chartData.length - 1];
                const previous = chartData[chartData.length - 2];
                const growth = previous.revenue > 0 
                  ? ((latest.revenue - previous.revenue) / previous.revenue) * 100
                  : 0;
                
                return (
                  <Typography 
                    variant="body2" 
                    color={growth > 0 ? 'success.main' : 'error.main'}
                  >
                    {growth > 0 ? '📈' : '📉'} 
                    {growth > 0 ? '+' : ''}{growth.toFixed(1)}% ຈາກງວດກ່ອນ
                  </Typography>
                );
              })()}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
