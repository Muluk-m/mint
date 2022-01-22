import React, { Component } from 'react';

import { InfoCircleOutlined } from '@ant-design/icons';
import { Table, Space, Tooltip, TableColumnType, TableProps, Tag } from 'antd';
import moment from 'moment';
import Link from 'antd/es/button';
import CalculateCanvas from '@/utils/calculateCanvas';
import RequestBtn from './components/RequestBtn';
import { handleMergeQS, getValueType } from './utils';

type DataType =
  | 'string'
  | 'number'
  | 'href'
  | 'operation'
  | 'percent'
  | 'bool'
  | 'render'
  | 'date'
  | 'tag'
  | string
  | undefined;

interface MTableColumnsType<T = any> extends TableColumnType<T> {
  dataType?: DataType;
  isSort?: boolean;
  help?: string;
  dataIndex?: any;
  maxLength?: null | string | number | { fontSize: number; length: number | string };
}

interface MtablePropsType<RecordType = any> extends TableProps<RecordType> {
  columns: MTableColumnsType[];
  dataSource?: RecordType[];
  paramsTransfer?: boolean; // href类型的link路径参数开启透传
  onOperationCallback?: (params: any) => any; // RequestBtn 的回调函数
}

/**
 * Mtable 组件
 */
export default class MTable extends Component<MtablePropsType> {
  constructor(props: MtablePropsType) {
    super(props);
    this.state = {};
  }

  formatColumns(columns: Array<MTableColumnsType>) {
    const template: MTableColumnsType = {
      title: '',
      dataIndex: '',
      dataType: 'string',
      isSort: false,
      help: '',
      maxLength: null
    };

    return columns?.map?.((column: MTableColumnsType) => {
      const config = {
        ...template,
        ...column,
        render: (value: any, record: any, index: number) => {
          if (column?.render) {
            return column?.render?.(value, record, index);
          }

          // 当前行的值，当前行数据，行索引
          return <>{this.renderCell(value, record, config.dataType)}</>;
        }
      };

      const { maxLength, isSort, dataIndex, help, title } = config;

      // 排序功能
      if (isSort) {
        config.sorter = (a, b) => {
          if (a[dataIndex] === b[dataIndex]) return 0;
          return a[dataIndex] > b[dataIndex] ? 1 : -1;
        };
      }

      // 表头提示信息
      if (help) {
        config.title = () => (
          <>
            {title}&nbsp;
            <Tooltip title={help}>
              <InfoCircleOutlined />
            </Tooltip>
          </>
        );
      }

      // 文本内容最大长度,超出展示ellipsis
      if (maxLength) {
        let fontSize = 14;
        let length: number | string = 10;
        // 以默认1em = 14px为基准  1length = 1em = 14px
        switch (getValueType(maxLength)) {
          case 'Object':
            ({ fontSize = 14, length = 10 } = maxLength as {
              fontSize: number;
              length: string | number;
            });
            break;
          default:
          case 'String':
          case 'Number':
            length = maxLength as number;
            break;
        }

        const withSize = +length * fontSize;
        config.ellipsis = { showTitle: false };
        config.width = withSize;
        config.render = (value) =>
          new CalculateCanvas(value, {
            fontSize: `${fontSize}px`,
            font: 'BlinkMacSystemFont' /** Mac-antd默认字体 */
          }).getFontWidth() > withSize ? (
            <Tooltip placement='topLeft' title={value}>
              <div
                style={{ width: `${maxLength}em`, textOverflow: 'ellipsis', overflow: 'hidden' }}
              >
                {value ?? '-'}
              </div>
            </Tooltip>
          ) : (
            value ?? '-'
          );
      }

      return config;
    });
  }

  /**
   * 转化表格内容
   * @param value 表格内容
   * @param record 行数据
   * @param type 类型
   * @returns ReactNode
   */
  renderCell(value: any, record: { [p: string]: any }, type: DataType): React.ReactNode {
    const { paramsTransfer, onOperationCallback } = this.props;
    switch (type) {
      case 'bool':
        return Boolean(value) === true ? '是' : '否';
      case 'percent':
        return `${Number(Number(value) * 100).toFixed(2)}%`;
      case 'date':
        return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '-';
      case 'tag':
        return Array.isArray(value) ? value.map((i) => <Tag key={i}>{i}</Tag>) : '-';
      case 'href':
        if (typeof value?.url === 'string') {
          return (
            <Link
              href={paramsTransfer ? handleMergeQS(value?.url) : value?.url}
              target={value?.target ?? '_self'}
            >
              {value?.text ?? ''}
            </Link>
          );
        }
        if (typeof value?.url === 'function') {
          return value.url(record);
        }
        if (typeof value === 'string') {
          return value;
        }
        if (Array.isArray(value)) {
          return (
            <Space size='middle'>
              {value.map(({ url, text, target = '_self' }) => (
                <Link href={paramsTransfer ? handleMergeQS(url) : url} key={text} target={target}>
                  {text ?? ''}
                </Link>
              ))}
            </Space>
          );
        }
        break;
      case 'operation':
        if (Array.isArray(value)) {
          return (
            <Space size='middle'>
              {value.map(({ url = '', text = '', type = 'link', target = '_self' }) => {
                switch (type) {
                  case 'request':
                    return (
                      <RequestBtn onOperationCallback={onOperationCallback as any} url={url}>
                        {text}
                      </RequestBtn>
                    );
                  case 'link':
                  default:
                    return (
                      <Link href={url} target={target}>
                        {text}
                      </Link>
                    );
                }
              })}
            </Space>
          );
        }
        break;
      case 'string':
      case 'number':
      default:
        return typeof value === 'string' || typeof value === 'number' ? value : '-';
    }
    return '-';
  }

  render() {
    const { columns = [], ...extraProps } = this.props;
    return <Table {...extraProps} columns={this.formatColumns(columns)} />;
  }
}
