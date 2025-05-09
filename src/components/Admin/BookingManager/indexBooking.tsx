import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useToast } from '../../Styles/ToastProvider';
import DialogContentText from '@mui/material/DialogContentText';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getMonthlyContactCountAPI } from '../../API';
import { getAllContactsAPI, getContactsByDateAPI, getContactsByTimeSlotAPI, updateContactAPI, updateContactStatusAPI, deleteContactAPI, getContactByIdAPI } from '../../API';

const PageContainer = styled(Container)`
  padding: 40px 0;
  
  @media (max-width: 768px) {
    padding: 20px 10px;
  }
`;

const Title = styled.h1`
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    margin-bottom: 20px !important;
    font-size: 1.5rem !important;
  }
`;

const StyledTableContainer = styled(TableContainer) <StyledTableContainerProps>`
  margin-top: 20px;
  overflow-x: auto;
  
  .MuiTableCell-head {
    font-weight: 600;
    background-color: #f5f5f5;
    
    @media (max-width: 768px) {
      display: none;
    }
  }

  .MuiTableCell-body {
    @media (max-width: 768px) {
      display: block;
      padding: 8px 16px;
      text-align: left;
      border: none;
      
      &:before {
        content: attr(data-label);
        float: left;
        font-weight: bold;
        margin-right: 1rem;
      }
    }
  }

  .MuiTableRow-root {
    @media (max-width: 768px) {
      display: block;
      border: 1px solid #ddd;
      border-radius: 8px;
      margin-bottom: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
  }
`;

const ImageThumbnail = styled.img`
  max-width: 200px;
  max-height: 200px;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    max-width: 150px;
    max-height: 150px;
  }

  @media (max-width: 480px) {
    max-width: 100px;
    max-height: 100px;
  }
`;

const StyledButton = styled(Button)`
  &.MuiButton-root {
    padding: 8px 20px;
    border-radius: 6px;
    text-transform: none;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.2s ease;
    
    &.MuiButton-contained {
      background-color: ${props => props.color === 'error' ? '#e31837' : '#666'};
      color: white;
      box-shadow: none;
      
      &:hover {
        background-color: ${props => props.color === 'error' ? '#c41730' : '#555'};
        box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
      }
      
      &:active {
        transform: scale(0.98);
      }
    }
    
    &.MuiButton-outlined {
      border: 1px solid #ddd;
      color: #666;
      
      &:hover {
        background-color: #f9f9f9;
        border-color: #ccc;
      }
    }
  }
`;

type StyledTableContainerProps = {
    component?: React.ComponentType<any>;
};

interface Contact {
    _id: string;
    fullName: string;
    date: string;
    timeSlot: string;
    numberPhone: string;
    description: string;
    images: string[];
    status: keyof typeof ContactStatus;
    createdAt: string;
}

const TIME_SLOTS = [
    '08:00', '09:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00'
];

const ContactStatus = {
    pending: 'Chờ xử lý',
    confirmed: 'Đã xác nhận',
    cancelled: 'Đã hủy'
} as const;

