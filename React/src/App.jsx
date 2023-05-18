import './style.css'
import { useState } from 'react'

export default function App () {
  const [newEntry, setNewEntry] = useState("")
  const [toDos, setToDos] = useState([])

  function handleSubmit(e) {
    e.preventDefault()
    setToDos((currentToDos) => {
      return [
        ...currentToDos,
        {
          id: crypto.randomUUID(),
          title: newEntry,
          completed: false
        }
      ]
    })

    setNewEntry("")
  }

  function toggleToDo(id, completed) {
    setToDos(currentToDos => {
      return currentToDos.map(todo => {
        if (todo.id === id){
          return {...todo, completed}
        }
        return todo
      })
    })
  }

  function deleteToDo(id) {
    setToDos(currentToDos => {
      return currentToDos.filter(todo => todo.id !== id)
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="new-item-form">
        <div className="form-row">
          <label htmlFor="item">New Entry</label>
          <input 
            value={newEntry}
            onChange={e => setNewEntry(e.target.value)}
            type="text"
            id="item"
          />
        </div>
        <button className="btn">Add</button>
      </form>
      <h1 className="header">To Do List</h1>
      <ul className="list">
        {toDos.length === 0 && "No To Dos to display"}
        {toDos.map(todo => {
          return (
            <li key={todo.id}>
              <label>
                <input 
                  type="checkbox"
                  checked={todo.completed}
                  onChange={e => toggleToDo(todo.id, e.target.checked)}
                />
                {todo.title}
              </label>
              <button 
                onClick={() => deleteToDo(todo.id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </li>
          )
        })}
        
      </ul>
    </>
  )
}