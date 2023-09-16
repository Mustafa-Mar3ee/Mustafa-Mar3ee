import { injectable } from 'inversify'
import mongoose from 'mongoose'
import { TodoRequest, TodoSchema } from './todo.model'

 
@injectable()
export class DBContext {
  private _db: typeof mongoose

  async connect() {
    this._db = await mongoose.connect(process.env.DB_URI)
    console.log('connected to DB 🥳')
  }
get todos(){
  return this._db.model<TodoRequest>("todos",TodoSchema)

}
   
}
