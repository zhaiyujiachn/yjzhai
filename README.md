# 学术个人主页

这是一个为高校教师设计的学术个人主页模板，用于展示学术成果、研究方向、教学工作等内容。

## 功能特点

- 响应式设计，适配各种设备屏幕
- 清晰的内容结构，包括个人简介、研究方向、发表论文、科研项目、教学工作、指导学生、获奖情况等
- 论文筛选功能，可按类型查看不同类别的论文
- 平滑滚动和导航高亮效果，提升用户体验
- 简洁美观的界面设计

## 文件结构

```
├── index.html          # 主页HTML文件
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── script.js       # JavaScript交互脚本
└── images/
    └── profile.svg     # 个人照片占位图
```

## 自定义指南

### 基本信息修改

1. 打开 `index.html` 文件
2. 修改以下部分：
   - 标题：`<title>学术个人主页</title>`
   - 个人信息：姓名、职称、所属院系、大学名称等
   - 联系方式：电子邮件、办公电话、办公室地址等
   - 页脚版权信息：`&copy; 2023 教授姓名. 保留所有权利。`

### 内容修改

1. **个人简介**：替换 `#about` 部分的内容
2. **研究方向**：在 `#research` 部分添加或修改研究方向
3. **发表论文**：在 `#publications` 部分添加您的论文，按照模板格式添加期刊论文、会议论文和专著
4. **科研项目**：在 `#projects` 部分添加您主持或参与的科研项目
5. **教学工作**：在 `#teaching` 部分添加您教授的课程
6. **指导学生**：在 `#students` 部分添加您指导的研究生信息
7. **获奖情况**：在 `#awards` 部分添加您获得的奖项

### 更换个人照片

1. 准备一张合适的个人照片
2. 将照片文件命名为 `profile.jpg` 或修改 `index.html` 中的图片路径
3. 替换 `images` 文件夹中的占位图像

### 样式定制

如果您想修改网站的颜色、字体等样式：

1. 打开 `css/style.css` 文件
2. 修改相应的CSS属性，如颜色代码、字体大小等

## 部署指南

### GitHub Pages 部署

1. 在GitHub上创建一个名为 `username.github.io` 的仓库（将 `username` 替换为您的GitHub用户名）
2. 将所有文件上传到该仓库
3. 启用GitHub Pages功能（在仓库设置中）
4. 访问 `https://username.github.io` 查看您的网站

### 使用自定义域名

1. 购买域名并设置DNS记录，添加一个CNAME记录指向 `username.github.io`
2. 在GitHub仓库中创建一个名为 `CNAME` 的文件，内容为您的域名
3. 在仓库设置中配置自定义域名

## 浏览器兼容性

- Chrome（推荐）
- Firefox
- Safari
- Edge

## 许可证

本模板采用 MIT 许可证。您可以自由使用、修改和分发，但需保留原作者署名。

## 联系方式

如有问题或建议，请通过以下方式联系：

- 电子邮件：your.email@example.com

---

祝您使用愉快！