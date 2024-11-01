import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Settings, Clock, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Dashboard = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [stats, setStats] = useState({
    totalTrades: 0,
    winRate: 0,
    profitLoss: 0
  });
  const [isConnected, setIsConnected] = useState(true);

  // محاكاة البيانات - استبدل هذا بطلبات API حقيقية
  useEffect(() => {
    // محاكاة بيانات التداول
    const mockTradeHistory = [
      { date: '2024-01', profit: 150 },
      { date: '2024-02', profit: 280 },
      { date: '2024-03', profit: -50 },
      { date: '2024-04', profit: 420 }
    ];
    setTradeHistory(mockTradeHistory);

    // محاكاة الإحصائيات
    setStats({
      totalTrades: 45,
      winRate: 67,
      profitLoss: 800
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* رأس الصفحة */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم</h1>
        <p className="text-gray-600">مراقبة وإدارة التداول الآلي</p>
      </div>

      {/* حالة الاتصال */}
      {isConnected ? (
        <Alert className="mb-4 bg-green-50">
          <Activity className="h-4 w-4" />
          <AlertDescription>متصل بـ Binance وجاهز للتداول</AlertDescription>
        </Alert>
      ) : (
        <Alert className="mb-4 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>غير متصل! تحقق من إعدادات API</AlertDescription>
        </Alert>
      )}

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الصفقات</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTrades}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نسبة الربح</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.winRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الربح/الخسارة</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${stats.profitLoss}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* رسم بياني للأرباح */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>تاريخ الأرباح</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tradeHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* الصفقات النشطة */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>الصفقات النشطة</CardTitle>
          <Settings className="h-4 w-4 text-gray-500 cursor-pointer" />
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">الرمز</th>
                  <th className="px-6 py-3">النوع</th>
                  <th className="px-6 py-3">الكمية</th>
                  <th className="px-6 py-3">السعر</th>
                  <th className="px-6 py-3">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {activeOrders.length === 0 ? (
                  <tr className="bg-white border-b">
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      لا توجد صفقات نشطة
                    </td>
                  </tr>
                ) : (
                  activeOrders.map((order, index) => (
                    <tr key={index} className="bg-white border-b">
                      <td className="px-6 py-4">{order.symbol}</td>
                      <td className="px-6 py-4">{order.type}</td>
                      <td className="px-6 py-4">{order.amount}</td>
                      <td className="px-6 py-4">{order.price}</td>
                      <td className="px-6 py-4">{order.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;