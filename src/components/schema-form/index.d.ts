import * as React from 'react';

interface SchemaFormProps {
  className?: string;
  schema: Record<string, any>;
  value: any;
  onChange: any;
  disabled?: boolean;
}

export declare const addWidget: (name: string, Component: any) => void;
export declare const SchemaForm: React.FC<SchemaFormProps>;
export default SchemaForm;
