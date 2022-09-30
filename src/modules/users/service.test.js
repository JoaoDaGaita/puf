import {
  decodeBasicToken,
  TokenTypeError,
  EncodedError,
  BadCredentialsError,
} from './services'

describe('User service', () => {
  it('should return credentials by basic authentication token', () => {
    //prepare
    const email = 'joao@zam.com'
    const password = '123123'
    const token = Buffer.from(`${email}:${password}`, 'utf-8').toString(
      'base64'
    )
    const basicToken = `Basic ${token}`

    //execution
    const result = decodeBasicToken(basicToken)

    //expect
    expect(result).toEqual([email, password])
  })

  it('should throw new error, when credentials is not in the basic type', () => {
    //prepare
    const email = 'joao@zam.com'
    const password = '123123'
    const token = Buffer.from(`${email}:${password}`, 'utf-8').toString(
      'base64'
    )

    const basicToken = `Bearer ${token}`

    //execution
    const result = () => decodeBasicToken(basicToken)

    //expect
    expect(result).toThrowError(TokenTypeError)
  })

  it('should throw new error, when credentials is not correct format', () => {
    //prepare
    const email = 'joao@zam.com'
    const password = '123123'
    const token = Buffer.from(`${email}${password}`, 'utf-8').toString('base64')

    const basicToken = `Basic ${token}`

    //execution
    const result = () => decodeBasicToken(basicToken)

    //expect
    expect(result).toThrowError(BadCredentialsError)
  })

  it('should throw new error, when credentials is not base64 encoded', () => {
    //prepare
    const email = 'joao@zam.com'
    const password = '123123'
    const token = `${email}:${password}`

    const basicToken = `Basic ${token}`

    //execution
    const result = () => decodeBasicToken(basicToken)

    //expect
    expect(result).toThrowError(EncodedError)
  })
})
