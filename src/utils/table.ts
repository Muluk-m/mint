import React from 'react';
import { Tooltip, Typography, message } from 'antd';
import moment from 'moment';
import { isFunction, isEmptyValue, isObject, getTextWidth } from '.';

/** 支持配置的数据类型 */
type ValueType = 'text' | 'date' | 'dateTime' | 'money';
type RecordType = Record<string, any>;
/** 链接打开方式 */
type Target = '_blank' | '_self' | string;
type HrefExtraConf = { url: string | ((record: RecordType) => string); target?: Target };
/** href配置 */
type HrefConf = string | ((record: RecordType) => string) | HrefExtraConf;

const toFixed = (value: number, precision: number) => Number(value).toFixed(precision);

/** 根据不同的ValueType渲染内容 */
const handleValueType = (value: any, type: ValueType = 'text') => {
  let result = value;
  const isFormatted = typeof value === 'string' && value.length === 14;

  switch (type) {
    case 'date':
      if (moment(value).isValid()) {
        result = moment(value).format('YYYY-MM-DD');
      } else if (isFormatted) {
        result = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
      }
      break;
    case 'dateTime':
      if (moment(value).isValid()) {
        result = moment(value).format('YYYY-MM-DD HH:mm:ss');
      } else if (isFormatted) {
        result = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)} ${value.slice(
          8,
          10
        )}:${value.slice(10, 12)}:${value.slice(12, 14)}`;
      }
      break;
    case 'money':
      result = `¥${toFixed(value, 2)}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      break;
    case 'text':
    default:
      result = value;
      break;
  }

  return result;
};

/** 根据href配置获取链接地址 */
const getLinkAddr = (link: HrefConf, record: Record<string, any>) => {
  if (isFunction(link)) {
    return link(record);
  }

  if (isObject(link)) {
    if (isFunction(link.url)) {
      return link.url(record);
    }

    if (typeof link.url === 'string') {
      return link.url;
    }
  }

  return '';
};

/** 渲染超链接 */
const renderLink = (text: string, href: string, target?: Target) =>
  React.createElement('a', { target: target ?? '_blank', href }, text);

/** 渲染可复制内容 */
const renderCopyable = (text: string, ellipsis: boolean) => {
  const Text = React.createElement(
    Typography.Text,
    {
      style: {
        maxWidth: '100%',
        margin: 0,
        padding: 0
      },
      copyable: {
        text,
        onCopy: () => message.success('复制成功')
      },
      ellipsis
    },
    text
  );

  return ellipsis
    ? React.createElement(
        Tooltip,
        {
          title: text
        },
        Text
      )
    : Text;
};

/** 列最终的渲染内容 */
const renderColumn = (
  children: React.ReactNode,
  width: number,
  isEllipsis: boolean,
  isLink: boolean
) =>
  React.createElement(
    'div',
    {
      style: isEllipsis
        ? {
            width: width ? width - 20 : 'auto',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: isLink ? '#1890ff' : 'currentcolor'
          }
        : {}
    },
    children
  );

/**
 * 增强表格列配置
 * 1.支持ellipsis配置，配置link时，单元格内容超出column.width自动生成tooltip，不配置column.width不生效
 * 2.支持link配置，配置link时，自动生成<a/>标签
 * 3.支持copyable配置，配置copyable时，文本内容可复制
 * 4.支持enums配置，配置enums时，文本内容转换为对应的枚举值
 * 5.支持valueType配置，配置valueType时，基于valueType自动转换内容
 *
 * Usage：
 *  常规使用：
 *  const enhanceColumns = createEnhanceColumn(columns)
 *
 *  带有link配置的列：
 *  a、const columns = [{...other, link: 'http://www.baidu.com'}]
 *  b、const columns = [{...other, link: ({ href })=> href }]
 *  c、const columns = [{...other, link: { url: 'http://www.baidu.com', target: '_blank' } }]
 *  d、const columns = [{...other, link: { url: ({ href })=> href, target: '_blank' } }]
 *
 *  带有copyable配置的列：
 *  const columns = [{...other, copyable: true}]
 *
 *  带有ellipsis配置的列：（默认开启）
 *  const columns = [{...other, ellipsis: false}]
 *
 *  带有enums配置的列：
 *  const columns = [{...other, enums: { man: '男', woman: '女' }}]
 *
 *  带有valueType配置的列：
 *  text：普通的文本类型（默认值）
 *  date：当数据是日期类型的返回时，会自动将格式转换为 YYYY-MM-DD
 *  dateTime：当数据是日期类型的返回时，会自动将格式转换为 YYYY-MM-DD HH:mm:ss
 *  money：当数据是金额时，会自动将格式转换为 ¥0,0.00
 */
export const createEnhanceColumn = (columns: Record<string, any>[]) => {
  return columns.map(({ render, valueType, link, ellipsis = true, copyable, enums, ...rest }) => ({
    ...rest,
    render: (text: string, record: Record<string, any>, index: number) => {
      let content = text;

      // 如果render存在，先拿到render后的内容
      if (isFunction(render)) {
        content = render(text, record, index);
      }

      // 如果render后的内容不是文本内容，则直接返回
      if (typeof content !== 'string' && typeof content !== 'number') {
        return content;
      }

      // 枚举值转换
      if (enums) {
        content = enums[content] ?? content;
      }

      if (valueType) {
        content = handleValueType(content, valueType);
      }

      // 空值，统一渲染为 '-'
      if (isEmptyValue(content)) {
        content = '-';
      }

      const linkAddr = getLinkAddr(link, record);
      const isCopyable = copyable && content !== '-';
      const isLink = link && content !== '-' && linkAddr;
      const isEllipsis =
        rest.width && ellipsis && getTextWidth(content) > rest.width - (isCopyable ? 40 : 20);

      const renderContent = (content: string) => {
        if (isLink) {
          return renderLink(content, linkAddr, link?.target);
        }
        return content;
      };

      const children = isEllipsis
        ? React.createElement(
            Tooltip,
            {
              title: content
            },
            renderContent(content)
          )
        : renderContent(content);

      return isCopyable
        ? renderCopyable(content, isEllipsis)
        : renderColumn(children, rest.width, isEllipsis, isLink);
    }
  }));
};
