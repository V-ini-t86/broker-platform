import React, { useState, useEffect } from 'react';
import { Card, Table, Space, Tag, Button, Select, Statistic, Row, Col, Modal, Form, InputNumber, Input, Progress } from 'antd';
import { Plus, Minus, TrendingUp, TrendingDown, DollarSign, Target, RefreshCw, BarChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import OrderPad from '../components/OrderPad';
import { useOrderPad } from '../contexts/OrderPadContext';

const Positions = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('open');
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [activeTrades, setActiveTrades] = useState([]);
  const { isOrderPadOpen, orderSymbol, orderSide, openOrderPad, closeOrderPad } = useOrderPad();
  const [form] = Form.useForm();

  const mockPositions = [
    {
      key: '1',
      symbol: 'AAPL',
      side: 'long',
      quantity: 500,
      entryPrice: 148.50,
      currentPrice: 152.30,
      marketValue: 76150,
      unrealizedPL: 1900,
      unrealizedPLPercent: 2.56,
      margin: 15230,
      leverage: 5,
    },
    {
      key: '2',
      symbol: 'TSLA',
      side: 'short',
      quantity: 200,
      entryPrice: 190.00,
      currentPrice: 185.40,
      marketValue: -37080,
      unrealizedPL: 920,
      unrealizedPLPercent: 2.42,
      margin: 7416,
      leverage: 5,
    },
    {
      key: '3',
      symbol: 'GOOGL',
      side: 'long',
      quantity: 100,
      entryPrice: 2680.00,
      currentPrice: 2720.50,
      marketValue: 272050,
      unrealizedPL: 4050,
      unrealizedPLPercent: 1.51,
      margin: 54410,
      leverage: 5,
    },
    {
      key: '4',
      symbol: 'MSFT',
      side: 'short',
      quantity: 150,
      entryPrice: 315.00,
      currentPrice: 305.20,
      marketValue: -45780,
      unrealizedPL: 1470,
      unrealizedPLPercent: 3.11,
      margin: 9156,
      leverage: 5,
    },
  ];

  const totalPL = mockPositions.reduce((sum, pos) => sum + pos.unrealizedPL, 0);
  const totalMargin = mockPositions.reduce((sum, pos) => sum + pos.margin, 0);
  const totalValue = mockPositions.reduce((sum, pos) => sum + Math.abs(pos.marketValue), 0);

  const columns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (symbol, record) => (
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-gray-800">{symbol}</div>
            <Tag color={record.side === 'long' ? 'green' : 'red'} size="small">
              {record.side.toUpperCase()}
            </Tag>
          </div>
          <div className="flex space-x-1">
            <Button 
              type="text" 
              size="small" 
              className="text-green-600 hover:bg-green-50"
              icon={<ArrowUpRight size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                openOrderPad(symbol, 'buy');
              }}
            />
            <Button 
              type="text" 
              size="small" 
              className="text-red-600 hover:bg-red-50"
              icon={<ArrowDownRight size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                openOrderPad(symbol, 'sell');
              }}
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right',
      render: (quantity, record) => (
        <div className={record.side === 'long' ? 'text-green-600' : 'text-red-600'}>
          {record.side === 'long' ? '+' : '-'}{quantity.toLocaleString()}
        </div>
      ),
    },
    {
      title: 'Entry Price',
      dataIndex: 'entryPrice',
      key: 'entryPrice',
      align: 'right',
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Current Price',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      align: 'right',
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Market Value',
      dataIndex: 'marketValue',
      key: 'marketValue',
      align: 'right',
      render: (value) => (
        <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
          ${Math.abs(value).toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Unrealized P&L',
      dataIndex: 'unrealizedPL',
      key: 'unrealizedPL',
      align: 'right',
      render: (pl, record) => (
        <div className={pl >= 0 ? 'text-green-600' : 'text-red-600'}>
          <div className="flex items-center justify-end">
            {pl >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
            ${Math.abs(pl).toLocaleString()}
          </div>
          <div className="text-sm">
            {record.unrealizedPLPercent >= 0 ? '+' : ''}{record.unrealizedPLPercent.toFixed(2)}%
          </div>
        </div>
      ),
    },
    {
      title: 'Margin',
      dataIndex: 'margin',
      key: 'margin',
      align: 'right',
      render: (margin) => `$${margin.toLocaleString()}`,
    },
    {
      title: 'Leverage',
      dataIndex: 'leverage',
      key: 'leverage',
      align: 'center',
      render: (leverage) => (
        <Tag color="blue">{leverage}x</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<Plus size={14} />}
            onClick={() => handleOpenModal('open', record)}
          >
            Add
          </Button>
          <Button
            size="small"
            icon={<Minus size={14} />}
            onClick={() => handleOpenModal('close', record)}
            danger
          >
            Close
          </Button>
        </Space>
      ),
    },
  ];

  const handleOpenModal = (type, position) => {
    setModalType(type);
    setSelectedPosition(position || null);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleModalSubmit = async (values) => {
    console.log('Form values:', values);
    setIsModalOpen(false);
    // In a real app, this would make an API call
  };

  // Generate active trades data
  const generateActiveTrades = () => {
    return [
      {
        id: 1,
        symbol: 'AAPL',
        entryTime: '10:30 AM',
        duration: '2h 15m',
        pnl: 325.50,
        pnlPercent: 1.8
      },
      {
        id: 2,
        symbol: 'TSLA',
        entryTime: '11:45 AM',
        duration: '45m',
        pnl: -120.75,
        pnlPercent: -0.9
      },
      {
        id: 3,
        symbol: 'GOOGL',
        entryTime: '9:15 AM',
        duration: '3h 30m',
        pnl: 780.25,
        pnlPercent: 2.4
      },
      {
        id: 4,
        symbol: 'MSFT',
        entryTime: '1:20 PM',
        duration: '25m',
        pnl: 150.80,
        pnlPercent: 0.7
      }
    ];
  };

  useEffect(() => {
    setActiveTrades(generateActiveTrades());
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setActiveTrades(generateActiveTrades());
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <OrderPad 
        isOpen={isOrderPadOpen} 
        onClose={closeOrderPad} 
        initialSymbol={orderSymbol} 
        initialSide={orderSide} 
      />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Positions</h1>
        <Space>
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => handleOpenModal('open')}
          >
            Open Position
          </Button>
          <Button
            icon={<RefreshCw size={16} />}
            loading={loading}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total P&L"
              value={totalPL}
              precision={2}
              prefix={totalPL >= 0 ? '+$' : '-$'}
              valueStyle={{ color: totalPL >= 0 ? '#3f8600' : '#cf1322' }}
              suffix={totalPL >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Margin Used"
              value={totalMargin}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#1890ff' }}
              suffix={<DollarSign size={20} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Exposure"
              value={totalValue}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Open Positions"
              value={mockPositions.length}
              valueStyle={{ color: '#1890ff' }}
              suffix={<Target size={20} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={8}>
          <Card title="Active Trades" className="shadow-sm h-full">
            <div className="space-y-4">
              {activeTrades.map(trade => (
                <div key={trade.id} className="border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium cursor-pointer hover:text-blue-600" onClick={() => openOrderPad(trade.symbol)}>
                      {trade.symbol}
                      <Button 
                        type="text" 
                        size="small" 
                        className="ml-1 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          openOrderPad(trade.symbol, trade.pnl >= 0 ? 'sell' : 'buy');
                        }}
                      >
                        {trade.pnl >= 0 ? <ArrowDownRight size={12} className="text-red-500" /> : <ArrowUpRight size={12} className="text-green-500" />}
                      </Button>
                    </div>
                    <Tag color={trade.pnl >= 0 ? 'green' : 'red'}>
                      {trade.entryTime} ({trade.duration})
                    </Tag>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className={trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)} ({trade.pnlPercent >= 0 ? '+' : ''}{trade.pnlPercent.toFixed(2)}%)
                    </div>
                    <div>
                      <Progress 
                        percent={Math.abs(trade.pnlPercent) * 10} 
                        size="small" 
                        status={trade.pnl >= 0 ? 'success' : 'exception'}
                        showInfo={false}
                        className="w-24"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t flex justify-between items-center">
              <div className="font-medium">Total PNL</div>
              <div className="text-lg font-semibold">
                {(() => {
                  const totalPnl = activeTrades.reduce((sum, trade) => sum + trade.pnl, 0);
                  return (
                    <span className={totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)}
                    </span>
                  );
                })()} 
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card title="Open Positions" className="shadow-sm">
            <Table
              columns={columns}
              dataSource={mockPositions}
              loading={loading}
              pagination={false}
              size="middle"
              scroll={{ x: 1200 }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={modalType === 'open' ? 'Open Position' : 'Close Position'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalSubmit}
          initialValues={{
            symbol: selectedPosition?.symbol || '',
            side: selectedPosition?.side || 'long',
            leverage: selectedPosition?.leverage || 1,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Symbol"
                name="symbol"
                rules={[{ required: true, message: 'Please select a symbol' }]}
              >
                <Select
                  placeholder="Select symbol"
                  disabled={modalType === 'close'}
                  options={[
                    { value: 'AAPL', label: 'Apple Inc.' },
                    { value: 'GOOGL', label: 'Alphabet Inc.' },
                    { value: 'MSFT', label: 'Microsoft Corp.' },
                    { value: 'TSLA', label: 'Tesla Inc.' },
                    { value: 'AMZN', label: 'Amazon.com Inc.' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Side"
                name="side"
                rules={[{ required: true, message: 'Please select a side' }]}
              >
                <Select
                  disabled={modalType === 'close'}
                  options={[
                    { value: 'long', label: 'Long (Buy)' },
                    { value: 'short', label: 'Short (Sell)' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[{ required: true, message: 'Please enter quantity' }]}
              >
                <InputNumber
                  placeholder="Enter quantity"
                  min={1}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Leverage"
                name="leverage"
                rules={[{ required: true, message: 'Please select leverage' }]}
              >
                <Select
                  placeholder="Select leverage"
                  options={[
                    { value: 1, label: '1x' },
                    { value: 2, label: '2x' },
                    { value: 3, label: '3x' },
                    { value: 5, label: '5x' },
                    { value: 10, label: '10x' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          {modalType === 'open' && (
            <Form.Item
              label="Order Type"
              name="orderType"
              initialValue="market"
            >
              <Select
                options={[
                  { value: 'market', label: 'Market Order' },
                  { value: 'limit', label: 'Limit Order' },
                  { value: 'stop', label: 'Stop Order' },
                ]}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Positions;