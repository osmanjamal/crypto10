import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Activity, Settings, Key } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import BotSettings from './pages/BotSettings';
import APIConnectionPage from './pages/APIConnectionPage';

function App() {
  const [isNavVisible, setIsNavVisible] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#1a1f2e]">
        {/* شريط رفيع دائماً ظاهر */}
        <div 
          className="fixed top-0 right-0 w-2 h-full bg-[#1c2c4f] z-40"
          onMouseEnter={() => setIsNavVisible(true)}
        />

        {/* القائمة الجانبية التي تظهر عند hover */}
        <nav 
          className={`fixed top-0 right-0 w-64 h-full bg-[#1c2c4f] p-6 transition-transform duration-300 z-30 transform ${
            isNavVisible ? 'translate-x-0' : 'translate-x-64'
          }`}
          onMouseLeave={() => setIsNavVisible(false)}
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">TradingView Bot</h1>
          </div>
          <ul className="space-y-2">
            <li>
              <Link 
                to="/" 
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#2d4a7c] rounded-lg"
                onClick={() => setIsNavVisible(false)}
              >
                <Activity className="ml-3" size={20} />
                <span>لوحة التحكم</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/settings" 
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#2d4a7c] rounded-lg"
                onClick={() => setIsNavVisible(false)}
              >
                <Settings className="ml-3" size={20} />
                <span>إعدادات البوت</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/api-connection" 
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#2d4a7c] rounded-lg"
                onClick={() => setIsNavVisible(false)}
              >
                <Key className="ml-3" size={20} />
                <span>ربط API</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* المحتوى الرئيسي */}
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/settings" element={<BotSettings />} />
            <Route path="/api-connection" element={<APIConnectionPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;