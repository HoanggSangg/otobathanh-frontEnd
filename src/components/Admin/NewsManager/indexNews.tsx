import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import EditNews from './editNews';
import CreateNews from './createNews';

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

const IndexNews = () => {
  const [tabValue, setTabValue] = useState(1);
  const [selectedNews, setSelectedNews] = useState(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditNews = (news: any) => {
    setSelectedNews(news);
    setTabValue(0);
  };

  return (
    <PageContainer maxWidth="lg">
      <StyledTabs value={tabValue} onChange={handleTabChange}>
        <StyledTab label={selectedNews ? "Chỉnh sửa tin tức" : "Thêm tin tức mới"} />
        <StyledTab label="Danh sách tin tức" />
      </StyledTabs>

      <TabPanel value={tabValue} index={1}>
        <EditNews onEdit={handleEditNews} />
      </TabPanel>

      <TabPanel value={tabValue} index={0}>
        <CreateNews 
          selectedNews={selectedNews}
          onSuccess={() => {
            setSelectedNews(null);
            setTabValue(1);
          }}
        />
      </TabPanel>
    </PageContainer>
  );
};

export default IndexNews;