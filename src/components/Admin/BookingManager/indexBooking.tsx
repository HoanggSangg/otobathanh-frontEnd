import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useToast } from '../../Styles/ToastProvider';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getAllContactsAPI, updateContactAPI, deleteContactAPI, getContactByIdAPI } from '../../API';

const PageContainer = styled(Container)`
  padding: 40px 0;
`;

const Title = styled(Typography)`
  margin-bottom: 40px !important;
  color: #e31837;
  font-weight: bold !important;
`;

type StyledTableContainerProps = {
    component?: React.ComponentType<any>;
};

const StyledTableContainer = styled(TableContainer)<StyledTableContainerProps>`
  margin-top: 20px;
  .MuiTableCell-head {
    font-weight: 600;
    background-color: #f5f5f5;
  }
`;

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

const ContactStatus = {
    pending: 'Chờ xử lý',
    confirmed: 'Đã xác nhận',
    cancelled: 'Đã hủy'
} as const;

const indexBooking = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState<keyof typeof ContactStatus>('pending');
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

    const handleStatusChange = async () => {
        if (!selectedContact) return;
        try {
            const response = await updateContactAPI(selectedContact._id, {
                ...selectedContact,
                status: newStatus
            });
            
            if (response) {
                showToast('Cập nhật trạng thái thành công', 'success');
                setIsStatusDialogOpen(false);
                fetchContacts();
            }
        } catch (err: any) {
            showToast('Không thể cập nhật trạng thái lịch hẹn', 'error');
            console.error('Error updating contact status:', err);
        }
    };

    const handleViewDetails = async (contact: Contact) => {
        try {
            const contactDetails = await getContactByIdAPI(contact._id);
            setSelectedContact(contactDetails);
            setIsDetailDialogOpen(true);
        } catch (error) {
            showToast('Không thể tải chi tiết lịch hẹn', 'error');
        }
    };

    const handleDelete = async (contactId: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa lịch hẹn này?')) return;
    
        try {
            const response = await deleteContactAPI(contactId);
            if (response) {
                setContacts(contacts.filter(contact => contact._id !== contactId));
                showToast('Xóa lịch hẹn thành công', 'success');
            }
        } catch (err: any) {
            showToast('Không thể xóa lịch hẹn', 'error');
            console.error('Error deleting contact:', err);
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
            <Title variant="h4">Quản lý Lịch Hẹn</Title>

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

            {/* Status Update Dialog */}
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

            {/* Contact Detail Dialog */}
            <Dialog
                open={isDetailDialogOpen}
                onClose={() => setIsDetailDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
                <DialogContent>
                    {selectedContact && (
                        <>
                            <Typography variant="subtitle1" gutterBottom>
                                Họ và tên: {selectedContact.fullName}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Số điện thoại: {selectedContact.numberPhone}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Ngày hẹn: {formatDate(selectedContact.date)}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Giờ hẹn: {selectedContact.timeSlot}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Mô tả: {selectedContact.description}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom sx={{
                                color: getStatusColor(selectedContact.status),
                                fontWeight: 'bold'
                            }}>
                                Trạng thái: {ContactStatus[selectedContact.status]}
                            </Typography>
                            {selectedContact.images && selectedContact.images.length > 0 && (
                                <>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Hình ảnh:
                                    </Typography>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        {selectedContact.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Contact image ${index + 1}`}
                                                style={{ maxWidth: '200px', maxHeight: '200px' }}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDetailDialogOpen(false)}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
};

export default indexBooking;