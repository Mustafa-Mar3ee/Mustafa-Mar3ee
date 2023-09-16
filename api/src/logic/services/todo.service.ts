import { injectable } from "inversify";
import { TodoRequest } from './../../data/todo.model';
import { TodoRepository } from './../../data/todo.repository';
import logger from '../../web/logger';
import TodoDTO from "../dto/todo";
import { validate } from "class-validator";

@injectable()
export class TodoService {
    constructor(private readonly _todoRepo: TodoRepository) { }

    async create(todo: TodoRequest) {
        try {
            const { title, describtion, isComplete } = todo;
            const todoDto = new TodoDTO(title, describtion, isComplete);
            const errors = await validate(todoDto);
            
            if (errors.length > 0) {
                console.error('Validation errors:', errors);
                return;
            }
            
            const createdTodo = await this._todoRepo.create(todo);
            return createdTodo;
        } catch (error) {
            logger.error(`message - Service create Todo ${error}`);
            throw error;
        }
    }

    async all({ filter, sortBy, limit, page }) {
        try {
            const todos = await this._todoRepo.all({ filter, sortBy, limit, page });
            return todos;
        } catch (error) {
            logger.error(`message - Service all Todo ${error}`);
            throw error;
        }
    }

    async find(todoId: string) {
        try {
            const todo = await this._todoRepo.find(todoId);
            return todo;
        } catch (error) {
            logger.error(`message - Service find Todo ${error}`);
            throw error;
        }
    }

    async update(todo: TodoRequest, todoId: string) {
        try {
            const updatedTodo = await this._todoRepo.update(todo, todoId);
            console.log("🚀 ~ file: todo.service.ts:51 ~ TodoService ~ update ~ Todo:", todo);
            return updatedTodo;
        } catch (error) {
            logger.error(`message - Service update Todo ${error}`);
            throw error;
        }
    }

    async clear() {
        try {
            const clearedTodos = await this._todoRepo.clear();
            return clearedTodos;
        } catch (error) {
            logger.error(`message - Service Clear Todo ${error}`);
            throw error;
        }
    }

    async delete(todoId: string) {
        try {
            const deletedTodo = await this._todoRepo.deleteOne(todoId);
            return deletedTodo;
        } catch (error) {
            logger.error(`message - Service Delete Todo ${error}`);
            throw error;
        }
    }
}
