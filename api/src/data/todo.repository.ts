import { injectable } from 'inversify';
import { DBContext } from './db.context';
import logger from './../web/logger';
import { TodoRequest } from './todo.model';

@injectable()
export class TodoRepository {
    constructor(private readonly _dbContext: DBContext) {}

    async all({ filter, sortBy, limit, page }) {
        try {
            const skip = (page - 1) * limit;
            let query = this._dbContext.todos.find();

            if (sortBy) {
                const sortOrder = sortBy.startsWith('-') ? -1 : 1;
                query = query.sort({ [sortBy.slice(1)]: sortOrder });
            }

            if (skip) {
                query = query.skip(skip);
            }

            if (limit) {
                query = query.limit(limit);
            }

            if (filter) {
                const filterType = filter.startsWith('-') ? false : true;
                query = query.find({ isComplete: filterType });
            }

            const [todos, totalTodos] = await Promise.all([
                query,
                this._dbContext.todos.countDocuments()
            ]);

            const totalPages = Math.ceil(totalTodos / limit);
            const paginationInfo = {
                page,
                totalPages,
                totalTodos
            };

            return { todos, paginationInfo };
        } catch (error) {
            logger.error(`message - Get Todos ${error}`);
            throw error; // Rethrow the error to be caught and handled by the caller
        }
    }

    async find(id: string) {
        try {
            const todo = await this._dbContext.todos.findById(id);
            return todo;
        } catch (error) {
            logger.error(`message - Get Todos ${error}`);
            throw error;
        }
    }

    async create(entity: TodoRequest) {
        try {
            const todo = await this._dbContext.todos.create(entity);
            return todo;
        } catch (error) {
            logger.error(`message - Get Todos ${error}`);
            throw error;
        }
    }

    async update(data: Partial<TodoRequest>, id: string) {
        try {
            const todo = await this._dbContext.todos.findOneAndUpdate(
                { _id: id },
                { ...data },
                { new: true }
            );
            return todo;
        } catch (error) {
            logger.error(`message - Get Todos ${error}`);
            throw error;
        }
    }

    async deleteOne(id: string) {
        try {
            const todo = await this._dbContext.todos.deleteOne({ _id: id }, { new: true });
            return todo;
        } catch (error) {
            logger.error(`message - Get Todos ${error}`);
            throw error;
        }
    }

    async clear() {
        try {
            const todos = await this._dbContext.todos.deleteMany({});
            return todos;
        } catch (error) {
            logger.error(`message - Get Todos ${error}`);
            throw error;
        }
    }
}
