'use client'

import { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  IconButton,
  Card,
  CardContent,
  Alert,
  Snackbar
} from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-4px)',
    transition: 'transform 0.3s ease-in-out'
  }
}))

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSnackbar({
        open: true,
        message: 'ຂໍ້ຄວາມຂອງທ່ານໄດ້ຖືກສົ່ງແລ້ວ! ພວກເຮົາຈະຕິດຕໍ່ກັບທ່ານໄວໆນີ້',
        severity: 'success'
      })
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'ເກີດຂໍ້ຜິດພາດ! ກະລຸນາລອງໃໝ່ອີກຄັ້ງ',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', py: 8 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ຕິດຕໍ່ພວກເຮົາ
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          ມີຄຳຖາມຫຼືຕ້ອງການຄວາມຊ່ວຍເຫຼືອ? ພວກເຮົາພ້ອມໃຫ້ບໍລິການທ່ານ 24/7
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ mb: 4 }}>
              <StyledCard>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h1" sx={{ mb: 2 }}>📍</Typography>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      ທີ່ຢູ່
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      ບ້ານດົງໄຊ, ເມືອງສີໂຄດຕະບອງ<br />
                      ນະຄອນຫຼວງວຽງຈັນ<br />
                      ສປປ ລາວ
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>
            </Box>

            <Box sx={{ mb: 4 }}>
              <StyledCard>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h1" sx={{ mb: 2 }}>📞</Typography>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      ເບີໂທ
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      +856 21 123 456<br />
                      +856 20 999 8888
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>
            </Box>

            <Box sx={{ mb: 4 }}>
              <StyledCard>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h1" sx={{ mb: 2 }}>✉️</Typography>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      ອີເມວ
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      info@dongxaihotel.com<br />
                      booking@dongxaihotel.com
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>
            </Box>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} lg={8}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                ສົ່ງຂໍ້ຄວາມຫາພວກເຮົາ
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="ຊື່ຂອງທ່ານ"
                      value={formData.name}
                      onChange={handleChange('name')}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="ອີເມວ"
                      type="email"
                      value={formData.email}
                      onChange={handleChange('email')}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="ເບີໂທ"
                      value={formData.phone}
                      onChange={handleChange('phone')}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="ຫົວຂໍ້"
                      value={formData.subject}
                      onChange={handleChange('subject')}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="ຂໍ້ຄວາມ"
                      multiline
                      rows={6}
                      value={formData.message}
                      onChange={handleChange('message')}
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={loading}
                      sx={{
                        py: 2,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        }
                      }}
                    >
                      {loading ? 'ກຳລັງສົ່ງ...' : 'ສົ່ງຂໍ້ຄວາມ'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Map Section */}
        <Box sx={{ mt: 6 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
              ແຜນທີ່
            </Typography>
            <Box sx={{ 
              height: 400, 
              background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}>
              <Typography variant="h1" sx={{ mb: 2 }}>🗺️</Typography>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                ແຜນທີ່ Dongxai Hotel
              </Typography>
              <Typography variant="body1" color="text.secondary">
                ບ້ານດົງໄຊ, ເມືອງສີໂຄດຕະບອງ, ນະຄອນຫຼວງວຽງຈັນ
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ContactForm
