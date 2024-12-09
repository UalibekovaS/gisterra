(function () {
    var taskData = [];
    var assignedTaskId = null; // Track the current assigned task ID
    var assignedTask = false; // Track if the user has a pending task
 
 
    async function checkUserTaskStatus() {
        const userId = getUserIdFromUrl();
        if (!userId) {
            console.error("User ID not found in URL.");
            $gameMessage.add("Error: User ID is required to check tasks.");
            return false;
        }
 
 
        try {
            const response = await fetch(`http://localhost:3000/api/user-task-status/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch assigned task status. Status: ' + response.status);
            }
 
 
            const data = await response.json();
            console.log("Assigned task status:", data);
 
 
            if (data.status === 'pending') {
                assignedTaskId = data.task._id; // Store the assigned task ID
                assignedTask = true; // Task is assigned
                return true;
            }
 
 
            assignedTaskId = null;
            assignedTask = false;
            return false;
        } catch (error) {
            console.error("Error fetching assigned task status:", error);
            return false;
        }
    }
 
 
    async function displayTasks() {
        const hasPendingTask = await checkUserTaskStatus();
 
 
        if (hasPendingTask) {
            $gameMessage.add("You cannot take another task until your \ncurrent task is completed.");
            return; // Exit if the player still has an active task
        }
 
 
        try {
            const response = await fetch('http://localhost:3000/api/tasks');
            if (!response.ok) {
                throw new Error('Failed to fetch tasks. Status: ' + response.status);
            }
 
 
            taskData = await response.json();
            taskData = taskData.filter(task => task.status === 'not assigned'); // Filter only unassigned tasks
            console.log("Tasks fetched:", taskData);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            $gameMessage.add("Failed to load tasks. Try again later.");
            return;
        }
 
 
        if (taskData.length === 0) {
            $gameMessage.add("No tasks available at the moment.");
            return;
        }
 
 
        console.log("Displaying tasks:");
        taskData.forEach((task, index) => console.log(index + 1 + ". " + task.title));
 
 
        $gameMessage.add("Available tasks:");
        taskData.forEach(task => $gameMessage.add(task.title));
 
 
        const taskChoices = taskData.map(task => task.title);
 
 
        $gameMessage.add("Choose a task:");
        $gameMessage.setChoices(taskChoices, 0, -1);
 
 
        $gameMessage.setChoiceCallback(choiceIndex => {
            const selectedTask = taskData[choiceIndex];
            $gameVariables.setValue(1, selectedTask._id);
 
 
            $gameMessage.add("You have chosen the task: " + selectedTask.title);
            $gameMessage.add("Good luck with your task!");
 
 
            saveTaskToServer(selectedTask);
        });
    }
 
 
    function saveTaskToServer(selectedTask) {
        const userId = getUserIdFromUrl();
        const taskDataToSave = {
            userId: userId,
            taskId: selectedTask._id,
            taskName: selectedTask.title
        };
 
 
        fetch('http://localhost:3000/api/saveTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskDataToSave)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Task saved successfully:", data);
            })
            .catch(error => {
                console.error("Error saving task to server:", error);
            });
    }
 
 
    function getUserIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('userId');
    }
 
 
    window.displayTasks = displayTasks;
 })();
 