import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
    Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, FormControl, Select, MenuItem, List,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../Styles/ToastProvider';
import { getAllContactsAPI } from '../../API';
import { SelectChangeEvent } from '@mui/material/Select';

const PageWrapper = styled.div`
    background-color: #fff;
    min-height: 100vh;
    padding-top: 80px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  `;

const MainContainer = styled.div`
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    gap: 24px;
    
    @media (max-width: 900px) {
      flex-direction: column;
    }
  `;

const StyledList = styled(List)`
    padding: 0 !important;
    margin: 0 !important;
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const StyledListItem = styled.div<{ selected?: boolean }>`
    color: #333;
    cursor: pointer;
    background-color: ${props => props.selected ? 'rgba(227, 24, 55, 0.1)' : 'transparent'};
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 8px;
    transition: all 0.3s ease;
    font-size: 15px;
    font-weight: ${props => props.selected ? '600' : '400'};
    border: 1px solid ${props => props.selected ? '#e31837' : 'transparent'};
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:hover {
        background-color: rgba(227, 24, 55, 0.05);
        border-color: #e31837;
    }

    &:active {
        transform: scale(0.98);
    }

    &:last-child {
        margin-bottom: 0;
    }
`;

// Update BookingSection styling
const BookingSection = styled.section`
  padding: 40px 0;
  flex: 1;
  min-width: 0; // Prevents flex item from overflowing
  display: flex;
  flex-direction: column;
  
  // Make TableContainer take remaining height
  .MuiTableContainer-root {
    flex: 1;
    height: calc(100vh - 280px); // Adjust based on header and padding
    overflow: auto;
  }
`;

const Sidebar = styled.div`
    flex: 0 0 280px;
    background-color: #fff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 16px;
    border-radius: 8px;
    color: white;
    position: sticky;
    top: 100px;
    height: fit-content;
  
    @media (max-width: 900px) {
      flex: none;
      position: static;
    }
  `;

const HeaderSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    background-color: #fff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 16px;
    border-radius: 8px;
  `;

interface Contact {
    _id: string;
    fullName: string;
    date: string;
    timeSlot: string;
    numberPhone: string;
    description: string;
    status: string;
    createdAt: string;
}

interface ListItemBookingProps {
    selected?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
}

const TIME_SLOTS = [
    '08:00', '09:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00'
];

const ListItemBooking: React.FC<ListItemBookingProps> = ({ selected, onClick, children }) => {
    return (
        <StyledListItem
            selected={selected}
            onClick={onClick}
        >
            {children}
        </StyledListItem>
    );
};

const Booking = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [sortOption, setSortOption] = useState('default');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('all');

    const navigate = useNavigate();
    const showToast = useToast();

    const handleSortChange = (event: SelectChangeEvent<string>) => {
        setSortOption(event.target.value);
    };

    const fetchContacts = async () => {
        try {
            const data = await getAllContactsAPI();
            setContacts(data);
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
            showToast('Không thể tải danh sách lịch hẹn', 'error');
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const getFilteredAndSortedContacts = () => {
        let filtered = [...contacts];

        // Apply time slot filter
        if (selectedTimeSlot !== 'all') {
            filtered = filtered.filter(contact => contact.timeSlot === selectedTimeSlot);
        }

        // Apply sorting
        switch (sortOption) {
            case 'dateAsc':
                filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                break;
            case 'dateDesc':
                filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                break;
            default:
                break;
        }

        return filtered;
    };

    return (
        <PageWrapper>
            <MainContainer>
                <Sidebar>
                    <Typography variant="h6" sx={{ color: '#ff0000', marginBottom: 2 }}>
                        Khung Giờ
                    </Typography>
                    <StyledList>
                        <ListItemBooking
                            selected={selectedTimeSlot === 'all'}
                            onClick={() => setSelectedTimeSlot('all')}
                        >
                            Tất cả
                        </ListItemBooking>
                        {TIME_SLOTS.map((slot) => (
                            <ListItemBooking
                                key={slot}
                                selected={selectedTimeSlot === slot}
                                onClick={() => setSelectedTimeSlot(slot)}
                            >
                                {slot}
                            </ListItemBooking>
                        ))}
                    </StyledList>
                </Sidebar>

                <BookingSection>
                    <HeaderSection>
                        <Typography variant="h4" sx={{
                            color: '#ff0000',
                            fontSize: { xs: '24px', md: '32px' }
                        }}>
                            Danh sách lịch hẹn
                        </Typography>
                        <FormControl sx={{ minWidth: { xs: 150, md: 200 } }}>
                            <Select
                                value={sortOption}
                                onChange={handleSortChange}
                                sx={{
                                    backgroundColor: '#fff',
                                    color: 'black',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#333'
                                    }
                                }}
                            >
                                <MenuItem value="default">Mặc định</MenuItem>
                                <MenuItem value="dateAsc">Ngày tăng dần</MenuItem>
                                <MenuItem value="dateDesc">Ngày giảm dần</MenuItem>
                            </Select>
                        </FormControl>
                    </HeaderSection>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Họ và tên</TableCell>
                                    <TableCell>Số điện thoại</TableCell>
                                    <TableCell>Ngày hẹn</TableCell>
                                    <TableCell>Giờ hẹn</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Mô tả</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {getFilteredAndSortedContacts().map((contact) => (
                                    <TableRow key={contact._id}>
                                        <TableCell>{contact.fullName}</TableCell>
                                        <TableCell>{contact.numberPhone}</TableCell>
                                        <TableCell>{new Date(contact.date).toLocaleDateString('vi-VN')}</TableCell>
                                        <TableCell>{contact.timeSlot}</TableCell>
                                        <TableCell>
                                            <span style={{
                                                color: contact.status === 'pending' ? '#ff9800' :
                                                    contact.status === 'confirmed' ? '#4caf50' : '#f44336'
                                            }}>
                                                {contact.status === 'pending' ? 'Chờ xử lý' :
                                                    contact.status === 'confirmed' ? 'Đã xác nhận' : 'Đã hủy'}
                                            </span>
                                        </TableCell>
                                        <TableCell>{contact.description}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </BookingSection>
            </MainContainer>
        </PageWrapper>
    );
};

export default Booking;
