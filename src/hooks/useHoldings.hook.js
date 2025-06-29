import React, { useEffect, useState } from 'react'
import { getHoldings } from '../axios/portfolio.action';
import { holdingsMockData } from '../const/common.const';

const useHoldings = () => {
  const [holdingsData, setHoldingsData] = useState({
    data: null,
    loader: false,
    error: null,
  })

  const fetchHoldings = async () => {
    setHoldingsData((prev) => ({ ...prev, loader: true }));
    try {
      // const response = await getHoldings();
      // if (response?.status !== 200) throw new Error("failed to fetch holding");
      const data = holdingsMockData;
      setTimeout(() => {
        setHoldingsData((prev) => ({ ...prev, data, loader: false }));
      }, 3000)
    } catch (error) {
      setHoldingsData((prev) => ({ ...prev, error, loader: false }));
    }
  };

  const handleRefresh = () => {
    setHoldingsData((prev) => ({ ...prev, loader: true }));
    setTimeout(() => {
      setHoldingsData((prev) => ({ ...prev, loader: true }));
    }, 1000);
  };

  useEffect(() => {
    fetchHoldings();
  }, [])


  return { holdingsData, handleRefresh }
}

export default useHoldings