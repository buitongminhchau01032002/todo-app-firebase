import { useRef, useState } from 'react';
import './App.css';
import clsx from 'clsx';

const TODOS = [
    {
        id: 1,
        content: 'Learn JavaScript',
        completed: false,
    },
    {
        id: 2,
        content: 'Lear HTML',
        completed: true,
    },
];

function TodoItem({ todo, onTodoCompletedChange, onTodoContentChange, onTodoDelete }) {
    const [editing, setEditing] = useState(false);
    const [content, setContent] = useState(todo.content);
    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            onTodoContentChange(todo.id, content);
            setEditing(false);
        }
    }
    return (
        <li
            class={clsx({
                completed: todo.completed,
                view: !todo.completed,
                editing: editing,
            })}
        >
            <div class="view">
                <input
                    class="toggle"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onTodoCompletedChange(todo.id, !todo.completed)}
                />
                <label onClick={() => setEditing(!editing)}>{todo.content}</label>
                <button class="destroy" onClick={() => onTodoDelete(todo.id)}></button>
            </div>
            <input
                class="edit"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={() => setEditing(false)}
                onKeyDown={handleKeyDown}
            />
        </li>
    );
}

function App() {
    const [todos, setTodos] = useState(TODOS);
    const [content, setContent] = useState('');
    function handleTodoContentChange(id, content) {
        const todosTemp = todos.map((todo) => {
            if (todo.id === id) {
                return { ...todo, content };
            }
            return todo;
        });
        setTodos(todosTemp);
    }
    function handleTodoCompletedChange(id, completed) {
        const todosTemp = todos.map((todo) => {
            if (todo.id === id) {
                return { ...todo, completed };
            }
            return todo;
        });
        setTodos(todosTemp);
    }
    function handleTodoDelete(id) {
        const todosTemp = todos.filter((todo) => todo.id !== id);
        setTodos(todosTemp);
    }
    function handleAddTodoKeyDown(e) {
        if (e.key === 'Enter') {
            setTodos([
                ...todos,
                {
                    id: Math.random(),
                    content,
                    completed: false,
                },
            ]);
        }
    }
    return (
        <>
            <section class="todoapp">
                <header class="header">
                    <h1>todos</h1>
                    <input
                        class="new-todo"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleAddTodoKeyDown}
                        placeholder="What needs to be done?"
                        autofocus
                    />
                </header>

                <section class="main">
                    <input id="toggle-all" class="toggle-all" type="checkbox" />
                    <label for="toggle-all">Mark all as complete</label>
                    <ul class="todo-list">
                        {todos.map((todo) => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onTodoCompletedChange={handleTodoCompletedChange}
                                onTodoContentChange={handleTodoContentChange}
                                onTodoDelete={handleTodoDelete}
                            />
                        ))}
                    </ul>
                </section>

                <footer class="footer">
                    <span class="todo-count">
                        <strong>0</strong> item left
                    </span>

                    <ul class="filters">
                        <li>
                            <a class="selected" href="#/">
                                All
                            </a>
                        </li>
                        <li>
                            <a href="#/active">Active</a>
                        </li>
                        <li>
                            <a href="#/completed">Completed</a>
                        </li>
                    </ul>
                    <button class="clear-completed">Clear completed</button>
                </footer>
            </section>
            <footer class="info">
                <p>Double-click to edit a todo</p>
                <p>
                    Template by <a href="http://sindresorhus.com">Sindre Sorhus</a>
                </p>
                <p>
                    Created by <a href="http://todomvc.com">you</a>
                </p>
                <p>
                    Part of <a href="http://todomvc.com">TodoMVC</a>
                </p>
            </footer>
        </>
    );
}

export default App;