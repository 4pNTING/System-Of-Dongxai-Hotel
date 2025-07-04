'use client'

import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { MESSAGES } from '../../../../libs/constants/messages.constant'
import { useCustomerStore } from '@/@core/infrastructure/store/customer/customer.store'
import { CustomerFormSchema } from '@core/domain/schemas/customer.schema'
import { Customer } from '@core/domain/models/customer/list.model'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'

interface CustomerFormInputProps {
  visible: boolean
  onHide: () => void 
  selectedItem: Customer | null
  onSaved?: () => void
}

// กำหนดฟอร์มอินพุท
interface CustomerInputForm {
  CustomerName: string
  CustomerGender: string
  CustomerTel: number | undefined
  CustomerAddress: string
  CustomerPostcode: number | undefined
}

const CustomerFormInput = ({ visible, onHide, selectedItem, onSaved }: CustomerFormInputProps) => {
  const { create, update, fetchItems, isSubmitting, reset: resetStore } = useCustomerStore()
  const isEditMode = Boolean(selectedItem)

  // กำหนดค่าเริ่มต้น
  const defaultValues: CustomerInputForm = {
    CustomerName: '',
    CustomerGender: 'MALE',
    CustomerTel: undefined,
    CustomerAddress: '',
    CustomerPostcode: undefined
  }

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CustomerInputForm>({
    defaultValues,
    resolver: zodResolver(CustomerFormSchema)
  })

  // โหลดข้อมูลลูกค้าเมื่ออยู่ในโหมดแก้ไข
  useEffect(() => {
    if (visible && selectedItem) {
      reset({
        CustomerName: selectedItem.CustomerName || '',
        CustomerGender: selectedItem.CustomerGender || 'MALE',
        CustomerTel: selectedItem.CustomerTel ? Number(selectedItem.CustomerTel) : undefined,
        CustomerAddress: selectedItem.CustomerAddress || '',
        CustomerPostcode: selectedItem.CustomerPostcode ? Number(selectedItem.CustomerPostcode) : undefined
      })
    } else if (visible) {
      reset(defaultValues)
    }
  }, [visible, selectedItem, reset])

  // จัดการปิดฟอร์ม
  const handleClose = () => {
    reset(defaultValues)
    resetStore()
    onHide()
  }

  // ส่งข้อมูลฟอร์มไปยัง API
  const onSubmit = async (data: CustomerInputForm) => {
    try {
      // เตรียมข้อมูลลูกค้า
      const customerData = {
        CustomerName: data.CustomerName,
        CustomerGender: data.CustomerGender,
        CustomerTel: data.CustomerTel,
        CustomerAddress: data.CustomerAddress,
        CustomerPostcode: data.CustomerPostcode
      }

      if (isEditMode && selectedItem) {
        // อัปเดตลูกค้า
        await update(selectedItem.CustomerId, customerData)
        toast.success(MESSAGES.SUCCESS.EDIT)
      } else {
        // สร้างลูกค้าใหม่
        await create(customerData)
        toast.success(MESSAGES.SUCCESS.SAVE)
      }
      
      // โหลดข้อมูลใหม่จาก API
      await fetchItems()
      
      // ถ้ามี callback ให้เรียกใช้
      if (onSaved) onSaved()
      
      // ปิดฟอร์ม
      handleClose()
    } catch (error) {
      console.error('Error saving customer:', error)
      toast.error(isEditMode ? MESSAGES.ERROR.EDIT : MESSAGES.ERROR.SAVE)
    }
  }

  return (
    <Dialog open={visible} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle sx={{ pb: 2, borderBottom: '1px solid #eee' }}>
        {isEditMode ? 'ແກ້ໄຂຂໍ້ມູນລູກຄ້າ' : 'ເພີ່ມລູກຄ້າໃໝ່'}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Divider sx={{ mb: 2 }}>ຂໍ້ມູນລູກຄ້າ</Divider>
            </Grid>

            {/* ชื่อลูกค้า */}
            <Grid item xs={12} md={6}>
              <Controller
                name='CustomerName'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='ຊື່ລູກຄ້າ'
                    fullWidth
                    error={Boolean(errors.CustomerName)}
                    helperText={errors.CustomerName?.message}
                    InputProps={{ sx: { borderRadius: 1 } }}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            {/* เพศ */}
            <Grid item xs={12} md={6}>
              <Controller
                name='CustomerGender'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.CustomerGender)} disabled={isSubmitting}>
                    <InputLabel>ເພດ</InputLabel>
                    <Select {...field} label='ເພດ' value={field.value || 'MALE'} sx={{ borderRadius: 1 }}>
                      <MenuItem value='MALE'>ຊາຍ</MenuItem>
                      <MenuItem value='FEMALE'>ຍິງ</MenuItem>
                    </Select>
                    {errors.CustomerGender && <FormHelperText error>{errors.CustomerGender.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            {/* เบอร์โทรศัพท์ */}
            <Grid item xs={12} md={6}>
              <Controller
                name='CustomerTel'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='ເບີໂທລະສັບ'
                    type='number'
                    fullWidth
                    error={Boolean(errors.CustomerTel)}
                    helperText={errors.CustomerTel?.message}
                    InputProps={{ sx: { borderRadius: 1 } }}
                    onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            {/* รหัสไปรษณีย์ */}
            <Grid item xs={12} md={6}>
              <Controller
                name='CustomerPostcode'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='ລະຫັດພັດສະປອດ'
                    type='number'
                    fullWidth
                    error={Boolean(errors.CustomerPostcode)}
                    helperText={errors.CustomerPostcode?.message}
                    InputProps={{ sx: { borderRadius: 1 } }}
                    onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            {/* ที่อยู่ */}
            <Grid item xs={12}>
              <Controller
                name='CustomerAddress'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='ທີ່ຢູ່'
                    fullWidth
                    multiline
                    rows={3}
                    error={Boolean(errors.CustomerAddress)}
                    helperText={errors.CustomerAddress?.message}
                    InputProps={{ sx: { borderRadius: 1 } }}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, borderTop: '1px solid #eee', pt: 2 }}>
          <Button
            variant='outlined'
            color='secondary'
            onClick={handleClose}
            disabled={isSubmitting}
            sx={{ borderRadius: 1, textTransform: 'none' }}
          >
            ຍົກເລີກ
          </Button>
          <Button
            variant='contained'
            type='submit'
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            sx={{ borderRadius: 1, ml: 2, textTransform: 'none' }}
          >
            {isSubmitting ? 'ກຳລັງບັນທຶກ...' : isEditMode ? 'ອັບເດດ' : 'ບັນທຶກ'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CustomerFormInput