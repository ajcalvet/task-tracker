import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const TaskList = ({ tasks, setTasks }) => {
    /*
    const [tasks, setTasks] = useState([]);
    
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetch(`${API_URL}/Tasks`)
            .then(res => res.json())
            .then(data => { console.log('Fetched tasks:', data); setTasks(data); })
            .catch(err => console.error('Error fetching tasks:', err))
    }, []);
    */

    tasks.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
    });

    const tasksWithDueDate = tasks.filter(task => task.dueDate);
    const tasksWithoutDueDate = tasks.filter(task => !task.dueDate);
    
    const getBackgroundColor = (task) => {
        if (task.isComplete) return '#e6ffe6';  // light green
        if (task.dueDate)    return '#ffe6e6';  // light red
        return '#e6f7ff';                       // light blue
    };

    const getButtonColor = (task) => {
        if (task.isComplete && task.dueDate)    return '#ff1e2f';   // red
        if (task.dueDate || !task.isComplete)   return '#4cbb17';   // green
        return '#007bff';                                           // blue
    };    

    const getStatusText = (task) => {
        if (task.isComplete) return '✅ Complete';
        if (task.dueDate)    return '❌ Incomplete';
        return '🔄 In progress';
    };

    const toggleComplete = (task) => {
        fetch(`${process.env.REACT_APP_API_URL}/Tasks/${task.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json-patch+json'
            },
            body: JSON.stringify([
            {
                op: 'replace',
                path: '/isComplete',
                value: !task.isComplete
            }])
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to update task');
            }
            return res.json();
        })
        .then(updatedTask => {
            // Update local state
            setTasks(prevTasks => prevTasks.map(prevTask => (prevTask.id === updatedTask.id ? updatedTask : prevTask)));
        })
        .catch(err => console.error('Error updating task:', err));
    };

    const deleteTask = async (id) => {
        // const confirmed = window.confirm("Are you sure you want to delete this task?");
        // if (!confirmed) return;

        const result = await MySwal.fire({
            title: 'Delete this task?',
            text: 'This action cannot be undone.',
            //icon: 'error',
            showCancelButton: true,
            confirmButtonColor: 'white',
            cancelButtonColor: 'white',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'my-swal-font',
                confirmButton: 'my-swal-button',
                cancelButton: 'my-swal-button'
            }
        });

        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/Tasks/${id}`, {
                method: 'DELETE'
            });
      
            if (response.ok) {
                setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
            } else {
                console.error('Failed to delete task');
            }
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    };

    const updateTask = (updatedTask) => {
        fetch(`${process.env.REACT_APP_API_URL}/Tasks/${updatedTask.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json-patch+json'
            },
            body: JSON.stringify([
                { op: 'replace', path: '/title', value: updatedTask.title },
                { op: 'replace', path: '/description', value: updatedTask.description },
                { op: 'replace', path: '/dueDate', value: updatedTask.dueDate },
                { op: 'replace', path: '/isComplete', value: updatedTask.isComplete }
            ])
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to update');
            return res.json();
        })
        .then(() => {
            // Refresh tasks after update
            setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
        })
        .catch(() => {
            Swal.fire('Error', 'Could not update task.', 'error');
        });
    };

    const handleEdit = (task) => {
        Swal.fire({
            title: 'Edit Task',
            html:
            `
              <input id="swal-title" class="swal-input" placeholder="Title" value="${task.title}">
              <textarea id="swal-desc" class="swal-input" placeholder="Description">${task.description}</textarea>
              <input id="swal-date" type="date" class="swal-input" value="${task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-CA') : ''}">
              <label style="margin-top: 1rem;">
                <input type="checkbox" id="swal-complete" ${task.isComplete ? 'checked' : ''}>
                <strong>Mark as Complete</strong>
              </label>
            `,
            showCancelButton: true,
            confirmButtonText: 'Save',
            customClass: {
              popup: 'my-swal-font',
              confirmButton: 'my-swal-button',
              cancelButton: 'my-swal-button',
              html: 'my-swal-font'
            },
            preConfirm: () => {
                const rawDate = document.getElementById('swal-date').value;
                let dueDate = null;
                if (rawDate) {
                    const [year, month, day] = rawDate.split('-');
                    dueDate = new Date(year, month - 1, day)
                }
                const updatedTask = {
                    ...task,
                    title: document.getElementById('swal-title').value,
                    description: document.getElementById('swal-desc').value,
                    dueDate: dueDate,
                    isComplete: document.getElementById('swal-complete').checked
              };
              return updatedTask;
            }
          }).then(result => {
            if (result.isConfirmed) {
              updateTask(result.value);
            }
          });        
    };

    const renderTaskList = (taskArray) => (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
            {taskArray.map(task => (
                <li
                    key={task.id}
                    className="task-item"
                    style={{
                        border: '1px solid #ccc',
                        marginBottom: '1rem',
                        padding: '1rem',
                        borderRadius: '5px',
                        position: 'relative',
                        backgroundColor: getBackgroundColor(task)
                    }}
                >
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    {task.dueDate && ( // Only render due date if there is one
                        <p>
                            <strong>Due:</strong>{' '}
                            {task.dueDate
                                ? new Date(task.dueDate).toLocaleDateString()
                                : 'No Due Date'}
                        </p>
                    )}
                    <p>
                        <strong>Status:</strong> {getStatusText(task)} {'   '}
                    </p>
                    <button
                        onClick={() => toggleComplete(task)}
                        style={{
                            position: 'absolute',
                            bottom: '1rem',
                            right: '15rem',
                            marginTop: '0.5rem',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: getButtonColor(task),
                            color: 'white',
                            fontWeight: 'bold',
                            fontFamily: 'Georgia',
                            fontSize: '1rem',
                            width: '120px',
                            height: '45px'
                        }}
                        >
                        {task.isComplete ? (task.dueDate? 'Mark Incomplete' : 'Mark In Progress') : 'Mark Complete'}
                    </button>
                    <button
                        onClick={() => deleteTask(task.id)}
                        style={{
                            position: 'absolute',
                            bottom: '1rem',
                            right: '1rem',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '4px',
                            backgroundColor: '#333333',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontFamily: 'Georgia',
                            fontSize: '1rem',
                            width: '6rem',
                            height: '45px'
                        }}
                        >
                        Delete
                    </button>
                    <button 
                        onClick={() => handleEdit(task)} 
                        style={{
                            position: 'absolute',
                            bottom: '1rem',
                            right: '8rem',
                            backgroundColor: '#fff',
                            color: '#555',
                            border: '1px solid gray',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontFamily: 'Georgia',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            marginRight: '0.5rem',
                            width: '5rem',
                            height: '45px'
                        }}
                        >
                        Edit
                    </button>
                </li>
            ))}
        </ul>        
    );

    const bothEmpty = tasksWithDueDate.length === 0 && tasksWithoutDueDate.length === 0;

    return (
        <div style={{ margin: '0 auto 0 auto' }}>
            <h1 style={{ textAlign: 'center', marginTop: '0' }}>Task List</h1>
            {bothEmpty ? (
                <p>No tasks found.</p>
            ) : (
                <div style={{ display: 'flex', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ flex: 1 }}>
                        <h2>Tasks with Deadline</h2>
                        {tasksWithDueDate.length === 0 ? (
                            <p>No tasks.</p>
                        ) : (
                            renderTaskList(tasksWithDueDate)
                        )}                        
                    </div>

                    <div style={{ flex: 1 }}>
                        <h2>No-rush Tasks</h2>
                        {tasksWithoutDueDate.length === 0 ? (
                            <p>No tasks.</p>
                        ) : (
                            renderTaskList(tasksWithoutDueDate)
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskList;