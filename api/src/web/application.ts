import express,{Request,Response,NextFunction,ErrorRequestHandler} from 'express'
import cors from 'cors';

import {InversifyExpressServer} from 'inversify-express-utils'

import { Container } from 'inversify'


import morgan from 'morgan'
import { Application, IAbstractApplicationOptions } from './lib/abstract-application'
import { MorganMode } from './lib/enums'

import './controllers/todo.controller'


import { CouldNotFindSubscriberException, ValidationException } from './exceptions'
import { BaseHttpResponse } from './lib/base-http-response'
import { DBContext } from './../data/db.context';
import { TodoService } from './../logic/services/todo.service'

import { TodoRepository } from './../data/todo.repository' 
   
export class App extends Application {
    constructor(){
        super({
            containerOpts:{defaultScope:"Singleton"},
        
        morgan:{
            mode:MorganMode.DEV
        }
    }
        )
    }

configureServices(container:Container):void {
    container.bind(DBContext).toSelf()
    container.bind(TodoService).toSelf()
    container.bind(TodoRepository).toSelf()
}

async setup(options:IAbstractApplicationOptions){
    const _db = this.container.get(DBContext)
    await _db.connect()
    const server  = new InversifyExpressServer(this.container)
    server.setErrorConfig((app)=>{
        app.use((err:ErrorRequestHandler,req:Request,res:Response,next:NextFunction)=>{
            if(err instanceof ValidationException){
                const response  = BaseHttpResponse.failed(err.message,422)
                return res.status(response.statusCode).json(response)
            }
            if(err instanceof CouldNotFindSubscriberException){
                const response = BaseHttpResponse.failed(err.message, 404)
                return res.status(response.statusCode).json(response)
            }
            if (err instanceof Error) {
                const response = BaseHttpResponse.failed(err.message, 500)
                return res.status(response.statusCode).json(response)
              }
      
              next()
        })
    })

    
    server.setConfig((app) => {
        app.use(cors());
        app.use(express.json({limit: '50MB'}))
        app.use(morgan(options.morgan.mode))
      })
      const app = server.build()

    app.listen(process.env.PORT, () => {
      console.log(
        `server is running on http://localhost:${process.env.PORT}`
      )
    })
  }
}

new App()







 