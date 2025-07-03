import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Container,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import EditCategory from './editCategoryStaff';
import CreateCategory from './createCategoryStaff';

const PageContainer = styled(Container)`
  padding: 40px 0;
`;

const Title = styled.h1`
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
  margin-left: 20px;

  @media (max-width: 768px) {
    margin-bottom: 20px !important;
    font-size: 1.5rem !important;
  }
`;

const StyledTabs = styled(Tabs)`
  margin-bottom: 20px;
  .MuiTabs-indicator {
    background-color: #e31837;
  }
  
  @media (max-width: 768px) {
    .MuiTabs-flexContainer {
      display: flex;
      width: 100%;
    }
  }
`;

const StyledTab = styled(Tab)`
  &.Mui-selected {
    color: #e31837 !important;
  }
  
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px 12px;
    min-height: 40px;
    flex: 1;
    min-width: auto;
    white-space: nowrap;
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
      <StyledTabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        <StyledTab label={selectedCategory ? "Chỉnh sửa chức vụ" : "Thêm chức vụ"} />
        <StyledTab label="Danh sách chức vụ" />
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