import 'reflect-metadata'
import requireContext from 'require-context'
const BASE_URL = 'BASE_URL'
const METHOD = 'METHOD'
const METHOD_URL = 'METHOD_URL'


class Decorator {
  prefix = ''
  controllerList = new Set()
  register(router, prefix = '') {
    // 所有接口的公共前缀
    this.prefix = prefix
    this.registerRouter(router)
    return router
  }

  /**
   * 注册路由
   *
   * @param {*} router Koa Router对象
   * @memberof Decorator
   */
  registerRouter (router) {
    for (const controller of this.controllerList) {
      // 获取类构造函数，就是类装饰器中的target参数
      const controllerCtor = controller.constructor
      const baseUrl = Reflect.getMetadata(BASE_URL, controllerCtor) || ''

      // 获取类对象上的所有属性
      const allProps = Object.getOwnPropertyNames(controller)
      for (const props of allProps) {
        const handle = controller[props]
        // 遍历所有属性中是函数 且存在路由信息的函数
        if (typeof handle !== 'function') { continue }
        const method = Reflect.getMetadata(METHOD, handle)
        const url = Reflect.getMetadata(METHOD_URL, handle)
        if (method && url && router[method]) {
          // 因为是demo 暂时不校验和转换各个url的格式
          // 实际使用中需要将三个路径拼接为合法的url格式
          const completeUrl = this.prefix + baseUrl + url
          // 把接口路径和函数注册到router对象上
          router[method](completeUrl, handle)
        }
      }
    }
  }


  /**
   * Controller 装饰器
   * 用来装饰Controller类
   *
   * @param {string} [baseUrl=''] 类的公共前缀
   * @returns
   * @memberof Decorator
   */
  Controller (baseUrl = '') {
    return (target) => {
      Reflect.defineMetadata(BASE_URL, baseUrl, target)
    }
  }

  /**
   * 用来生成各种方法装饰器的工具函数
   *
   * @param {*} method
   * @memberof Decorator
   */
  createMethodDecorator (method) {
    return  (url) => {
      return (target, name, decorator) => {
        // target 为装饰方法所在的类
        // 因为类方法的装饰器会比类的装饰器先执行, 在这个阶段拿不到 Controller 类的公共前缀
        // 所以要存下 target 后面再根据所存的信息生成 router
        this.controllerList.add(target)
        // decorator.value 为装饰的函数本身
        Reflect.defineMetadata(METHOD, method, decorator.value)
        // 没有指定请求的url就是用函数名作为url
        Reflect.defineMetadata(METHOD_URL, url || name, decorator.value)
      }
    }
  }
}

const decorator = new Decorator()

export const register = decorator.register.bind(decorator)

export const Controller = decorator.Controller

export const Get = decorator.createMethodDecorator('get')
export const Post = decorator.createMethodDecorator('post')
export const Put = decorator.createMethodDecorator('put')
export const Delete = decorator.createMethodDecorator('delete')
export const Options = decorator.createMethodDecorator('options')
export const All = decorator.createMethodDecorator('all')
export const load = function (path) {
  const ctx = requireContext(path, true, /\.js$/)
  ctx.keys().forEach(key => ctx(key))
}