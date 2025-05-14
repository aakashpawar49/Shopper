🛍️ Shopper —— 电子商务平台
MERN技术栈
许可证

Shopper是一个基于React.js、Node.js、Express和MongoDB构建的全功能电子商务平台。它支持用户注册、认证、商品管理、筛选功能，并为访客和登录用户提供购物车功能。

✨ 功能特性
🔐 认证与安全
基于JWT的用户认证

使用bcrypt加密密码

基于角色的路由访问控制（管理员vs普通用户）

敏感配置使用环境变量

🛒 购物体验
支持多种筛选的商品列表（颜色、尺寸、价格、类别）

访客和登录用户通用的购物车系统

可扩展的订单提交与结算逻辑

多种排序选项（价格、受欢迎程度）

🖥️ 管理功能
受保护的管理员路由

基于Mongoose模型的MongoDB数据库

RESTful API架构

📸 界面截图
页面	预览

首页	![image](https://github.com/user-attachments/assets/d22c8504-4182-4a62-81a5-581613242b0f) |
商品集合	![image](https://github.com/user-attachments/assets/9dae9241-5bbd-4e2b-a376-4cd5f9b806c8) |
商品详情	![image](https://github.com/user-attachments/assets/30fd9a5f-8cea-4f9d-8770-d8455ba9b8ba) |
管理面板	![image](https://github.com/user-attachments/assets/cf8c5db8-bc24-4a12-8ba8-20538fc8f8c7) |
🚀 快速开始
先决条件
Node.js (v14及以上版本)

MongoDB (本地或Atlas云服务)

npm或yarn包管理器

安装步骤
bash
# 克隆仓库
git clone https://github.com/yourusername/shopper.git

# 安装依赖
cd shopper
npm install
cd client
npm install
配置
在根目录创建.env文件：

env
MONGO_URI=mongodb://localhost:27017/shopper
JWT_SECRET=你的JWT密钥
PORT=5000
运行应用
bash
# 启动后端服务（在根目录）
npm start

# 启动前端（在client目录）
cd client
npm start
🛡️ 安全特性
密码保护：bcrypt哈希加密

安全认证：JWT令牌机制

访问控制：管理员/用户角色分离

安全配置：使用环境变量

📌 未来改进计划
支付网关集成

商品评价系统

订单历史与物流追踪

高级数据分析看板

👨‍💻 作者
Aakash Pawar
GitHub个人主页 | 作品集 | 联系方式****