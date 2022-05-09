# CellAction 组件

## Props

| 参数    | 说明                              | 类型 默认值  |
| :------ | :-------------------------------- | :----------- | :-- |
| configs | 操作控件配置                      | _ConfigType_ | []  |
| maxSize | 最多展示的操作项,超出渲染到“更多” | _number_     | 3   |
| record  | 行数据                            | _object_     | {}  |

### _ConfigType_ 数据结构

| 参数        | 说明               | 类型       | 默认值        |
| :---------- | :----------------- | :--------- | :------------ |
| name        | 名称               | _string_   | ''            |
| action      | 点击事件回调函数   | _function_ | '—'           |
| hidden      | 是否隐藏           | _boolean_  | false         |
| confirm     | 是否需要二次确定   | _boolean_  | false         |
| props       | 操作项组件的 props | _object_   | {}            |
| confirmText | 二次确定提示文案   | _string_   | 确定${name}吗 |

## Usage

### Demo

```jsx
const actionGroup = [
  { name: '编辑', action: () => {}, hidden: false, confirm: true, props: {} },
  {
    name: '上线',
    action: () => {},
    hidden: ({ state }) => state === REPORT_STATE.Published,
    confirm: false,
    props: {}
  },
  {
    name: '下线',
    action: () => {},
    hidden: ({ state }) => state !== REPORT_STATE.Published,
    confirm: false,
    props: {}
  },
  {
    name: '删除',
    action: ({ reportId }) => {
      console.log(reportId);
    },
    hidden: false,
    confirm: true,
    props: {}
  },
  { name: '清除缓存', action: () => {}, hidden: false, confirm: true, props: {} },
  { name: '切换数据源', action: () => {}, hidden: false, confirm: true, props: {} }
];

const handleTableAction = (columns) => [
  ...columns,
  {
    title: '操作',
    dataType: 'render',
    width: 210,
    render: (record) => <CellAction record={record} data={actionGroup} maxSize={3} />
  }
];
```
