import { User } from "@/types"

export const mockUser: User = {
  id: "user-001",
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  phone: "+1 (555) 123-4567",
  avatar: "/images/avatars/user-001.jpg",
  points: 1840,
  tier: "gold",
  tierPointsNeeded: 2500,
  tierPointsCurrent: 1840,
  birthday: "1992-07-15",
  savedAddresses: [
    {
      formatted: "123 Main Street, Apt 4B, New York, NY 10001",
      street: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "US",
      lat: 40.7484,
      lng: -73.9857,
    },
    {
      formatted: "456 Park Avenue, Office 12, New York, NY 10022",
      street: "456 Park Avenue, Office 12",
      city: "New York",
      state: "NY",
      postalCode: "10022",
      country: "US",
      lat: 40.7635,
      lng: -73.9722,
    },
  ],
  savedPayments: [
    {
      id: "pay-001",
      type: "visa",
      lastFour: "4242",
      expiryDate: "12/27",
      isDefault: true,
    },
    {
      id: "pay-002",
      type: "mastercard",
      lastFour: "8888",
      expiryDate: "06/26",
      isDefault: false,
    },
    {
      id: "pay-003",
      type: "apple-pay",
      lastFour: "",
      expiryDate: "",
      isDefault: false,
    },
  ],
  pastOrders: [
    {
      orderId: "ord-001",
      items: [
        { productId: "prod-classic-burger", productName: "The Classic", quantity: 2 },
        { productId: "prod-fries", productName: "House Cut Fries", quantity: 2 },
        { productId: "prod-cola", productName: "Cola", quantity: 2 },
      ],
      total: 35.92,
      placedAt: "2026-06-28T18:30:00Z",
      isFavourite: true,
    },
    {
      orderId: "ord-002",
      items: [
        { productId: "prod-spicy-chicken", productName: "Spicy Chicken Sandwich", quantity: 1 },
        { productId: "prod-milkshake", productName: "Triple Chocolate Milkshake", quantity: 1 },
      ],
      total: 19.47,
      placedAt: "2026-06-25T12:15:00Z",
      isFavourite: true,
    },
    {
      orderId: "ord-003",
      items: [
        { productId: "prod-double-smash", productName: "Double Smash Burger", quantity: 1 },
      ],
      total: 15.38,
      placedAt: "2026-06-20T19:45:00Z",
      isFavourite: false,
    },
  ],
  dietaryPreferences: [],
  allergenAlerts: [],
}