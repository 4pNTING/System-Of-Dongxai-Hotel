import React from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

interface PaymentStatusFilterProps {
  value: string
  onChange: (value: string) => void
}

const PaymentStatusFilter: React.FC<PaymentStatusFilterProps> = ({ value, onChange }) => {
  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel id="payment-status-filter-label">ສະຖານະການຊຳລະ</InputLabel>
      <Select
        labelId="payment-status-filter-label"
        id="payment-status-filter"
        value={value}
        label="ສະຖານະການຊຳລະ"
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="">ທັງໝົດ</MenuItem>
        <MenuItem value="paid">ຊຳລະແລ້ວ</MenuItem>
        <MenuItem value="pending">ລໍຖ້າຊຳລະ</MenuItem>
        <MenuItem value="failed">ລົ້ມເຫຼວ</MenuItem>
        <MenuItem value="refunded">ຄືນເງິນແລ້ວ</MenuItem>
        <MenuItem value="partial">ບາງສ່ວນ</MenuItem>
      </Select>
    </FormControl>
  )
}

export default PaymentStatusFilter
