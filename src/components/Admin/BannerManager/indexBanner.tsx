import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Container,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import EditBanner from './editBanner';
import CreateBanner from './createBanner';

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

const IndexBanner = () => {
  const [tabValue, setTabValue] = useState(1);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditBanner = (banner: any) => {
    setSelectedBanner(banner);
    setTabValue(0);
  };

  return (
    <PageContainer maxWidth="lg">
      <StyledTabs value={tabValue} onChange={handleTabChange}>
        <StyledTab label={selectedBanner ? "Chỉnh sửa banner" : "Thêm banner mới"} />
        <StyledTab label="Danh sách banner" />
      </StyledTabs>

      <TabPanel value={tabValue} index={1}>
        <EditBanner onEdit={handleEditBanner} />
      </TabPanel>

      <TabPanel value={tabValue} index={0}>
        <CreateBanner
          selectedBanner={selectedBanner}
          onSuccess={() => {
            setSelectedBanner(null);
            setTabValue(1);
          }}
        />
      </TabPanel>
    </PageContainer>
  );
};

export default IndexBanner;