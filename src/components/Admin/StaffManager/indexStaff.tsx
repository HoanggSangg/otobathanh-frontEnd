import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Container, Paper } from '@mui/material';
import CreateStaff from './createStaff';
import EditStaff from './editStaff';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

interface Staff {
    _id: string;
    name: string;
    phone: string;
    position: string;
    image: string;
    catestaff_id: {
        _id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`staff-tabpanel-${index}`}
      aria-labelledby={`staff-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `staff-tab-${index}`,
    'aria-controls': `staff-tabpanel-${index}`,
  };
}

export default function StaffManager() {
  const [value, setValue] = useState(1);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (newValue === 1) {
      setEditingStaff(null);
    }
  };

  const handleEditSuccess = () => {
    setValue(1);
    setEditingStaff(null);
  };

  const handleEditStaff = (staff: Staff) => {
    setEditingStaff(staff);
    setValue(0);
  };

  return (
    <StyledContainer>
      <StyledPaper>
        <Box sx={{ width: '100%' }}>
          <Box sx={{
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            '& .MuiTabs-root': {
              minHeight: { xs: 'auto', sm: '48px' }
            },
            '& .MuiTab-root': {
              fontSize: { xs: '14px', sm: '16px' },
              minHeight: { xs: '40px', sm: '48px' },
              padding: { xs: '8px 12px', sm: '12px 16px' },
              minWidth: { xs: 'auto', sm: '160px' },
              textTransform: 'none',
              fontWeight: 500,
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
                fontWeight: 600
              }
            }
          }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="Quản lý nhân viên"
              variant="scrollable"
              scrollButtons="auto"
              sx={{ px: { xs: 1, sm: 2 } }}
            >
              <Tab 
                label={editingStaff ? "Chỉnh sửa nhân viên" : "Thêm nhân viên"} 
                {...a11yProps(0)} 
              />
              <Tab 
                label="Danh sách nhân viên" 
                {...a11yProps(1)} 
              />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <CreateStaff 
              onSuccess={handleEditSuccess} 
              editingStaff={editingStaff} 
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <EditStaff 
              onEdit={handleEditStaff}
            />
          </TabPanel>
        </Box>
      </StyledPaper>
    </StyledContainer>
  );
}