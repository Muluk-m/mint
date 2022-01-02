# MTable 组件

基于 antd 的 table 组件及涉及业务值的再封装

## props

### columns

表头 header 内容，以及表格如何取值的元数据配置
类型：Array

元素属性
| 名称 | 含义 | 默认值 |
| :-------- | :------------ | :----- |
| title | 列-表头的中文名称 | ''|
| dataIndex | 列 对应的取值 key | ''|
| dataType | 列 值的数据类型 string：字符串，number：数值类型，bool：布尔类型，percent：百分比，ps：百分比类型返回的数值统一是小数点的形式。href: 链接 ele: { url: '', text: ''} render：自定义数据展示样式。如果 dataType 没返回，默认是 string 类型 | string |
| isSort | 该列是否有排序功能，true：排序，false：不排序，默认不排序 | false |
| help | 列名称的解释说明字段，默认空字符串 | ''|
| maxLength | 列内容最大字段长度,超出会展示 ellipsis 效果 length 单位 = 1em = 14px | null|

### dataSources

表格的数据
类型：Array

元素属性
对应 `columns` 中的 `dataIndex` 值的所有的 key-value 对象

### 测试数据展示

```json
{
  "columns": [
    {
      "title": "姓名", // 列-表头的中文名称
      "dataIndex": "name", // 列 对应的取值key
      "dataType": "string", // 列 值的数据类型 string：字符串，number：数值类型，bool：布尔类型，percent：百分比， href：链接 ps：百分比类型返回的数值统一是小数点的形式。如果dataType没返回，默认是string类型，给啥展示啥
      "isSort": false, // 该列是否有排序功能，true：排序，false：不排序，默认不排序
      "help": "这是用户的姓名" // 列名称的解释说明字段，默认空字符串
    },
    {
      "title": "链接",
      "dataIndex": "url",
      "dataType": "href",
      "isSort": false,
      "help": ""
    }
  ],
  "dataSources": [
    {
      "name": "胡彦斌", // 对应 column 里的姓名
      "age": 32, // 对应 column 里的年龄
      "address": "西湖区湖底公园1号", // 对应 column 里的地址
      "url": {
        "url": "www.baidu.com",
        "text": "百度",
        "target": "_blank" // 默认_self 当前窗口跳转 _blank为新窗口跳转
      }
    },
    {
      "name": "胡彦祖",
      "age": 42,
      "address": "西湖区湖底公园1号",
      "url": {
        "url": "www.baidu.com",
        "text": "百度"
      }
    }
  ]
}
```

### operation 类型 使用说明

数据源类型：object[]

属性
| 名称 | 含义 | 默认值 |
| :--- | :----------------------------------------------------| :----- |
| type | 组件类型 'link' (超链接组件) or 'request' (http 请求组件) | 'link' |
| text | 展示文字 | '' |
| url | 'link'类型为跳转链接,'request'类型为请求地址 | '' |
| target | 值:'\_blank'为新窗口打开链接,'\_self'为当前页面打开 | '\_self' |

示例

```json
{
  "columns": [
    {
      "title": "姓名",
      "dataIndex": "name"
    },
    {
      "title": "操作",
      "dataIndex": "operation",
      "dataType": "operation"
    }
  ],
  "dataSources": [
    {
      "name": "胡彦祖",
      "operation": [
        // 类型必须为Array[]
        {
          "type": "link", // 生成超链接
          "text": "查询详情",
          "url": "/xxx/detial",
          "target": "_blank"
        },
        {
          "type": "request", // 生成http请求按钮
          "text": "点赞",
          "url": "/xxx/like?id=52&type=link"
        }
      ]
    }
  ]
}
```
