import { Button, Result } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button
            type="default"
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}
          >
            Back Home
          </Button>
        }
      />
    </div>
  );
};

export default Error404;