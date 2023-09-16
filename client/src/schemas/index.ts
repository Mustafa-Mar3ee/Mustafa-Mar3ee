import * as yup from 'yup'
export const TodoSchema = yup.object({
    title:yup.string().min(4).max(25).required("Title is required"),
    describtion:yup.string().min(4).max(125).required("Describtion is required")
  })
  