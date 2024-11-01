from fastapi import APIRouter, HTTPException
from binance.client import Client
from binance.exceptions import BinanceAPIException
from typing import Dict
import os

router = APIRouter()

class BinanceManager:
    _instance = None
    _client = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = BinanceManager()
        return cls._instance

    def set_credentials(self, api_key: str, api_secret: str):
        self._client = Client(api_key, api_secret)

    def get_client(self):
        if not self._client:
            raise HTTPException(status_code=400, detail="Binance API not configured")
        return self._client

@router.post("/api/binance/connect")
async def connect_binance(credentials: Dict[str, str]):
    try:
        # إنشاء عميل Binance للتحقق من صحة المفاتيح
        client = Client(credentials['api_key'], credentials['api_secret'])
        # اختبار الاتصال
        client.get_account()
        
        # حفظ المفاتيح بشكل آمن (يمكنك استخدام قاعدة بيانات)
        BinanceManager.get_instance().set_credentials(
            credentials['api_key'],
            credentials['api_secret']
        )
        
        return {"status": "success", "message": "تم الاتصال بنجاح"}
    except BinanceAPIException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/account/balance")
async def get_account_balance():
    try:
        client = BinanceManager.get_instance().get_client()
        account = client.get_account()
        
        # تحويل البيانات
        balances = [
            {
                'asset': balance['asset'],
                'free': float(balance['free']),
                'locked': float(balance['locked'])
            }
            for balance in account['balances']
            if float(balance['free']) > 0 or float(balance['locked']) > 0
        ]

        # الحصول على أسعار USDT
        prices = client.get_symbol_ticker()
        price_dict = {item['symbol']: float(item['price']) for item in prices}

        # حساب القيمة بالدولار
        for balance in balances:
            if balance['asset'] == 'USDT':
                balance['usd_value'] = balance['free'] + balance['locked']
            else:
                symbol = f"{balance['asset']}USDT"
                if symbol in price_dict:
                    balance['usd_value'] = (balance['free'] + balance['locked']) * price_dict[symbol]
                else:
                    balance['usd_value'] = 0

        total_usd = sum(b['usd_value'] for b in balances)

        return {
            "balances": balances,
            "total_usd": total_usd
        }
    except BinanceAPIException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/trading/active-orders")
async def get_active_orders():
    try:
        client = BinanceManager.get_instance().get_client()
        orders = client.get_open_orders()
        
        return [{
            "symbol": order['symbol'],
            "side": order['side'],
            "type": order['type'],
            "quantity": float(order['origQty']),
            "price": float(order['price']) if order['price'] != '0' else None,
            "created_at": order['time']
        } for order in orders]
    except BinanceAPIException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.get("/api/account/balance")
async def get_account_balance():
    try:
        client = BinanceManager.get_instance().get_client()
        account = client.get_account()
        # طباعة للتشخيص
        print("Account data:", account)
        
        balances = [
            {
                'asset': balance['asset'],
                'free': float(balance['free']),
                'locked': float(balance['locked'])
            }
            for balance in account['balances']
            if float(balance['free']) > 0 or float(balance['locked']) > 0
        ]

        prices = client.get_symbol_ticker()
        price_dict = {item['symbol']: float(item['price']) for item in prices}

        # طباعة للتشخيص
        print("Balances:", balances)
        print("Prices:", price_dict)

        total_usd = sum(
            balance['usd_value'] 
            for balance in balances 
            if 'usd_value' in balance
        )

        return {
            "balances": balances,
            "total_usd": total_usd
        }
    except BinanceAPIException as e:
        print("Binance API Error:", str(e))  # طباعة خطأ Binance
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print("General Error:", str(e))  # طباعة الخطأ العام
        raise HTTPException(status_code=500, detail=str(e))

