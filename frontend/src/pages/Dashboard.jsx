import React, { useState, useEffect } from 'react';
import { Activity, DollarSign, TrendingUp, Clock } from 'lucide-react';

function Dashboard() {
  const [accountData, setAccountData] = useState(null);
  const [stats, setStats] = useState({
    totalTrades: 0,
    winRate: 0,
    profitLoss: 0
  });
  const [activeTrades, setActiveTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // تحديث كل 10 ثواني
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      // جلب بيانات الحساب
      const balanceRes = await fetch('http://localhost:3000/api/account/balance');
      const balanceData = await balanceRes.json();
      
      // جلب الصفقات النشطة
      const ordersRes = await fetch('http://localhost:3000/api/trading/active-orders');
      const ordersData = await ordersRes.json();

      // تحديث البيانات
      setAccountData(balanceData);
      setActiveTrades(ordersData.map(order => ({
        symbol: order.symbol,
        position: order.side,
        amount: order.quantity.toString(),
        entryPrice: order.price?.toString() || 'Market',
        currentPrice: '--',
        pnl: '--'
      })));
      
      setStats({
        totalTrades: ordersData.length,
        winRate: calculateWinRate(ordersData),
        profitLoss: balanceData.total_usd
      });

      setLastUpdate(new Date());
      setIsConnected(true);
      setError(null);
    } catch (err) {
      setError('فشل في جلب البيانات');
      setIsConnected(false);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateWinRate = (orders) => {
    if (!orders.length) return 0;
    const profitableOrders = orders.filter(order => 
      parseFloat(order.pnl || 0) > 0
    ).length;
    return Math.round((profitableOrders / orders.length) * 100);
  };

  if (loading) return <div className="text-white">جاري التحميل...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-white">
      <h2 className="text-2xl font-bold mb-6">لوحة التحكم</h2>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1c2c4f] p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">إجمالي الصفقات</h3>
            <Clock className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-3xl font-bold">{stats.totalTrades}</p>
        </div>

        <div className="bg-[#1c2c4f] p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">نسبة الربح</h3>
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
          <p className="text-3xl font-bold">{stats.winRate}%</p>
        </div>

        <div className="bg-[#1c2c4f] p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">الرصيد الكلي</h3>
            <DollarSign className="h-6 w-6 text-purple-500" />
          </div>
          <p className={`text-3xl font-bold ${stats.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${stats.profitLoss.toFixed(2)}
          </p>
        </div>
      </div>

      {/* حالة البوت */}
      <div className="bg-[#1c2c4f] rounded-lg mb-8 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">حالة البوت</h3>
          <div className="flex items-center">
            <span className={`h-3 w-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm text-gray-400">{isConnected ? 'نشط' : 'غير متصل'}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">آخر تحديث</p>
            <p className="font-medium">{new Date(lastUpdate).toLocaleTimeString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">حالة الاتصال</p>
            <p className="font-medium">{isConnected ? 'متصل' : 'غير متصل'}</p>
          </div>
        </div>
      </div>

      {/* جدول الصفقات النشطة */}
      <div className="bg-[#1c2c4f] rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">الصفقات النشطة</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-400">
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase">الرمز</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase">الموقف</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase">الكمية</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase">سعر الدخول</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase">السعر الحالي</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase">الربح/الخسارة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {activeTrades.map((trade, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4">{trade.symbol}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        trade.position === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {trade.position}
                      </span>
                    </td>
                    <td className="px-6 py-4">{trade.amount}</td>
                    <td className="px-6 py-4">{trade.entryPrice}</td>
                    <td className="px-6 py-4">{trade.currentPrice}</td>
                    <td className={`px-6 py-4 ${
                      trade.pnl.startsWith('+') ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {trade.pnl}
                    </td>
                  </tr>
                ))}
                {activeTrades.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                      لا توجد صفقات نشطة
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;