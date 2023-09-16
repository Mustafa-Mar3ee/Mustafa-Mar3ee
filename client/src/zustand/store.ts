import axios, { AxiosInstance } from "axios";
import { GetState, SetState, create } from "zustand";

 
export interface Todo {
	_id: string;
	title: string;
	describtion: string;
	isComplete: boolean;
	createdAt: string;
	__v: number;
}

export interface PaginationInfo {
	totalPages: number;
	totalTodos: number;
}

export interface PagentedTodo {
	todos: Todo[];
	paginationInfo: PaginationInfo;
}
export type Params = Partial<{
  page: number;
  limit: number;
  sortBy: string;
  filter: string;
}>;
type TodoState = {
  todos: Todo[];
  paginationInfo: {};
  addTodo: (todo: Todo) => Promise<void>;
  toggleTodo: (id: string, data: Todo) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  updateTodo: (id: string, updatedTodo: Todo) => Promise<void>;
  reorderTodos: (startIndex: number, endIndex: number) => void;
  fetchTodos: (params: Params) => Promise<void>;
};

const useStore = create<TodoState>((set, get) => {
  const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:5000/",
  });

  return {
    todos: [],
    paginationInfo: {},
    addTodo: async (todo: Todo) => {
      try {
        const response = await api.post<Todo>("api/v1/todo", todo);
        const addedTodo = response.data as any;
        const data = addedTodo.data;
        set((state) => ({ todos: [...state.todos, data] }));
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    },
    toggleTodo: async (id: string) => {
      try {
        const todos = get().todos;
        const todo = todos.find((el) => el._id === id);
        const { isComplete, title } = { ...todo, isComplete: !todo.isComplete };
        await api.put(`api/v1/todo/${id}/`, { isComplete, title });
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo._id === id ? { ...todo, isComplete: !todo.isComplete } : todo
          ),
        }));
      } catch (error) {
        console.error("Error toggling todo:", error);
      }
    },
    deleteTodo: async (id: string) => {
      try {
        await api.delete(`api/v1/todo/${id}`);

        set((state) => ({
          todos: state.todos.filter((todo) => todo._id !== id),
        }));
      } catch (error) {
        console.error("Error deleting todo:", error);
      }
    },
    updateTodo: async (id: string, updatedTodo: Todo) => {
      try {
        const response = await api.put<Todo>(`api/v1/todo/${id}`, updatedTodo);
        const updated = response.data as any;
        const data = updated.data
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo._id === id ? { ...data } : todo
          ),
        }));
      } catch (error) {
        console.error("Error updating todo:", error);
      }
    },
    reorderTodos: (startIndex: number, endIndex: number) => {
      const todos = get().todos;
      const updatedTodos = [...todos];
      const [reorderedTodo] = updatedTodos.splice(startIndex, 1);
      updatedTodos.splice(endIndex, 0, reorderedTodo);
      set({ todos: updatedTodos });
    },
    fetchTodos: async (params) => {
      try {
        const response = await api.get<PagentedTodo[]>("api/v1/todo/", { params });
        const res = response.data as any ;
        const { todos, paginationInfo } = res.data
        set({ todos,paginationInfo });
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    },
  };
});

export { useStore };
