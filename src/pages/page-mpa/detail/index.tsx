import React from 'react';
import { render } from 'react-dom';
import PageContainer from '@/components/PageContainer';
import LayoutHoc from '@/components/LayoutHoc';

import '@/common/share';

const Page: React.FC = () => {
  return <PageContainer title='mpa-detail'>detail</PageContainer>;
};

render(React.createElement(LayoutHoc(Page), null, null), document.querySelector('#root'));
