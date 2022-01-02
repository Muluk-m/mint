# CellAction 组件

## API

| 参数        | 说明               | 类型             | 默认值        |
| :---------- | :----------------- | :--------------- | :------------ |
| name        | 名称               | string           | ''            |
| action      | diff 新数据源      | 点击事件执行函数 | '—'           |
| isHide      | 是否隐藏           | boolean          | false         |
| confirm     | 是否需要二次确定   | boolean          | false         |
| props       | 操作项组件的 porps | object           | {}            |
| confirmText | 二次确定提示文案   | string           | 确定${name}吗 |

## Usage

### Demo

```jsx
const actionGroup = [
  { name: '编辑', action: () => {}, isHide: false, confirm: true, props: {} },
  {
    name: '上线',
    action: () => {},
    isHide: ({ state }) => state === REPORT_STATE.Published,
    confirm: false,
    props: {}
  },
  {
    name: '下线',
    action: () => {},
    isHide: ({ state }) => state !== REPORT_STATE.Published,
    confirm: false,
    props: {}
  },
  {
    name: '删除',
    action: ({ reportId }) => {
      console.log(reportId);
    },
    isHide: false,
    confirm: true,
    props: {}
  },
  { name: '清除缓存', action: () => {}, isHide: false, confirm: true, props: {} },
  { name: '切换数据源', action: () => {}, isHide: false, confirm: true, props: {} }
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
