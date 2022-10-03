import request from 'supertest'
import { prisma } from '~/data'
import bcrypt from 'bcrypt'

import { app } from './server-setup'

const server = app.listen()

describe('User routes', () => {
  beforeAll(async () => {
    await prisma.User.deleteMany({})
  })
  it('should return not found with wrong password', async () => {
    // prepare
    const email = 'joao@zam.com'
    const password = 'teste'
    // execution
    const result = await request(server).get('/login').auth(email, password)

    // expectation
    expect(result.status).toBe(404)
  })

  it('should return not found with wrong email', async () => {
    // prepare
    const email = 'error@zam.com'
    const password = '123123'
    // execution
    const result = await request(server).get('/login').auth(email, password)

    // expectation
    expect(result.status).toBe(404)
  })
  // it('should return logged user with correct credentials', async () => {
  //   // prepare
  //   const email = 'joao@zam.com'
  //   const password = '123123'
  //   // execution
  //   const result = await request(server).get('/login').auth(email, password)

  //   // expectation
  //   expect(result.status).toBe(200)
  //   expect(result.body).toBeTruthy()
  //   expect(result.body.user.id).toBeTruthy()
  //   expect(result.body.user.email).toBe(email)
  //   //expect(result.body.user.password).toBe(false)
  // })
  it('should return logged user with correct credentials', async () => {
    // prepare
    const email = 'joao@zam.com'
    const password = '123123'

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    await prisma.User.create({
      data: { email, password: hashedPassword },
    })
    // execution
    const result = await request(server).get('/login').auth(email, password)

    // expectation
    expect(result.status).toBe(200)
    expect(result.body).toBeTruthy()
    expect(result.body.user.id).toBeTruthy()
    expect(result.body.user.email).toBe(email)
    //expect(result.body.user.password).toBe(false)
  })
})
