import { verify } from 'jsonwebtoken'
import { User } from './trpc'

export const decodeToken = async (token?: string) => {
  return token ? (verify(token, 'shh') as User) : null
}
