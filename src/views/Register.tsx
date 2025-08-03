'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { SystemMode } from '@core/types'
import type { Locale } from '@configs/i18n'
import { CustomerRegistrationForm, CustomerRegistrationData } from '@core/domain/models/customer/form.model'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Service Imports
import { customerService } from '@core/services/customer.service'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Styled Custom Components
const RegisterIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 600,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 345,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

// Form validation error type
type FormValidationErrors = {
  CustomerName?: string
  CustomerGender?: string
  CustomerTel?: string
  CustomerAddress?: string
  CustomerPostcode?: string
  userName?: string
  password?: string
  confirmPassword?: string
  agreeToTerms?: string
}

const Register = ({ mode }: { mode: SystemMode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Form Data State
  const [formData, setFormData] = useState<CustomerRegistrationForm>({
    CustomerName: '',
    CustomerGender: '',
    CustomerTel: '',
    CustomerAddress: '',
    CustomerPostcode: '',
    userName: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })

  // Validation Errors State
  const [errors, setErrors] = useState<FormValidationErrors>({})

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-register-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-register-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-register-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-register-light-border.png'

  // Hooks
  const { lang: locale } = useParams()
  const { settings } = useSettings()
  const theme = useTheme()
  const router = useRouter()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  // Handlers
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)

  const handleInputChange = (field: keyof CustomerRegistrationForm) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Validation Function
  const validateForm = (): boolean => {
    const newErrors: FormValidationErrors = {}

    // Required field validation
    if (!formData.CustomerName.trim()) newErrors.CustomerName = 'ກະລຸນາໃສ່ຊື່ຂອງທ່ານ'
    if (!formData.CustomerGender) newErrors.CustomerGender = 'ກະລຸນາເລືອກເພດ'
    if (!formData.CustomerTel.trim()) newErrors.CustomerTel = 'ກະລຸນາໃສ່ເບີໂທລະສັບ'
    if (!formData.CustomerAddress.trim()) newErrors.CustomerAddress = 'ກະລຸນາໃສ່ທີ່ຢູ່'
    if (!formData.CustomerPostcode.trim()) newErrors.CustomerPostcode = 'ກະລຸນາໃສ່ລະຫັດພັດສະປອດ'
    if (!formData.userName.trim()) newErrors.userName = 'ກະລຸນາໃສ່ຊື່ຜູ້ໃຊ້'
    if (!formData.password) newErrors.password = 'ກະລຸນາໃສ່ລະຫັດຜ່ານ'
    if (!formData.confirmPassword) newErrors.confirmPassword = 'ກະລຸນາຢືນຢັນລະຫັດຜ່ານ'
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'ກະລຸນາຍອມຮັບເງື່ອນໄຂການໃຊ້ງານ'

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'ລະຫັດຜ່ານບໍ່ກົງກັນ'
    }

    // Phone number validation (basic)
    if (formData.CustomerTel && !/^[0-9+\-\s]+$/.test(formData.CustomerTel)) {
      newErrors.CustomerTel = 'ເບີໂທລະສັບບໍ່ຖືກຕ້ອງ'
    }

    // Username validation
    if (formData.userName && formData.userName.length < 3) {
      newErrors.userName = 'ຊື່ຜູ້ໃຊ້ຕ້ອງມີຢ່າງໜ້ອຍ 3 ຕົວອັກສອນ'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Prepare data for API
      const registrationData: CustomerRegistrationData = {
        CustomerName: formData.CustomerName.trim(),
        CustomerGender: formData.CustomerGender,
        CustomerTel: formData.CustomerTel.replace(/[^\d]/g, ''), // Remove non-digits but keep as string
        CustomerAddress: formData.CustomerAddress.trim(),
        CustomerPostcode: formData.CustomerPostcode.replace(/[^\d]/g, ''),
        userName: formData.userName.trim(),
        password: formData.password
      }

      // Call registration API
      await customerService.register(registrationData)
      
      setSuccess(true)
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push(getLocalizedUrl('/login', locale as Locale))
      }, 2000)

    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err.response?.data?.message || err.message || 'ເກີດຂໍ້ຜິດພາດໃນການສະໝັກສະມາຊິກ')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className='flex bs-full justify-center items-center'>
        <div className='text-center'>
          <Alert severity="success" className='mb-4'>
            ສະໝັກສະມາຊິກສຳເລັດ! ກຳລັງນຳທ່ານໄປຫາໜ້າເຂົ້າສູ່ລະບົບ...
          </Alert>
          <CircularProgress />
        </div>
      </div>
    )
  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <RegisterIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && <MaskImg alt='mask' src={authBackground} />}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link
          href={getLocalizedUrl('/login', locale as Locale)}
          className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'
        >
          <Logo />
        </Link>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>Adventure starts here 🚀</Typography>
            <Typography>Make your app management easy and fun!</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <CustomTextField 
              autoFocus 
              fullWidth 
              label='ຊື່ຂອງທ່ານ' 
              placeholder='ກະລຸນາໃສ່ຊື່ຂອງທ່ານ' 
              value={formData.CustomerName} 
              onChange={handleInputChange('CustomerName')} 
              error={!!errors.CustomerName} 
              helperText={errors.CustomerName} 
            />
            <CustomTextField 
              select 
              fullWidth 
              label='ເພດ' 
              placeholder='ກະລຸນາເລືອກເພດ' 
              value={formData.CustomerGender} 
              onChange={handleInputChange('CustomerGender')} 
              error={!!errors.CustomerGender} 
              helperText={errors.CustomerGender} 
            >
              <MenuItem value='male'>ຊາຍ</MenuItem>
              <MenuItem value='female'>ຍິງ</MenuItem>
            </CustomTextField>
            <CustomTextField 
              fullWidth 
              label='ເບີໂທລະສັບ' 
              placeholder='ກະລຸນາໃສ່ເບີໂທລະສັບ' 
              value={formData.CustomerTel} 
              onChange={handleInputChange('CustomerTel')} 
              error={!!errors.CustomerTel} 
              helperText={errors.CustomerTel} 
            />
            <CustomTextField 
              fullWidth 
              label='ທີ່ຢູ່' 
              placeholder='ກະລຸນາໃສ່ທີ່ຢູ່' 
              value={formData.CustomerAddress} 
              onChange={handleInputChange('CustomerAddress')} 
              error={!!errors.CustomerAddress} 
              helperText={errors.CustomerAddress} 
            />
            <CustomTextField 
              fullWidth 
              label='ລະຫັດພັດສະປອດ' 
              placeholder='ກະລຸນາໃສ່ລະຫັດພັດສະປອດ' 
              value={formData.CustomerPostcode} 
              onChange={handleInputChange('CustomerPostcode')} 
              error={!!errors.CustomerPostcode} 
              helperText={errors.CustomerPostcode} 
            />
            <CustomTextField 
              fullWidth 
              label='ຊື່ຜູ້ໃຊ້' 
              placeholder='ກະລຸນາໃສ່ຊື່ຜູ້ໃຊ້' 
              value={formData.userName} 
              onChange={handleInputChange('userName')} 
              error={!!errors.userName} 
              helperText={errors.userName} 
            />
            <CustomTextField 
              fullWidth 
              label='ລະຫັດຜ່ານ' 
              placeholder='ກະລຸນາໃສ່ລະຫັດຜ່ານ' 
              type={isPasswordShown ? 'text' : 'password'} 
              value={formData.password} 
              onChange={handleInputChange('password')} 
              error={!!errors.password} 
              helperText={errors.password} 
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                      <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <CustomTextField 
              fullWidth 
              label='ຢືນຢັນລະຫັດຜ່ານ' 
              placeholder='ກະລຸນາຢືນຢັນລະຫັດຜ່ານ' 
              type={isConfirmPasswordShown ? 'text' : 'password'} 
              value={formData.confirmPassword} 
              onChange={handleInputChange('confirmPassword')} 
              error={!!errors.confirmPassword} 
              helperText={errors.confirmPassword} 
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton edge='end' onClick={handleClickShowConfirmPassword} onMouseDown={e => e.preventDefault()}>
                      <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <FormControlLabel
              control={<Checkbox checked={formData.agreeToTerms} onChange={handleInputChange('agreeToTerms')} />}
              label={
                <>
                  <span>ຍອມຮັບເງື່ອນໄຂການໃຊ້ງານ</span>
                </>
              }
            />
            {error && (
              <Alert severity="error" className='mb-4'>
                {error}
              </Alert>
            )}
            <Button 
              fullWidth 
              variant='contained' 
              type='submit' 
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} />
              ) : (
                'ສະໝັກສະມາຊິກ'
              )}
            </Button>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>ມີບັນຊີແລ້ວບໍ່?</Typography>
              <Typography component={Link} href={getLocalizedUrl('/login', locale as Locale)} color='primary'>
                ເຂົ້າສູ່ລະບົບ
              </Typography>
            </div>
            <Divider className='gap-2'>or</Divider>
            <div className='flex justify-center items-center gap-1.5'>
              <IconButton className='text-facebook' size='small'>
                <i className='tabler-brand-facebook-filled' />
              </IconButton>
              <IconButton className='text-twitter' size='small'>
                <i className='tabler-brand-twitter-filled' />
              </IconButton>
              <IconButton className='text-textPrimary' size='small'>
                <i className='tabler-brand-github-filled' />
              </IconButton>
              <IconButton className='text-error' size='small'>
                <i className='tabler-brand-google-filled' />
              </IconButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
