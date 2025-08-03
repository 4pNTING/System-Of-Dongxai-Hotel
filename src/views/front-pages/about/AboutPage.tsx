'use client'

import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  Divider
} from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 16,
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[12]
  }
}))

const GradientBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: 16,
  padding: theme.spacing(6),
  textAlign: 'center'
}))

const AboutPage = () => {
  const stats = [
    { icon: '🏨', value: '50+', label: 'ຫ້ອງພັກ' },
    { icon: '⭐', value: '4.8/5', label: 'ຄະແນນ' },
    { icon: '👥', value: '1000+', label: 'ລູກຄ້າທີ່ພໍໃຈ' },
    { icon: '🏆', value: '5+', label: 'ປີປະສົບການ' }
  ]

  const services = [
    {
      icon: '🛏️',
      title: 'ຫ້ອງພັກຫຼູຫຼາ',
      description: 'ຫ້ອງພັກທີ່ສະດວກສະບາຍ ຄຸນນະພາບສູງ ພ້ອມສິ່ງອຳນວຍຄວາມສະດວກຄົບຄັນ'
    },
    {
      icon: '🍽️',
      title: 'ຮ້ານອາຫານ',
      description: 'ອາຫານລາວແລະນານາຊາດ ລົດຊາດແສນອຮ່ອຍ ຈາກຊານມືມືອາຊີບ'
    },
    {
      icon: '🏊‍♂️',
      title: 'ສະຖານທີ່ພັກຜ່ອນ',
      description: 'ສະຫາຍນ້ຳ, ຫ້ອງອອກກຳລັງກາຍ, ແລະພື້ນທີ່ພັກຜ່ອນທີ່ສວຍງາມ'
    },
    {
      icon: '🚗',
      title: 'ບໍລິການຂົນສົ່ງ',
      description: 'ບໍລິການຮັບສົ່ງສະໜາມບິນ ແລະການເດີນທາງທ່ອງທ່ຽວ'
    },
    {
      icon: '📞',
      title: 'ບໍລິການ 24/7',
      description: 'ທີມງານພ້ອມໃຫ້ບໍລິການຕະຫຼອດ 24 ຊົ່ວໂມງ ທຸກມື້'
    },
    {
      icon: '🌐',
      title: 'ອິນເຕີເນັດໄວຟາຍ',
      description: 'ອິນເຕີເນັດໄວຟາຍຄວາມໄວສູງ ຟຣີທົ່ວທຸກພື້ນທີ່'
    }
  ]

  const team = [
    {
      name: 'ທ່ານ ສົມຊາຍ ພົງສະວັດ',
      position: 'ຜູ້ຈັດການໃຫຍ່',
      avatar: '👨‍💼',
      description: 'ປະສົບການ 15 ປີ ໃນອຸດສາຫະກຳໂຮງແຮມ'
    },
    {
      name: 'ນາງ ສົມຍິງ ພະຍາ',
      position: 'ຫົວຫນ້າພະແນກບໍລິການ',
      avatar: '👩‍💼',
      description: 'ຜູ້ຊ່ຽວຊານດ້ານການບໍລິການລູກຄ້າ'
    },
    {
      name: 'ທ່ານ ບຸນມີ ສົມບັດ',
      position: 'ເຊັຟຫັວຫນ້າ',
      avatar: '👨‍🍳',
      description: 'ຜູ້ຊ່ຽວຊານອາຫານລາວແລະນານາຊາດ'
    }
  ]

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', py: 8 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h1" fontWeight="bold" gutterBottom sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: { xs: '2.5rem', md: '3.5rem' }
        }}>
          ກ່ຽວກັບພວກເຮົາ
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', px: 3 }}>
          Dongxai Hotel - ທີ່ພັກແຫ່ງຄວາມສຸກແລະຄວາມສະດວກສະບາຍ ໃນໃຈກາງນະຄອນຫຼວງວຽງຈັນ
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        
        {/* About Story */}
        <GradientBox sx={{ mb: 8 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            ເລື່ອງລາວຂອງພວກເຮົາ
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, lineHeight: 1.8 }}>
            Dongxai Hotel ແມ່ນໂຮງແຮມທີ່ກໍ່ຕັ້ງຂຶ້ນດ້ວຍຄວາມຕັ້ງໃຈທີ່ຈະສະໜອງບໍລິການທີ່ພັກແຫ່ງຄຸນນະພາບສູງ
            ໃຫ້ແກ່ນັກທ່ອງທ່ຽວທັງໃນແລະຕ່າງປະເທດ. ພວກເຮົາມຸ່ງໝັ້ນທີ່ຈະສ້າງປະສົບການການພັກຜ່ອນທີ່ບໍ່ມີວັນລືມ
            ດ້ວຍການຜະສົມຜະສານລະຫວ່າງວັດທະນະທຳລາວດັ້ງເດີມແລະຄວາມທັນສະໄໝ
          </Typography>
        </GradientBox>

        {/* Stats */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <StyledCard>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h2" sx={{ mb: 2 }}>{stat.icon}</Typography>
                  <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                    {stat.value}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        {/* Services */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom sx={{ mb: 6 }}>
            ບໍລິການຂອງພວກເຮົາ
          </Typography>
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <StyledCard>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Typography variant="h1" sx={{ mb: 2 }}>{service.icon}</Typography>
                      <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {service.title}
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary" textAlign="center">
                      {service.description}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Team */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom sx={{ mb: 6 }}>
            ທີມງານຂອງພວກເຮົາ
          </Typography>
          <Grid container spacing={4}>
            {team.map((member, index) => (
              <Grid item xs={12} md={4} key={index}>
                <StyledCard>
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h1" sx={{ mb: 3 }}>{member.avatar}</Typography>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {member.name}
                    </Typography>
                    <Chip 
                      label={member.position} 
                      color="primary" 
                      sx={{ mb: 2, borderRadius: 3 }}
                    />
                    <Typography variant="body1" color="text.secondary">
                      {member.description}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Mission & Vision */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h1" sx={{ mb: 2 }}>🎯</Typography>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    ພາລະກິດ
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  ໃຫ້ບໍລິການທີ່ພັກແລະການຕ້ອນຮັບທີ່ເປັນເລີດ ສ້າງປະສົບການທີ່ບໍ່ລືມ 
                  ແລະສ້າງຄວາມສຸກໃຫ້ແກ່ແຂກທຸກທ່ານທີ່ມາພັກກັບພວກເຮົາ
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h1" sx={{ mb: 2 }}>👁️</Typography>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    ວິໄສທັດ
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  ເປັນໂຮງແຮມຊັ້ນນຳຂອງລາວ ທີ່ໄດ້ຮັບການຍອມຮັບໃນລະດັບສາກົນ 
                  ດ້ວຍຄຸນນະພາບການບໍລິການແລະການຮັກສາວັດທະນະທຳທ້ອງຖິ່ນ
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>

        {/* Call to Action */}
        <Paper elevation={3} sx={{ p: 6, borderRadius: 3, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            ມາເປັນສ່ວນໜຶ່ງຂອງປະສົບການອັນພິເສດ
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            ຈອງຫ້ອງພັກກັບພວກເຮົາວັນນີ້ ແລະສົມເປັນປະສົບການການພັກຜ່ອນທີ່ວິເສດ
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' },
                borderRadius: 3,
                px: 4
              }}
              onClick={() => window.location.href = '/book-now'}
            >
              ຈອງຫ້ອງພັກ
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': { 
                  borderColor: 'white', 
                  bgcolor: 'rgba(255,255,255,0.1)' 
                },
                borderRadius: 3,
                px: 4
              }}
              onClick={() => window.location.href = '/contact'}
            >
              ຕິດຕໍ່ພວກເຮົາ
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default AboutPage
