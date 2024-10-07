import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import routes from './routes.js'
import { cookies } from './cookies.js'

const app = express()

app.set('trust proxy', true)
app.use(helmet({ referrerPolicy: { policy: 'unsafe-url' } }))
app.use(cors({ origin: /(localhost)./, credentials: true }))
app.use(express.json())
app.use(cookies)
app.use(routes)

export default app
