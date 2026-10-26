# 88API-Video-Studio

**一个插件调用 [88API](https://88api.ai/) 的全部视频模型。** 实时读取当前视频模型、价格、能力与可用状态，由你选择模型后生成单条短片或 TVC/广告片，还能反推参考视频、整理可复刻工程包。

支持 **Claude Code、Codex、ZCode、DeepSeek Harness、Trae**，以及 Cursor、Cline、Gemini CLI 等能读 `SKILL.md` 技能、能运行本机 Node.js 18+ 的客户端。

首次使用配置两个彼此独立的凭据：生成用 **API Key**，账户/价格查询用**个人访问令牌**。两项凭据都可以在受信任的 Agent 会话中直接交给 Agent 一键配置；个人访问令牌同时保留本机隐藏输入方式。插件不会替你擅自决定视频模型。

> 🖼 **要做关键帧、产品图？** 姊妹插件 [88API-Image-Gen](https://github.com/blackdm666/88API-image-gen) 一个插件调用 88API 全部生图模型，和本插件共用同一个 88API Key、支持同样的客户端。

## 安装

| 客户端 | 安装方式 |
| --- | --- |
| Claude Code | 在对话里输入 `/plugin marketplace add blackdm666/88API-Video-Studio`，再输入 `/plugin install seedance-studio@seedance-studio-plugins` |
| Codex | 终端运行 `codex plugin marketplace add blackdm666/88API-Video-Studio`，然后在插件列表里安装 **88API-Video-Studio** |
| ZCode | **设置 → Plugins → Create → Add marketplace**，填入 `blackdm666/88API-Video-Studio`，然后安装 **88API-Video-Studio** |
| DeepSeek Harness | 打开「添加插件」，填入 `github:blackdm666/88API-Video-Studio`，点「安装」；装完完全退出并重新打开 DSH，然后新开对话 |
| Trae | 终端运行 `npx skills add blackdm666/88API-Video-Studio -g -a trae -y`（装到 `~/.trae/skills/`），然后新开对话 |
| 其它客户端 | 把 [`plugins/seedance-studio/skills/seedance-studio/`](plugins/seedance-studio/skills/seedance-studio/) 整个文件夹复制到客户端的技能目录（见下方） |

<details>
<summary>其它客户端的技能目录</summary>

| 客户端 | 用户级技能目录 |
| --- | --- |
| DeepSeek Harness（不用插件时） | `~/.dsh/skills/` 或 `~/.agents/skills/` |
| Trae（不用命令时） | `~/.trae/skills/`（Windows 为 `%USERPROFILE%\.trae\skills\`）；只给一个项目用时放项目里的 `.trae/skills/` |
| Cursor、Gemini CLI 等认公共目录的客户端 | `~/.agents/skills/` |
| Cline | `~/.cline/skills/` |
| ZCode（不用插件时） | `~/.zcode/skills/` |

复制后保持文件夹名为 `seedance-studio`，新开对话让客户端重新加载技能。DeepSeek Harness 两种方式选一种即可；两种都装了时，用插件装的那份。

</details>

## 升级

- **Claude Code**：终端运行 `claude plugin marketplace update seedance-studio-plugins` 和 `claude plugin update seedance-studio@seedance-studio-plugins`，然后新开对话。
- **Codex**：`codex plugin marketplace upgrade seedance-studio-plugins`，然后新建任务。
- **ZCode**：在插件设置里刷新市场并更新 **88API-Video-Studio**。
- **DeepSeek Harness**：暂不支持插件自动更新。在插件设置里卸载 **88API-Video-Studio**，再按安装步骤重新添加；重新添加后完全退出并重新打开 DSH（托盘里的也要退出），然后新开对话。
- **Trae**：终端运行 `npx skills update -g -y`；手动复制安装的，用新版技能文件夹覆盖旧的。然后新开对话。
- **其它客户端**：用新版技能文件夹覆盖旧的。

更新内容见 [CHANGELOG.md](CHANGELOG.md)。`video --dry-run` 不上传、不生成；正式创建不自动重试，查询失败可继续查询原任务。运行 `node --test tests/*.test.mjs dsh/package.test.mjs` 执行离线回归；在线 `models --json` 与 `--self-test` 只读，不产生视频生成费用。

## 三大工作流

| 工作流 | 输入 | Agent 自动完成 | 产出 |
|---|---|---|---|
| **① 想法 → 成片** | 一句话想法 | 获取实时视频模型、价格和能力 → 用户选模型 → 按该模型单段上限自动分级 → 必要时拆段并 `concat` | 单条短片 / TVC 的 MP4 |
| **② 视频 → 反推** | 一条参考视频 | ffmpeg 抽帧 → 逐帧证据观察 → 结构化还原运镜/动作/文字/声音 | 可直接生成的提示词 |
| **③ 视频 → 复刻工程包** | 一条参考视频 | ②的全部 + 素材盘点 + 人物身份路由（原片演员新身份 / 授权替换人物原图直传）+ 逐段绑定提示词 | 补齐素材即可一键生成的完整工程 |

## 首次调用体验

插件首次被调用时会主动介绍上述三种用法，并给出可直接照着说的例子：

```text
做一条 10 秒竖屏运动鞋广告。
反推这个视频的提示词。
把这个参考片做成可复刻工程包，我要换成自己的产品。
```

介绍只显示一次，随后自动继续用户刚才的任务，不要求重新描述。

> 首次出片会展示所有当前视频模型的模型 ID、实时单价、能力摘要和三层可用状态（目录、账户、当前 API Key），等待用户明确选择。多镜片还会确认拆段、价格版本和总估算金额。**本插件专注单条短片与 TVC，不做多集连续短剧/剧集/电影。**

> 功能③是对"光有提示词还不够"的回答：好视频 = 提示词 × 素材绑定 × 时间结构。工程包内含素材职责表与**缺失素材清单**（原片每种产品形态各需一张干净图），补齐后直接进入①的生成阶段。

## 内置能力

- 🎬 动态视频目录与模型适配：从 `/api/pricing` 获取当前视频模型、价格和能力，再按各模型的 88API 规范选择提交模型名、端点和请求参数，并与 `/api/user/models`、`/v1/models` 交叉验证
- 💰 账户与计费：只读查询余额，按实时计价单位显示单价，并在付费提交前计算本次估算金额
- 🎧 `gemini-3.7-flash`：默认用于视频音频反推，一次拆出台词、BGM 和音效时间线
- 🖼 gpt-image-2 / gpt-image-2-4k / gpt-image-2.5-flare / gpt-image-2.5-sunburst 生图：关键帧预审、人物/产品/场景锚定图（跨段一致性）
- 👤 授权人物直传：用户另行提供并指定的人物原图作为唯一身份权威，每张关键帧与视频请求都直接携带，避免 AI 图套 AI 图造成身份漂移和合成感
- 🔍 反推：ffmpeg 抽帧 + Agent 逐帧观察，零 API 成本，证据优先防幻觉
- 🧵 拼接：`concat` 命令流复制拼段（异常时 `--reencode`）
- 🛡 成本安全：dry-run、防重复提交闸、failed 任务 NO-RETRY、拆段方案先确认总计费秒数
- 📡 任务监控：提交后立即返回任务ID，Agent提示用户耐心等待并持续输出状态心跳，直到下载完成
- 🧾 参考图审计：图生视频必须通过 `--require-image` 和 `[REFERENCE-AUDIT]`，缺图时在付费前拦截

图片生成默认使用 `gpt-image-2`。明确点名时可传 `--model gpt-image-2.5-flare` 或 `--model gpt-image-2.5-sunburst`；两个新模型使用插件 2K 预设，不代表上游仅支持 2K。用户未指定其它模型而明确要求4K时使用 `gpt-image-2-4k`；只有明确点名 Nano Banana/Gemini 时才转到 Gemini 图片插件。

插件在询问凭据前会运行程序级 `preflight`。它能识别本插件自己的配置，也会复用本机 [88API-Image-Gen](https://github.com/blackdm666/88API-image-gen)（`~/.88api/image-gen.json`）或旧版 88API-Nano-Banana 已保存的 88API Key；预检显示有效时不会重复索要。

## 环境要求

- 能读 `SKILL.md` 技能、能运行本机命令的 Agent 客户端（见上方“安装”）+ Node.js 18+
- ffmpeg（反推与拼接需要）
- 一个 88api.ai API Key（建议 `auto` 分组，用于生成）
- 一个 88api.ai 个人访问令牌（用于只读查询余额、价格、能力和状态）

## 创建并配置 88API 凭据

### 1. 注册并登录

打开 [88api.ai](https://88api.ai/) 注册账号并登录。

### 2. 创建生成 API Key

进入“API 密钥”页面，点击“创建 API 密钥”。名称可以自定义（例如 `Video Studio`），分组建议选择 `auto`（自动分组），以便同时调用 Seedance 视频模型和 Image-2 关键帧模型。如需在当前分组请求失败时继续尝试下一分组，可以开启“跨分组重试”。

![创建 88API Key](docs/assets/88api-create-image-key.png)

### 3. 创建个人访问令牌

登录 88API 控制台，进入左侧 **“安全与访问 → 访问令牌”**，点击 **“创建访问令牌”**，权限只勾选“查看”类即可。该令牌用于 `/api/*` 账户接口，与生成 API Key 不同；插件会通过 `/api/user/self` 自动识别用户 ID。

### 4. 复制两项凭据

创建完成后，分别复制 API Key 和个人访问令牌的完整内容。两者都只用于你自己的本机配置，请勿粘贴到 Issue、公开聊天、仓库文件或截图中。

![复制 88API Key](docs/assets/88api-copy-key.png)

### 5. 让 Agent 一键配置（推荐）

安装插件后直接向 **88API-Video-Studio** 描述视频需求。Agent 会先介绍插件用法并检查两项凭据。**推荐把 API Key 和个人访问令牌直接交给当前受信任会话中的 Agent**，它会自动保存、脱敏验证、查询余额并显示实时模型列表；验证通过后不会要求撤销或重新创建凭据。你不愿在聊天中发送个人访问令牌时，再改用隐藏输入助手。

聊天配置的 API Key、个人访问令牌与模型选择保存在本机权限受限的 `~/.88api/video-studio.json`（和 88API-Image-Gen 同一个文件夹，本机所有客户端共用；0.12.0 之前的 `~/.seedance-studio/config.json` 会继续读取）；隐藏输入方式则把访问令牌保存到 `SEEDANCE_STUDIO_ACCESS_TOKEN` Windows 用户环境变量。Agent 不会在回复中显示完整凭据；账户、目录和自检不会发起付费生成。

> 仅在自己信任的 Agent 会话中提供凭据，不要把 API Key 或个人访问令牌发布到 GitHub Issue、公开聊天、仓库文件或截图中。

<details>
<summary>高级用户：手动配置命令</summary>

```powershell
node plugins/seedance-studio/skills/seedance-studio/scripts/studio.mjs --set-key "<YOUR_88API_KEY>"
node plugins/seedance-studio/skills/seedance-studio/scripts/studio.mjs --set-access-token "<YOUR_88API_ACCESS_TOKEN>"
node plugins/seedance-studio/skills/seedance-studio/scripts/studio.mjs --configure-access-token
node plugins/seedance-studio/skills/seedance-studio/scripts/studio.mjs intro
node plugins/seedance-studio/skills/seedance-studio/scripts/studio.mjs preflight --scope image --json
node plugins/seedance-studio/skills/seedance-studio/scripts/studio.mjs account
node plugins/seedance-studio/skills/seedance-studio/scripts/studio.mjs models
node plugins/seedance-studio/skills/seedance-studio/scripts/studio.mjs --set-video-model "<EXACT_MODEL_ID>"
node plugins/seedance-studio/skills/seedance-studio/scripts/studio.mjs --get-config
node plugins/seedance-studio/skills/seedance-studio/scripts/studio.mjs --self-test
node plugins/seedance-studio/skills/seedance-studio/scripts/studio.mjs --caps
```

</details>

## 快速开始

1. 按上方“安装”在你的客户端里装好插件，新开对话。
2. 直接描述视频需求；按 Agent 提示配置 API Key 和个人访问令牌。
3. 从实时列表中明确选择视频模型。
4. 直接说人话（Codex 里可以用 `@88API-Video-Studio` 点名插件，其它客户端直接描述需求即可）：

```text
@88API-Video-Studio 做一个 45 秒的竖屏治愈短片：雨夜女孩把流浪猫带回家。
@88API-Video-Studio 反推这条视频的提示词：D:\videos\ref.mp4
@88API-Video-Studio 给我这条视频的复刻工程包，我想换成我自己的产品：D:\videos\hot.mp4
```

## CLI 直接使用（可选）

```powershell
node plugins/seedance-studio/skills/seedance-studio/scripts/studio.mjs account --json
node plugins/seedance-studio/skills/seedance-studio/scripts/studio.mjs models --json
node plugins/seedance-studio/skills/seedance-studio/scripts/studio.mjs --set-video-model "Seedance-2.5-720p官方版"
node plugins/seedance-studio/skills/seedance-studio/scripts/studio.mjs video --prompt "雨夜东京街头，银色跑车驶过，霓虹倒影，电影级跟拍" --duration 10 --ratio 16:9
node plugins/seedance-studio/skills/seedance-studio/scripts/studio.mjs video --prompt "..." --image product.jpg --require-image --duration 8 --dry-run
node plugins/seedance-studio/skills/seedance-studio/scripts/studio.mjs video --prompt "..." --identity-image person.jpg --first-frame opening.png --duration 8 --dry-run
node plugins/seedance-studio/skills/seedance-studio/scripts/studio.mjs status --task task_xxx --wait
node plugins/seedance-studio/skills/seedance-studio/scripts/studio.mjs image --prompt "产品关键帧…" --aspect 16:9
node plugins/seedance-studio/skills/seedance-studio/scripts/studio.mjs image --prompt "人物关键帧…" --identity-ref person.jpg --ref scene.jpg --aspect 16:9 --dry-run
node plugins/seedance-studio/skills/seedance-studio/scripts/studio.mjs concat --dir seedance-projects/demo/segments --out final.mp4
```

## 边界说明

- 时长、分辨率、画幅、参考素材和声音能力以用户所选模型的实时目录说明为准，不得把 Seedance 能力套到其它模型。
- 当前 CLI 只允许目录端点类型含 `openai-video` 或 `video-generation` 的模型走 `/v1/videos`；其它视频模型会展示为“端点不兼容”。
- `available` 表示目录、账户和 API Key 三层检查通过，不保证上游永远有容量；临时熔断仍可能发生。
- 所选模型支持视频/音频参考时，素材必须是公网可直连 URL；本地图片参考走 base64。
- 复刻参考视频中的原演员时生成新身份锚定图，不从原片抽帧；用户另行提供并明确指定的授权人物照片则保持为唯一身份权威，使用 `--identity-ref` / `--identity-image` 直传，禁止只在第一次生图后改用 AI 锚定图。BGM 不提取原曲（版权）。
- 两项凭据均为敏感信息；不要提交配置文件、粘贴到 Issue 或放进截图。

## 鸣谢与来源

- 提示词方法论 references 改编自 [allenGKC/Seedance-2.5](https://github.com/allenGKC/Seedance-2.5)（MIT，见 THIRD-PARTY-LICENSE-seedance25os.txt）。
- 反推与复刻方法论参考社区证据优先实践（fkyhdd、daihuo-fanpai 等项目的公开经验），正文为本项目重写。
- 插件结构与姊妹插件 [blackdm666/88API-image-gen](https://github.com/blackdm666/88API-image-gen) 保持一致；接口规格来自 88api.ai 官方文档。

非 ByteDance / 即梦 / Dreamina / 88api 官方项目。

## 项目信息

- 版本：`0.12.1`
- GitHub：[blackdm666/88API-Video-Studio](https://github.com/blackdm666/88API-Video-Studio)（原 `seedance-studio`，旧地址自动跳转）
- 插件名：`seedance-studio@seedance-studio-plugins`（Claude Code、Codex、ZCode 相同）；DeepSeek Harness 插件包名 `seedance-studio`
- 更新记录：[CHANGELOG.md](CHANGELOG.md)
