import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateRandomId } from "../utils/utils";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}
interface TodoStore {
  todos: Todo[];
  filter: string;
  setFilter: (filter: string) => void;
  addTodo: (text: string) => void;
  toggleComplete: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, newText: string) => void;
  clearCompleted: () => void;
  toggleAll: () => void;
}

const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      filter: "All", // Thêm filter mặc định
      setFilter: (filter: string) => set({ filter }), // Hàm thay đổi filter
      addTodo: (text: string) =>
        set((state) => ({
          todos: [
            ...state.todos,
            { text, completed: false, id: generateRandomId() },
          ],
        })),
      toggleComplete: (id: number) =>
        set((state) => {
          const updatedTodos = state.todos.map((todo, i) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          );
          return { todos: updatedTodos };
        }),
      deleteTodo: (id: number) =>
        set((state) => ({
          todos: state.todos.filter((todo, i) => todo.id !== id),
        })),
      editTodo: (id: number, newText: string) =>
        set((state) => {
          const updatedTodos = state.todos.map((todo, i) =>
            todo.id === id ? { ...todo, text: newText } : todo
          );
          return { todos: updatedTodos };
        }),
      clearCompleted: () =>
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed),
        })),
      toggleAll: () => {
        const { todos } = get();
        const allCompleted = todos.every((todo) => todo.completed);
        set({
          todos: todos.map((todo) => ({
            ...todo,
            completed: !allCompleted,
          })),
        });
      },
    }),
    {
      name: "todo-storage",
    }
  )
);
export default useTodoStore;
