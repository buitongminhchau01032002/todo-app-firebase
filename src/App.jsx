import { useState, useEffect } from 'react';
import './App.css';
import clsx from 'clsx';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import db from '../firebase';
const TODOS = [];

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
            className={clsx({
                completed: todo.completed,
                view: !todo.completed,
                editing: editing,
            })}
        >
            <div className="view">
                <input
                    className="toggle"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onTodoCompletedChange(todo.id, !todo.completed)}
                />
                <label onClick={() => setEditing(!editing)}>{todo.content}</label>
                <button className="destroy" onClick={() => onTodoDelete(todo.id)}></button>
            </div>
            <input
                className="edit"
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
    useEffect(() => {
        readFB();
    }, []);
    async function readFB() {
        const querySnapshot = await getDocs(collection(db, 'todos'));
        let tmpTodos = [];
        querySnapshot.forEach((doc) => {
            tmpTodos.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        setTodos(tmpTodos);
    }

    async function handleTodoContentChange(id, content) {
        const todoRef = doc(db, 'todos', id);

        // Set the "capital" field of the city 'DC'
        await updateDoc(todoRef, {
            content: content,
        });
        await readFB();
    }
    async function handleTodoCompletedChange(id, completed) {
        const todoRef = doc(db, 'todos', id);

        // Set the "capital" field of the city 'DC'
        await updateDoc(todoRef, {
            completed: completed,
        });
        await readFB();
    }
    async function handleTodoDelete(id) {
        await deleteDoc(doc(db, 'todos', id));
        await readFB();
    }
    async function handleAddTodoKeyDown(e) {
        if (e.key === 'Enter') {
            try {
                const docRef = await addDoc(collection(db, 'todos'), {
                    content: content,
                    completed: false,
                });

                console.log('Document written with ID: ', docRef.id);
            } catch (e) {
                console.error('Error adding document: ', e);
            }
            await readFB();
            setContent('');
        }
    }
    return (
        <>
            <section className="todoapp">
                <header className="header">
                    <h1 style={{ color: '#FC8EAC' }}>todos</h1>
                    <input
                        className="new-todo"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleAddTodoKeyDown}
                        placeholder="What needs to be done?"
                        autoFocus
                    />
                </header>

                <section className="main">
                    <input id="toggle-all" className="toggle-all" type="checkbox" />
                    <label htmlFor="toggle-all">Mark all as complete</label>
                    <ul className="todo-list">
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

                <footer className="footer">
                    <span className="todo-count">
                        <strong>0</strong> item left
                    </span>

                    <ul className="filters">
                        <li>
                            <a className="selected" href="#/">
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
                    <button className="clear-completed">Clear completed</button>
                </footer>
            </section>
            <footer className="info">
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
