export interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'OWNER'
}

export interface Spot {
  id: string
  title: string
  description: string
  location: string
  price: number
  latitude?: number
  longitude?: number
  images?: string[]
  averageRating?: number
  totalRatings?: number
  createdAt?: string
  updatedAt?: string
  owner?: {
    id?: string
    name: string
    email?: string
  }
}

export interface Rating {
  id: string
  rating: number
  comment?: string
  createdAt: string
  user?: {
    id: string
    name: string
  }
  spot?: Spot
}

export interface Booking {
  id: string
  spotId: string
  userId: string
  dateFrom: string
  dateTo: string
  createdAt: string
  updatedAt: string
  spot?: Spot
  user?: User
} 