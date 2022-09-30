import request from 'supertest'
import { app } from './server-setup'

const server = app.listen()

describe('User routes', () => {
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
})
