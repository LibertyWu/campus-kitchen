from flask import Flask
from flask_cors import CORS
from app.config.database import db
from app.config.init_data import init_test_data
from sqlalchemy import text

# 创建Flask应用实例
app = Flask(__name__)

# 配置CORS
CORS(app, resources={"/*": {"origins": "*"}})

# 配置数据库连接
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:111111@localhost:3306/campus_share_kitchen'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False  # 生产环境关闭

# 初始化数据库
with app.app_context():
    db.init_app(app)
    
    # 导入所有模型，确保它们被注册到SQLAlchemy的元数据中
    from app.models import User, Kitchen, Reserve, Food, Order, FoodOrderDetail, UserCreditLog
    
    # 先删除所有表（如果存在），然后重新创建
    # 使用原始SQL语句，绕过外键约束检查
    from app.models import User, Kitchen, Reserve, Food, Order, FoodOrderDetail, UserCreditLog
    
    # 禁用外键约束检查
    with db.engine.connect() as conn:
        conn.execute(text("SET FOREIGN_KEY_CHECKS = 0"))
        
        # 删除所有表
        conn.execute(text("DROP TABLE IF EXISTS food_order_detail"))
        conn.execute(text("DROP TABLE IF EXISTS user_credit_log"))
        conn.execute(text("DROP TABLE IF EXISTS appointment"))
        conn.execute(text("DROP TABLE IF EXISTS `order`"))
        conn.execute(text("DROP TABLE IF EXISTS food"))
        conn.execute(text("DROP TABLE IF EXISTS kitchen"))
        conn.execute(text("DROP TABLE IF EXISTS sys_user"))
        
        # 重新启用外键约束检查
        conn.execute(text("SET FOREIGN_KEY_CHECKS = 1"))
    
    # 重新创建所有表
    db.create_all()
    
    # 初始化测试数据
    init_test_data()

# 注册API路由
from app.api import user, kitchen, food, reserve, order
app.register_blueprint(user.bp, url_prefix='/api/user')
app.register_blueprint(kitchen.bp, url_prefix='/api/kitchen')
app.register_blueprint(food.bp, url_prefix='/api/food')
app.register_blueprint(reserve.bp, url_prefix='/api/reserve')
app.register_blueprint(order.bp, url_prefix='/api/order')

# 健康检查接口
@app.route('/health')
def health_check():
    return {"status": "ok", "message": "服务运行正常"}

# 启动应用
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
