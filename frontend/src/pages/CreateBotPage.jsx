import React, { useState } from 'react';
import { 
  Save, AlertTriangle, ChevronRight, ChevronLeft,
  Code, Settings, LineChart
} from 'lucide-react';

const CreateBotPage = () => {
  const [step, setStep] = useState(1);
  const [botConfig, setBotConfig] = useState({
    name: '',
    description: '',
    exchange: 'binance',
    symbol: 'BTCUSDT',
    timeframe: '1h',
    strategy: 'custom',
    maxPositions: 1,
    riskPerTrade: 1,
    stopLoss: true,
    takeProfit: true
  });

  const handleInputChange = (e) => {
    setBotConfig({
      ...botConfig,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">إنشاء بوت جديد</h1>
        <p className="text-gray-400">قم بإعداد وتكوين البوت الخاص بك</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((num) => (
            <div 
              key={num}
              className={`flex items-center ${num !== 3 ? 'ml-4' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= num ? 'bg-emerald-600' : 'bg-[#2d4a7c]'
              }`}>
                {num}
              </div>
              {num !== 3 && (
                <div className={`w-24 h-1 ml-4 ${
                  step > num ? 'bg-emerald-600' : 'bg-[#2d4a7c]'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-gray-400">
          {step === 1 && 'المعلومات الأساسية'}
          {step === 2 && 'إعدادات التداول'}
          {step === 3 && 'الاستراتيجية'}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-[#1c2c4f] rounded-lg p-6">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm mb-2">اسم البوت</label>
              <input
                type="text"
                name="name"
                value={botConfig.name}
                onChange={handleInputChange}
                className="w-full bg-[#2d4a7c] border border-gray-700 rounded-lg px-4 py-2"
                placeholder="أدخل اسم البوت"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-2">الوصف</label>
              <textarea
                name="description"
                value={botConfig.description}
                onChange={handleInputChange}
                className="w-full bg-[#2d4a7c] border border-gray-700 rounded-lg px-4 py-2"
                placeholder="وصف مختصر للبوت"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">البورصة</label>
              <select
                name="exchange"
                value={botConfig.exchange}
                onChange={handleInputChange}
                className="w-full bg-[#2d4a7c] border border-gray-700 rounded-lg px-4 py-2"
              >
                <option value="binance">Binance</option>
                <option value="binance_futures">Binance Futures</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2">الرمز</label>
              <select
                name="symbol"
                value={botConfig.symbol}
                onChange={handleInputChange}
                className="w-full bg-[#2d4a7c] border border-gray-700 rounded-lg px-4 py-2"
              >
                <option value="BTCUSDT">BTC/USDT</option>
                <option value="ETHUSDT">ETH/USDT</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2">الإطار الزمني</label>
                <select
                  name="timeframe"
                  value={botConfig.timeframe}
                  onChange={handleInputChange}
                  className="w-full bg-[#2d4a7c] border border-gray-700 rounded-lg px-4 py-2"
                >
                  <option value="1m">1 دقيقة</option>
                  <option value="5m">5 دقائق</option>
                  <option value="15m">15 دقيقة</option>
                  <option value="1h">1 ساعة</option>
                  <option value="4h">4 ساعات</option>
                  <option value="1d">يومي</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">أقصى عدد للصفقات</label>
                <input
                  type="number"
                  name="maxPositions"
                  value={botConfig.maxPositions}
                  onChange={handleInputChange}
                  className="w-full bg-[#2d4a7c] border border-gray-700 rounded-lg px-4 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">نسبة المخاطرة لكل صفقة (%)</label>
              <input
                type="number"
                name="riskPerTrade"
                value={botConfig.riskPerTrade}
                onChange={handleInputChange}
                className="w-full bg-[#2d4a7c] border border-gray-700 rounded-lg px-4 py-2"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#2d4a7c] rounded-lg">
                <div>
                  <h4 className="font-medium">وقف الخسارة التلقائي</h4>
                  <p className="text-sm text-gray-400">تفعيل وقف الخسارة لكل الصفقات</p>
                </div>
                <Switch 
                  enabled={botConfig.stopLoss}
                  onChange={(enabled) => setBotConfig({...botConfig, stopLoss: enabled})}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#2d4a7c] rounded-lg">
                <div>
                  <h4 className="font-medium">جني الأرباح التلقائي</h4>
                  <p className="text-sm text-gray-400">تفعيل جني الأرباح لكل الصفقات</p>
                </div>
                <Switch 
                  enabled={botConfig.takeProfit}
                  onChange={(enabled) => setBotConfig({...botConfig, takeProfit: enabled})}
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm mb-2">نوع الاستراتيجية</label>
              <select
                name="strategy"
                value={botConfig.strategy}
                onChange={handleInputChange}
                className="w-full bg-[#2d4a7c] border border-gray-700 rounded-lg px-4 py-2"
              >
                <option value="custom">مخصص</option>
                <option value="rsi">RSI</option>
                <option value="macd">MACD</option>
                <option value="bb">Bollinger Bands</option>
              </select>
            </div>

            {botConfig.strategy === 'custom' && (
              <div className="bg-[#2d4a7c] p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <Code size={20} />
                  <h4 className="font-medium">Pine Script</h4>
                </div>
                <textarea
                  className="w-full bg-[#1a1f2e] text-gray-300 p-4 rounded-lg font-mono"
                  rows="10"
                  placeholder="//@version=5
study('My Script')
// Add your Pine Script code here..."
                />
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center px-6 py-2 bg-[#2d4a7c] hover:bg-[#3d5a8c] rounded-lg"
            >
              <ChevronRight className="ml-2" size={20} />
              السابق
            </button>
          )}
          
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg mr-auto"
            >
              التالي
              <ChevronLeft className="mr-2" size={20} />
            </button>
          ) : (
            <button
              onClick={() => console.log('Saving bot configuration:', botConfig)}
              className="flex items-center px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg mr-auto"
            >
              <Save className="ml-2" size={20} />
              إنشاء البوت
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Switch = ({ enabled, onChange }) => (
  <div 
    onClick={() => onChange(!enabled)}
    className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors ${
      enabled ? 'bg-emerald-600' : 'bg-[#1a1f2e]'
    }`}
  >
    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
      enabled ? 'translate-x-5' : ''
    }`} />
  </div>
);

export default CreateBotPage;