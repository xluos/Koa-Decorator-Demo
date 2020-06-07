import { Controller, Get, Post } from '../decorator'

@Controller('/user')
export class UserController {

  @Get('/info')
  async getInfo (ctx, next) {
    ctx.body = { name: 'test user info' }
    await next()
  }
  @Get()
  async list (ctx, next) {
    ctx.body = []
    await next()
  }
  @Post('/create')
  async create (ctx, next) {
    ctx.body = 'ok'
    await next()
  }
}