import { prisma } from '~/data'

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
    const user = await prisma.User.create({
      data: ctx.request.body,
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
      where: { id: ctx.params.id },
    })
    ctx.body = { id: ctx.params.id }
  } catch (error) {
    ctx.status = 500
    ctx.body = 'Houve um erro!!'
  }
}
