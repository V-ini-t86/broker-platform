import { Progress, Tag } from "antd";
import { TrendingDown, TrendingUp } from "lucide-react";

export const holdingColumns = [
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    key: 'symbol',
    render: (symbol, record) => (
      <div>
        <div className="font-semibold text-gray-800">{symbol}</div>
        <div className="text-sm text-gray-500">{record.name}</div>
      </div>
    ),
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    align: 'right',
    render: (quantity) => quantity.toLocaleString(),
  },
  {
    title: 'Avg Price',
    dataIndex: 'avgPrice',
    key: 'avgPrice',
    align: 'right',
    render: (price) => `₹${price.toFixed(2)}`,
  },
  {
    title: 'Current Price',
    dataIndex: 'currentPrice',
    key: 'currentPrice',
    align: 'right',
    render: (price) => `₹${price.toFixed(2)}`,
  },
  {
    title: 'Market Value',
    dataIndex: 'marketValue',
    key: 'marketValue',
    align: 'right',
    render: (value) => `₹${value.toLocaleString()}`,
    sorter: (a, b) => a.marketValue - b.marketValue,
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
          ₹{Math.abs(pl).toLocaleString()}
        </div>
        <div className="text-sm">
          {record.unrealizedPLPercent >= 0 ? '+' : ''}{record.unrealizedPLPercent.toFixed(2)}%
        </div>
      </div>
    ),
    sorter: (a, b) => a.unrealizedPL - b.unrealizedPL,
  },
  {
    title: 'Sector',
    dataIndex: 'sector',
    key: 'sector',
    render: (sector) => (
      <Tag color={sector === 'Technology' ? 'blue' : 'green'}>{sector}</Tag>
    ),
  },
  {
    title: 'Allocation',
    dataIndex: 'allocation',
    key: 'allocation',
    align: 'right',
    render: (allocation) => (
      <div>
        <Progress
          percent={allocation}
          size="small"
          strokeColor={allocation > 20 ? '#1890ff' : '#52c41a'}
          showInfo={false}
        />
        <div className="text-sm text-gray-600 mt-1">{allocation}%</div>
      </div>
    ),
  },
];