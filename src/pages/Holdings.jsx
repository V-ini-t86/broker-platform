import React, { useState } from 'react';
import { Card, Table, Space, Tag, Progress, Statistic, Row, Col, Select, Button } from 'antd';
import { TrendingUp, TrendingDown, DollarSign, PieChart, RefreshCw, IndianRupee, IndianRupeeIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import useHoldings from '../hooks/useHoldings.hook';
import { holdingColumns } from '../const/columns.const';
import OrderPad from '../components/OrderPad';
import { useOrderPad } from '../contexts/OrderPadContext';

const Holdings = () => {
  const { holdingsData, handleRefresh } = useHoldings()
  const [sortBy, setSortBy] = useState('marketValue');
  const { isOrderPadOpen, orderSymbol, orderSide, openOrderPad, closeOrderPad } = useOrderPad();

  const { data, loader } = holdingsData;

  const totalValue = data?.length ? data.reduce((sum, item) => sum + item.marketValue, 0) : 0;
  const totalPL = data?.length ? data.reduce((sum, item) => sum + item.unrealizedPL, 0) : 0;
  const totalPLPercent = (totalPL / (totalValue - totalPL)) * 100;

  const cardData = [
    {
      title: "Total Portfolio Value",
      value: totalValue,
      precision: 2,
      prefix: <IndianRupeeIcon size={20} />,
      valueStyle: { color: '#1890ff' }
    },
    {
      title: "Total P&L",
      value: Math.abs(totalPL),
      precision: 2,
      prefix: totalPL >= 0 ? 
        <span className='inline-flex items-center'>+<IndianRupeeIcon size={16} /></span> : 
        <span className='inline-flex items-center'>-<IndianRupeeIcon size={16} /></span>,
      suffix: totalPL >= 0 ? <TrendingUp size={16} className="ml-1" /> : <TrendingDown size={16} className="ml-1" />,
      valueStyle: { color: totalPL >= 0 ? '#3f8600' : '#cf1322' }
    },
    {
      title: "Total Returns %",
      value: Math.abs(totalPLPercent),
      precision: 2,
      prefix: totalPLPercent >= 0 ? '+' : '-',
      suffix: "%",
      valueStyle: { color: totalPLPercent >= 0 ? '#3f8600' : '#cf1322' }
    },
    {
      title: "Total Positions",
      value: data?.length || 0,
      suffix: <PieChart size={20} />,
      valueStyle: { color: '#1890ff' }
    }
  ]

  // Create modified columns with click handlers
  const enhancedColumns = holdingColumns.map(column => {
    if (column.dataIndex === 'symbol') {
      return {
        ...column,
        render: (symbol, record) => (
          <div 
            className="cursor-pointer hover:text-blue-600" 
            onClick={() => openOrderPad(symbol, 'buy')}
          >
            <div className="font-semibold text-gray-800">{symbol}</div>
            <div className="text-sm text-gray-500">{record.name}</div>
          </div>
        ),
      };
    }
    if (column.dataIndex === 'currentPrice') {
      return {
        ...column,
        render: (price, record) => (
          <div 
            className="cursor-pointer hover:text-blue-600" 
            onClick={() => openOrderPad(record.symbol, 'buy')}
          >
            ₹{price.toFixed(2)}
          </div>
        ),
      };
    }
    return column;
  });

  return (
    <div className="space-y-6">
      <OrderPad 
        isOpen={isOrderPadOpen} 
        onClose={closeOrderPad} 
        initialSymbol={orderSymbol} 
        initialSide={orderSide} 
      />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Holdings</h1>
        <Space>
          <Select
            defaultValue="marketValue"
            style={{ width: 140 }}
            onChange={setSortBy}
            options={[
              { value: 'marketValue', label: 'Market Value' },
              { value: 'unrealizedPL', label: 'P&L' },
              { value: 'symbol', label: 'Symbol' },
            ]}
          />
          <Button
            icon={<RefreshCw size={16} />}
            loading={loader}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        {cardData.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={card.title}
                value={card.value}
                precision={card.precision}
                prefix={card.prefix}
                suffix={card.suffix}
                valueStyle={card.valueStyle}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="Portfolio Holdings" className="shadow-sm">
        <Table
          columns={enhancedColumns}
          dataSource={holdingsData.data || []}
          loading={loader}
          pagination={{ size: 10 }}
          size="middle"
          scroll={{ x: 1000 }}
          className="holdings-table"
          onRow={(record) => ({
            onClick: () => openOrderPad(record.symbol, 'buy'),
            style: { cursor: 'pointer' }
          })}
        />
      </Card>
    </div>
  );
};

export default Holdings;