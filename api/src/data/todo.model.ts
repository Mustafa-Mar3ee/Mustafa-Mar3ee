import mongoose from 'mongoose'

export interface TodoRequest extends Document {
  _id: string
  title: string
  describtion: string
  isComplete:boolean
  createdAt: Date
}

export const TodoSchema = new mongoose.Schema<TodoRequest>({
  title: {
    type: String,
    required: true,
  },
  describtion: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isComplete:{
    type:Boolean,
    default:false
  }
})
