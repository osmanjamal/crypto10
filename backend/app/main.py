from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
from binance.client import Client
import hmac
import hashlib
import time
import os
from dotenv import load_dotenv 
from routers import dashboard


load_dotenv()

app = FastAPI(title="TradingView Bot")




app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)



# نموذج بيانات الويب هوك
class WebhookData(BaseModel):
    secret: str
    max_lag: str
    timestamp: str
    trigger_price: str
    tv_exchange: str
    tv_instrument: str
    action: str
    bot_uuid: str
    strategy_info: Dict[str, Any]
    order: Dict[str, Any]

# تهيئة عميل Binance
binance_client = Client(
    os.getenv('BINANCE_API_KEY'),
    os.getenv('BINANCE_API_SECRET')
)

def validate_webhook_secret(secret: str) -> bool:
    """التحقق من صحة سر الويب هوك"""
    expected_secret = os.getenv('WEBHOOK_SECRET')
    return hmac.compare_digest(secret, expected_secret)

def check_signal_lag(timestamp: str, max_lag: str) -> bool:
    """التحقق من تأخير الإشارة"""
    current_time = time.time()
    signal_time = float(timestamp)
    max_lag_seconds = float(max_lag)
    return (current_time - signal_time) <= max_lag_seconds

@app.post("/webhook")
async def webhook_handler(data: WebhookData):
    """معالج الويب هوك الرئيسي"""
    # التحقق من السر
    if not validate_webhook_secret(data.secret):
        raise HTTPException(status_code=401, detail="Invalid secret")

    # التحقق من تأخير الإشارة
    if not check_signal_lag(data.timestamp, data.max_lag):
        raise HTTPException(status_code=400, detail="Signal too old")

    try:
        # تحضير معلومات الأمر
        symbol = data.tv_instrument
        side = data.action.upper()  # BUY or SELL
        quantity = float(data.order['amount'])

        # تنفيذ الأمر على Binance
        order = binance_client.create_order(
            symbol=symbol,
            side=side,
            type='MARKET',
            quantity=quantity
        )

        # تخزين معلومات الصفقة
        trade_info = {
            'bot_uuid': data.bot_uuid,
            'order_id': order['orderId'],
            'symbol': symbol,
            'side': side,
            'quantity': quantity,
            'position': data.strategy_info['market_position'],
            'timestamp': time.time()
        }
        
        # هنا يمكنك إضافة كود لتخزين trade_info في قاعدة البيانات

        return {
            "status": "success",
            "order": order,
            "trade_info": trade_info
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """نقطة نهاية للتحقق من صحة التطبيق"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
