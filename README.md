# SimpleIcveMoocHelper

## 一个简单基于油猴+jquery 开发实现的智慧职教MOOC,职教云自动化网课助手

- 支持自动评论

- 自动阅览 PPT 和视频

- 自动在讨论区抓取有效讨论内容,参与讨论

- 自动解除作业复制限制 (1.06 added)

- 提供窗口用于提取题库 (1.07 added)

- ~~暂不支持答题功能(无题库支撑)~~ 现已提供答题,有能力的朋友可自行对接

- 已支持绿版职教云,zjy2(ver 2.0 added)

- 增加自定义选项openMultiplyComment用于是否启用评论选项卡下多项评论功能(ver 2.08 added)

- 细分各评论开关选项(优先级低于自定义全项)(ver 2.09 added)

- 兼容内含文件夹的课件(ver 2.10 added)

- 兼容文件和图文课件(ver 2.101 added)

- 插件上架[油猴](https://greasyfork.org/zh-CN/scripts/396813-%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99%E8%81%8C%E6%95%99%E4%BA%91-%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B-%E7%BB%BF%E7%89%88),已支持一键安装,追踪更新
  
- 未兼容课件跳过(ver 2.11b0 added)

- 开放选项(未兼容课件评论,静音);兼容音频,与视频合并为媒体处理(ver 2.125 added)

- 支持青版智慧职教,使用IndexDB实现(ver 0.1added)

- 添加提前评论设置 (ver 2.13 added)

- 鸡肋搜题功能(ver 2.15 added)

- 提供考试支持(ver 2.15.4 added)

- 正式计划推出答题(ver 2.16 added)

- 废弃模拟点击,重构为 API 拦截,解决数个积病 BUG,及部分随新版本诞生的新特性(ver 3.0 added)

- 蓝版添加众望所归的是否开启自动评论 (ver 1.08 added)

- 提供课件下载功能(ver 3.1 added)

- ........

```js
接口对接规范(JSON) 请求方式 GET
    //快速通道(/q?q=问题)
    //更多信息(/q2?q=问题)
[{
     'question': '问题,可留空',
     'answer': '答案', //判断题 √为正确,其余为错误
     'options':'题目选项,可留空',
     'msg': '消息,可留空'
  },{
    'question': '问题,可留空',
     'answer': '答案', //判断题 √为正确,其余为错误
     'options':'题目选项,可留空',
     'msg': '消息,可留空'
     }
  ]
```

---

> 如果觉得有所帮助,请给我一个[star](https://github.com/W-ChihC/SimpleIcveMoocHelper),谢谢
> 
> 又或者在页面最下方扫码赏臭不要脸的一根辣条钱☕️,[捐赠者名单❤️](捐赠者名单.md)
>
>
> 如有问题欢迎issue

---

油猴插件简单说明: 在浏览器插件中心(扩展中心啥啥的)搜索关键字 **tampermonkey** 等待安装完成

~~本插件使用说明: 油猴安装完成后找到 **添加新脚本** 选项后,将本脚本全选复制进编辑框,按快捷键 Ctrl+S 即可食用~~

已支持[一键安装](https://greasyfork.org/zh-CN/scripts/396813-%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99%E8%81%8C%E6%95%99%E4%BA%91-%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B-%E7%BB%BF%E7%89%88)及同步更新

注意:本脚本需在点击具体小节后才会运行,运行前有数秒等待时间,运行流程可按 F12 查看

---

|            |                                                                                            |                                                                                                 |                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 网站版本   | MOOC [蓝版](https://mooc.icve.com.cn/profile.html)                                         | 职教云  [绿版](https://zjy2.icve.com.cn)                                                        | 智慧职教学习中心[青版](https://www.icve.com.cn/study/)                                     |
| 测试浏览器 | Chrome                                                                                     | Chrome                                                                                          | Chromium 80(低版本不兼容)                                                                  |
| 已知问题   | 暂无                                                                                       | 暂无                                                                                            | 暂无                                                                                       |
| 源文件     | [bule.src.js](https://github.com/W-ChihC/SimpleIcveMoocHelper/blob/master/src/blue.src.js) | [green.src.js](https://github.com/W-ChihC/SimpleIcveMoocHelper/blob/master/src/green.v3.src.js) | [cyan.src.js](https://github.com/W-ChihC/SimpleIcveMoocHelper/blob/master/src/cyan.src.js) |
| 版本       | 1.08                                                                                       | 3.3.9                                                                                           | 0.2(IndexDB)                                                                               |

~~大一菜鸡 学习 JS 练手所写, ES5,6 瞎混搭,勿喷~~

已经大二了

ver.1.0 完成时间 : 2019.5.25

ver.2.0 完成时间 : 2019.12.13

> 优化思路：改用阻塞队列处理任务，解决因应对定时器搭配异步处理不太稳定导致时间较长的问题

![支付宝](alipay.jpg?raw=true)![微信支付](wechat.png?raw=true)

---

> ### 特别感谢
>
> * 写作之初学习如何写油猴脚本时借鉴了[wyn665817](https://greasyfork.org/zh-CN/scripts/369625-%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B)的源码,学习到了宝贵的入门知识,并引用了等待Jquery加载的一段代码
> * [tonylu00](https://github.com/tonylu00)提供实测视频清晰度参数
> * @给我一碗炒饭 的签到抓包分析结果

### 免责声明

* 本脚本完全开源免费仅供个人学习研究和交流前端自动化使用，请于下载后二十四小时内删除,勿要滥用,用于商业用途等

* 捐助均为自发行为,未于作者构成任何雇佣或利益交换关系,未用于任何商业盈利活动

* 未经过非法途径或越权漏洞实现自动化,均为常规前端自动化技术

> 如作它用所承受的法律责任一概与作者无关,各种途径使用即代表你**同意**上述观点
