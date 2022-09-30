class TokenTypeError extends Error {
  constructor(message = 'Wrong token type') {
    super()
    this.message = message
  }
}

class EncodedError extends Error {
  constructor(message = 'Wrong credentials is not encoded correct') {
    super()
    this.message = message
  }
}

class BadCredentialsError extends Error {
  constructor(message = 'Wrong credentials format') {
    super()
    this.message = message
  }
}

export const decodeBasicToken = basicToken => {
  const [type, credentials] = basicToken.split(' ')

  if (type !== 'Basic') {
    throw new TokenTypeError()
  }

  const decoded = Buffer.from(credentials, 'base64').toString()
  const encoded = Buffer.from(decoded, 'utf-8').toString('base64')

  if (encoded !== credentials) {
    throw new EncodedError()
  }

  if (decoded.indexOf(':') === -1) {
    throw new BadCredentialsError()
  }

  return decoded.split(':')
}
