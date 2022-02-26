# FormTerritory

基于 antd/Form 的语法糖写法
具备原始 Form 的全部能力, 并且支持受控组件写法

## Props

| 名称     | 说明                                         | 类型                                                                | 默认值 |
| :------- | :------------------------------------------- | :------------------------------------------------------------------ | :----- |
| ref      | 表单实例 ,可通过 ref.onVerify() 手动触发校验 | { onVerify :(nameList?: NamePath[])=>Promise<> }                    | -      |
| value    | 整个表单的值                                 | object                                                              | {}     |
| onChange | 表单项内容变化的回调                         | function (data)                                                     | -      |
| protocol | 生成表单的协议                               | { fieldKey: string; // 需要匹配的表单项 key ...Form.Item 的配置 }[] | -      |

## Usage

```tsx
const [data,setData] = useState({
	field1:'',
  field2:'',
})

<FormTerritory value={data} onChange={setData} protocol={[{fieldKey:'field1'} ,{fieldKey:'field2'}  ]}>
  <Field1 key="field1"></Field1>
  <Field2 key="field2"></Field2>
<FormTerritory/>
```
