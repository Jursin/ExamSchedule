<div align="center">

<image src="./icon.png" height="64"/>

</div>

# ExamSchedule

## 页面
- 当前时间
  - 支持自定义字体、字号
- 考试看板
  - 显示当前时间、考试状态、考试列表
  - 支持设置时间偏移、考场号、缩放倍数
  - 支持深色/浅色模式
  - 支持将设置保存到浏览器 Cookie 中
  
## 部署

- 使用 Python 启动本地服务器

```bash
python -m http.server 8000
```
> [!note]
> 或尝试使用 Python3

> [!tip]
> 可以通过 bat 脚本快速启动服务器并用默认浏览器访问
> 
> ```bat
> @echo off
> start python -m http.server 8000
> timeout /t 1 >nul
> start "" "http://localhost:8000"
> ```

- 使用 GitHub Pages 部署

## 开发状态

- 在原 [`main`](https://github.com/ExamAware/ExamSchedule/commits/master) 分支上根据自身使用情况做了小更改

## 贡献

欢迎向源头仓库提出 [Issue](https://github.com/ExamAware/ExamSchedule/issues) 或提交 [Pull Request](https://github.com/ExamAware/ExamSchedule/pulls) 来贡献代码
