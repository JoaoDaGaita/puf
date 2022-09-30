import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { prisma } from '~/data'
import {
  decodeBasicToken,
  TokenTypeError,
  EncodedError,
  BadCredentialsError,
} from './services'

export const login = async ctx => {
  try {
    const [email, password] = decodeBasicToken(
      ctx.request.headers.authorization
    )
    const user = await prisma.User.findUnique({
      where: { email },
    })

    if (!user) {
      ctx.status = 404
      ctx.body = 'Usuário não encontrado!'
      return
    }

    const passwordEqual = await bcrypt.compare(password, user.password)

    if (!passwordEqual) {
      ctx.status = 404
      ctx.body = 'Usuário não encontrado!'
      return
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET)

    ctx.body = { user, token }
  } catch (error) {
    ctx.status = 500
    ctx.body = 'Houve um errol'
  }
}

export const list = async ctx => {
  try {
    const users = await prisma.User.findMany()
    ctx.body = users
  } catch (error) {
    ctx.status = 500
    ctx.body = 'Houve um errol'
  }
}

export const create = async ctx => {
  try {
    const saltRounds = 10

    const hashedPassword = await bcrypt.hash(
      ctx.request.body.password,
      saltRounds
    )
    ctx.body = hashedPassword

    const { user } = await prisma.User.create({
      data: {
        name: ctx.request.body.name,
        email: ctx.request.body.email,
        password: hashedPassword,
      },
    })
    ctx.body = user
  } catch (error) {
    if (error.code !== null) {
      ctx.status = 400
      ctx.body = `Bad request: ${error.meta.target} already exists`
      return
    }
    if (error instanceof TokenTypeError) {
      ctx.status = 400
    }
    if (error instanceof EncodedError) {
      ctx.status = 400
    }
    if (error instanceof BadCredentialsError) {
      ctx.status = 400
    }
    ctx.status = 500
    ctx.body = 'Houve um erro!!'
  }
}

export const update = async ctx => {
  const data = {
    name: ctx.request.body.name,
    email: ctx.request.body.email,
  }
  try {
    const user = await prisma.User.update({
      where: { id: ctx.params.id },
      data,
    })
    ctx.body = user
  } catch (error) {
    ctx.status = 500
    ctx.body = 'Houve um erro!!'
  }
}
export const remove = async ctx => {
  try {
    await prisma.User.delete({
      where: {
        id: ctx.params.id,
      },
    })
    ctx.body = { id: ctx.params.id }
  } catch (error) {
    console.log(error)
    ctx.status = 500
    ctx.body = 'Houve um erro!!'
  }
}
