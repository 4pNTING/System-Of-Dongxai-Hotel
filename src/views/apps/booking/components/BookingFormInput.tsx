// src/views/apps/booking/components/BookingFormInput.tsx
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { MESSAGES } from '../../../../libs/constants/messages.constant'
import { useBookingStore } from '@/@core/infrastructure/store/booking/booking.store'
import { BookingFormSchema } from '@core/domain/schemas/booking.schema'
import { Booking } from '@core/domain/models/booking/list.model'

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
import Autocomplete from '@mui/material/Autocomplete'

// Store Imports
import { useRoomStore } from '@/@core/infrastructure/store/rooms/room.store'
import { useCustomerStore } from '@/@core/infrastructure/store/customer/customer.store'
import { useStaffStore } from '@/@core/infrastructure/store/staffs/staff.store'
import { useBookingStatusStore } from '@/@core/infrastructure/store/booking/booking-status.store'

interface BookingFormInputProps {
  open: boolean
  onClose: () => void
  selectedItem: Booking | null
  onSaved?: () => void
}

// กำหนดฟอร์มอินพุท
interface BookingInputForm {
  BookingDate: Date | string
  RoomId: number
  CheckinDate: Date | string
  CheckoutDate: Date | string
  CustomerId: number
  StaffId: number
  StatusId: number
}

// Helper function to format date to yyyy-MM-dd
const formatDateForInput = (date: Date | string): string => {
  if (typeof date === 'string') {
    return date.substring(0, 10) // Assuming the format is already YYYY-MM-DD...
  }
  return date.toISOString().substring(0, 10)
}

// Helper function to parse date string
const parseDate = (dateString: string): Date => {
  return new Date(dateString)
}

