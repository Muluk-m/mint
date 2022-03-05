# Notice

菜单公告栏
可绑定积木配置界面,可视化配置公告信息和生效时间等信息

## Options

| 配置项    | 类型   | 作用                                           |
| --------- | ------ | ---------------------------------------------- |
| type      | string | 公告等级 'warning', 'info', 'error', 'success' |
| name      | string | 页面路径                                       |
| title     | string | 公告的标题(不展示,用于标示)                    |
| startTime | string | 生效开始时间                                   |
| endTime   | string | 生效结束时间                                   |
| content   | string | 公告内容                                       |

## Usage

使用方式参考

```js
const mock = [
  {
    type: 'warning',
    path: '/page-a/list',
    title: '测试公告',
    startTime: '2022-01-19 15:04',
    endTime: '2022-01-19 19:04',
    content:
      '[产品公告] 推送工具预计1月10日左右迁移至星芒平台，迁移后、除地址变更外，不会影响使用；如有问题，欢迎随时联系lirui53'
  }
];
```
