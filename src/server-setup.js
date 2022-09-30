import Koa from 'koa'
import bodyparser from 'koa-bodyparser'

import { router } from './routes'

const app = new Koa()

app.use(bodyparser())
app.use(router.routes())
app.use(router.allowedMethods())

//app.listen(process.env.SERVER_PORT)

export { app }
