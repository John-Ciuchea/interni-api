import {
  createLogin,
  createRegister,
  createUser,
  deleteLogin,
  deleteRegister,
  findUser,
  getLogin,
  getRegister,
  getUser
} from './database.js'
import { differenceInMinutes } from 'date-fns'
import { randomBytes } from 'node:crypto'
import { send } from './mailer.js'

export const registerHandler = async (req, res) => {
  const code = randomBytes(20).toString('hex') // TODO: use something stronger: client ip maybe...
  const inserted = createRegister(req.body.email, code)// TODO: check if email already exists
  if (!inserted) {
    return res.status(500).json({ error: 'something went wrong' })
  }
  const url = `${req.get('origin')}/create-user?code=${code}`
  const message = `<div>Click <a href="${url}">here</a> to finish the registration.</div>`
  const subject = 'Register your awesome account'

  const mail = await send({ to: req.body.email, subject, message })
  if (mail.success === false) {
    return res.status(500).json({ error: 'something went wrong' })
  }
  res.json({ status: 'ok' })
}

export const createUserHandler = async (req, res) => {
  const register = getRegister(req.body.code)
  if (!register) {
    return res.status(400).json({ error: 'invalid code' })
  }
  if (differenceInMinutes(new Date(), register.createdAt) > process.env.CODE_EXPIRES_IN) {
    return res.status(400).json({ error: 'expired code' })
  }
  if (createUser(register.email, req.body.name)) {
    deleteRegister(register.id)
    return res.json({ status: 'ok' })
  }
  res.status(500).json({ error: 'something went wrong' })
}

export const loginHandler = async (req, res) => {
  const user = getUser(req.body.email)
  if (!user) {
    return res.json({ status: 'ok' })
  }
  const code = randomBytes(20).toString('hex')
  const inserted = createLogin(user.id, code)
  if (!inserted) {
    return res.status(500).json({ error: 'something went wrong' })
  }
  const url = `${req.get('origin')}/authenticate?code=${code}`
  const message = `<div>Click <a href="${url}">here</a> to login.</div>`
  const subject = 'Awesome login'

  const mail = await send({ to: req.body.email, subject, message })
  if (mail.success === false) {
    return res.status(500).json({ error: 'something went wrong' })
  }
  return res.json({ status: 'ok' })
}

export const authenticateHandler = async (req, res) => {
  const login = getLogin(req.body.code)
  if (!login) {
    return res.status(400).json({ error: 'invalid code' })
  }
  if (differenceInMinutes(new Date(), login.createdAt) > process.env.CODE_EXPIRES_IN) {
    deleteLogin(login.id)
    return res.status(400).json({ error: 'expired code' })
  }
  const user = findUser(login.userId)
  // deleteLogin(login.id)
  if (!user) {
    return res.status(500).json({ error: 'something went wrong' })
  }
  res.setAuthCookie({ userId: user.id })
  return res.json({ status: 'ok' })
}

export const meHandler = async (req, res) => {
  const user = findUser(req.auth.userId)
  if (!user) {
    console.log('user not found')
    return res.status(500).json({ error: 'something went wrong' })
  }
  return res.json({ ...user, loggedInUntil: req.auth.expires })
}

export const logoutHandler = async (req, res) => {
  res.unsetAuthCookie()
  return res.json({ status: 'ok' })
}
