import React, { useState, useEffect } from 'react';
import { 
  Key, Shield, Copy, AlertCircle, Eye, EyeOff,
  CheckCircle, XCircle, ExternalLink 
} from 'lucide-react';

const APIConnectionPage = () => {
  // States
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);
  const [apiData, setApiData] = useState({
    exchange: 'binance',
    api_key: '',
    api_secret: '',
    name: 'Main Account'
  });
  const [connectedApis, setConnectedApis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // جلب APIs المتصلة
  useEffect(() => {
    fetchConnectedApis();
  }, []);

  const fetchConnectedApis = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/exchange/list');
      const data = await response.json();
      setConnectedApis(data);
    } catch (err) {
      setError('فشل في جلب APIs المتصلة');
      console.error(err);
    }
  };

  // التحقق من صحة وحفظ API
  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // التحقق من صحة API
      const validateResponse = await fetch('http://localhost:3000/api/exchange/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      });
      const validateData = await validateResponse.json();

      if (validateData.status === 'success') {
        // حفظ API
        const connectResponse = await fetch('http://localhost:3000/api/exchange/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiData)
        });
        const connectData = await connectResponse.json();

        if (connectData.status === 'success') {
          setValidationStatus('success');
          fetchConnectedApis();
          setApiData({
            exchange: 'binance',
            api_key: '',
            api_secret: '',
            name: ''
          });
        }
      } else {
        setValidationStatus('error');
        setError(validateData.message);
      }
    } catch (err) {
      setValidationStatus('error');
      setError('حدث خطأ في الاتصال');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setApiData({
      ...apiData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-white">
      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">Connect Exchange</h1>
          <p className="text-gray-400">Connect your exchange account to start trading</p>
        </div>
        {/* Security Notice */}
        <div className="bg-[#2d4a7c] rounded-lg p-4 mb-8 flex items-start space-x-4">
          <Shield className="w-6 h-6 text-emerald-500 flex-shrink-0" />
          <div>
            <h3 className="font-medium mb-1">Your Security is Our Priority</h3>
            <p className="text-gray-400 text-sm">
              All API keys are encrypted and stored securely. We never have access to your funds.
            </p>
          </div>
        </div>

        {/* Connection Steps */}
        <div className="bg-[#1c2c4f] rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium mb-4 flex items-center justify-between">
            Connect keys securely
            <a 
              href="#" 
              className="text-sm text-emerald-500 hover:text-emerald-400 flex items-center"
            >
              View Guide <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </h3>

          <div className="space-y-6">
            {/* IP Whitelist */}
            <div>
              <p className="text-sm text-gray-400 mb-2">
                1. Add these IP addresses to your API key whitelist
              </p>
              <div className="flex items-center bg-[#2d4a7c] rounded p-3">
                <code className="flex-1 font-mono">64.202.96.0/24</code>
                <button className="p-1 hover:bg-[#3d5a8c] rounded">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* API Form */}
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                2. Enter your API credentials
              </p>

              {/* Exchange Selection */}
              <div>
                <label className="block text-sm mb-2">Exchange</label>
                <select 
                  name="exchange"
                  value={apiData.exchange}
                  onChange={handleInputChange}
                  className="w-full bg-[#2d4a7c] border border-gray-700 rounded-lg px-4 py-3"
                >
                  <option value="binance">Binance</option>
                  <option value="binance_futures">Binance Futures</option>
                </select>
              </div>

              {/* API Key */}
              <div>
                <label className="block text-sm mb-2">API Key</label>
                <div className="relative">
                  <input 
                    type="text"
                    name="api_key"
                    value={apiData.api_key}
                    onChange={handleInputChange}
                    className="w-full bg-[#2d4a7c] border border-gray-700 rounded-lg px-4 py-3"
                    placeholder="Enter your API key"
                  />
                </div>
              </div>

              {/* API Secret */}
              <div>
                <label className="block text-sm mb-2">API Secret</label>
                <div className="relative">
                  <input 
                    type={showApiSecret ? "text" : "password"}
                    name="api_secret"
                    value={apiData.api_secret}
                    onChange={handleInputChange}
                    className="w-full bg-[#2d4a7c] border border-gray-700 rounded-lg px-4 py-3 pr-10"
                    placeholder="Enter your API secret"
                  />
                  <button 
                    onClick={() => setShowApiSecret(!showApiSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showApiSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Required Permissions */}
            <div className="bg-[#2d4a7c] rounded-lg p-4">
              <h4 className="font-medium mb-3">Required API Permissions</h4>
              <div className="space-y-2">
                <PermissionItem checked>Read Information</PermissionItem>
                <PermissionItem checked>Spot & Margin Trading</PermissionItem>
                <PermissionItem checked>Futures Trading</PermissionItem>
                <PermissionItem checked={false}>Withdraw</PermissionItem>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/20 text-red-400 p-4 rounded-lg">
                {error}
              </div>
            )}

            {/* Validation Status */}
            {validationStatus && (
              <div className={`rounded-lg p-4 ${
                validationStatus === 'success' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                <div className="flex items-center space-x-2">
                  {validationStatus === 'success' 
                    ? <CheckCircle className="w-5 h-5" />
                    : <XCircle className="w-5 h-5" />
                  }
                  <span>{validationStatus === 'success' 
                    ? 'API connected successfully' 
                    : 'Invalid API credentials'}</span>
                </div>
              </div>
            )}

            {/* Connect Button */}
            <button 
              onClick={handleConnect}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg font-medium disabled:opacity-50"
            >
              {loading ? 'Connecting...' : 'Connect Exchange'}
            </button>
          </div>
        </div>

        {/* Connected APIs */}
        <div className="bg-[#1c2c4f] rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Connected APIs</h3>
          
          <div className="space-y-4">
            {connectedApis.map((api, index) => (
              <ConnectedAPICard 
                key={index}
                exchange={api.exchange}
                name={api.name}
                lastUsed={api.created_at}
                status={api.status}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PermissionItem = ({ children, checked }) => (
  <div className="flex items-center space-x-2 text-sm">
    {checked ? (
      <CheckCircle className="w-4 h-4 text-emerald-500" />
    ) : (
      <XCircle className="w-4 h-4 text-gray-500" />
    )}
    <span className={checked ? 'text-gray-300' : 'text-gray-500'}>
      {children}
    </span>
  </div>
);

const ConnectedAPICard = ({ exchange, name, lastUsed, status }) => (
  <div className="flex items-center justify-between p-4 bg-[#2d4a7c] rounded-lg">
    <div className="flex items-center space-x-4">
      <Key className="w-5 h-5 text-gray-400" />
      <div>
        <h4 className="font-medium">{exchange}</h4>
        <p className="text-sm text-gray-400">Last used: {lastUsed}</p>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <span className={`px-3 py-1 rounded-full text-xs ${
        status === 'active' 
          ? 'bg-green-500/20 text-green-400' 
          : 'bg-yellow-500/20 text-yellow-400'
      }`}>
        {status === 'active' ? 'Active' : 'Update Required'}
      </span>
      <button className="p-2 hover:bg-[#3d5a8c] rounded-lg">
        <AlertCircle className="w-5 h-5" />
      </button>
    </div>
  </div>
);

export default APIConnectionPage;