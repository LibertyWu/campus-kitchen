from functools import wraps
from flask import request, jsonify
from app.utils.jwt import verify_token

# JWT认证装饰器
def jwt_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # 从请求头获取token
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({"code": 401, "msg": "请先登录"})
        
        # 移除Bearer前缀
        if token.startswith('Bearer '):
            token = token[7:]
        
        # 验证token
        result = verify_token(token)
        if not result['valid']:
            return jsonify({"code": 401, "msg": result['message']})
        
        # 将用户ID传递给视图函数
        kwargs['user_id'] = result['user_id']
        return f(*args, **kwargs)
    return decorated_function
