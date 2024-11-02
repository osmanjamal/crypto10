from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import json
import os
from cryptography.fernet import Fernet

router = APIRouter()

# نموذج بيانات API
class ExchangeAPI(BaseModel):
    exchange: str
    api_key: str
    api_secret: str
    name: Optional[str] = None

# توليد مفتاح التشفير (يجب تخزينه بشكل آمن في الإنتاج)
ENCRYPTION_KEY = Fernet.generate_key()
fernet = Fernet(ENCRYPTION_KEY)

def encrypt_data(text: str) -> str:
    return fernet.encrypt(text.encode()).decode()

def decrypt_data(encrypted_text: str) -> str:
    return fernet.decrypt(encrypted_text.encode()).decode()

@router.post("/api/exchange/connect")
async def connect_exchange(api_data: ExchangeAPI):
    """ربط حساب البورصة"""
    try:
        # تشفير البيانات الحساسة
        encrypted_api_key = encrypt_data(api_data.api_key)
        encrypted_api_secret = encrypt_data(api_data.api_secret)

        # حفظ البيانات المشفرة
        api_info = {
            "exchange": api_data.exchange,
            "name": api_data.name,
            "api_key": encrypted_api_key,
            "api_secret": encrypted_api_secret,
            "created_at": datetime.now().isoformat(),
            "status": "active"
        }

        # حفظ في ملف (يمكن استبدالها بقاعدة بيانات)
        with open('exchange_apis.json', 'a') as f:
            json.dump(api_info, f)
            f.write('\n')

        return {"status": "success", "message": "تم ربط API بنجاح"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/exchange/list")
async def list_exchanges():
    """الحصول على قائمة APIs المتصلة"""
    try:
        apis = []
        if os.path.exists('exchange_apis.json'):
            with open('exchange_apis.json', 'r') as f:
                for line in f:
                    api = json.loads(line)
                    # نحذف البيانات الحساسة قبل الإرسال
                    api.pop('api_secret')
                    api['api_key'] = api['api_key'][:8] + '...'
                    apis.append(api)
        
        return apis

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/exchange/validate")
async def validate_api(api_data: ExchangeAPI):
    """التحقق من صحة بيانات API"""
    try:
        # هنا يمكنك إضافة التحقق الفعلي مع البورصة
        is_valid = True  # للتجربة فقط
        
        return {
            "status": "success" if is_valid else "error",
            "message": "تم التحقق بنجاح" if is_valid else "بيانات API غير صحيحة"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))