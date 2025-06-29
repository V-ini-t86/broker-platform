import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button, Radio, Divider, Space, Typography, Slider } from 'antd';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

const { Title, Text } = Typography;

const OrderPad = ({ isOpen, onClose, initialSymbol = '', initialSide = 'buy' }) => {
  const [form] = Form.useForm();
  const [orderSide, setOrderSide] = useState(initialSide);
  const [orderType, setOrderType] = useState('market');
  const [stockPrice, setStockPrice] = useState(0);
  const [stockInfo, setStockInfo] = useState(null);
  
  // Reset form when modal opens with new symbol
  useEffect(() => {
    if (isOpen && initialSymbol) {
      form.resetFields();
      setOrderSide(initialSide);
      fetchStockInfo(initialSymbol);
    }
  }, [isOpen, initialSymbol, initialSide, form]);

  // Mock function to fetch stock info
  const fetchStockInfo = (symbol) => {
    // In a real app, this would be an API call
    const mockPrices = {
      'AAPL': { price: 152.30, change: 2.45, changePercent: 1.64 },
      'GOOGL': { price: 2720.50, change: 35.20, changePercent: 1.31 },
      'MSFT': { price: 305.20, change: -3.75, changePercent: -1.21 },
      'TSLA': { price: 185.40, change: 5.80, changePercent: 3.23 },
      'AMZN': { price: 142.80, change: 1.25, changePercent: 0.88 },
    };
    
    const price = mockPrices[symbol]?.price || 100.00;
    setStockPrice(price);
    form.setFieldsValue({ price: price });
    
    setStockInfo({
      symbol,
      name: `${symbol} Inc.`,
      price,
      change: mockPrices[symbol]?.change || 0,
      changePercent: mockPrices[symbol]?.changePercent || 0,
    });
  };

  const handleSubmit = (values) => {
    console.log('Order submitted:', { ...values, side: orderSide });
    onClose();
  };

  const handleSideChange = (e) => {
    setOrderSide(e.target.value);
  };

  const handleOrderTypeChange = (value) => {
    setOrderType(value);
    if (value === 'market') {
      form.setFieldsValue({ price: stockPrice });
    }
  };

  // Calculate estimated cost
  const calculateTotal = () => {
    const quantity = form.getFieldValue('quantity') || 0;
    const price = form.getFieldValue('price') || 0;
    return (quantity * price).toFixed(2);
  };

  return (
    <Modal
      title={
        <div className="flex items-center">
          <div 
            className={`w-4 h-4 rounded-full mr-2 ${orderSide === 'buy' ? 'bg-green-500' : 'bg-red-500'}`}
          ></div>
          <span>{orderSide === 'buy' ? 'Buy' : 'Sell'} Order</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={400}
      className={`${orderSide === 'buy' ? 'border-t-4 border-green-500' : 'border-t-4 border-red-500'}`}
      bodyStyle={{ 
        padding: '16px'
      }}
    >
      {stockInfo && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold text-lg">{stockInfo.symbol}</div>
              <div className="text-gray-500 text-sm">{stockInfo.name}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">${stockInfo.price.toFixed(2)}</div>
              <div className={stockInfo.change >= 0 ? 'text-green-600 flex items-center justify-end' : 'text-red-600 flex items-center justify-end'}>
                {stockInfo.change >= 0 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                {stockInfo.change >= 0 ? '+' : ''}{stockInfo.change.toFixed(2)} ({stockInfo.changePercent.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          symbol: initialSymbol,
          orderType: 'market',
          price: stockPrice,
          quantity: 10,
          timeInForce: 'day'
        }}
      >
        <Form.Item name="symbol" label="Symbol" rules={[{ required: true }]}>
          <Input disabled={!!initialSymbol} />
        </Form.Item>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Side</label>
          <Radio.Group 
            value={orderSide} 
            onChange={handleSideChange} 
            buttonStyle="solid" 
            className="w-full"
          >
            <Radio.Button 
              value="buy" 
              className={`w-1/2 text-center ${orderSide === 'buy' ? 'bg-green-50 border-green-500 text-green-700' : ''}`}
            >
              Buy
            </Radio.Button>
            <Radio.Button 
              value="sell" 
              className={`w-1/2 text-center ${orderSide === 'sell' ? 'bg-red-50 border-red-500 text-red-700' : ''}`}
            >
              Sell
            </Radio.Button>
          </Radio.Group>
        </div>

        <Form.Item name="orderType" label="Order Type">
          <Select onChange={handleOrderTypeChange}>
            <Select.Option value="market">Market</Select.Option>
            <Select.Option value="limit">Limit</Select.Option>
            <Select.Option value="stop">Stop</Select.Option>
            <Select.Option value="stopLimit">Stop Limit</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item 
          name="price" 
          label="Price" 
          rules={[{ required: orderType !== 'market' }]}
        >
          <InputNumber 
            disabled={orderType === 'market'} 
            style={{ width: '100%' }} 
            prefix="$" 
            precision={2}
          />
        </Form.Item>

        <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={1} />
        </Form.Item>

        <Form.Item name="timeInForce" label="Time in Force">
          <Select>
            <Select.Option value="day">Day</Select.Option>
            <Select.Option value="gtc">Good Till Canceled</Select.Option>
            <Select.Option value="ioc">Immediate or Cancel</Select.Option>
          </Select>
        </Form.Item>

        <Divider style={{ margin: '12px 0' }} />

        <div className="bg-gray-50 p-3 rounded-md mb-4">
          <div className="flex justify-between mb-2">
            <Text>Estimated Cost:</Text>
            <Text strong>${calculateTotal()}</Text>
          </div>
          <div className="flex justify-between">
            <Text>Commission:</Text>
            <Text>$0.00</Text>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="primary" 
            htmlType="submit"
            className={`${orderSide === 'buy' ? 'bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600' : 'bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600'}`}
          >
            {orderSide === 'buy' ? 'Buy' : 'Sell'} {initialSymbol}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default OrderPad;