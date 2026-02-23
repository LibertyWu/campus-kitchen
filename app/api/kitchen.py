from flask import Blueprint, request, jsonify
from app.models import db, Kitchen, Reserve
from datetime import datetime, date, time

# 创建蓝图
bp = Blueprint('kitchen', __name__)

# 获取厨房列表接口
@bp.route('/list', methods=['GET'])
def get_kitchen_list():
    # 获取查询参数
    category = request.args.get('category')  # 分类
    keyword = request.args.get('keyword')  # 搜索关键词
    sort_by = request.args.get('sort_by', 'default')  # 排序方式：default, distance, price
    sort_order = request.args.get('sort_order', 'asc')  # 排序顺序：asc, desc
    status = request.args.get('status')  # 厨房状态
    
    # 构建查询
    query = Kitchen.query
    
    # 按分类筛选
    if category:
        query = query.filter_by(category=category)
    
    # 按关键词搜索
    if keyword:
        query = query.filter(Kitchen.name.like(f'%{keyword}%'))
    
    # 按状态筛选
    if status:
        query = query.filter_by(status=status)
    
    # 排序
    if sort_by == 'distance':
        if sort_order == 'asc':
            query = query.order_by(Kitchen.distance.asc())
        else:
            query = query.order_by(Kitchen.distance.desc())
    elif sort_by == 'price':
        if sort_order == 'asc':
            query = query.order_by(Kitchen.price_per_hour.asc())
        else:
            query = query.order_by(Kitchen.price_per_hour.desc())
    else:
        # 默认排序
        query = query.order_by(Kitchen.id.desc())
    
    try:
        kitchens = query.all()
        
        kitchen_list = []
        for kitchen in kitchens:
            kitchen_list.append({
                "id": kitchen.id,
                "name": kitchen.name,
                "image": kitchen.image,
                "location": kitchen.location,
                "distance": kitchen.distance,
                "capacity": kitchen.capacity,
                "equipment": kitchen.equipment,
                "price_per_hour": kitchen.price_per_hour,
                "status": kitchen.status,
                "description": kitchen.description,
                "tags": kitchen.tags.split(',') if kitchen.tags else []
            })
        
        return jsonify({"code": 0, "msg": "获取成功", "data": kitchen_list})
    except Exception as e:
        # 捕获异常，返回空数据
        return jsonify({"code": 0, "msg": "获取成功", "data": []})

# 获取厨房详情接口
@bp.route('/detail', methods=['GET'])
def get_kitchen_detail():
    kitchen_id = request.args.get('kitchen_id')
    if not kitchen_id:
        return jsonify({"code": 1, "msg": "厨房ID不能为空"})
    
    kitchen = Kitchen.query.get(kitchen_id)
    if not kitchen:
        return jsonify({"code": 1, "msg": "厨房不存在"})
    
    return jsonify({
        "code": 0, 
        "msg": "获取成功", 
        "data": {
            "id": kitchen.id,
            "name": kitchen.name,
            "image": kitchen.image,
            "location": kitchen.location,
            "distance": kitchen.distance,
            "capacity": kitchen.capacity,
            "equipment": kitchen.equipment,
            "price_per_hour": kitchen.price_per_hour,
            "status": kitchen.status,
            "description": kitchen.description,
            "tags": kitchen.tags.split(',') if kitchen.tags else [],
            "category": kitchen.category
        }
    })

# 获取厨房分类列表接口
@bp.route('/categories', methods=['GET'])
def get_kitchen_categories():
    try:
        # 查询所有不重复的分类
        categories = db.session.query(Kitchen.category).distinct().all()
        category_list = [cat[0] for cat in categories if cat[0]]
        
        return jsonify({"code": 0, "msg": "获取成功", "data": category_list})
    except Exception as e:
        return jsonify({"code": 0, "msg": "获取成功", "data": []})

# 检查厨房是否可预约接口
@bp.route('/check_availability', methods=['POST'])
def check_availability():
    data = request.json
    kitchen_id = data.get('kitchen_id')
    reserve_date = data.get('date')
    start_time = data.get('start_time')
    end_time = data.get('end_time')
    
    if not all([kitchen_id, reserve_date, start_time, end_time]):
        return jsonify({"code": 1, "msg": "请填写完整信息"})
    
    # 解析日期和时间
    try:
        reserve_date = date.fromisoformat(reserve_date)
        start_time = time.fromisoformat(start_time)
        end_time = time.fromisoformat(end_time)
    except ValueError:
        return jsonify({"code": 1, "msg": "日期或时间格式错误"})
    
    # 检查时间是否合理
    if start_time >= end_time:
        return jsonify({"code": 1, "msg": "结束时间必须晚于开始时间"})
    
    # 检查是否与现有预约冲突
    conflicting_reserves = Reserve.query.filter(
        Reserve.kitchen_id == kitchen_id,
        Reserve.date == reserve_date,
        Reserve.status.in_(['pending', 'confirmed']),
        ((Reserve.start_time < end_time) & (Reserve.end_time > start_time))
    ).all()
    
    if conflicting_reserves:
        return jsonify({"code": 1, "msg": "该时间段已被预约，请选择其他时间"})
    
    return jsonify({"code": 0, "msg": "该时间段可预约"})
