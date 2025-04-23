import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import EditCategory from './editCategory';
import CreateCategory from './createCategory';

const PageContainer = styled(Container)`
  padding: 40px 0;
`;

const Title = styled(Typography)`
  margin-bottom: 40px !important;
  color: #e31837;
  font-weight: bold !important;
`;

const StyledTabs = styled(Tabs)`
  margin-bottom: 20px;
  .MuiTabs-indicator {
    background-color: #e31837;
  }
`;

const StyledTab = styled(Tab)`
  &.Mui-selected {
    color: #e31837 !important;
  }
`;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

interface Category {
  _id: string;
  name: string;
}

const IndexCategory = () => {
  const [tabValue, setTabValue] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setTabValue(0);
  };

  return (
    <PageContainer maxWidth="lg">
      <Title variant="h4">Quản lý Danh mục</Title>

      <StyledTabs value={tabValue} onChange={handleTabChange}>
        <StyledTab label={selectedCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"} />
        <StyledTab label="Danh sách danh mục" />
      </StyledTabs>

      <TabPanel value={tabValue} index={1}>
        <EditCategory onEdit={handleEditCategory} />
      </TabPanel>

      <TabPanel value={tabValue} index={0}>
        <CreateCategory 
          selectedCategory={selectedCategory}
          onSuccess={() => {
            setSelectedCategory(null);
            setTabValue(1);
          }}
        />
      </TabPanel>
    </PageContainer>
  );
};

export default IndexCategory;