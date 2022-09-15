import Router from '@koa/router'

import * as users from './modules/users'

export const router = new Router()

router.get('/users', users.list)
