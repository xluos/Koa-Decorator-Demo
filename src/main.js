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