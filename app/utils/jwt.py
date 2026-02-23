import jwt
import datetime
from flask import current_app

# JWT密钥
JWT_SECRET = 'campus_kitchen_secret_key'
# JWT过期时间（小时）
JWT_EXPIRES_HOURS = 24

def generate_token(user_id):
    """生成JWT token"""
    # 设置过期时间
    expire_time = datetime.datetime.utcnow() + datetime.timedelta(hours=JWT_EXPIRES_HOURS)
    
    # 构建payload
    payload = {
        'user_id': user_id,
        'exp': expire_time,
        'iat': datetime.datetime.utcnow()
    }
    
    # 生成token
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
    
    return token

def verify_token(token):
    """验证JWT token"""
    try:
        # 解码token
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return {
            'valid': True,
            'user_id': payload.get('user_id')
        }
    except jwt.ExpiredSignatureError:
        # token过期
        return {'valid': False, 'message': 'Token已过期'}
    except jwt.InvalidTokenError:
        # token无效
        return {'valid': False, 'message': 'Token无效'}
    except Exception as e:
        # 其他错误
        return {'valid': False, 'message': str(e)}
