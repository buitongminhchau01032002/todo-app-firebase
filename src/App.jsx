import { useState, useEffect } from 'react';
import './App.css';
import clsx from 'clsx';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import db from '../firebase';
const TODOS = [];

function removeVietnameseTones(stra) {
    var str = stra;
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, ' ');
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, ' ');
    return str;
}

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
    const [search, setSearch] = useState('');
    useEffect(() => {
        readFB();
    }, [search]);
    async function readFB() {
        const querySnapshot = await getDocs(collection(db, 'todos'));

        const tmpTodos = querySnapshot.docs
            .map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            .filter((todo) => {
                if (search === '') {
                    return todo;
                } else {
                    if (
                        removeVietnameseTones(todo.content.toLowerCase()).includes(
                            removeVietnameseTones(search.toLowerCase()),
                        )
                    ) {
                        var id = todo.id.toString();
                        return todo.id.toString().includes(id);
                    }
                }
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
                        value={search}
                        placeholder="Find todo"
                        onChange={(e) => setSearch(e.target.value)}
                    />
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
