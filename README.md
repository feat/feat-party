# Feat Party Web

开源的 Party 应用。
线上的聊天系统

使用 React 和 Redux 以及 Next.js 构建， 同时利用 Feat Open Project 的 API。

> Feat.com 项目是一个社会化工程，也是一个公开的工程。我们欢迎各种形式的贡献：比如 PR、提出问题、对问题的反馈、提供评论、捐款，甚至只是将你认为工程上的一些事情分享出去，都是一种对工程发展很有价值的贡献和帮助。

在提出拉取请求之前，请记得阅读我们的 [《FEAT 社会化工程参与者指南》](http://new.featapi.com/category/guides/)

Feat.com 的工程开发所需的资金筹款在接收、开销、管理等整个过程都以完全透明的方式进行， 并接受社会监管。

我们非常感谢哪些已经为我们作出了筹款的捐献者。

## 关于 Party

Party 是提供给站内用户的即时通讯工具。除一对一的与好友私聊外，用户还可选择群聊和消息群发的聊天方式；可支持但不限于文本、图片、表情、语音、录像等消息类型的发送。Party 的功能特征如下：

- 用户聊天，用户与用户之间进行即时通讯，允许“陌生人”直接发起会话
- 记录用户发送消息时所在地区的基本信息（城市、时区、天气状况等）
- 消息广播
- 创建并管理群组
- 发起群聊
- 自动清理（隐藏）过期的收件箱信息，以及消息提醒
- 建立好友关系
- 黑名单与消息屏蔽
- 记录用户与用户间的交互记录（包含但不限于：聊天记录、评论、点赞、交易记录），并提供永久的存储、查询功能。

更多产品说明可查阅: [Party 产品说明](https://www.openwriter.com/dimzou-publication/224/228)

## 系统要求

- Node.js 10.13 or later
- Redis 2.8 or later

## 项目启动

1. 拉取仓库

```bash
git clone
```

2. 安装依赖包

```
npm install
```

3. 通过环境配置模版创建环境配置文件，并编辑环境配置文件。`.env` 中需要填入 FEAT_CLIENT_ID 以及 FEAT_CLIENT_SECRET。具体内容可联系我们获取。

```bash
cp .env.example .env
```

```
## API proxy
# ==========
API_ENDPOINT=https://www.featapi.com
SOCKET_ENDPOINT=
STORAGE_ENDPOINT=
# 需要在 feat.com 上创建 Application。https://www.feat.com/application
FEAT_CLIENT_ID=
FEAT_CLIENT_SECRET=

PORT=3100

## APP config
# ==========
# HTTPS=true
# NEXT_ASSET_PREFIX=
# SENTRY_DSN=
SESSION_SECRET=random_string
# seconds, 86400 --> 24h
SESSION_TTL=86400

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=
REDIS_PORT=6379
REDIS_DB=0
REDIS_PREFIX=feat_web_

# Services
# ==========
FACEBOOK_APP_ID=
WEIBO_APP_KEY=

# 开发用
DEBUG=feat-web:*
# 生产用
# DEBUG=feat-web:request,feat-web:server,proxy:*


## Dev related
# ==========
# GOOGLE_API_KEY=
# SENTRY_AUTH_TOKEN=
# SENTRY_ORG=
# SENTRY_PROJECT=
# SENTRY_URL=
```

4. 将开发证书放到 `server/cert`，证书命名规则，详见目录中的 `README.md`。当`.env` 中未设置 `HTTPS` 时，可忽略这个步骤

### 开发

开发环境中需要使用 redis，请确保环境配置中指向的 `redis-server` 已启动。本地服务可以尝试在终端中使用 `redis-server` 启动服务

```bash
$ redis-server
```

1. 启动开发服务器

```bash
$ npm start
```

### 生产部署

1. 构建

```bash
$ npm run build
```

2. 启动生产服务器

```bash
$ npm run start:prod
```

## 技术栈

- [Express](https://expressjs.com/en/api.html): NodeJS 服务器
- [Next.js](https://nextjs.org/): SSR 以及 Async 路由系统
- [React](https://reactjs.org/): 组件组织，及数据渲染
- [React-Intl](https://formatjs.io/docs/react-intl/): 多语言
- [React-DnD](https://react-dnd.github.io/react-dnd/): 拖放功能
- [Redux](https://redux.js.org/): 全局数据管理
- [Redux-thunk](https://github.com/reduxjs/redux-thunk): 异步请求
- [Redux-saga](https://redux-saga.js.org/): Redux Action 副作用处理
- [Socket.io](https://socket.io/): 消息推送
- [sass](https://sass-lang.com/): 样式
