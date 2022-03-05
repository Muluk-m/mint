import React from 'react';
import { Alert } from 'antd';
import moment from 'moment';

const mock = [
  {
    type: 'warning',
    path: '/page-a/list',
    title: '测试公告',
    startTime: '2022-01-19 15:04',
    endTime: '2022-01-19 19:04',
    content:
      '[产品公告] 推送工具预计1月10日左右迁移至星芒平台，迁移后、除地址变更外，不会影响使用；如有问题，欢迎随时联系lirui53'
  }
];

interface NoticeOptions {
  type?: 'warning' | 'info' | 'error' | 'success';
  path: string;
  title: string;
  startTime: string;
  endTime: string;
  content: string;
}

/**
 * 公共栏,数据源绑定积木配置页
 */
const Notice: React.FC = () => {
  const [noticeInfo, setNoticeInfo] = React.useState<NoticeOptions | null>(null);
  const { type, content } = noticeInfo ?? { type: 'warning', path: '', content: '' };

  /**
   * 获取数据源
   */
  const getNoticeOriginData = () => {
    // 在此处接入数据源 参考mock数据结构
    const originData = (mock as NoticeOptions[]) ?? [];
    const configInfo = originData.find(({ path }) => path === window.location.pathname);
    if (!configInfo) return;

    const { startTime, endTime } = configInfo;
    if (moment().isBetween(startTime, endTime)) setNoticeInfo(configInfo);
  };

  React.useEffect(() => {
    getNoticeOriginData();
  }, []);

  return (
    <>
      {content && (
        <Alert
          message={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* <Icon type='volume2' style={{ fontSize: 18, color: '#F5BA31', marginRight: 10 }} /> */}
              <span>{content}</span>
            </div>
          }
          banner
          type={type}
        />
      )}
    </>
  );
};

export default Notice;
