import Koa from 'koa'
import Router from '@koa/router'
import { register, load } from './decorator'
import path from 'path'
load(path.resolve(__dirname, './controller'))
const app = new Koa();
const router = new Router();

register(router)

app.use(router.routes())

app.listen(3000, () => {
  console.log('server start!')
});

async function UserInfoController (ctx, next) {
  ctx.body = { name: 'test user info' }
  await next()
}

async function UserListController (ctx, next) {
  ctx.body = []
  await next()
}
async function UserCreateController (ctx, next) {
  ctx.body = 'ok'
  await next()
}