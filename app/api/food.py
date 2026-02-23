from flask import Blueprint, request, jsonify
from app.models import db, Food

# 创建蓝图
bp = Blueprint('food', __name__)

# 获取食材列表接口
@bp.route('/list', methods=['GET'])
def get_food_list():
    # 获取查询参数
    category = request.args.get('category')
    keyword = request.args.get('keyword')
    
    # 构建查询
    query = Food.query.filter_by(status='available')
    
    # 按分类筛选
    if category:
        query = query.filter_by(category=category)
    
    # 按关键词搜索
    if keyword:
        query = query.filter(Food.name.like(f'%{keyword}%'))
    
    foods = query.all()
    
    food_list = []
    for food in foods:
        food_list.append({
            "id": food.id,
            "name": food.name,
            "category": food.category,
            "price": food.price,
            "stock": food.stock,
            "unit": food.unit,
            "description": food.description
        })
    
    return jsonify({"code": 0, "msg": "获取成功", "data": food_list})

# 获取食材详情接口
@bp.route('/detail', methods=['GET'])
def get_food_detail():
    food_id = request.args.get('food_id')
    if not food_id:
        return jsonify({"code": 1, "msg": "食材ID不能为空"})
    
    food = Food.query.get(food_id)
    if not food:
        return jsonify({"code": 1, "msg": "食材不存在"})
    
    if food.status != 'available':
        return jsonify({"code": 1, "msg": "该食材当前不可用"})
    
    return jsonify({
        "code": 0, 
        "msg": "获取成功", 
        "data": {
            "id": food.id,
            "name": food.name,
            "category": food.category,
            "price": food.price,
            "stock": food.stock,
            "unit": food.unit,
            "description": food.description
        }
    })

# 获取食材分类接口
@bp.route('/categories', methods=['GET'])
def get_food_categories():
    # 查询所有不重复的分类
    categories = db.session.query(Food.category).distinct().all()
    category_list = [cat[0] for cat in categories]
    
    return jsonify({"code": 0, "msg": "获取成功", "data": category_list})
