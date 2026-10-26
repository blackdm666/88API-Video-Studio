# 更新记录

## 0.12.0 — 2026-10-26

改名 88API-Video-Studio，并和姊妹插件 88API-Image-Gen 一样适配多种 Agent 客户端。

### 变更

- **改名**：插件显示名改为 88API-Video-Studio，GitHub 仓库改名为 `blackdm666/88API-Video-Studio`（旧地址 `blackdm666/seedance-studio` 自动跳转）。插件 id `seedance-studio`、市场名 `seedance-studio-plugins` 不变，已安装的用户照常升级。
- **多客户端**：新增 Claude Code / ZCode 插件市场（`.claude-plugin/`）、DeepSeek Harness 插件包（根目录 `package.json` + `dsh/`，「添加插件」填 `github:blackdm666/88API-Video-Studio`）和 Trae 安装方式（`npx skills add blackdm666/88API-Video-Studio -g -a trae -y`）；其它能读 `SKILL.md` 的客户端复制技能文件夹即可。各客户端显示同一个名称、简介和 88API 图标。
- **技能文件夹自带脚本**：`scripts/` 移进 `skills/seedance-studio/`，技能文件夹单独复制到任何客户端都能运行；命令改为 `node "<SKILL_DIR>/scripts/studio.mjs"`。
- **凭据位置与共用 Key**：配置改存 `~/.88api/video-studio.json`，和 88API-Image-Gen 的 `~/.88api/image-gen.json` 同一个文件夹；旧的 `~/.seedance-studio/config.json` 继续读取，下次保存时写到新位置。API Key 依次复用 `SEEDANCE_STUDIO_API_KEY`、`API88_KEY`、本插件配置、88API-Image-Gen 的 Key 和旧版位置。`API88_CONFIG_DIR` 可改配置目录。
- **沙箱客户端**：DeepSeek Harness、Codex workspace-write 等不允许写 `~/.88api/` 时，保存凭据和选模型会提示“配置没有保存”并说明需要客户端批准一次，不再抛出报错，也不会改存到工作目录；首次介绍标记写不进时只提示、不打断任务。
- **长任务**：技能说明新增“客户端与长任务”：Claude Code 后台运行视频、等待和生图命令；DeepSeek Harness 等超时转后台的客户端不要重复提交；中断后用 `status --task` 续查原任务。
- 新增 `--version`，`--get-config` 显示插件版本；提示语不再假设只在 Codex 里使用。

### 验证

- 本地回归：原有 29 项 + 共用 `~/.88api/image-gen.json` Key 的测试，以及 `dsh/package.test.mjs` 的版本号、名称、简介、图标和 id 一致性检查。

## 0.11.0 — 2026-09-17

适配 88API 于 2026-09-15 更新的视频任务协议。NewAPI 内部改为任务插件后，部分模型的目录端点仍标为 `openai`，旧版会误判为不兼容；价格改为按秒表达式后，旧版也会误读为 Token 计价。本版本更新模型识别、计价和完整生成流程。

### 变更

- 识别已核实的 SD2.0/SD2.5、Seedance 官方版及 Mini、Wan3、Kling、MiniMax H3、Veo、Grok 和 Gemini Omni 型号；保留精确销售模型名。未知型号需有明确视频端点或视频分组及按秒任务 schema，聊天模型的“视频理解”描述不会被误判为视频生成。
- 统一通过 `POST /v1/videos` 创建任务、优先保存公开 `id`，通过 `GET /v1/videos/{id}` 查询。请求使用 `size`、`images` 及模型要求的 `metadata` 字段。
- 解析按秒 `tiered_expr` 及分辨率价格分支，应用实时目录的分组倍率。保留价格版本与表达式；未知表达式会阻止付费提交，不回退为旧 Token 价格或零价。
- 本地图片在正式生成前通过 `/v1/media/uploads` 上传；dry-run 不上传。Veo 显式图片模式改为 Base64 输入；上传及成片下载不携带 API Key。
- Veo 支持 4/6/8 秒、720p/1080p、frames/reference 模式及专用音频字段。Grok 支持七种比例和单张首图；Gemini Omni 使用顶层视频参考字段。
- 前置检查首尾帧互斥、尾帧必须搭配首帧、SD2.0 素材总数、音频开关、参考类型及分辨率档位。
- 完成结果优先使用 `url`，兼容 `video_url`、`result_url`；先保存终态，再下载文件。瞬时 GET 错误可继续查询原任务；`video` 创建请求发出前保存记录，结果不确定时防止盲目重复提交。
- 更新技能和 API 文档，移除将旧 `content[]`、Ark 原生格式直接套用到现行 88API 任务的说明；保留 Image 2.5 图片预设。

### 验证

- 29 项本地回归测试通过，包含 25 个现网视频型号的目录夹具、价格、请求、上传和任务生命周期测试。
- 已安装插件完成 34 项使用真实鉴权与实时目录的 dry-run，覆盖 25 个型号及 9 个素材/参数场景；预演强制禁止 POST/PUT。
- SD2.5 720P 完成一次真实 10 秒、9:16、带音轨的生成、轮询与下载。成品为 720×1280、H.264/AAC，实际容器时长约 10.08 秒，完整解码及画面、音频检查通过。
- 插件清单、技能格式及 JavaScript 语法检查通过。其他型号未逐一进行付费生成，目录可见性和协议校验不代表上游容量或所有服务路径能力保证。

### 使用说明

- 更新后新开一个 Codex 任务加载技能。原有凭据、模型选择和历史任务保留；历史任务继续使用原公开 ID 查询，避免重复生成。
- 首次正式生成仍由用户选择具体视频型号。估算价格不等于实际账单，未返回 `usage` 时不将请求时长当作实际计费用量。
- 当前只自动上传本地图片；视频和音频参考继续使用可匿名下载的公网 HTTPS 直链。

协议依据：[88API 视频 API 完整调用规范](https://88api.ai/zh/docs/api/video/video-api-standard/)。
