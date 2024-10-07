import { differenceInMinutes } from 'date-fns'

export const auth = (req, res, next) => {
  if (!req.auth) {
    return res.status(401).json({ error: 'unauthenticated' })
  }
  if (!req.auth.userId) {
    return res.status(401).json({ error: 'unauthenticated' })
  }
  if (differenceInMinutes(req.auth.expires, new Date()) < 0) {
    return res.status(401).json({ error: 'unauthenticated' })
  }
  next()
}

