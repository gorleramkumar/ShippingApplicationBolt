export interface Order {
  id: string
  fromName: string
  fromAddress: string
  fromPostCode: string
  toName: string
  toAddress: string
  toPostCode: string
  shippingPriority: 'standard' | 'express'
  price: number
  createdAt: string
  trackingNumber: string
  status: 'pending' | 'in-transit' | 'delivered'
}

export interface ShippingRate {
  type: 'standard' | 'express'
  name: string
  price: number
  deliveryTime: string
  description: string
}