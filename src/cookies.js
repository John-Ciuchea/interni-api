import cookie from 'cookie'
import { addSeconds } from 'date-fns'

const cookieName = 'auth'
const maxAge = process.env.LOGIN_EXPIRES_IN * 60

const getCookie = (req, name) => {
  const cookies = cookie.parse(req.headers.cookie || '')
  return JSON.parse(cookies[name] || 'null')
}

const setAuthCookie = (res, data) => {
  const expires = addSeconds(new Date(), maxAge)
  const value = JSON.stringify({ ...data, expires })
  const options = { httpOnly: true, maxAge, expires }

  res.setHeader('Set-Cookie', cookie.serialize(cookieName, value, options))
}

const unsetAuthCookie = (res) => {
  const unsetMaxAge = - maxAge
  const expires = addSeconds(new Date(), unsetMaxAge)
  const options = { httpOnly: true, unsetMaxAge, expires }

  res.setHeader('Set-Cookie', cookie.serialize(cookieName, '', options))
}

export const cookies = (req, res, next) => {
  req.getCookie = getCookie.bind(undefined, req)
  req.auth = req.getCookie(cookieName)

  res.setAuthCookie = setAuthCookie.bind(undefined, res)
  res.unsetAuthCookie = unsetAuthCookie.bind(undefined, res)

  next()
}
