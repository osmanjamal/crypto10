import React, { useState, useEffect } from 'react';

function BotSettings() {
  const [settings, setSettings] = useState({
    secret: "",
    max_lag: "",
    bot_uuid: "",
    currency_type: "base"
  });

  const [status, setStatus] = useState({ type: '', message: '' });

  // جلب الإعدادات عند تحميل الصفحة
  useEffect(() => {
    fetch('http://localhost:3000/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => {
        setStatus({ type: 'error', message: 'فشل في جلب الإعدادات' });
        console.error(err);
      });
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });

      const data = await response.json();
      
      if (response.ok) {
        setStatus({ type: 'success', message: 'تم حفظ الإعدادات بنجاح' });
      } else {
        setStatus({ type: 'error', message: data.detail || 'فشل في حفظ الإعدادات' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'خطأ في الاتصال بالخادم' });
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">إعدادات البوت</h2>
      
      {/* رسالة الحالة */}
      {status.message && (
        <div className={`p-4 rounded mb-6 ${
          status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {status.message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secret Key
            </label>
            <input
              type="text"
              value={settings.secret}
              onChange={(e) => setSettings({...settings, secret: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Lag (seconds)
            </label>
            <input
              type="text"
              value={settings.max_lag}
              onChange={(e) => setSettings({...settings, max_lag: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bot UUID
            </label>
            <input
              type="text"
              value={settings.bot_uuid}
              onChange={(e) => setSettings({...settings, bot_uuid: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency Type
            </label>
            <select
              value={settings.currency_type}
              onChange={(e) => setSettings({...settings, currency_type: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="base">Base</option>
              <option value="quote">Quote</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            حفظ الإعدادات
          </button>
        </div>
      </div>
    </div>
  );
}

export default BotSettings;