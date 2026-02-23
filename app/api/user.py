from flask import Blueprint, request, jsonify
from app.models import db, User, UserCreditLog
from app.utils.jwt import generate_token
from datetime import datetime

# 创建蓝图
bp = Blueprint('user', __name__)

# 登录接口
@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')  # 可以是用户名或手机号
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"code": 1, "msg": "用户名/手机号和密码不能为空"})
    
    # 查询用户（支持用户名或手机号登录）
    user = User.query.filter((User.username == username) | (User.phone == username)).first()
    if not user:
        return jsonify({"code": 1, "msg": "用户不存在"})
    
    # 验证密码（这里简化处理，实际应该使用密码哈希）
    if user.password != password:
        return jsonify({"code": 1, "msg": "密码错误"})
    
    # 生成token
    token = generate_token(user.id)
    
    # 返回用户信息和token
    return jsonify({
        "code": 0, 
        "msg": "登录成功", 
        "data": {
            "id": user.id,
            "username": user.username,
            "name": user.name,
            "student_id": user.student_id,
            "phone": user.phone,
            "credit": user.credit,
            "avatar": user.avatar,
            "token": token
        }
    })

# 注册接口
@bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    name = data.get('name')
    student_id = data.get('student_id')
    phone = data.get('phone')
    
    # 验证参数
    if not all([username, password, name, student_id, phone]):
        return jsonify({"code": 1, "msg": "请填写完整信息"})
    
    # 检查用户是否已存在
    if User.query.filter_by(username=username).first():
        return jsonify({"code": 1, "msg": "用户名已存在"})
    
    if User.query.filter_by(student_id=student_id).first():
        return jsonify({"code": 1, "msg": "学号已被注册"})
    
    # 创建新用户
    new_user = User(
        username=username,
        password=password,  # 实际应用中应该使用密码哈希
        name=name,
        student_id=student_id,
        phone=phone
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    # 记录积分变动
    credit_log = UserCreditLog(
        user_id=new_user.id,
        credit_change=100,  # 初始积分100
        reason="用户注册"
    )
    db.session.add(credit_log)
    db.session.commit()
    
    return jsonify({"code": 0, "msg": "注册成功", "data": {"username": username}})

# 获取用户信息接口
@bp.route('/info', methods=['GET'])
def get_user_info():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"code": 1, "msg": "用户ID不能为空"})
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"code": 1, "msg": "用户不存在"})
    
    return jsonify({
        "code": 0, 
        "msg": "获取成功", 
        "data": {
            "id": user.id,
            "username": user.username,
            "name": user.name,
            "student_id": user.student_id,
            "phone": user.phone,
            "credit": user.credit
        }
    })

# 获取用户积分记录接口
@bp.route('/credit/logs', methods=['GET'])
def get_credit_logs():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"code": 1, "msg": "用户ID不能为空"})
    
    logs = UserCreditLog.query.filter_by(user_id=user_id).order_by(UserCreditLog.created_at.desc()).all()
    
    log_list = []
    for log in logs:
        log_list.append({
            "id": log.id,
            "credit_change": log.credit_change,
            "reason": log.reason,
            "created_at": log.created_at.strftime("%Y-%m-%d %H:%M:%S")
        })
    
    return jsonify({"code": 0, "msg": "获取成功", "data": log_list})

# 第三方登录接口
@bp.route('/third/login', methods=['POST'])
def third_login():
    data = request.json
    login_type = data.get('login_type')  # wechat, alipay
    openid = data.get('openid')
    nickname = data.get('nickname')
    avatar = data.get('avatar')
    
    if not login_type or not openid:
        return jsonify({"code": 1, "msg": "登录类型和openid不能为空"})
    
    # 检查用户是否已存在
    user = User.query.filter_by(openid=openid).first()
    
    if not user:
        # 新用户，创建账号
        # 生成随机用户名
        import random
        import string
        username = f"{login_type}_{''.join(random.choices(string.ascii_letters + string.digits, k=8))}"
        
        # 创建用户
        user = User(
            username=username,
            password='',  # 第三方登录无需密码
            name=nickname or username,
            student_id=f"{login_type}_{openid[:10]}",
            phone=f"{login_type}_{openid[:10]}",  # 临时手机号
            avatar=avatar,
            login_type=login_type,
            openid=openid
        )
        db.session.add(user)
        db.session.commit()
        
        # 记录积分变动
        credit_log = UserCreditLog(
            user_id=user.id,
            credit_change=100,  # 初始积分100
            reason="用户注册"
        )
        db.session.add(credit_log)
        db.session.commit()
    
    # 生成token
    token = generate_token(user.id)
    
    # 返回用户信息和token
    return jsonify({
        "code": 0, 
        "msg": "登录成功", 
        "data": {
            "id": user.id,
            "username": user.username,
            "name": user.name,
            "student_id": user.student_id,
            "phone": user.phone,
            "credit": user.credit,
            "avatar": user.avatar,
            "token": token
        }
    })
