import React from 'react';
import PageContainer from '@/components/PageContainer';

interface PageProps {
  title: string;
}

const Page: React.FC<PageProps> = ({ title }) => {
  return <PageContainer title={title}>detail</PageContainer>;
};

export default Page;
