// src/views/apps/booking/components/BookingFormInput.tsx
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
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
  deposit?: number
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
  const { data: session } = useSession();
  const [bookingData, setBookingData] = useState(null);
  
  const isEditMode = Boolean(selectedItem)

  // กำหนดค่าเริ่มต้น - ใช้ string สำหรับวันที่
  const defaultValues: BookingInputForm = {
    BookingDate: formatDateForInput(new Date()),
    RoomId: 0,
    CheckinDate: formatDateForInput(new Date()),
    CheckoutDate: formatDateForInput(new Date(new Date().setDate(new Date().getDate() + 1))),
    CustomerId: 0,
    StaffId: 0,
    StatusId: 0,
    deposit: 0  // 💰 เพิ่มฟิลด์ deposit ใน defaultValues
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
        StatusId: selectedItem.StatusId,
        deposit: selectedItem.deposit || 0  // 💰 เพิ่มฟิลด์ deposit สำหรับโหมดแก้ไข
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
        CheckoutDate: typeof data.CheckoutDate === 'string' ? data.CheckoutDate : formatDateForInput(data.CheckoutDate as Date),
        deposit: data.deposit || 0  // เพิ่มมัดจำ default เป็น 0 ถ้าไม่ได้กรอก
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

            {/* มัดจำ (Deposit) */}
            <Grid item xs={12} md={6}>
              <Controller
                name='deposit'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label='ສ່ວນລົດ (LAK)'
                    fullWidth
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0
                      field.onChange(value)
                    }}
                    error={!!errors.deposit}
                    helperText={errors.deposit?.message || 'ມັດຈໍາສໍາລັບການຈອງນີ້ (ທາງເລືອກ)'}
                    disabled={isSubmitting}
                    inputProps={{ 
                      min: 0, 
                      step: 1000,
                      placeholder: '0'
                    }}
                    InputProps={{
                      startAdornment: (
                        <span style={{ marginRight: '8px', color: '#666' }}>💰</span>
                      ),
                    }}
                    sx={{ borderRadius: 1 }}
                  />
                )}
              />
            </Grid>

            {/* ແສດງໄຟລ໌ແນບທີ່ມີຢູ່ (ໃບບິນ/ຮູບພາບ) */}
            {selectedItem?.attachments && selectedItem.attachments.length > 0 && (
              <Grid item xs={12}>
                <div style={{ 
                  marginTop: '16px', 
                  padding: '16px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '8px',
                  border: '1px solid #e3e6ea'
                }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: '#f8f9ff',
                    border: '1px solid #e3e8ff'
                  }}>
                    <span style={{ 
                      marginRight: '12px', 
                      fontSize: '20px',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}>📎</span>
                    <span style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: '700'
                    }}>
                      ໄຟລ໌ແນບ ({selectedItem.attachments.length} ໄຟລ໌)
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    {selectedItem.attachments.map((attachment: any, index: number) => {
                      const fileName = attachment.FilePath.split('/').pop() || 'unknown';
                      const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName);
                      
                      return (
                        <div key={attachment.AttachmentId} style={{
                          padding: '16px 20px',
                          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                          borderRadius: '16px',
                          border: '1px solid #e3e8ff',
                          boxShadow: '0 4px 16px rgba(31, 38, 135, 0.1)',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          cursor: 'default',
                          position: 'relative',
                          overflow: 'hidden',
                          backdropFilter: 'blur(5px)',
                          minHeight: '70px'
                        }}>
                          {/* ໄອຄອນໄຟລ໌ */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            minWidth: '50px'
                          }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              background: isImage ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                              borderRadius: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}>
                              <span style={{ fontSize: '18px' }}>
                                {isImage ? '🖼️' : '📄'}
                              </span>
                            </div>
                          </div>
                          
                          {/* ข້ອມູນໄຟລ໌ */}
                          <div style={{ 
                            flex: 1,
                            marginLeft: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            fontWeight: '500',
                            padding: '8px 12px',
                            backgroundColor: '#f7fafc',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                          }}>
                            {new Date(attachment.UploadedAt).toLocaleDateString('lo-LA', {
                              year: 'numeric',
                              month: '2-digit', 
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          
                          {/* ปุ່ມເປີດໄຟລ໌ */}
                          <button
                            type="button"
                            onClick={async () => {
                              console.log('=== BUTTON CLICK STARTED ===');
                              
                              try {
                                // ໃຊ້ fetch API ພ້ອມ JWT token ເພື່ອດາວໂຫລດໄຟລ໌
                                console.log('Building download URL...');
                                const downloadUrl = `http://localhost:5000/v1/booking-attachments/${attachment.AttachmentId}/download`;
                                
                                // ດຶງชື່ໄຟລ໌จາກ FilePath ເພາະໄມ່ມີ FileName field
                                console.log('Extracting filename from FilePath...');
                                const fileName = attachment.FilePath.split('/').pop() || 'attachment';
                                
                                console.log('Downloading file via authenticated API:', {
                                  attachmentId: attachment.AttachmentId,
                                  downloadUrl: downloadUrl,
                                  filePath: attachment.FilePath,
                                  extractedFileName: fileName
                                });
                                
                                // ດຶງ accessToken จາກ NextAuth session
                                console.log('Getting accessToken from NextAuth session...');
                                console.log('Session object:', session);
                                
                                const token = session?.user?.accessToken;
                                console.log('AccessToken retrieved:', token ? 'YES (exists)' : 'NO (null)');
                                console.log('Session user:', session?.user);
                                
                                if (!token) {
                                  console.error('No token found - showing alert');
                                  alert('ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ');
                                  return;
                                }

                                // ສົ່ງ request ດ້ວຍ JWT token
                                console.log('Sending fetch request...');
                                const response = await fetch(downloadUrl, {
                                  method: 'GET',
                                  headers: {
                                    'Authorization': `Bearer ${token}`,
                                  },
                                });

                                console.log('Response received:', {
                                  status: response.status,
                                  statusText: response.statusText,
                                  ok: response.ok,
                                  headers: Object.fromEntries(response.headers.entries())
                                });

                                if (!response.ok) {
                                  const errorText = await response.text();
                                  console.error('Response error:', errorText);
                                  throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
                                }

                                // ແປງເປັນ blob ແລະສ້າງ URL
                                console.log('Converting to blob...');
                                const blob = await response.blob();
                                console.log('Blob created:', {
                                  size: blob.size,
                                  type: blob.type
                                });
                                
                                const blobUrl = window.URL.createObjectURL(blob);
                                console.log('Blob URL created:', blobUrl);
                                
                                // ເປີດໄຟລ໌ໃນ tab ໃຫມ່ເພື່ອ preview ແທນ download
                                console.log('Opening file in new tab for preview...');
                                const previewWindow = window.open(blobUrl, '_blank');
                                
                                if (!previewWindow || previewWindow.closed || typeof previewWindow.closed === 'undefined') {
                                  console.error('Popup blocked - falling back to download');
                                  // Fallback: ถ້າ popup ບ່ນໄດ້ ໃຫ້ download ແທນ
                                  const link = document.createElement('a');
                                  link.href = blobUrl;
                                  link.download = fileName;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                  alert('ບໍ່ສາມາດເປີດໄຟລ໌ໄດ້ - ກະລຸນາອະນຸຍາດ popup');
                                } else {
                                  console.log('File opened in new tab successfully');
                                }
                                
                                // ລຶບ blob URL ເພື່ອປ່ອຍ memory
                                setTimeout(() => {
                                  console.log('Cleaning up blob URL...');
                                  window.URL.revokeObjectURL(blobUrl);
                                }, 100);
                                
                                console.log('File download process completed successfully');
                              } catch (error) {
                                console.error('Error downloading file:', error);
                                alert('ມີຂໍ້ຜິດພາດໃນການດາວໂຫລດໄຟລ໌');
                              }
                            }}
                            style={{
                              padding: '12px 24px',
                              fontSize: '13px',
                              fontWeight: '600',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '12px',
                              cursor: 'pointer',
                              textTransform: 'none',
                              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              letterSpacing: '0.5px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              minWidth: '120px',
                              transform: 'translateY(0)',
                              backdropFilter: 'blur(10px)'
                            }}
                            onMouseOver={(e) => {
                              const element = e.target as HTMLElement;
                              element.style.transform = 'translateY(-2px)';
                              element.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
                            }}
                            onMouseOut={(e) => {
                              const element = e.target as HTMLElement;
                              element.style.transform = 'translateY(0)';
                              element.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                            }}
                          >
                            ເບິ່ງໄຟລ໌
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Grid>
            )}
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