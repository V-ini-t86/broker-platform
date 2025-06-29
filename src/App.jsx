import { ConfigProvider } from 'antd';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { OrderPadProvider } from './contexts/OrderPadContext';
import './index.css';
import Dashboard from './pages/Dashboard';
import Error404 from './pages/Error404';
import LoginScreen from './pages/LoginScreen';

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          colorSuccess: '#52c41a',
          colorWarning: '#faad14',
          colorError: '#ff4d4f',
          colorInfo: '#1890ff',
          colorTextBase: '#000000',
          colorBgBase: '#ffffff',
          borderRadius: 8,
          wireframe: false,
        },
        components: {
          Layout: {
            siderBg: '#ffffff',
            headerBg: '#ffffff',
            bodyBg: '#f5f5f5',
          },
          Menu: {
            itemBg: 'transparent',
            itemSelectedBg: '#e6f7ff',
            itemHoverBg: '#f0f0f0',
          },
          Card: {
            headerBg: '#ffffff',
            bodyBg: '#ffffff',
          },
        },
      }}
    >
      <AuthProvider>
        <OrderPadProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/dashboard/*" element={<Dashboard />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/*" element={<Error404 />} />
              </Routes>
            </div>
          </Router>
        </OrderPadProvider>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;