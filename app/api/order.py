from flask import Blueprint, request, jsonify
from app.models import db, Order, Food, FoodOrderDetail, User, UserCreditLog
from app.utils.auth import jwt_required
from datetime import datetime

# 创建蓝图
bp = Blueprint('order', __name__)

# 创建食材订单接口
@bp.route('/create', methods=['POST'])
@jwt_required
def create_order(user_id):
    data = request.json
    items = data.get('items')  # 格式: [{food_id: 1, quantity: 2}, ...]
    
    if not items:
        return jsonify({"code": 1, "msg": "请选择食材"})
    
    if not isinstance(items, list) or len(items) == 0:
        return jsonify({"code": 1, "msg": "请选择食材"})
    
    # 检查用户是否存在
    user = User.query.get(user_id)
    if not user:
        return jsonify({"code": 1, "msg": "用户不存在"})
    
    # 计算总金额并检查库存
    total_amount = 0
    order_items = []
    
    for item in items:
        food_id = item.get('food_id')
        quantity = item.get('quantity')
        
        if not food_id or not quantity or quantity <= 0:
            return jsonify({"code": 1, "msg": "食材数量必须大于0"})
        
        # 查找食材
        food = Food.query.get(food_id)
        if not food:
            return jsonify({"code": 1, "msg": f"食材ID {food_id} 不存在"})
        
        if food.status != 'available':
            return jsonify({"code": 1, "msg": f"食材 {food.name} 当前不可用"})
        
        if food.stock < quantity:
            return jsonify({"code": 1, "msg": f"食材 {food.name} 库存不足"})
        
        # 计算小计
        subtotal = food.price * quantity
        total_amount += subtotal
        
        # 保存订单商品信息
        order_items.append({
            "food": food,
            "quantity": quantity,
            "unit_price": food.price,
            "subtotal": subtotal
        })
    
    # 检查用户积分是否足够
    if user.credit < total_amount:
        return jsonify({"code": 1, "msg": "积分不足，请先充值"})
    
    # 创建订单
    new_order = Order(
        user_id=user_id,
        total_amount=total_amount,
        status='completed'  # 直接完成
    )
    db.session.add(new_order)
    db.session.flush()  # 获取订单ID
    
    # 创建订单详情
    for item in order_items:
        # 扣减库存
        item['food'].stock -= item['quantity']
        
        # 创建订单详情记录
        order_detail = FoodOrderDetail(
            order_id=new_order.id,
            food_id=item['food'].id,
            quantity=item['quantity'],
            unit_price=item['unit_price'],
            subtotal=item['subtotal']
        )
        db.session.add(order_detail)
    
    # 扣除用户积分
    user.credit -= int(total_amount)
    
    # 记录积分变动
    credit_log = UserCreditLog(
        user_id=user_id,
        credit_change=-int(total_amount),
        reason=f"购买食材"
    )
    db.session.add(credit_log)
    
    db.session.commit()
    
    return jsonify({"code": 0, "msg": "订单创建成功", "data": {"order_id": new_order.id}})

# 获取用户订单列表接口
@bp.route('/list', methods=['GET'])
@jwt_required
def get_order_list(user_id):
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    
    order_list = []
    for order in orders:
        # 获取订单详情
        order_details = []
        for detail in order.order_details:
            order_details.append({
                "food_name": detail.food.name,
                "quantity": detail.quantity,
                "unit_price": detail.unit_price,
                "subtotal": detail.subtotal
            })
        
        order_list.append({
            "id": order.id,
            "total_amount": order.total_amount,
            "status": order.status,
            "created_at": order.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "items": order_details
        })
    
    return jsonify({"code": 0, "msg": "获取成功", "data": order_list})

# 获取订单详情接口
@bp.route('/detail', methods=['GET'])
@jwt_required
def get_order_detail(user_id):
    order_id = request.args.get('order_id')
    
    if not order_id:
        return jsonify({"code": 1, "msg": "订单ID不能为空"})
    
    # 查找订单
    order = Order.query.filter_by(id=order_id, user_id=user_id).first()
    if not order:
        return jsonify({"code": 1, "msg": "订单不存在"})
    
    # 获取订单详情
    order_details = []
    for detail in order.order_details:
        order_details.append({
            "food_id": detail.food.id,
            "food_name": detail.food.name,
            "quantity": detail.quantity,
            "unit_price": detail.unit_price,
            "subtotal": detail.subtotal
        })
    
    return jsonify({
        "code": 0, 
        "msg": "获取成功", 
        "data": {
            "id": order.id,
            "total_amount": order.total_amount,
            "status": order.status,
            "created_at": order.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "items": order_details
        }
    })
