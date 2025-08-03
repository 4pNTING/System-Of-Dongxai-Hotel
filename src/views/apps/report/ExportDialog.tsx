// src/views/apps/payments/report/ExportDialog.tsx
import React, { useState } from 'react';

// MUI Imports
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';

// Icon Imports
import GetApp from '@mui/icons-material/GetApp';
import PictureAsPdf from '@mui/icons-material/PictureAsPdf';
import TableChart from '@mui/icons-material/TableChart';
import Close from '@mui/icons-material/Close';

// Types
import { PaymentModel } from '@core/domain/models/payments/list.model';

// Utils
import { formatCurrency } from '@core/utils/formatters';

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  paymentItems: any[];
  stats: any;
  dateRange: string;
  reportType: string;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onClose,
  paymentItems,
  stats,
  dateRange,
  reportType
}) => {
  // State management
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [includePaymentMethods, setIncludePaymentMethods] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate export data based on format
      switch (exportFormat) {
        case 'pdf':
          await exportToPDF();
          break;
        case 'excel':
          await exportToExcel();
          break;
        case 'csv':
          await exportToCSV();
          break;
      }
      
      onClose();
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    // Generate PDF report
    const reportData = generateReportData();
    
    // Create PDF content
    const pdfContent = {
      title: 'ລາຍງານການເງິນ - ໂຮງແຮມດົງໄຊ',
      dateRange: getDateRangeLabel(),
      reportType: getReportTypeLabel(),
      stats,
      data: reportData,
      generatedAt: new Date().toLocaleString('lo-LA')
    };

    // In a real implementation, you would use a PDF library like jsPDF
    console.log('Generating PDF with data:', pdfContent);
    
    // Simulate file download
    const blob = new Blob([JSON.stringify(pdfContent, null, 2)], { type: 'application/json' });
    downloadFile(blob, `financial-report-${Date.now()}.json`);
  };

  const exportToExcel = async () => {
    // Generate Excel report
    const reportData = generateReportData();
    
    // Create CSV content (Excel compatible)
    const csvContent = convertToCSV(reportData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `financial-report-${Date.now()}.csv`);
  };

  const exportToCSV = async () => {
    // Generate CSV report
    const reportData = generateReportData();
    const csvContent = convertToCSV(reportData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `financial-report-${Date.now()}.csv`);
  };

  const generateReportData = () => {
    const filteredPayments = paymentItems.filter(payment => 
      payment.Status === 'paid' || payment.Status === 'completed' || payment.Status === 'refunded'
    );

    return filteredPayments.map(payment => ({
      'ID ການຊໍາລະ': payment.PaymentId,
      'ວັນທີ': new Date(payment.PaymentDate || payment.CreatedAt).toLocaleDateString('lo-LA'),
      'ຈຳນວນເງິນ': payment.Amount,
      'ວິທີການຊໍາລະ': getPaymentMethodLabel(payment.PaymentMethod || 'cash'),
      'ສະຖານະ': getStatusLabel(payment.Status || 'pending'),
      'ລູກຄ້າ': payment.customer?.CustomerName || '-',
      'ຫ້ອງ': payment.room?.RoomNumber || '-',
      'ພະນັກງານ': payment.staff?.StaffName || '-'
    }));
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          return typeof value === 'string' && (value.includes(',') || value.includes('"'))
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        }).join(',')
      )
    ];
    
    return csvRows.join('\n');
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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

  const getReportTypeLabel = () => {
    switch (reportType) {
      case 'summary': return 'ສະຫຼຸບຫຍໍ້';
      case 'detailed': return 'ລະອຽດ';
      case 'trends': return 'ແນວໂນ້ມ';
      default: return 'ທົ່ວໄປ';
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    const methodLabels: { [key: string]: string } = {
      'credit_card': 'ບັດເຄຣດິດ',
      'debit_card': 'ບັດເດບິດ',
      'bank_transfer': 'ໂອນເງິນ',
      'cash': 'ເງິນສົດ',
      'mobile_payment': 'ມືຖືຈ່າຍ',
      'qr_payment': 'QR ຈ່າຍ'
    };
    return methodLabels[method] || method;
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: { [key: string]: string } = {
      'paid': 'ຊໍາລະແລ້ວ',
      'completed': 'ສຳເລັດ',
      'pending': 'ລໍຖ້າຊໍາລະ',
      'failed': 'ລົ້ມເຫຼວ',
      'refunded': 'ຄືນເງິນແລ້ວ'
    };
    return statusLabels[status] || status;
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return <PictureAsPdf />;
      case 'excel': return <TableChart />;
      case 'csv': return <TableChart />;
      default: return <GetApp />;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            <GetApp sx={{ mr: 1, verticalAlign: 'middle' }} />
            ຍ້າຍອອກລາຍງານການເງິນ
          </Typography>
          <Button
            onClick={onClose}
            size="small"
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <Close />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Report Summary */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            ລາຍງານ: {getReportTypeLabel()} ({getDateRangeLabel()})
          </Typography>
          <Typography variant="body2">
            ທັງໝົດ: {stats.totalPayments} ລາຍການ • 
            ລາຍໄດ້: {formatCurrency(stats.totalAmount)}
          </Typography>
        </Alert>

        {/* Export Format */}
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend">ຮູບແບບໄຟລ์</FormLabel>
          <RadioGroup
            row
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as any)}
          >
            <FormControlLabel
              value="pdf"
              control={<Radio color="primary" />}
              label={
                <Box display="flex" alignItems="center">
                  <PictureAsPdf sx={{ mr: 1, color: '#d32f2f' }} />
                  PDF
                </Box>
              }
            />
            <FormControlLabel
              value="excel"
              control={<Radio color="primary" />}
              label={
                <Box display="flex" alignItems="center">
                  <TableChart sx={{ mr: 1, color: '#2e7d32' }} />
                  Excel
                </Box>
              }
            />
            <FormControlLabel
              value="csv"
              control={<Radio color="primary" />}
              label={
                <Box display="flex" alignItems="center">
                  <TableChart sx={{ mr: 1, color: '#1976d2' }} />
                  CSV
                </Box>
              }
            />
          </RadioGroup>
        </FormControl>

        <Divider sx={{ my: 2 }} />

        {/* Include Options */}
        <FormControl component="fieldset">
          <FormLabel component="legend">ເນື້ອຫາທີ່ຈະຮວມ</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeSummary}
                  onChange={(e) => setIncludeSummary(e.target.checked)}
                  color="primary"
                />
              }
              label="ສະຫຼຸບພາບລວມ"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeDetails}
                  onChange={(e) => setIncludeDetails(e.target.checked)}
                  color="primary"
                />
              }
              label="ລາຍລະອຽດການຊໍາລະ"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={includePaymentMethods}
                  onChange={(e) => setIncludePaymentMethods(e.target.checked)}
                  color="primary"
                />
              }
              label="ວິທີການຊໍາລະ"
            />
            {exportFormat === 'pdf' && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeCharts}
                    onChange={(e) => setIncludeCharts(e.target.checked)}
                    color="primary"
                  />
                }
                label="ກຣາຟແລະຕາຕະລາງ"
              />
            )}
          </FormGroup>
        </FormControl>

        {/* Progress Bar */}
        {isExporting && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" gutterBottom>
              ກຳລັງສ້າງລາຍງານ...
            </Typography>
            <LinearProgress />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          disabled={isExporting}
          color="inherit"
        >
          ຍົກເລີກ
        </Button>
        <Button
          onClick={handleExport}
          disabled={isExporting}
          variant="contained"
          startIcon={getFormatIcon(exportFormat)}
        >
          {isExporting ? 'ກຳລັງສ້າງ...' : 'ຍ້າຍອອກ'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportDialog;
