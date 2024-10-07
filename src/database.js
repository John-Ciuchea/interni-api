import { DatabaseSync } from 'node:sqlite';

const database = new DatabaseSync('database.sqlite');

export const init = () => {
  database.exec(`
    CREATE TABLE if not exists register(
      id INTEGER PRIMARY KEY,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      createdAt TEXT NOT NULL
    ) STRICT
  `);

  database.exec(`
    CREATE TABLE if not exists users(
      id INTEGER PRIMARY KEY,
      email TEXT NOT NULL,
      name TEXT NOT NULL
    ) STRICT
  `);

  database.exec(`
    CREATE TABLE if not exists logins(
      id INTEGER PRIMARY KEY,
      userId INTEGER NOT NULL,
      code TEXT NOT NULL,
      createdAt TEXT NOT NULL
    ) STRICT
  `);
}

export const createRegister = (email, code) => {
  const stmt = database.prepare(
    'INSERT INTO register(email, code, createdAt) VALUES (?, ?, ?)'
  )
  const result = stmt.run(email, code, (new Date).toISOString());
  return result.changes === 1
}

export const getRegister = (code) => {
  const query = database.prepare(`select * from register where code = ?`);
  const record = query.get(code)
  return record.id ? record : null
}

export const createUser = (email, name) => {
  const stmt = database.prepare(
    'INSERT INTO users(email, name) VALUES (?, ?)'
  )
  const result = stmt.run(email, name);
  return result.changes === 1
}

export const deleteRegister = (id) => {
  const stmt = database.prepare('DELETE FROM register WHERE id = ?');
  const result = stmt.run(id);
  return result.changes === 1
}

export const getUser = (email) => {
  const query = database.prepare(`select * from users where email = ?`);
  const record = query.get(email)
  return record.id ? record : null
}

export const findUser = (id) => {
  const query = database.prepare(`select * from users where id = ?`);
  const record = query.get(id)
  return record.id ? record : null
}

export const createLogin = (userId, code) => {
  const stmt = database.prepare(
    'INSERT INTO logins(userId, code, createdAt) VALUES (?, ?, ?)'
  )
  const result = stmt.run(userId, code, (new Date).toISOString());
  return result.changes === 1
}

export const getLogin = (code) => {
  const query = database.prepare(`select * from logins where code = ?`);
  const record = query.get(code)
  return record.id ? record : null
}

export const deleteLogin = (id) => {
  const stmt = database.prepare('DELETE FROM logins WHERE id = ?');
  const result = stmt.run(id);
  return result.changes === 1
}
