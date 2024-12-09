'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from './OrganizerBoard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
const OrganizerBoard = () => {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedTo: '' });
  const [loading, setLoading] = useState(false); // To handle loading state
  const [taskBeingUpdated, setTaskBeingUpdated] = useState(null); // Track specific task for updating

  // Fetch tasks once the session is available
  useEffect(() => {
    if (session) {
      fetchTasks();
    }
  }, [session]);

  // Fetch tasks for the logged-in organizer
  const fetchTasks = async () => {
    if (session) {
      setLoading(true);
      try {
        const response = await fetch(`/api/tasks?createdBy=${session.userId}`);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle new task submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { userId, role } = session;

    const taskData = {
      title: taskForm.title,
      description: taskForm.description,
      userId: userId,
      role: role,
    };

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
        setTasks((prev) => [...prev, result]);
        setTaskForm({ title: '', description: '', assignedTo: '' }); // Reset form
      } else {
        console.error('Error creating task:', result);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle task approval (marking as completed)
  const handleTaskApproval = async (taskId, userId) => {
    setTaskBeingUpdated(taskId); // Mark this task as being updated
    try {
      const response = await fetch('http://localhost:3000/api/updateStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          taskId: taskId,
          taskStatus: 'completed',
          userTaskStatus: 'completed',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task status. Status: ' + response.status);
      }

      // Update task status in the local state
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: 'completed' } : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    } finally {
      setTaskBeingUpdated(null); // Clear the updating task
    }
  };

  const handleDeleteTask = async (taskId) => {
    console.log("Received deleting request in frontend");
    setTaskBeingUpdated(taskId); // Mark this task as being updated (disables buttons temporarily)
    try {
      const response = await fetch(`/api/tasks?taskId=${taskId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete task. Status: ' + response.status);
      }
  
      // Remove task from local state
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setTaskBeingUpdated(null); // Clear the updating task
    }
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
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Task...' : 'Create Task'}
        </button>
      </form>

      <div className={styles.tasks}>
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task._id} className={styles.task}>
              <h3>{task.title}</h3>
              <FontAwesomeIcon
                icon={faTrash}
                className={styles.trashIcon}
                onClick={() => handleDeleteTask(task._id)}
                title="Delete Task"
              />
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <p>
                Assigned to:{' '}
                {task.assignedTo
                  ? `${task.assignedTo.name} (${task.assignedTo.email})`
                  : 'Not assigned'}
              </p>
              <button
                onClick={() => handleTaskApproval(task._id, task.assignedTo._id)}
                disabled={task.status !== 'waiting for approval' || taskBeingUpdated === task._id}
              >
                {task.status === 'completed' ? 'Completed' : taskBeingUpdated === task._id ? 'Completing...' : 'Mark as Completed'}
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
