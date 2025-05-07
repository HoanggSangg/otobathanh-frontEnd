import React, { useState } from 'react';
import { Tabs, Tab, Box, Container } from '@mui/material';
import CreateAccount from './createAccount';
import EditAccount from './editAccount';

interface Account {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  image: string;
  roles: {
    _id: string;
    name: string;
  }[];
  status: boolean;
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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function AccountManager() {
  const [value, setValue] = useState(1);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const switchToEditTab = () => {
    setValue(1);
    setEditingAccount(null);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setValue(0);
  };

  return (
    <Container>
      <Box sx={{ width: '100%' }}>
        <Box sx={{
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTabs-root': {
            minHeight: { xs: 'auto', sm: '48px' }
          },
          '& .MuiTab-root': {
            fontSize: { xs: '14px', sm: '16px' },
            minHeight: { xs: '40px', sm: '48px' },
            minWidth: { xs: 'auto', sm: '160px' },
            textTransform: 'none',
            flexShrink: 1,
            whiteSpace: 'nowrap'
          }
        }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="account management tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={editingAccount ? "Chỉnh sửa tài khoản" : "Thêm tài khoản"} {...a11yProps(0)} />
            <Tab label="Danh sách tài khoản" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <CreateAccount onSuccess={switchToEditTab} editingAccount={editingAccount} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <EditAccount onEdit={handleEditAccount} />
        </TabPanel>
      </Box>
    </Container>
  );
} 