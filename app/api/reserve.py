from flask import Blueprint, request, jsonify
from app.models import db, Reserve, Kitchen, User, UserCreditLog
from app.utils.auth import jwt_required
from datetime import datetime, date, time

# 创建蓝图
bp = Blueprint('reserve', __name__)

# 创建预约接口
@bp.route('/create', methods=['POST'])
@jwt_required
def create_reserve(user_id):
    data = request.json
    kitchen_id = data.get('kitchen_id')
    reserve_date = data.get('date')
    start_time = data.get('start_time')
    end_time = data.get('end_time')
    people_count = data.get('people_count', 1)  # 使用人数
    
    if not all([kitchen_id, reserve_date, start_time, end_time, people_count]):
        return jsonify({"code": 1, "msg": "请填写完整信息"})
    
    # 验证使用人数
    if people_count < 1:
        return jsonify({"code": 1, "msg": "使用人数必须大于等于1"})
    
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
    
    # 检查厨房是否存在
    kitchen = Kitchen.query.get(kitchen_id)
    if not kitchen:
        return jsonify({"code": 1, "msg": "厨房不存在"})
    
    # 检查厨房状态
    if kitchen.status != 'available':
        return jsonify({"code": 1, "msg": "厨房当前不可用"})
    
    # 检查是否与现有预约冲突
    conflicting_reserves = Reserve.query.filter(
        Reserve.kitchen_id == kitchen_id,
        Reserve.date == reserve_date,
        Reserve.status.in_(['pending', 'confirmed']),
        ((Reserve.start_time < end_time) & (Reserve.end_time > start_time))
    ).all()
    
    if conflicting_reserves:
        return jsonify({"code": 1, "msg": "该时间段已被预约，请选择其他时间"})
    
    # 计算预约时长（小时）
    duration = (end_time.hour * 60 + end_time.minute - start_time.hour * 60 - start_time.minute) / 60
    total_price = duration * kitchen.price_per_hour
    
    # 检查用户积分是否足够
    user = User.query.get(user_id)
    if not user:
        return jsonify({"code": 1, "msg": "用户不存在"})
    
    if user.credit < total_price:
        return jsonify({"code": 1, "msg": "积分不足，请先充值"})
    
    # 创建预约记录
    new_reserve = Reserve(
        user_id=user_id,
        kitchen_id=kitchen_id,
        date=reserve_date,
        start_time=start_time,
        end_time=end_time,
        people_count=people_count,
        total_price=total_price,
        status='confirmed'  # 直接确认
    )
    db.session.add(new_reserve)
    
    # 扣除用户积分
    user.credit -= int(total_price)
    
    # 记录积分变动
    credit_log = UserCreditLog(
        user_id=user_id,
        credit_change=-int(total_price),
        reason=f"预约厨房：{kitchen.name}"
    )
    db.session.add(credit_log)
    
    db.session.commit()
    
    return jsonify({"code": 0, "msg": "预约成功", "data": {"reserve_id": new_reserve.id}})

# 获取用户预约列表接口
@bp.route('/list', methods=['GET'])
@jwt_required
def get_reserve_list(user_id):
    reserves = Reserve.query.filter_by(user_id=user_id).order_by(Reserve.created_at.desc()).all()
    
    reserve_list = []
    for reserve in reserves:
        reserve_list.append({
            "id": reserve.id,
            "kitchen_name": reserve.kitchen.name,
            "date": reserve.date.isoformat(),
            "start_time": reserve.start_time.isoformat(),
            "end_time": reserve.end_time.isoformat(),
            "people_count": reserve.people_count,
            "total_price": reserve.total_price,
            "status": reserve.status,
            "created_at": reserve.created_at.strftime("%Y-%m-%d %H:%M:%S")
        })
    
    return jsonify({"code": 0, "msg": "获取成功", "data": reserve_list})

# 取消预约接口
@bp.route('/cancel', methods=['POST'])
@jwt_required
def cancel_reserve(user_id):
    data = request.json
    reserve_id = data.get('reserve_id')
    
    if not reserve_id:
        return jsonify({"code": 1, "msg": "预约ID不能为空"})
    
    # 查找预约记录
    reserve = Reserve.query.filter_by(id=reserve_id, user_id=user_id).first()
    if not reserve:
        return jsonify({"code": 1, "msg": "预约记录不存在"})
    
    # 检查预约状态
    if reserve.status not in ['pending', 'confirmed']:
        return jsonify({"code": 1, "msg": "该预约已完成或已取消"})
    
    # 取消预约
    reserve.status = 'cancelled'
    
    # 退还积分
    user = User.query.get(user_id)
    user.credit += int(reserve.total_price)
    
    # 记录积分变动
    credit_log = UserCreditLog(
        user_id=user_id,
        credit_change=int(reserve.total_price),
        reason=f"取消预约厨房：{reserve.kitchen.name}"
    )
    db.session.add(credit_log)
    
    db.session.commit()
    
    return jsonify({"code": 0, "msg": "预约已取消，积分已退还"})
