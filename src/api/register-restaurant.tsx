import { api } from '@/lib/axios'

export type RegisterRestaurantBody = {
  email: string
  managerName: string
  restaurantName: string
  phone: string
}

export async function registerRestaurant({
  email,
  managerName,
  phone,
  restaurantName,
}: RegisterRestaurantBody) {
  await api.post('/restaurants', { email, managerName, phone, restaurantName })
}
