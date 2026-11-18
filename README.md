---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 3b8ddf290b7a1c33bf8fdf1e3c983246_66e492a1e31c11f189bc525400248c00
    ReservedCode1: CSVt5SqlaEFZsYvPUULaOwOyoAWPTzfAJhZJdAfhMs4RFRN16T1DkHB90ooBd4fbAp4vAzN9f3vj8sUGCzaoF/uO4XO2DTu3u3DSieuN/FSqizm0o0G909NJGUaIrMaenmV1j+ksZgcXJ9iMgE/CbSRpUsxcU06Y/2iepLXFGznQwwovUobrFZI4CTQ=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 3b8ddf290b7a1c33bf8fdf1e3c983246_66e492a1e31c11f189bc525400248c00
    ReservedCode2: CSVt5SqlaEFZsYvPUULaOwOyoAWPTzfAJhZJdAfhMs4RFRN16T1DkHB90ooBd4fbAp4vAzN9f3vj8sUGCzaoF/uO4XO2DTu3u3DSieuN/FSqizm0o0G909NJGUaIrMaenmV1j+ksZgcXJ9iMgE/CbSRpUsxcU06Y/2iepLXFGznQwwovUobrFZI4CTQ=
---

# Sprout Launcher 官网

纯静态官网，零构建、零外部依赖（无 CDN、无 npm），双击 `index.html` 即可预览，也可以直接托管到 GitHub Pages。

## 目录结构

```
sprout-site/
├─ index.html            首页
├─ 404.html              GitHub Pages 404 页
├─ assets/
│  ├─ css/style.css      全部样式与动画
│  ├─ js/main.js         全部交互脚本（原生 JS）
│  └─ img/
│     ├─ logo.svg        站点 logo
│     └─ favicon.svg     浏览器标签图标
└─ README.md
```

## 本地预览

直接双击 `index.html`；或用任意静态服务器：

```bash
python -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## 上传 GitHub 并开启 Pages

目标仓库已存在：`https://github.com/unique541/SproutLauncher.github.io`（公开仓库，目前只有 README，站点文件还没传）。它是**项目仓库**，Pages 地址为子路径 `https://unique541.github.io/SproutLauncher.github.io/`。

> 注意：根路径 `https://unique541.github.io/` 由用户站点仓库 `unique541.github.io` 承载（当前是 breezebox 资源站），不要往那边传本目录，否则会覆盖掉资源站。

### 方式一：网页上传（最简单）

1. 进入仓库 → `Add file` → `Upload files`，把 `sprout-site` 目录里的**全部内容**拖进浏览器上传区（要保留 `assets/css`、`assets/js`、`assets/img` 三层目录结构；也可以直接把 `assets` 文件夹拖进去，浏览器会展开成目录），底部提交。
2. 仓库 → `Settings` → 左侧 `Pages` → `Build and deployment`
   - Source：`Deploy from a branch`
   - Branch：`main` / 目录 `/(root)`
3. 等 1~2 分钟（首次构建有时要 3~5 分钟），访问 `https://unique541.github.io/SproutLauncher.github.io/`。

### 方式二：命令行

```bash
cd sprout-site
git init
git add .
git commit -m "feat: sprout launcher website"
git branch -M main
git remote add origin https://github.com/unique541/SproutLauncher.github.io.git
git push -u origin main
```

> `git push` 会要求身份验证：密码栏已停用，必须用 Personal Access Token（GitHub → Settings → Developer settings → Personal access tokens → Tokens(classic) → 勾 `repo` 权限），或走 `gh auth login`。

推送后在 `Settings → Pages` 按上面第 2 步开启即可。

## 下载地址与版本号

站点已指向真实仓库与真实安装包，站内**无 `data-todo` 占位**。

| 项目 | 值 |
| --- | --- |
| 源码 / 安装包仓库 | https://github.com/unique541/Sprout-Launcher |
| 官网站点仓库 | https://github.com/unique541/SproutLauncher.github.io |
| 站点地址 | https://unique541.github.io/SproutLauncher.github.io/ （子路径站点；根路径是 breezebox 资源站） |
| 安装包文件名 | `SproutLauncher-Setup-0.1.0.exe`（Inno Setup 生成，约 161 MB） |
| 下载直链 | https://github.com/unique541/Sprout-Launcher/releases/latest/download/SproutLauncher-Setup-0.1.0.exe |
| 版本号 | 0.1.0（与 `.iss` 中 `AppVersion` 一致） |

## 发布安装包（Release）的要求

下载按钮用的是 `releases/latest/download/<文件名>` 形式的直链，因此：

> **当前状态（2026-11-18 核对）**：安装包已发布在 `unique541/Sprout-Launcher` 仓库的 Release 中，Tag 为 `SproutLauncher0.1.0`，资产名 `SproutLauncher-Setup-0.1.0.exe`（160.93 MB），直链实测可下载。官网仓库 `SproutLauncher.github.io` 只放站点文件，不放安装包。

1. **安装包必须传到 Releases，不能放进仓库主干**。GitHub 对仓库内单个文件限制 100 MB，安装包约 161 MB，直接 `git add` 会被拒绝；Release 资产上限 2 GB，可以正常上传。
2. Release 的**资产文件名必须与直链完全一致**：`SproutLauncher-Setup-0.1.0.exe`。改名会让按钮 404。
3. 发布步骤：`Sprout-Launcher` 仓库 → `Releases` → `Draft a new release` → 新建 Tag（本次为 `SproutLauncher0.1.0`）→ 标题写版本号 → 上传 `SproutLauncher-Setup-0.1.0.exe` → `Publish release`。直链用 `releases/latest/download/...` 形式，最新一条正式版发布后会自动指向它。
4. 发新版时：`AppVersion` 改成新版本号重新编译安装包，上传后同步修改 `index.html` 里两处文本（卡片副标题里的版本号、`dl-meta` 里的文件名）和按钮 `href` 里的文件名。

> Linux / macOS 卡片当前写明"暂无预编译安装包 · 需源码构建"，按钮指向仓库，没有虚假下载地址。

## 内置动画一览

- 背景：canvas 星点缓慢漂移 + 三个渐变光斑 26~38s 循环 + 鼠标视差
- 首屏：标题逐字 3D 翻转入场、渐变文字、打字机、窗口示意浮动与下载进度条循环
- 全站：滚动入场（位移+模糊+错峰）、顶部滚动进度条、鼠标柔光跟随
- 卡片：3D 倾斜、光晕跟随指针、图标微动、按钮光泽扫过与磁吸
- 功能区：Tab 指示器滑动 + 自动轮播（悬停暂停）
- 流程区：滚动点亮进度线与节点
- FAQ：平滑展开手风琴
- 无障碍：`prefers-reduced-motion` 下自动关闭大动效
- 主题：深色 / 浅色一键切换，localStorage 记忆

## 说明

站内唯一的版本号是安装包的 `0.1.0`，来自 `.iss` 的 `AppVersion`，其余统计数字均为结构性描述，不含下载量、Star 数等易过期数据；更新日志为概括性描述，请按实际发版情况补充。
*（内容由AI生成，仅供参考）*