const IndexBooking = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [editedContact, setEditedContact] = useState<Contact | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updateReason, setUpdateReason] = useState('');
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState<keyof typeof ContactStatus>('pending');
    const [searchDate, setSearchDate] = useState('');
    const [searchTimeSlot, setSearchTimeSlot] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [contactToDelete, setContactToDelete] = useState<string | null>(null);
    const [isMonthlyModalOpen, setIsMonthlyModalOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [monthlyCount, setMonthlyCount] = useState(0);
    const showToast = useToast();

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await getAllContactsAPI();
            setContacts(response);
        } catch (error) {
            showToast('Không thể tải danh sách lịch hẹn', 'error');
        }
    };

    const handleViewDetails = async (contact: Contact) => {
        try {
            const contactDetails = await getContactByIdAPI(contact._id);
            setSelectedContact(contactDetails);
            setEditedContact(contactDetails);
            setUpdateReason(''); // Reset lý do mỗi lần mở
            setIsDetailDialogOpen(true);
        } catch (error) {
            showToast('Không thể tải chi tiết lịch hẹn', 'error');
        }
    };

    const handleSaveEdit = async () => {
        if (!editedContact) return;

        if (!updateReason.trim()) {
            showToast('Vui lòng nhập lý do cập nhật.', 'warning');
            return;
        }

        try {
            const payload = {
                ...editedContact,
                updateReason
            };

            const response = await updateContactAPI(editedContact._id, payload);
            if (response) {
                showToast('Cập nhật thông tin thành công', 'success');
                setIsEditing(false);
                setIsDetailDialogOpen(false);
                setUpdateReason('');
                fetchContacts();
            }
        } catch (error) {
            showToast('Không thể cập nhật thông tin', 'error');
        }
    };

    const handleDelete = async (contactId: string) => {
        setContactToDelete(contactId);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (contactToDelete) {
            try {
                const response = await deleteContactAPI(contactToDelete);
                if (response.status === 200) {
                    setContacts(prev => prev.filter(a => a._id !== contactToDelete));
                    showToast(response.data.message, 'success');
                } else {
                    showToast(response.data.message, 'error');
                }
            } catch (err) {
                console.error('Error deleting contact:', err);
                showToast('Không thể xóa lịch hẹn!', 'error');
            }
        }
        setDeleteConfirmOpen(false);
        setContactToDelete(null);
    };

    const handleStatusChange = async () => {
        if (!selectedContact) return;
        try {
            const response = await updateContactStatusAPI(selectedContact._id, newStatus);
            if (response) {
                showToast('Cập nhật trạng thái thành công', 'success');
                setIsStatusDialogOpen(false);
                fetchContacts();
            }
        } catch (err) {
            showToast('Không thể cập nhật trạng thái lịch hẹn', 'error');
            console.error('Error updating contact status:', err);
        }
    };

    const handleMonthlyCount = async () => {
        try {
            const response = await getMonthlyContactCountAPI(selectedMonth, selectedYear);
            setMonthlyCount(response.data.count);
        } catch (error) {
            showToast('Không thể lấy thống kê tháng', 'error');
        }
    };

    const handleCombinedSearch = async () => {
        if (!searchDate && !searchTimeSlot) {
            fetchContacts();
            return;
        }
        try {
            let response: Contact[];
            if (searchDate && searchTimeSlot) {
                response = await getContactsByDateAPI(searchDate);
                response = response.filter((contact: Contact) => contact.timeSlot === searchTimeSlot);
            } else if (searchDate) {
                response = await getContactsByDateAPI(searchDate);
            } else {
                response = await getContactsByTimeSlotAPI(searchTimeSlot);
            }
            setContacts(response);
        } catch (error) {
            showToast('Không thể tìm kiếm lịch hẹn', 'error');
        }
    };

    const getStatusColor = (status: keyof typeof ContactStatus) => {
        switch (status) {
            case 'pending': return '#ff9800';
            case 'confirmed': return '#4caf50';
            case 'cancelled': return '#f44336';
            default: return '#000';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <PageContainer maxWidth="lg">
            <Title>Quản lý Lịch Hẹn</Title>
            <Paper sx={{
                p: 2,
                mb: 2,
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
                flexDirection: { xs: 'column', sm: 'row' },
                '& .MuiFormControl-root': {
                    minWidth: { xs: '100%', sm: 200 }
                }
            }}>
                <FormControl sx={{
                    minWidth: 200,
                    '& .MuiInputBase-root': {
                        height: '44px'
                    },
                    '& .MuiOutlinedInput-input': {
                        padding: '0 14px'
                    }
                }}>
                    <TextField
                        type="date"
                        label="Tìm theo ngày"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </FormControl>

                <FormControl sx={{
                    minWidth: 200,
                    '& .MuiInputBase-root': {
                        height: '44px'
                    },
                    '& .MuiInputLabel-root': {
                        transform: 'translate(18px, 10px) scale(1)'
                    },
                    '& .MuiInputLabel-shrink': {
                        transform: 'translate(14px, -9px) scale(0.75)'
                    }
                }}>
                    <InputLabel>Tìm theo giờ hẹn</InputLabel>
                    <Select
                        value={searchTimeSlot}
                        onChange={(e) => setSearchTimeSlot(e.target.value)}
                        label="Tìm theo giờ hẹn"
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        {TIME_SLOTS.map((slot) => (
                            <MenuItem key={slot} value={slot}>
                                {slot}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <div style={{
                    display: 'flex',
                    gap: '16px',
                    width: '100%',
                    justifyContent: 'flex-end',
                    flexWrap: 'wrap'
                }}>
                    <Button
                        onClick={handleCombinedSearch}
                        variant="contained"
                        sx={{
                            flex: '1',
                            minWidth: '120px',
                            height: '44px',
                            backgroundColor: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#1565c0',
                            },
                            fontSize: '15px',
                            fontWeight: 500,
                            textTransform: 'none',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        Tìm kiếm
                    </Button>
                    <Button
                        onClick={() => {
                            setSearchDate('');
                            setSearchTimeSlot('');
                            fetchContacts();
                        }}
                        variant="outlined"
                        sx={{
                            flex: '1',
                            minWidth: '120px',
                            height: '44px',
                            borderColor: '#1976d2',
                            color: '#1976d2',
                            '&:hover': {
                                borderColor: '#1565c0',
                                backgroundColor: 'rgba(25, 118, 210, 0.04)'
                            },
                            fontSize: '15px',
                            fontWeight: 500,
                            textTransform: 'none'
                        }}
                    >
                        Đặt lại
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setIsMonthlyModalOpen(true)}
                        sx={{
                            flex: '1',
                            minWidth: '120px',
                            height: '44px',
                            backgroundColor: '#2e7d32',
                            '&:hover': {
                                backgroundColor: '#1b5e20',
                            },
                            fontSize: '15px',
                            fontWeight: 500,
                            textTransform: 'none',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        Thống kê tháng
                    </Button>
                </div>
            </Paper>

            <StyledTableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Họ và tên</TableCell>
                            <TableCell>Số điện thoại</TableCell>
                            <TableCell>Ngày hẹn</TableCell>
                            <TableCell>Giờ hẹn</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                            <TableCell align="right">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contacts.map((contact) => (
                            <TableRow key={contact._id}>
                                <TableCell>{contact.fullName}</TableCell>
                                <TableCell>{contact.numberPhone}</TableCell>
                                <TableCell>{formatDate(contact.date)}</TableCell>
                                <TableCell>{contact.timeSlot}</TableCell>
                                <TableCell>
                                    <span style={{
                                        color: getStatusColor(contact.status),
                                        fontWeight: 'bold'
                                    }}>
                                        {ContactStatus[contact.status]}
                                    </span>
                                </TableCell>
                                <TableCell>{formatDate(contact.createdAt)}</TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        onClick={() => handleViewDetails(contact)}
                                        color="primary"
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => {
                                            setSelectedContact(contact);
                                            setNewStatus(contact.status);
                                            setIsStatusDialogOpen(true);
                                        }}
                                        color="primary"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDelete(contact._id)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </StyledTableContainer>

            <Dialog
                open={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                maxWidth="lg"
                fullWidth
            >
                <DialogContent style={{ padding: 0 }}>
                    <img
                        src={selectedImage || ''}
                        alt="Preview"
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '80vh',
                            objectFit: 'contain'
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedImage(null)}>Đóng</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isStatusDialogOpen} onClose={() => setIsStatusDialogOpen(false)}>
                <DialogTitle>Cập nhật trạng thái lịch hẹn</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as keyof typeof ContactStatus)}
                            label="Trạng thái"
                        >
                            {Object.entries(ContactStatus).map(([key, value]) => (
                                <MenuItem key={key} value={key}>
                                    {value}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsStatusDialogOpen(false)}>Hủy</Button>
                    <Button onClick={handleStatusChange} variant="contained" color="primary">
                        Cập nhật
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={isDetailDialogOpen}
                onClose={() => {
                    setIsDetailDialogOpen(false);
                    setIsEditing(false);
                }}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
                <DialogContent>
                    {selectedContact && editedContact && (
                        <>
                            <Typography variant="subtitle1" gutterBottom>
                                <strong>Họ và tên:</strong> {isEditing ? (
                                    <TextField
                                        value={editedContact.fullName}
                                        onChange={(e) => setEditedContact({
                                            ...editedContact,
                                            fullName: e.target.value
                                        })}
                                        fullWidth
                                        margin="dense"
                                        placeholder="Nhập họ và tên..."
                                    />
                                ) : selectedContact.fullName}
                            </Typography>

                            <Typography variant="subtitle1" gutterBottom>
                                <strong>Số điện thoại:</strong> {isEditing ? (
                                    <TextField
                                        value={editedContact.numberPhone}
                                        onChange={(e) => setEditedContact({
                                            ...editedContact,
                                            numberPhone: e.target.value
                                        })}
                                        fullWidth
                                        margin="dense"
                                        placeholder="Nhập số điện thoại..."
                                    />
                                ) : selectedContact.numberPhone}
                            </Typography>

                            <Typography variant="subtitle1" gutterBottom>
                                <strong>Ngày hẹn:</strong> {isEditing ? (
                                    <TextField
                                        type="date"
                                        value={editedContact.date.split('T')[0]}
                                        onChange={(e) => setEditedContact({
                                            ...editedContact,
                                            date: e.target.value
                                        })}
                                        fullWidth
                                        margin="dense"
                                    />
                                ) : formatDate(selectedContact.date)}
                            </Typography>

                            <Typography variant="subtitle1" gutterBottom>
                                <strong>Giờ hẹn:</strong> {isEditing ? (
                                    <FormControl fullWidth margin="dense">
                                        <Select
                                            value={editedContact.timeSlot}
                                            onChange={(e) => setEditedContact({
                                                ...editedContact,
                                                timeSlot: e.target.value
                                            })}
                                        >
                                            {TIME_SLOTS.map((slot) => (
                                                <MenuItem key={slot} value={slot}>
                                                    {slot}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                ) : selectedContact.timeSlot}
                            </Typography>

                            <Typography variant="subtitle1" gutterBottom>
                                <strong>Mô tả:</strong> {isEditing ? (
                                    <TextField
                                        value={editedContact.description}
                                        onChange={(e) => setEditedContact({
                                            ...editedContact,
                                            description: e.target.value
                                        })}
                                        fullWidth
                                        multiline
                                        rows={3}
                                        margin="dense"
                                        placeholder="Nhập mô tả cho lịch hẹn..."
                                    />
                                ) : selectedContact.description}
                            </Typography>

                            {/* Lý do cập nhật */}
                            {isEditing && (
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Lý do cập nhật:</strong>
                                    <TextField
                                        value={updateReason}
                                        onChange={(e) => setUpdateReason(e.target.value)}
                                        fullWidth
                                        multiline
                                        rows={2}
                                        margin="dense"
                                        placeholder="Nhập lý do cập nhật lịch hẹn..."
                                    />
                                </Typography>
                            )}

                            <Typography variant="subtitle1" gutterBottom sx={{
                                color: getStatusColor(selectedContact.status),
                                fontWeight: 'bold'
                            }}>
                                <strong>Trạng thái:</strong> {ContactStatus[selectedContact.status]}
                            </Typography>

                            {selectedContact.images && selectedContact.images.length > 0 && (
                                <>
                                    <Typography variant="subtitle1" gutterBottom>
                                        <strong>Hình ảnh:</strong> Nhấp vào hình ảnh để xem chi tiết
                                    </Typography>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        {selectedContact.images.map((image, index) => (
                                            <ImageThumbnail
                                                key={index}
                                                src={image}
                                                alt={`Contact image ${index + 1}`}
                                                onClick={() => setSelectedImage(image)}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </DialogContent>

                <DialogActions>
                    {isEditing ? (
                        <>
                            <Button onClick={() => setIsEditing(false)} color="error">
                                Hủy
                            </Button>
                            <Button onClick={handleSaveEdit} variant="contained" color="primary">
                                Lưu
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => setIsDetailDialogOpen(false)}>Đóng</Button>
                            <Button onClick={() => setIsEditing(true)} color="primary">
                                Chỉnh sửa
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    style: {
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: window.innerWidth <= 768 ? '16px' : '24px',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                        margin: window.innerWidth <= 768 ? '16px' : 'auto'
                    }
                }}
            >
                <DialogTitle style={{
                    fontSize: window.innerWidth <= 768 ? '18px' : '20px',
                    fontWeight: '600',
                    color: '#333',
                    padding: window.innerWidth <= 768 ? '0 0 12px 0' : '0 0 16px 0'
                }}>
                    Xác nhận xóa lịch hẹn
                </DialogTitle>
                <DialogContent style={{
                    padding: window.innerWidth <= 768 ? '8px 0 16px 0' : '8px 0 24px 0'
                }}>
                    <DialogContentText style={{
                        fontSize: window.innerWidth <= 768 ? '14px' : '16px',
                        color: '#555',
                        lineHeight: '1.5'
                    }}>
                        Bạn có chắc chắn muốn xóa lịch hẹn này? Hành động này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{
                    padding: '0',
                    justifyContent: 'flex-end',
                    gap: window.innerWidth <= 768 ? '8px' : '12px',
                    flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
                    width: window.innerWidth <= 768 ? '100%' : 'auto'
                }}>
                    <StyledButton
                        variant="outlined"
                        onClick={() => setDeleteConfirmOpen(false)}
                        fullWidth={window.innerWidth <= 768}
                    >
                        Hủy
                    </StyledButton>
                    <StyledButton
                        variant="contained"
                        color="error"
                        onClick={confirmDelete}
                        fullWidth={window.innerWidth <= 768}
                    >
                        Xóa
                    </StyledButton>
                </DialogActions>
            </Dialog>

            <Dialog
                open={isMonthlyModalOpen}
                onClose={() => setIsMonthlyModalOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Thống kê lịch hẹn theo tháng</DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                        <FormControl fullWidth>
                            <InputLabel>Tháng</InputLabel>
                            <Select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                label="Tháng"
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <MenuItem key={i + 1} value={i + 1}>
                                        Tháng {i + 1}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Năm</InputLabel>
                            <Select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                label="Năm"
                            >
                                {Array.from({ length: 5 }, (_, i) => {
                                    const year = new Date().getFullYear() - 3 + i;
                                    return (
                                        <MenuItem key={year} value={year}>
                                            {year}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </div>
                    {monthlyCount > 0 && (
                        <TableContainer component={Paper} sx={{ mt: 3 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Họ và tên</TableCell>
                                        <TableCell>Số điện thoại</TableCell>
                                        <TableCell>Ngày hẹn</TableCell>
                                        <TableCell>Giờ hẹn</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {contacts
                                        .filter(contact => {
                                            const contactDate = new Date(contact.date);
                                            return (
                                                contactDate.getMonth() + 1 === selectedMonth &&
                                                contactDate.getFullYear() === selectedYear
                                            );
                                        })
                                        .map((contact) => (
                                            <TableRow key={contact._id}>
                                                <TableCell>{contact.fullName}</TableCell>
                                                <TableCell>{contact.numberPhone}</TableCell>
                                                <TableCell>{formatDate(contact.date)}</TableCell>
                                                <TableCell>{contact.timeSlot}</TableCell>
                                                <TableCell>
                                                    <span style={{
                                                        color: getStatusColor(contact.status),
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {ContactStatus[contact.status]}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsMonthlyModalOpen(false)}>
                        Đóng
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleMonthlyCount}
                        color="primary"
                    >
                        Xem thống kê
                    </Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
};

export default IndexBooking;
