import React from 'react';
import { Button, Popconfirm, Dropdown, Menu, Modal } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export interface ConfigType<R = any> {
  name: string | ((record: R) => string);
  action?: (record: R) => void; // 回调函数
  isHide?: boolean | ((record: R) => boolean); // 是否隐藏
  confirm?: boolean; // 是否需要二次确定
  disabled?: boolean | ((record: R) => boolean); // 是否禁用
  props?: { [x in string]: any }; // 操作项组件的porps
  confirmText?: string | React.ReactNode; // 二次确定提示文案
}

interface CellActionType<R = any> {
  configs: ConfigType<R>[]; // 数据源
  maxSize?: number; // 最多展示的操作项,超出渲染到“更多”
  record?: R; // 行数据
}

type CellRender<R = unknown> = (
  actionGroup: ConfigType<R>[],
  record: R
) => JSX.Element[] | JSX.Element;

const BUTTON_STYLE = { padding: '4px 6px' };

const renderButtonGroup: CellRender = (actionGroup, record) =>
  actionGroup.map(({ name, action, props = {}, confirm = false, disabled, confirmText }) => {
    const isDisabled = typeof disabled === 'function' ? disabled(record) : disabled;
    const title = typeof name === 'function' ? name(record) : name;

    return confirm ? (
      <Popconfirm
        key={title}
        title={confirmText ?? `确定${title}吗?`}
        onConfirm={() => action?.(record)}
        disabled={isDisabled}
      >
        <Button {...props} style={BUTTON_STYLE} type='link' disabled={isDisabled}>
          {title}
        </Button>
      </Popconfirm>
    ) : (
      <Button
        {...props}
        key={title}
        style={BUTTON_STYLE}
        type='link'
        onClick={() => action?.(record)}
        disabled={isDisabled}
      >
        {title}
      </Button>
    );
  });

const renderMenuGroup: CellRender = (actionGroup, record) => (
  <Menu>
    {actionGroup.map(({ name, action, confirm = false, disabled, confirmText, props = {} }) => {
      const isDisabled = typeof disabled === 'function' ? disabled(record) : disabled;
      const title = typeof name === 'function' ? name(record) : name;

      return (
        <Menu.Item
          {...props}
          key={title}
          disabled={isDisabled}
          onClick={() => {
            if (!confirm) {
              action?.(record);
              return;
            }

            Modal.confirm({
              content: confirmText ?? `确定${title}吗`,
              onOk: () => action?.(record),
              okText: '确定',
              cancelText: '取消'
            });
          }}
        >
          {title}
        </Menu.Item>
      );
    })}
  </Menu>
);

/**
 * 配置化渲染表格操作列
 */
const CellAction: React.FC<CellActionType> = ({ configs, maxSize = 3, record }) => {
  const actionGroup = configs.filter(({ isHide }: ConfigType<typeof record>) =>
    typeof isHide === 'function' ? !isHide(record) : !isHide
  );

  return (
    <>
      {actionGroup.length > maxSize ? (
        <>
          {renderButtonGroup(actionGroup.slice(0, maxSize - 1), record)}
          <Dropdown
            overlay={renderMenuGroup(actionGroup.slice(maxSize - 1), record) as JSX.Element}
          >
            <Button type='link' style={BUTTON_STYLE} onClick={(e) => e.preventDefault()}>
              更多
              <DownOutlined />
            </Button>
          </Dropdown>
        </>
      ) : (
        renderButtonGroup(actionGroup, record)
      )}
    </>
  );
};

CellAction.defaultProps = {
  maxSize: 3,
  record: {}
};

export default CellAction;
