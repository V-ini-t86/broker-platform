import { Button, Card, Form, Input, message, Space, Typography } from 'antd';
import { TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { brokers } from '../const/common.const';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

const LoginScreen = () => {
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleBrokerSelect = (brokerId) => {
    setSelectedBroker(brokerId);
  };

  const onFinish = async (values) => {
    if (!selectedBroker) {
      message.warning('Please select a broker first');
      return;
    }

    setLoading(true);
    try {
      // const response = await getAuthDetails(values)
      const response = {
        data: { ...values },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
        request: {}
      }

      if (response.status >= 400 && response.status < 500) {
        message.error('Invalid credentials. Please check your email and password.');
        return;
      } else if (response.status >= 500) {
        message.error('Server error. Please try again later.');
        return;
      } else if (response.status === 200) {
        try {
          await login(selectedBroker, values);
          message.success('Login successful!');
          navigate('/dashboard');
        } catch (loginError) {
          console.error('Login error:', loginError);
          message.error('Failed to authenticate with broker. Please try again.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Login failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <Card className="max-w-md w-full shadow-lg border-0">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-xl mb-6">
            <TrendingUp size={32} className="text-white" />
          </div>
          <Title level={1} className="!text-gray-800 !mb-2">
            BrokerPlatform
          </Title>
          <Text className="text-gray-500">
            Connect with your broker to get started
          </Text>
        </div>

        <div className="mb-6">
          <Title level={2} className="!text-gray-800 !mb-6">
            Log in with your broker
          </Title>

          {!selectedBroker ? (
            <div>
              {/* <Text className="text-gray-600 block mb-6">
                First, choose your broker to continue
              </Text> */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {brokers.map((broker) => (
                  <div
                    key={broker.id}
                    className="p-3 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:border-blue-300 hover:bg-blue-50"
                    onClick={() => handleBrokerSelect(broker.id)}
                  >
                    <div className="text-center">
                      <div className="text-xl mb-1 flex justify-center">
                        <img src={broker.logo} />
                      </div>
                      <div className="text-gray-800 text-xs font-medium mb-1">
                        {broker.name}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {broker.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <Text className="text-gray-600 text-sm">
                  Selected broker: {brokers.find(b => b.id === selectedBroker)?.name}
                </Text>
                <Button
                  type="link"
                  size="small"
                  className="!text-blue-500 !p-0 !ml-2"
                  onClick={() => setSelectedBroker(null)}
                >
                  Change
                </Button>
              </div>

              <Space direction="vertical" size="middle" className="w-full">
                <Form
                  onFinish={onFinish}
                  layout={'vertical'}
                  className="w-full"
                >
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!', type: "email" }]}
                  >
                    <Input className="w-full" />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                  >
                    <Input.Password className="w-full" />
                  </Form.Item>

                  <Form.Item className="mb-0">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="w-full h-10 bg-blue-500 hover:bg-blue-600"
                      loading={loading}
                    >
                      Log in
                    </Button>
                  </Form.Item>
                </Form>
              </Space>

              <div className="text-center mt-8">
                <Text className="text-gray-500 text-sm">
                  Don't have an account?{' '}
                  <Button type="link" className="!text-blue-500 !p-0">
                    Sign up
                  </Button>
                </Text>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default LoginScreen;