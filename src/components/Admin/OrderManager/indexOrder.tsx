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
import { getAllOrdersAPI, updateOrderStatusAPI, deleteOrderAPI } from '../../API';



const PageContainer = styled(Container)`
  padding: 40px 0;
`;

const Title = styled(Typography)`
  margin-bottom: 40px !important;
  color: #e31837;
  font-weight: bold !important;
`;

// Add this type definition at the top of the file, after imports
type StyledTableContainerProps = {
    component?: React.ComponentType<any>;
};

const StyledTableContainer = styled(TableContainer) <StyledTableContainerProps>`
  margin-top: 20px;
  .MuiTableCell-head {
    font-weight: 600;
    background-color: #f5f5f5;
  }
`;

interface OrderItem {
    product_id: {
        _id: string;
        name: string;
        price: number;
        image: string;
    };
    quantity: number;
    price: number;
}

// Update the Order interface status type
interface Order {
    _id: string;
    account_id: {
      _id: string;
      fullName: string;
      email: string;
      phone: string;
    };
    items: OrderItem[];  // Add this line
    phone: string;
    name: string;
    email: string;
    payment_method: string;
    note: string;
    total: number;
    status: keyof typeof OrderStatus;
    createdAt: string;
  }

// Fix the OrderStatus definition
const OrderStatus = {
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy'
} as const;


const IndexOrder = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState<keyof typeof OrderStatus>('pending');
    const showToast = useToast();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getAllOrdersAPI();
            setOrders(response);
        } catch (error) {
            showToast('Không thể tải danh sách đơn hàng', 'error');
        }
    };

    const handleStatusChange = async () => {
        if (!selectedOrder) return;

        try {
            await updateOrderStatusAPI(selectedOrder._id, { status: newStatus });
            setOrders(orders.map(order =>
                order._id === selectedOrder._id ? { ...order, status: newStatus } : order
            ));
            showToast('Cập nhật trạng thái thành công', 'success');
            setIsStatusDialogOpen(false);
        } catch (error) {
            showToast('Không thể cập nhật trạng thái', 'error');
        }
    };

    const handleDelete = async (orderId: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) return;

        try {
            await deleteOrderAPI(orderId);
            setOrders(orders.filter(order => order._id !== orderId));
            showToast('Xóa đơn hàng thành công', 'success');
        } catch (error) {
            showToast('Không thể xóa đơn hàng', 'error');
        }
    };

    const getStatusColor = (status: keyof typeof OrderStatus) => {
        switch (status) {
            case 'pending': return '#ff9800';
            case 'processing': return '#2196f3';
            case 'completed': return '#4caf50';
            case 'cancelled': return '#f44336';
            default: return '#000';
        }
    };

    return (
        <PageContainer maxWidth="lg">
            <Title variant="h4">Quản lý Đơn hàng</Title>

            <StyledTableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã đơn hàng</TableCell>
                            <TableCell>Khách hàng</TableCell>
                            <TableCell>Số điện thoại</TableCell>
                            <TableCell>Tổng tiền</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Ngày đặt</TableCell>
                            <TableCell align="right">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell>{order._id.slice(-6).toUpperCase()}</TableCell>
                                <TableCell>{order.name}</TableCell>
                                <TableCell>{order.phone}</TableCell>
                                <TableCell>
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(order.total)}
                                </TableCell>
                                <TableCell>
                                    <span style={{
                                        color: getStatusColor(order.status as keyof typeof OrderStatus),
                                        fontWeight: 'bold'
                                    }}>
                                        {OrderStatus[order.status as keyof typeof OrderStatus]}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setIsDetailDialogOpen(true);
                                        }}
                                        color="primary"
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setNewStatus(order.status);
                                            setIsStatusDialogOpen(true);
                                        }}
                                        color="primary"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDelete(order._id)}
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
                <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as keyof typeof OrderStatus)}
                            label="Trạng thái"
                        >
                            {Object.entries(OrderStatus).map(([key, value]) => (
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

            {/* Order Detail Dialog */}
            <Dialog
                open={isDetailDialogOpen}
                onClose={() => setIsDetailDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Chi tiết đơn hàng #{selectedOrder?._id.slice(-6).toUpperCase()}</DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <>
                            <Typography variant="subtitle1" gutterBottom>
                                Khách hàng: {selectedOrder.name}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Số điện thoại: {selectedOrder.phone}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Email: {selectedOrder.email}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Phương thức thanh toán: {selectedOrder.payment_method}
                            </Typography>
                            {selectedOrder.note && (
                                <Typography variant="subtitle1" gutterBottom>
                                    Ghi chú: {selectedOrder.note}
                                </Typography>
                            )}
                            <Typography variant="subtitle1" gutterBottom sx={{
                                color: getStatusColor(selectedOrder.status as keyof typeof OrderStatus),
                                fontWeight: 'bold'
                            }}>
                                Trạng thái: {OrderStatus[selectedOrder.status as keyof typeof OrderStatus]}
                            </Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Sản phẩm</TableCell>
                                        <TableCell>Đơn giá</TableCell>
                                        <TableCell>Số lượng</TableCell>
                                        <TableCell>Thành tiền</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedOrder.items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.product_id.name}</TableCell>
                                            <TableCell>
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(item.price)}
                                            </TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(item.price * item.quantity)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Typography variant="h6" align="right" sx={{ mt: 2 }}>
                                Tổng cộng: {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(selectedOrder.total)}
                            </Typography>
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

export default IndexOrder;