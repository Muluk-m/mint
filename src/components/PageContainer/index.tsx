import React from 'react';
import { ConfigProvider, PageHeader, Breadcrumb, PageHeaderProps } from 'antd';
import zh from 'antd/lib/locale-provider/zh_CN';
import handleLink from '@/utils/formatLink';
import './index.scss';

interface BreadcrumbItem {
  name: string;
  href?: string;
}
interface PropsType extends Omit<PageHeaderProps, 'breadcrumb'> {
  title: string;
  breadcrumb?: Array<BreadcrumbItem>;
}

/**
 * 页面容器
 * 整合了 Breadcrumb、PageHeader和容器样式
 * props 同 antd的 PageHeader
 */
const PageWrap: React.FC<PropsType> = ({ children, title, breadcrumb, ...props }) => {
  return (
    <div className='page-wrap'>
      <ConfigProvider locale={zh}>
        <div className='page-wrap-header'>
          <Breadcrumb>
            {Array.isArray(breadcrumb) &&
              breadcrumb.map(({ name, href }) => (
                <Breadcrumb.Item key={name} href={handleLink(href!)}>
                  {name}
                </Breadcrumb.Item>
              ))}
          </Breadcrumb>

          <PageHeader {...props} title={title} />
        </div>
        <div className='page-wrap-container container'>{children}</div>
      </ConfigProvider>
    </div>
  );
};

PageWrap.defaultProps = {
  breadcrumb: []
};

export default PageWrap;