const BookingFormInput = ({ open, onClose, selectedItem, onSaved }: BookingFormInputProps) => {
  // แก้ไขการเรียกใช้ store
  const { 
    create,   
    update,
    fetchItems, 
    isSubmitting, 
    reset: resetStore 
  } = useBookingStore()
  
  // แก้ไขการเรียกใช้ rooms
  const { items: rooms, fetchItems: fetchRooms } = useRoomStore()
  const { items: customers, fetchItems: fetchCustomers } = useCustomerStore()
  const { items: staffs, fetchItems: fetchStaffs } = useStaffStore()
  const { bookingStatuses, fetchBookingStatuses } = useBookingStatusStore()
  
  const isEditMode = Boolean(selectedItem)

  // กำหนดค่าเริ่มต้น - ใช้ string สำหรับวันที่
  const defaultValues: BookingInputForm = {
    BookingDate: formatDateForInput(new Date()),
    RoomId: 0,
    CheckinDate: formatDateForInput(new Date()),
    CheckoutDate: formatDateForInput(new Date(new Date().setDate(new Date().getDate() + 1))),
    CustomerId: 0,
    StaffId: 0,
    StatusId: 0
  }

  const { control, handleSubmit, reset, formState: { errors } } = useForm<BookingInputForm>({
    defaultValues,
    resolver: zodResolver(BookingFormSchema)
  })

  // โหลดข้อมูลที่จำเป็นสำหรับฟอร์ม
  useEffect(() => {
    fetchRooms()
    fetchCustomers()
    fetchStaffs()
    fetchBookingStatuses()
  }, [fetchRooms, fetchCustomers, fetchStaffs, fetchBookingStatuses])

  // โหลดข้อมูลการจองเมื่ออยู่ในโหมดแก้ไข
  useEffect(() => {
    if (open && selectedItem) {
      reset({
        BookingDate: formatDateForInput(selectedItem.BookingDate),
        RoomId: selectedItem.RoomId,
        CheckinDate: formatDateForInput(selectedItem.CheckinDate),
        CheckoutDate: formatDateForInput(selectedItem.CheckoutDate),
        CustomerId: selectedItem.CustomerId,
        StaffId: selectedItem.StaffId,
        StatusId: selectedItem.StatusId
      })
    } else if (open) {
      reset(defaultValues)
    }
  }, [open, selectedItem, reset])

  // จัดการปิดฟอร์ม - รีเซ็ตทั้ง form และ store
  const handleClose = () => {
    reset(defaultValues)
    resetStore()
    onClose()
  }

  // ส่งข้อมูลฟอร์มไปยัง API
  const onSubmit = async (data: BookingInputForm) => {
    // ป้องกันการ submit ซ้ำ
    if (isSubmitting) {
      return
    }

    try {
      console.log('Form data received:', data)
      
      // แปลง Date object เป็น string format สำหรับ API (YYYY-MM-DD)
      const bookingData = {
        RoomId: data.RoomId,
        CustomerId: data.CustomerId,
        StaffId: data.StaffId,
        StatusId: data.StatusId,
        BookingDate: typeof data.BookingDate === 'string' ? data.BookingDate : formatDateForInput(data.BookingDate as Date),
        CheckinDate: typeof data.CheckinDate === 'string' ? data.CheckinDate : formatDateForInput(data.CheckinDate as Date),
        CheckoutDate: typeof data.CheckoutDate === 'string' ? data.CheckoutDate : formatDateForInput(data.CheckoutDate as Date)
      }
      
      console.log('Prepared booking data for API:', bookingData)

      if (isEditMode && selectedItem) {
        // อัปเดตการจอง - store method จะจัดการ toast และ refresh ข้อมูลเอง
        await update(selectedItem.BookingId, bookingData)
      } else {
        // สร้างการจองใหม่ - store method จะจัดการ toast และ refresh ข้อมูลเอง
        await create(bookingData)
      }
      
      // ปิดฟอร์ม
      handleClose()
      
      // เรียกใช้ callback หลังบันทึก (ถ้ามี)
      if (onSaved) {
        onSaved()
      }
    } catch (error) {
      console.error('Error saving booking:', error)
      // แสดง error toast เฉพาะเมื่อเกิดข้อผิดพลาด
      toast.error(isEditMode ? MESSAGES.ERROR.EDIT : MESSAGES.ERROR.SAVE)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle sx={{ pb: 2, borderBottom: '1px solid #eee' }}>
        {isEditMode ? 'ແກ້ໄຂຂໍ້ມູນການຈອງ' : 'ເພີ່ມການຈອງໃໝ່'}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Divider sx={{ mb: 2 }}>ຂໍ້ມູນການຈອງ</Divider>
            </Grid>

            {/* วันที่จอง - ใช้ TextField แทน DatePicker */}
            <Grid item xs={12} md={6}>
              <Controller
                name='BookingDate'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    label='ວັນທີຈອງ'
                    fullWidth
                    error={!!errors.BookingDate}
                    helperText={errors.BookingDate?.message}
                    disabled={isSubmitting}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>

            {/* ห้องพัก */}
            <Grid item xs={12} md={6}>
              <Controller
                name='RoomId'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.RoomId} disabled={isSubmitting}>
                    <InputLabel id='room-select-label'>ຫ້ອງພັກ</InputLabel>
                    <Select
                      {...field}
                      labelId='room-select-label'
                      label='ຫ້ອງພັກ'
                      value={field.value || 0}
                      sx={{ borderRadius: 1 }}
                    >
                      <MenuItem value={0} disabled>
                        <em>ເລືອກຫ້ອງພັກ</em>
                      </MenuItem>
                      {rooms.map(room => (
                        <MenuItem key={room.RoomId} value={room.RoomId}>
                          {`ຫ້ອງ ${room.RoomId} - ${room.roomType?.TypeName || ''} - ${room.RoomPrice} KIP`}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.RoomId && <FormHelperText>{errors.RoomId.message?.toString()}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            {/* วันที่เช็คอิน - ใช้ TextField แทน DatePicker */}
            <Grid item xs={12} md={6}>
              <Controller
                name='CheckinDate'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    label='ວັນທີເຂົ້າພັກ'
                    fullWidth
                    error={!!errors.CheckinDate}
                    helperText={errors.CheckinDate?.message}
                    disabled={isSubmitting}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>

            {/* วันที่เช็คเอาท์ - ใช้ TextField แทน DatePicker */}
            <Grid item xs={12} md={6}>
              <Controller
                name='CheckoutDate'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    label='ວັນທີອອກຈາກຫ້ອງພັກ'
                    fullWidth
                    error={!!errors.CheckoutDate}
                    helperText={errors.CheckoutDate?.message}
                    disabled={isSubmitting}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>

            {/* ລູກຄ້າ */}
            <Grid item xs={12} md={6}>
              <Controller
                name='CustomerId'
                control={control}
                render={({ field }) => {
                  const selectedCustomer = customers.find(customer => customer.CustomerId === field.value) || null
                  return (
                    <Autocomplete
                      options={customers}
                      getOptionLabel={(option) => `${option.CustomerName} (${option.CustomerTel || 'ບໍ່ມີເບີໂທ'})`}
                      value={selectedCustomer}
                      onChange={(_, newValue) => {
                        field.onChange(newValue ? newValue.CustomerId : 0)
                      }}
                      disabled={isSubmitting}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='ລູກຄ້າ'
                          placeholder='ຄົ້ນຫາຊື່ ຫຼື ເບີໂທລູກຄ້າ...'
                          error={!!errors.CustomerId}
                          helperText={errors.CustomerId?.message?.toString()}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                {params.InputProps.startAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props} key={option.CustomerId}>
                          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <div style={{ fontWeight: 'bold' }}>{option.CustomerName}</div>
                            <div style={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                              📞 {option.CustomerTel || 'ບໍ່ມີເບີໂທ'}
                            </div>
                          </div>
                        </li>
                      )}
                      filterOptions={(options, { inputValue }) => {
                        const filtered = options.filter(option => 
                          option.CustomerName.toLowerCase().includes(inputValue.toLowerCase()) ||
                          (option.CustomerTel && option.CustomerTel.includes(inputValue))
                        )
                        return filtered
                      }}
                      noOptionsText='ບໍ່ພົບລູກຄ້າ'
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                  )
                }}
              />
            </Grid>

            {/* ພະນັກງານ */}
            <Grid item xs={12} md={6}>
              <Controller
                name='StaffId'
                control={control}
                render={({ field }) => {
                  const selectedStaff = staffs.find(staff => staff.StaffId === field.value) || null
                  return (
                    <Autocomplete
                      options={staffs}
                      getOptionLabel={(option) => `${option.StaffName}`}
                      value={selectedStaff}
                      onChange={(_, newValue) => {
                        field.onChange(newValue ? newValue.StaffId : 0)
                      }}
                      disabled={isSubmitting}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='ພະນັກງານ'
                          placeholder='ຄົ້ນຫາຊື່ພະນັກງານ...'
                          error={!!errors.StaffId}
                          helperText={errors.StaffId?.message?.toString()}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                {params.InputProps.startAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props} key={option.StaffId}>
                          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <div style={{ fontWeight: 'bold' }}>{option.StaffName}</div>
                          </div>
                        </li>
                      )}
                      filterOptions={(options, { inputValue }) => {
                        const filtered = options.filter(option => 
                          option.StaffName.toLowerCase().includes(inputValue.toLowerCase())
                        )
                        return filtered
                      }}
                      noOptionsText='ບໍ່ພົບພະນັກງານ'
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                  )
                }}
              />
            </Grid>

            {/* สถานะการจอง */}
            <Grid item xs={12}>
              <Controller
                name='StatusId'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.StatusId} disabled={isSubmitting}>
                    <InputLabel id='status-select-label'>ສະຖານະການຈອງ</InputLabel>
                    <Select
                      {...field}
                      labelId='status-select-label'
                      label='ສະຖານະການຈອງ'
                      value={field.value || 0}
                      sx={{ borderRadius: 1 }}
                    >
                      <MenuItem value={0} disabled>
                        <em>ເລືອກສະຖານະການຈອງ</em>
                      </MenuItem>
                      {bookingStatuses.map(status => (
                        <MenuItem key={status.StatusId} value={status.StatusId}>
                          {status.StatusName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.StatusId && <FormHelperText>{errors.StatusId.message?.toString()}</FormHelperText>}
                  </FormControl>
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

export default BookingFormInput