import React, { useState } from "react"
import useTodoStore from "../../store/todoStore"
import clsx from "clsx"

const filterButtons = [
    {
        title: "All"
    },
    {
        title: "Active"
    },
    {
        title: "Completed"
    }
]

const TodoApp = () => {
    const [newTodo, setNewTodo] = useState<string>("")
    const [editing, setEditing] = useState<number | null>(null)
    const {
        todos,
        addTodo,
        toggleComplete,
        deleteTodo,
        editTodo,
        filter,
        setFilter,
        clearCompleted,
        toggleAll
    } = useTodoStore()

    const handleAddTodo = () => {
        if (newTodo.trim() !== "" && newTodo.length > 1) {
            addTodo(newTodo)
            setNewTodo("")
        }
    }

    const filteredTodos = todos.filter((todo) => {
        if (filter === "Active") return !todo.completed
        if (filter === "Completed") return todo.completed
        return true
    })

    const activeTodoCount = todos.filter(todo => !todo.completed).length;

    return (
        <div className="todo-app">
            <div className="bg-gray-100 py-2 px-4">
                <h2 className="text-xl font-semibold text-gray-800">Todo List</h2>
            </div>
            <div className="rounded mx-auto max-w-[600px] shadow-xl flex gap-4 my-4">
                <button onClick={toggleAll} className="w-16 flex justify-center items-center"><img src="icon-arrow.svg" className="w-6" /></button>
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewTodo(e.target.value)
                    }
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                        e.key === "Enter" && handleAddTodo()
                    }
                    placeholder="What needs to be done?"
                    className="text-base overflow-ellipsis w-full focus:outline-none py-4 sm:py-4.5 px-8 cursor-pointer"
                />
            </div>

            <ul className="divide-y divide-gray-200 max-w-96 mx-auto my-5">
                {filteredTodos.map((todo) => (
                    <li key={todo.id} className="group flex items-center py-4 px-6">
                        <div className="flex gap-4">
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => toggleComplete(todo.id)}
                            />

                            {editing === todo.id ? (
                                <input
                                    type="text"
                                    value={todo.text}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        editTodo(todo.id, e.target.value)
                                    }
                                    autoFocus
                                    onBlur={() => setEditing(null)}
                                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                                        e.key === "Enter" && setEditing(null)
                                    }
                                />
                            ) : <span
                                    onDoubleClick={() => setEditing(todo.id)}
                                style={{
                                    textDecoration: todo.completed ? "line-through" : "none",
                                }}
                            >
                                {todo.text}
                            </span>}
                        </div>
                        <button className="ml-auto hidden group-hover:block" onClick={() => deleteTodo(todo.id)}><img src="icon-delete.svg" className="w-6" /></button>
                    </li>
                ))}
            </ul>

            <div className="filters flex flex-col items-center justify-center gap-5 mt-6 md:flex-row">
                <p className="text-gray-500 text-left flex items-center">{activeTodoCount} items left!</p>
                {
                    filterButtons.map((btn, index) => (
                        <button
                            key={index}
                            onClick={() => setFilter(btn.title)}
                            className={clsx(
                                "inline-block w-auto text-center min-w-[100px] px-4 py-2 rounded-md shadow-xl sm:w-auto",
                                {
                                    "bg-gradient-to-r from-blue-600 to-blue-500 text-white": filter === btn.title
                                }
                            )}
                        >
                            {btn.title}
                        </button>
                    ))
                }

                <button
                    onClick={clearCompleted}
                    className={clsx(
                        "inline-block w-auto text-center min-w-[100px] px-4 py-2 rounded-md shadow-xl",
                    )}
                >
                    Clear Completed
                </button>
            </div>
        </div>
    )
}

export default TodoApp
