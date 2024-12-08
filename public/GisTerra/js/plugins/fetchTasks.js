(function () {
    // Store tasks in a global variable
    var taskData = [];
    var assignedTaskId = null; // Track the current assigned task ID
    var assignedTask = false; // Track if the user has a pending task

    // Function to check the user's task status from the server
    async function checkUserTaskStatus() {
        const userId = getUserIdFromUrl(); // Get userId from URL

        if (!userId) {
            console.error("User ID not found in URL.");
            $gameMessage.add("Error: User ID is required to access tasks.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/user-task-status/${userId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch user task status. Status: ' + response.status);
            }

            const data = await response.json();
            console.log("User task status:", data);

            // Update the assignedTask variable based on the user's status
            assignedTask = data.status === 'pending';
        } catch (error) {
            console.error("Error checking user task status:", error);
        }
    }

    // Function to fetch tasks from your server
    async function fetchTasksFromAPI() {
        await checkUserTaskStatus(); // Ensure the user task status is checked before continuing

        if (assignedTask) {
            $gameMessage.add("You cannot take another task until your \ncurrent task is completed.");
            return; // Exit if the user already has a pending task
        }

        try {
            const response = await fetch('http://localhost:3000/api/tasks'); // Replace with your server URL

            if (!response.ok) {
                throw new Error('Failed to fetch tasks. Status: ' + response.status);
            }

            taskData = await response.json();
            taskData = taskData.filter(task => task.status === 'not assigned'); // Filter only unassigned tasks
            console.log("Tasks fetched:", taskData);
        } catch (error) {
            console.error("Error fetching tasks:", error); // Handle fetch errors
        }
    }

    // Function to display tasks and allow player to choose
    function displayTasks() {
        if (assignedTask) {
            console.log("You still have an assigned task.");
            $gameMessage.add("You cannot take another task until your \ncurrent task is completed.");
            return; // Exit if the player still has an active task
        }

        if (taskData.length === 0) {
            console.log("No tasks to display.");
            $gameMessage.add("No tasks available at the moment.");
            return; // Exit if no tasks are available
        }

        console.log("Displaying tasks:");
        taskData.forEach((task, index) => console.log(index + 1 + ". " + task.title));

        // Display tasks in the RPG Maker MV message window
        $gameMessage.add("Available tasks:");
        taskData.forEach(task => $gameMessage.add(task.title));

        // Show the task choices in the choice window
        const taskChoices = taskData.map(task => task.title);

        $gameMessage.add("Choose a task:");
        $gameMessage.setChoices(taskChoices, 0, -1);

        $gameMessage.setChoiceCallback(choiceIndex => {
            const selectedTask = taskData[choiceIndex];
            $gameVariables.setValue(1, selectedTask._id); // Store the task ID in a game variable (e.g., variable 1)

            $gameMessage.add("You have chosen the task: " + selectedTask.title);
            $gameMessage.add("Good luck with your task!");

            saveTaskToServer(selectedTask);

            assignedTask = true; // Update the assigned task status
        });
    }

    // Make the function accessible globally to call when needed
    window.displayTasks = displayTasks;

    // Get the user ID from the URL
    function getUserIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('userId');
    }

    // Function to save the selected task to the server
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

    // Fetch tasks when the game starts
    fetchTasksFromAPI();
})();
