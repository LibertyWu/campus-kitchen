# 统一响应格式工具

def success_response(data=None, msg="操作成功"):
    """成功响应"""
    return {
        "code": 0,
        "msg": msg,
        "data": data
    }

def error_response(msg="操作失败", code=1):
    """错误响应"""
    return {
        "code": code,
        "msg": msg,
        "data": None
    }
