import React from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'

interface PaymentSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const PaymentSearch: React.FC<PaymentSearchProps> = ({ 
  value, 
  onChange, 
  placeholder = 'ຄົ້ນຫາການຊຳລະ...' 
}) => {
  return (
    <TextField
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      variant="outlined"
      size="small"
    />
  )
}

export default PaymentSearch
