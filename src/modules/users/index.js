import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { prisma } from '~/data'

export const login = async ctx => {
  const [type, credentials] = ctx.request.headers.authorization.split(' ')
  if (type !== 'Basic') {
    ctx.status = 400
    return
  }
  const decoded = Buffer.from(credentials, 'base64').toString()
  const [email, password] = decoded.split(':')
  try {
    const user = await prisma.User.findUnique({
      where: { email },
    })

    const passwordEqual = await bcrypt.compare(password, user.password)

    if (!user || !passwordEqual) {
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

    const { password, ...user } = await prisma.User.create({
      data: {
        name: ctx.request.body.name,
        email: ctx.request.body.email,
        password: hashedPassword,
      },
    })
    ctx.body = user
  } catch (error) {
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
