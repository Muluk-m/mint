import React from 'react';
import { Spin } from 'antd';
import LayoutHoc from '@/components/LayoutHoc';

const FallLoading: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 300
      }}
    >
      <Spin />
    </div>
  );
};

export default LayoutHoc(FallLoading);
