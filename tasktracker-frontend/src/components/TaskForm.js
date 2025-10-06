import React, { useState } from 'react';

const TaskForm = ({ onTaskAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('')

    const API_URL = process.env.REACT_APP_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newTask = {
            title,
            description,
            dueDate: dueDate ? dueDate : null,
            isComplete: false
        };

        try {
            const response = await fetch(`${API_URL}/Tasks`, {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(newTask)
            });

            if (response.ok) {
                const createdTask = await response.json();
                onTaskAdded(createdTask);
                setTitle('');
                setDescription('');
                setDueDate('');
            } else {
                console.error('Failed to add task');
            }
        } catch(error) {
            console.error('Error submitting task', error);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <input
                    type="text"
                    placeholder="Task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={inputStyle}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={inputStyle}
                />
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={inputStyle}
                />
                <button type="submit" style={buttonStyle}>Add New Task</button>
            </form>
        </div>
    );
};

export default TaskForm;

// Styles
const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '2rem'
};

const inputStyle = {
    padding: '0.5rem',
    fontSize: '1rem',
    fontFamily: 'Georgia'
};
  
const buttonStyle = {
    padding: '0.6rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    borderRadius: '8px'
};