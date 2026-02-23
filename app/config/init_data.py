from app.config.database import db
from app.models import User, Kitchen, Reserve, Food, Order, FoodOrderDetail, UserCreditLog
from datetime import datetime

def init_test_data():
    """初始化测试数据"""
    # 检查是否已有数据
    if User.query.first():
        print("数据库中已有数据，跳过初始化")
        return
    
    print("开始初始化测试数据...")
    
    # 创建测试用户
    users = [
        User(
            username="test",
            password="123456",
            name="测试用户",
            student_id="20210001",
            phone="13800138000",
            credit=1000  # 初始积分1000
        ),
        User(
            username="admin",
            password="123456",
            name="管理员",
            student_id="20210002",
            phone="13800138001",
            credit=1000  # 初始积分1000
        )
    ]
    for user in users:
        db.session.add(user)
    
    # 创建厨房
    kitchens = [
        Kitchen(
            name="一号厨房",
            image="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20kitchen%20with%20stove%20and%20cabinet&image_size=square",
            location="第一食堂三楼",
            capacity=4,
            equipment="电磁炉、微波炉、烤箱、冰箱、刀具套装",
            price_per_hour=20,
            status="available"
        ),
        Kitchen(
            name="二号厨房",
            image="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=large%20kitchen%20with%20gas%20stove&image_size=square",
            location="第二食堂二楼",
            capacity=6,
            equipment="燃气灶、抽油烟机、烤箱、冰箱、餐具套装",
            price_per_hour=30,
            status="available"
        )
    ]
    for kitchen in kitchens:
        db.session.add(kitchen)
    
    # 创建食材
    foods = [
        # 蔬菜类
        Food(
            name="西红柿",
            category="蔬菜",
            price=5.0,
            stock=100,
            unit="斤",
            description="新鲜西红柿",
            status="available"
        ),
        Food(
            name="鸡蛋",
            category="蛋类",
            price=8.0,
            stock=200,
            unit="斤",
            description="新鲜鸡蛋",
            status="available"
        )
    ]
    for food in foods:
        db.session.add(food)
    
    # 提交数据以获取ID
    db.session.commit()
    
    # 创建预约
    reserves = [
        Reserve(
            user_id=users[0].id,
            kitchen_id=kitchens[0].id,
            date="2026-02-22",
            start_time="18:00",
            end_time="20:00",
            people_count=4,
            status="pending",
            total_price=40.0
        ),
        Reserve(
            user_id=users[0].id,
            kitchen_id=kitchens[1].id,
            date="2026-02-23",
            start_time="19:00",
            end_time="21:00",
            people_count=6,
            status="pending",
            total_price=60.0
        )
    ]
    for reserve in reserves:
        db.session.add(reserve)
    
    # 创建订单
    orders = [
        Order(
            user_id=users[0].id,
            total_amount=21.0,
            status="completed"
        ),
        Order(
            user_id=users[1].id,
            total_amount=13.0,
            status="pending"
        )
    ]
    for order in orders:
        db.session.add(order)
    
    # 提交订单以获取ID
    db.session.commit()
    
    # 创建订单详情
    order_details = [
        FoodOrderDetail(
            order_id=orders[0].id,
            food_id=foods[0].id,
            quantity=2,
            unit_price=foods[0].price,
            subtotal=foods[0].price * 2
        ),
        FoodOrderDetail(
            order_id=orders[0].id,
            food_id=foods[1].id,
            quantity=1,
            unit_price=foods[1].price,
            subtotal=foods[1].price * 1
        ),
        FoodOrderDetail(
            order_id=orders[1].id,
            food_id=foods[0].id,
            quantity=1,
            unit_price=foods[0].price,
            subtotal=foods[0].price * 1
        ),
        FoodOrderDetail(
            order_id=orders[1].id,
            food_id=foods[1].id,
            quantity=1,
            unit_price=foods[1].price,
            subtotal=foods[1].price * 1
        )
    ]
    for detail in order_details:
        db.session.add(detail)
    
    # 创建积分记录
    credit_logs = [
        UserCreditLog(
            user_id=users[0].id,
            credit_change=10,
            reason="注册奖励"
        ),
        UserCreditLog(
            user_id=users[0].id,
            credit_change=5,
            reason="首次预约"
        ),
        UserCreditLog(
            user_id=users[1].id,
            credit_change=10,
            reason="注册奖励"
        ),
        UserCreditLog(
            user_id=users[1].id,
            credit_change=5,
            reason="首次下单"
        )
    ]
    for log in credit_logs:
        db.session.add(log)
    
    # 提交数据
    db.session.commit()
    print("测试数据初始化完成！")
