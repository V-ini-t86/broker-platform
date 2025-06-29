import React, { createContext, useState, useContext } from 'react';

const OrderPadContext = createContext();

export const OrderPadProvider = ({ children }) => {
  const [isOrderPadOpen, setIsOrderPadOpen] = useState(false);
  const [orderSymbol, setOrderSymbol] = useState('');
  const [orderSide, setOrderSide] = useState('buy');

  const openOrderPad = (symbol, side = 'buy') => {
    setOrderSymbol(symbol);
    setOrderSide(side);
    setIsOrderPadOpen(true);
  };

  const closeOrderPad = () => {
    setIsOrderPadOpen(false);
  };

  return (
    <OrderPadContext.Provider
      value={{
        isOrderPadOpen,
        orderSymbol,
        orderSide,
        openOrderPad,
        closeOrderPad,
      }}
    >
      {children}
    </OrderPadContext.Provider>
  );
};

export const useOrderPad = () => useContext(OrderPadContext);