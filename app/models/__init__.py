from datetime import datetime
from app.config.database import db

# 用户模型
class User(db.Model):
    __tablename__ = 'sys_user'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    student_id = db.Column(db.String(20), unique=True, nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False, index=True)  # 手机号唯一索引
    credit = db.Column(db.Integer, default=100)  # 初始积分100
    avatar = db.Column(db.String(255))  # 头像
    login_type = db.Column(db.String(20), default='password')  # 登录方式：password, wechat, alipay
    openid = db.Column(db.String(100), unique=True)  # 第三方登录openid
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    # 关联关系
    reserves = db.relationship('Reserve', backref='user', lazy=True)
    orders = db.relationship('Order', backref='user', lazy=True)
    credit_logs = db.relationship('UserCreditLog', backref='user', lazy=True)

# 厨房模型
class Kitchen(db.Model):
    __tablename__ = 'kitchen'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False, index=True)
    image = db.Column(db.String(255), nullable=False)  # 厨房图片
    location = db.Column(db.String(255), nullable=False)
    distance = db.Column(db.Float, default=0)  # 距离（公里）
    capacity = db.Column(db.Integer, nullable=False)  # 容纳人数
    equipment = db.Column(db.Text, nullable=False)  # 设备清单
    price_per_hour = db.Column(db.Float, nullable=False, index=True)  # 每小时价格
    status = db.Column(db.String(20), default='available', index=True)  # available, busy, maintenance
    description = db.Column(db.Text)  # 厨房描述
    tags = db.Column(db.String(255))  # 标签，逗号分隔
    category = db.Column(db.String(50), index=True)  # 分类
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    # 关联关系
    reserves = db.relationship('Reserve', backref='kitchen', lazy=True)

# 厨房预约模型
class Reserve(db.Model):
    __tablename__ = 'appointment'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('sys_user.id'), nullable=False)
    kitchen_id = db.Column(db.Integer, db.ForeignKey('kitchen.id'), nullable=False)
    date = db.Column(db.Date, nullable=False, index=True)  # 预约日期
    start_time = db.Column(db.Time, nullable=False)  # 开始时间
    end_time = db.Column(db.Time, nullable=False)  # 结束时间
    people_count = db.Column(db.Integer, nullable=False)  # 使用人数
    status = db.Column(db.String(20), default='pending', index=True)  # pending, confirmed, completed, cancelled
    total_price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

# 食材模型
class Food(db.Model):
    __tablename__ = 'food'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # 分类
    price = db.Column(db.Float, nullable=False)  # 单价
    stock = db.Column(db.Integer, nullable=False)  # 库存
    unit = db.Column(db.String(20), nullable=False)  # 单位
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='available')  # available, unavailable
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    # 关联关系
    order_details = db.relationship('FoodOrderDetail', backref='food', lazy=True)

# 食材订单模型
class Order(db.Model):
    __tablename__ = 'order'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('sys_user.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, paid, completed, cancelled
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    # 关联关系
    order_details = db.relationship('FoodOrderDetail', backref='order', lazy=True)

# 食材订单详情模型（用户提供）
class FoodOrderDetail(db.Model):
    __tablename__ = 'food_order_detail'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    food_id = db.Column(db.Integer, db.ForeignKey('food.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    subtotal = db.Column(db.Float, nullable=False)

# 用户积分记录模型（用户提供）
class UserCreditLog(db.Model):
    __tablename__ = 'user_credit_log'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('sys_user.id'), nullable=False)
    credit_change = db.Column(db.Integer, nullable=False)  # 积分变动值
    reason = db.Column(db.String(255), nullable=False)  # 变动原因
    created_at = db.Column(db.DateTime, default=datetime.now)
