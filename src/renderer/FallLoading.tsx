import React from 'react';
import { Spin } from 'antd';

const FallLoading: React.FC = () => {
  // TODO fall模型的layout 通过本地缓存拿菜单树

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

export default FallLoading;
