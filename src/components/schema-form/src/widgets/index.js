import {
  Select as AntdSelect,
  Switch as AntdSwitch,
  InputNumber,
  DatePicker as AntdDatePicker
} from 'antd';
import _handleDefault from './handleDefault';
import React from 'react';
import PropTypes from 'prop-types';
import Input from './input';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';

const defaultDateProps = {
  format: 'YYYY-MM-DD',
  disabled: false,
  locale
};

export const handleDefault = _handleDefault;

const DatePicker = (props) => {
  const newProps = {
    ...defaultDateProps,
    ...props
  };
  const { format } = newProps;
  const fn = (momentObj) => {
    props.onChange(momentObj ? momentObj.format(format) : null);
  };
  const value = props.value ? moment(props.value) : undefined;
  return <AntdDatePicker {...newProps} value={value} onChange={fn} />;
};

const DateRangePicker = (props) => {
  const newProps = {
    ...defaultDateProps,
    ...props
  };
  const { format, value, showTime } = newProps;
  const [startDate, endDate] = value ?? [];

  const onChange = ([startDate, endDate]) => {
    props.onChange(
      startDate && endDate ? [+startDate.format('x'), +endDate.format('x')] : [undefined, undefined]
    );
  };

  const _value =
    startDate && endDate
      ? [
          moment.isMoment(startDate) ? startDate : moment(startDate),
          moment.isMoment(endDate) ? endDate : moment(endDate)
        ]
      : undefined;
  return (
    <AntdDatePicker.RangePicker
      {...newProps}
      format={showTime ? 'YYYY-MM-DD HH:mm:ss' : format}
      value={_value}
      onChange={onChange}
    />
  );
};

DatePicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
};

DateRangePicker.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func
};

const Select = (props) => {
  const { data = [] } = props;
  return (
    <AntdSelect {...props} dropdownMatchSelectWidth={false}>
      {data.map((item) => {
        return (
          <AntdSelect.Option key={item.value} value={item.value}>
            {item.label}
          </AntdSelect.Option>
        );
      })}
    </AntdSelect>
  );
};

const Switch = (props) => {
  const { changeParentData, ...extraProps } = props; //eslint-disable-line
  return <AntdSwitch {...extraProps} checked={props.value} />;
};

const maps = {
  Input,
  InputNumber,
  Select,
  Switch,
  TextArea: Input.TextArea,
  DatePicker,
  DateRangePicker
};

Switch.propTypes = {
  value: PropTypes.bool
};

Select.propTypes = {
  data: PropTypes.array
};

const result = Object.keys(maps).reduce((result, key) => {
  result[key] = _handleDefault()(maps[key]);
  return result;
}, {});

export default result;
