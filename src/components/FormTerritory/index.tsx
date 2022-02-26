import React, { useImperativeHandle } from 'react';
import { Form, FormItemProps, FormProps } from 'antd';
import { useDeepCompareEffect } from '@/hooks';

interface ProtocolItem extends FormItemProps {
  fieldKey: string; // 需要匹配的表单项key
}

interface FormTerritoryProps extends FormProps {
  ref?: any;
  value?: any;
  disabled?: boolean;
  onChange?: (data: any) => void;
  protocol: ProtocolItem[];
}

/**
 * 深层遍历匹配对应的表单项
 */
const handleNode = (
  node: any,
  protocol: ProtocolItem[],
  extraProps: Record<string, any>
): React.ReactNode => {
  const findItemProps = (key: React.Key) => protocol?.find(({ fieldKey }) => fieldKey === key);

  if (Array.isArray(node)) {
    const nodeQueue: any[] = [];
    for (const n of node) {
      nodeQueue.push(handleNode(n, protocol, extraProps));
    }
    return nodeQueue;
  }

  if (!React.isValidElement<any>(node) || protocol.length === 0) return node;

  if (protocol.some(({ fieldKey }) => node.key === fieldKey)) {
    const { fieldKey, style, ...props } = findItemProps(node.key!)!;
    // eslint-disable-next-line no-param-reassign
    protocol = protocol.filter(({ fieldKey }) => fieldKey !== node.key);
    return (
      <Form.Item
        name={fieldKey}
        getValueProps={(value) => ({ value, ...extraProps })}
        {...props}
        style={{
          // TODO 样式定制覆盖场景
          ...style
        }}
      >
        {node}
      </Form.Item>
    );
  }

  if (node.props.children) {
    return React.cloneElement(node, {}, handleNode(node.props.children, protocol, extraProps));
  }

  return node;
};

/**
 * 表单域
 * 通过protocol配置的字段key 自动填充Form.Item进行包裹,用法同 antd/Form
 */
// eslint-disable-next-line react/display-name
const FormTerritory: React.FC<FormTerritoryProps> = React.forwardRef(
  ({ children, protocol, value, disabled, onChange, ...props }, ref) => {
    const [form] = Form.useForm();

    /** 触发校验 */
    const onVerify = () => {
      return form.validateFields();
    };

    useDeepCompareEffect(() => {
      form.setFieldsValue(value);
    }, [value]);

    useImperativeHandle(ref, () => ({
      onVerify
    }));

    /** 渲染器 */
    const renderer = () => {
      return handleNode(children, protocol, { disabled });
    };

    return (
      <Form
        form={form}
        onValuesChange={(_, allValues) => {
          onChange?.({ ...value, ...allValues });
        }}
        {...props}
      >
        {renderer()}
      </Form>
    );
  }
);

export default FormTerritory;
