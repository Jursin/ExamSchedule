# ExamSchedule

**不只是考试看板**

## 功能

- 当前时间
- 考试看板
  - 实时显示当前时间、当前考试科目、考试起止时间、剩余时间及考试状态
  - 支持全屏显示
  - 支持设置时间偏移和考场信息，并保存到浏览器 Cookie 中
  - 支持临时编辑消息，并保存到浏览器 Cookie 中（3天后到期）
- 考试广播
  - 支持自定义广播配置
  - 支持打开本地 json 配置

## 部署

- 使用 Python 启动本地服务器

```bash
python -m http.server 8000
```
> [!tip]
> 或尝试使用 Python3

- 使用 GitHub Pages 部署

> [!WARNING]
>
> 注意，广播与看板的配置文件是**分开存储于两个文件夹之下的**

## 开发进度

- 正在 [`main`](https://github.com/ExamAware/ExamSchedule/commits/master) 分支上提供稳定版本
- 正在 [`dev`](https://github.com/ExamAware/ExamSchedule/commits/dev) 分支上进行开发

## 贡献

欢迎提交[Issue](https://github.com/ExamAware/ExamSchedule/issues)和[Pull Request](https://github.com/ExamAware/ExamSchedule/pulls)来贡献代码
