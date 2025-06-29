import { portfolioInstance } from "./axios.config"


export const getHoldings = () => {
  return portfolioInstance({
    method: "GET",
    url: "/holdings",
  })
}

export const getOrderBookings = () => {
  return portfolioInstance({
    method: "GET",
    url: "/order-bookings",
  })
}

export const getPositions = () => {
  return portfolioInstance({
    method: "GET",
    url: "/positions",
  })
}