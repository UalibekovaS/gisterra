'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from './OrganizerBoard.module.css';

const OrganizerBoard = () => {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedTo: '' });

  // Fetch tasks once the session is available
  useEffect(() => {
    if (session) {
      fetchTasks();
    }
  }, [session]);
  // Fetch tasks for the logged-in organizer
  const fetchTasks = async () => {
    if (session) {
      const response = await fetch(`/api/tasks?createdBy=${session.userId}`);
      const data = await response.json();
      setTasks(data);
    }
  };

  // Handle new task submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Capture data from session (or user context)
    const { userId, role } = session; // Assuming session holds these values
  
    // Data to send to the backend (including task information)
    const taskData = {
      title: taskForm.title,
      description: taskForm.description,
      userId: userId,  // Pass the userId
      role: role,      // Pass the role
    };
    console.log(taskData);
  
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
  
      const result = await response.json();
      if (response.ok) {
        setTasks((prev) => [...prev, result]);  // Add task to the state
      } else {
        console.error('Error creating task:', result);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };
  

  // Handle task approval (marking as completed)
  const handleTaskApproval = async (taskId, status) => {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const updatedTask = await response.json();
    setTasks((prev) =>
      prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
  };

  // If no session or user isn't an organizer, show a message
  if (!session || session.role !== 'organizer') {
    return <p>You must be an organizer to access this page.</p>;
  }

  return (
    <div className={styles.board}>
      <h1>Organizer Board</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={taskForm.title}
          onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
          placeholder="Task title"
          required
        />
        <textarea
          value={taskForm.description}
          onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
          placeholder="Task description"
          required
        />
        <button type="submit">Create Task</button>
      </form>

      <div className={styles.tasks}>
        {tasks.length > 0 ? (
            tasks.map((task) => (
            <div key={task._id} className={styles.task}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Status: {task.status}</p>
                <p>Assigned to: {task.assignedTo ? task.assignedTo.name : 'Not assigned'}</p>
                <button
                onClick={() => handleTaskApproval(task._id, 'completed')}
                disabled={task.status === 'completed'}
                >
                Mark as Completed
                </button>
            </div>
            ))
        ) : (
            <p>No tasks available</p>
        )}
        </div>

    </div>
  );
};

export default OrganizerBoard;
