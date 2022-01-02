import React from 'react';
import { Checkbox } from 'antd';
import SchemaFrom, { addWidget } from './src';
import CodeEditor from './widgets/code-editor';

addWidget('CodeEditor', CodeEditor);
addWidget('Check', ({ value, onChange, disabled }) => (
  <Checkbox
    onChange={({ target: { checked } }) => {
      onChange?.(checked);
    }}
    checked={value}
    disabled={disabled}
  />
));
export { addWidget };
export default SchemaFrom;
