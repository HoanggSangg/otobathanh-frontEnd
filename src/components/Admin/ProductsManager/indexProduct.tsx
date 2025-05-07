import React, { useState } from 'react';
import { Tabs, Tab, Box, Container } from '@mui/material';
import CreateProduct from './createProduct';
import EditProduct from './editProduct';

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  category_id: {
    _id: string;
    name: string;
  };
  description: string;
  image: string;
  subImages: string[];
  date: string;
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

export default function ProductManager() {
  const [value, setValue] = useState(1);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const switchToEditTab = () => {
    setValue(1);
    setEditingProduct(null); // Reset editing product when switching to list
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setValue(0); // Chuyển về tab create
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
          <Tabs value={value} onChange={handleChange} aria-label="product management tabs">
            <Tab label={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"} {...a11yProps(0)} />
            <Tab label="Danh sách sản phẩm" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <CreateProduct onSuccess={switchToEditTab} editingProduct={editingProduct} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <EditProduct onEdit={handleEditProduct} />
        </TabPanel>
      </Box>
    </Container>
  );
}
