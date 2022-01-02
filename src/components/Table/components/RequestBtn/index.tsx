import React from 'react';
import { Button, message } from 'antd';
import { debounce } from 'lodash';
import request from '@/utils/request';
import './index.scss';

interface RequestBtnProps {
  url: string;
  onOperationCallback: (res: any) => void;
}

const RequestBtn: React.FC<RequestBtnProps> = ({
  url,
  children,
  onOperationCallback,
  ...props
}) => {
  const sendRequest = debounce(async () => {
    try {
      const res = await request.get(url);
      if (!res) return message.error('操作失败');

      message.success('操作成功');
      onOperationCallback?.(res);
    } catch (error) {
      message.error('操作异常');
      console.error(error);
    }
    return null;
  }, 300);

  return (
    <Button type='link' className='request-btn' onClick={() => sendRequest()} {...props}>
      {children}
    </Button>
  );
};
export default RequestBtn;
