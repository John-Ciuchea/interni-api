import { z } from 'zod'

export const registerRequest = z.object({
  email: z.string().email()
})

export const createUserRequest = z.object({
  name: z.string().min(3),
  code: z.string(),
})
export const authenticateRequest = z.object({
  code: z.string()
})

export const loginRequest = registerRequest
