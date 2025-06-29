import React, { useState, useEffect } from 'react';
import { Card, Table, Space, Tag, Button, Select, Statistic, Row, Col, Tabs } from 'antd';
import { Play, Pause, RefreshCw, TrendingUp, TrendingDown, DollarSign, IndianRupeeIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import OrderPad from '../components/OrderPad';
import { useOrderPad } from '../contexts/OrderPadContext';

const Orderbook = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [isLive, setIsLive] = useState(true);
  const [lastPrice, setLastPrice] = useState(152.30);
  const [priceChange, setPriceChange] = useState(2.45);
  const [volume, setVolume] = useState(45678123);
  const [unrealizedPnl, setUnrealizedPnl] = useState(1245.67);
  const [realizedPnl, setRealizedPnl] = useState(876.32);
  const [activeTab, setActiveTab] = useState('unrealized');
  const { isOrderPadOpen, orderSymbol, orderSide, openOrderPad, closeOrderPad } = useOrderPad();

  const symbols = [
    { value: 'AAPL', label: 'Apple Inc.' },
    { value: 'GOOGL', label: 'Alphabet Inc.' },
    { value: 'MSFT', label: 'Microsoft Corp.' },
    { value: 'TSLA', label: 'Tesla Inc.' },
    { value: 'AMZN', label: 'Amazon.com Inc.' },
  ];

  const generateOrderData = (side, count) => {
    const basePrice = lastPrice;
    const data = [];

    for (let i = 0; i < count; i++) {
      const priceOffset = (Math.random() * 2 - 1) * 0.5;
      const price = side === 'buy' ? basePrice - Math.abs(priceOffset) : basePrice + Math.abs(priceOffset);
      const size = Math.floor(Math.random() * 10000) + 100;

      data.push({
        key: `${side}-${i}`,
        price: price,
        size: size,
        total: price * size,
        side: side,
      });
    }

    return data.sort((a, b) => side === 'buy' ? b.price - a.price : a.price - b.price);
  };

  const generateTradeData = () => {
    const data = [];
    const now = new Date();

    for (let i = 0; i < 20; i++) {
      const time = new Date(now.getTime() - i * 1000);
      const price = lastPrice + (Math.random() * 2 - 1) * 0.5;
      const size = Math.floor(Math.random() * 5000) + 100;
      const side = Math.random() > 0.5 ? 'buy' : 'sell';

      data.push({
        key: i.toString(),
        time: time.toLocaleTimeString(),
        price: price,
        size: size,
        side: side,
      });
    }

    return data;
  };

  const [buyOrders, setBuyOrders] = useState([]);
  const [sellOrders, setSellOrders] = useState([]);
  const [recentTrades, setRecentTrades] = useState([]);

  useEffect(() => {
    const updateData = () => {
      setBuyOrders(generateOrderData('buy', 15));
      setSellOrders(generateOrderData('sell', 15));
      setRecentTrades(generateTradeData());

      // Simulate price changes
      const change = (Math.random() * 0.5 - 0.25);
      setLastPrice(prev => prev + change);
      setPriceChange(prev => prev + change);
      setVolume(prev => prev + Math.floor(Math.random() * 10000));

      // Simulate PNL changes
      setUnrealizedPnl(prev => prev + (Math.random() * 20 - 10));
      setRealizedPnl(prev => prev + (Math.random() * 5 - 2));
    };

    updateData();

    let interval;
    if (isLive) {
      interval = setInterval(updateData, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive, selectedSymbol]);

  const orderColumns = [
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (price, record) => (
        <span
          className={`${record.side === 'buy' ? 'text-green-600' : 'text-red-600'} cursor-pointer hover:underline`}
          onClick={() => openOrderPad(selectedSymbol, record.side)}
        >
          ${price.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      align: 'right',
      render: (size) => size.toLocaleString(),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      align: 'right',
      render: (total) => `$${total.toLocaleString()}`,
    },
  ];

  const tradeColumns = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width: 100,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (price, record) => (
        <span
          className={`${record.side === 'buy' ? 'text-green-600' : 'text-red-600'} cursor-pointer hover:underline`}
          onClick={() => openOrderPad(selectedSymbol, record.side === 'buy' ? 'sell' : 'buy')}
        >
          ${price.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      align: 'right',
      render: (size) => size.toLocaleString(),
    },
    {
      title: 'Side',
      dataIndex: 'side',
      key: 'side',
      render: (side) => (
        <Tag color={side === 'buy' ? 'green' : 'red'}>
          {side.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <OrderPad
        isOpen={isOrderPadOpen}
        onClose={closeOrderPad}
        initialSymbol={orderSymbol || selectedSymbol}
        initialSide={orderSide}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Orderbook</h1>
        <Space>
          <Select
            value={selectedSymbol}
            style={{ width: 140 }}
            onChange={setSelectedSymbol}
            options={symbols}
          />
          <Button
            type={isLive ? 'primary' : 'default'}
            icon={isLive ? <Pause size={16} /> : <Play size={16} />}
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? 'Pause' : 'Start'} Live
          </Button>
          <Button icon={<RefreshCw size={16} />}>
            Refresh
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Last Price"
              value={lastPrice}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#1890ff', cursor: 'pointer' }}
              onClick={() => openOrderPad(selectedSymbol, 'buy')}
              className="cursor-pointer hover:opacity-80"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="24h Change"
              value={Math.abs(priceChange)}
              precision={2}
              prefix={priceChange >= 0 ? '+$' : '-$'}
              suffix={priceChange >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              valueStyle={{ color: priceChange >= 0 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Volume"
              value={volume}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={8}>
          <Card className="h-full">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: 'unrealized',
                  label: 'Unrealized PNL',
                  children: (
                    <Statistic
                      value={Math.abs(unrealizedPnl)}
                      precision={2}
                      prefix={unrealizedPnl >= 0 ? <span className="text-green-600">+$</span> : <span className="text-red-600">-$</span>}
                      valueStyle={{ color: unrealizedPnl >= 0 ? '#3f8600' : '#cf1322', fontSize: '24px' }}
                      suffix={unrealizedPnl >= 0 ? <TrendingUp size={20} className="ml-2" /> : <TrendingDown size={20} className="ml-2" />}
                    />
                  ),
                },
                {
                  key: 'realized',
                  label: 'Realized PNL',
                  children: (
                    <Statistic
                      value={Math.abs(realizedPnl)}
                      precision={2}
                      prefix={realizedPnl >= 0 ? <span className="text-green-600">+$</span> : <span className="text-red-600">-$</span>}
                      valueStyle={{ color: realizedPnl >= 0 ? '#3f8600' : '#cf1322', fontSize: '24px' }}
                      suffix={realizedPnl >= 0 ? <TrendingUp size={20} className="ml-2" /> : <TrendingDown size={20} className="ml-2" />}
                    />
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title={`${selectedSymbol} Order Book`} className="shadow-sm">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-red-600 mb-2 flex items-center justify-between">
                    <span>Sell Orders</span>
                    <Button
                      type="text"
                      size="small"
                      className="text-red-600 hover:bg-red-50 flex items-center"
                      icon={<ArrowDownRight size={14} />}
                      onClick={() => openOrderPad(selectedSymbol, 'sell')}
                    >
                      Sell
                    </Button>
                  </h3>
                  <Table
                    columns={orderColumns}
                    dataSource={sellOrders.slice(0, 10)}
                    pagination={false}
                    size="small"
                    className="sell-orders"
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-green-600 mb-2">Buy Orders</h3>
                  <Table
                    columns={orderColumns}
                    dataSource={buyOrders.slice(0, 10)}
                    pagination={false}
                    size="small"
                    className="buy-orders"
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Recent Trades" className="shadow-sm">
            <Table
              columns={tradeColumns}
              dataSource={recentTrades}
              pagination={false}
              size="small"
              scroll={{ y: 400 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Orderbook;