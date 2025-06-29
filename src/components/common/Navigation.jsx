import { Avatar, Dropdown, Space } from 'antd';
import { BookOpen, LogOut, PieChart, Settings, Target, User } from 'lucide-react';
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split('/')[2] || 'holdings';
  const { user, logout } = useAuth();

  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    {
      key: 'holdings',
      icon: <PieChart size={20} />,
      label: 'Holdings',
      path: '/dashboard/holdings',
    },
    {
      key: 'orderbook',
      icon: <BookOpen size={20} />,
      label: 'Orderbook',
      path: '/dashboard/orderbook',
    },
    {
      key: 'positions',
      icon: <Target size={20} />,
      label: 'Positions',
      path: '/dashboard/positions',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <User size={16} />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <Settings size={16} />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogOut size={16} />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const handleMenuClick = (item) => {
    const menuItem = navigationItems.find(menu => menu.key === item.key);
    if (menuItem) {
      navigate(menuItem.path);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        {navigationItems.map((item) =>
          <button
            key={item.key}
            type="button"
            className={`inline-flex flex-col items-center justify-center px-5 transition-all duration-300 ease-in-out hover:bg-blue-50 group ${currentPath === item.key ? 'bg-blue-50' : ''}`}
            onClick={() => handleMenuClick(item)}
          >
            <div className={`transition-colors duration-300 ${currentPath === item.key ? 'text-blue-500' : 'group-hover:text-blue-500'}`}>
              {item.icon}
            </div>
            <span className={`text-sm transition-colors duration-300 ${currentPath === item.key ? 'text-blue-500 font-medium' : 'text-gray-800 group-hover:text-blue-500'}`}>{item.label}</span>
          </button>
        )}
        {/* <Space> */}
          <Dropdown
            menu={{
              items: userMenuItems,
            }}
            trigger={['click']}
          >
            <div className="flex items-center cursor-pointer">
              <Avatar src={user?.avatar} className="mr-2">
                {user?.name?.[0]}
              </Avatar>
              <div className="hidden sm:block">
                <div className="font-medium text-gray-800">{user?.name}</div>
                {/* <div className="text-xs text-gray-500">{user?.email}</div> */}
              </div>
            </div>
          </Dropdown>
        {/* </Space> */}
      </div>
    </div>
  )
}

export default Navigation