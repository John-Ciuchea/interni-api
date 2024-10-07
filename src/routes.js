import { Router } from 'express'
import { authenticateRequest, createUserRequest, loginRequest, registerRequest } from './requests.js'
import {
  authenticateHandler,
  createUserHandler,
  loginHandler,
  logoutHandler,
  meHandler,
  registerHandler
} from './handlers.js'
import { validate, validationErrorHandler } from './validation.js'
import { auth } from './middleware.js'

const authRoutes = new Router()
authRoutes.use(auth)
authRoutes.get('/me', meHandler)
authRoutes.post('/logout', logoutHandler)

const router = Router()

router.post('/register', validate(registerRequest), registerHandler)
router.post('/create-user', validate(createUserRequest), createUserHandler)
router.post('/login', validate(loginRequest), loginHandler)
router.post('/authenticate', validate(authenticateRequest), authenticateHandler)

router.use(authRoutes)
router.use(validationErrorHandler)

export default router
