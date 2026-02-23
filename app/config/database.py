from flask_sqlalchemy import SQLAlchemy

# 创建数据库实例
db = SQLAlchemy()

# 配置数据库连接
def init_db(app):
    # 使用MySQL数据库
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:111111@localhost:3306/campus_share_kitchen'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ECHO'] = False  # 生产环境关闭
    
    # 初始化数据库
    db.init_app(app)
    
    # 创建所有表
    with app.app_context():
        db.create_all()
