import { Layout } from 'antd';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navigation from '../components/common/Navigation';
import Holdings from './Holdings';
import Orderbook from './Orderbook';
import Positions from './Positions';

const { Content } = Layout;

const Dashboard = () => {
  return (
    <Layout className="min-h-screen">
      <Layout>
        <Content className="p-6 bg-gray-50 mb-12">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard/holdings" replace />} />
            <Route path="/holdings" element={<Holdings />} />
            <Route path="/orderbook" element={<Orderbook />} />
            <Route path="/positions" element={<Positions />} />
          </Routes>
        </Content>
        <Navigation />
      </Layout>
    </Layout>
  );
};

export default Dashboard;