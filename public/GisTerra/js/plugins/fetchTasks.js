(function() {
    // Store tasks in a global variable
    var taskData = [];

    // Function to fetch tasks from your server
    function fetchTasksFromAPI() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:4001/getTasks', true);  // Replace with your server URL

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {  // Request is complete
                if (xhr.status === 200) {  // Successfully received a response
                    try {
                        taskData = JSON.parse(xhr.responseText);  // Parse the JSON response from the server
                        console.log("Tasks fetched:", taskData);
                    } catch (e) {
                        console.error("Error parsing tasks from server:", e);  // Handle JSON parsing errors
                    }
                } else {
                    console.error("Failed to fetch tasks. Status:", xhr.status);  // Log the error if the request fails
                }
            }
        };

        xhr.send();  // Send the request to the server
    }

    // Fetch tasks when the game starts
    fetchTasksFromAPI();

    // Function to display tasks and allow player to choose
    function displayTasks() {
        var tasks = taskData;  // Fetch tasks

        if (tasks.length === 0) {
            console.log("No tasks to display");
            $gameMessage.add("No tasks available at the moment.");
            return;  // Exit if no tasks are available
        }

        console.log("Displaying tasks:");
        tasks.forEach(function(task, index) {
            console.log(index + 1 + ". " + task.name);  // For debugging, log each task
        });

        // Display tasks in the RPG Maker MV message window
        $gameMessage.add("Available tasks:");
        tasks.forEach(function(task) {
            $gameMessage.add(task.name);  // Display each task in the message window
        });

        // Show the task choices in the choice window
        var taskChoices = tasks.map(function(task) {
            return task.name;  // Create a list of task names for the choices
        });

        // Set up the choices for the player to select
        $gameMessage.add("Choose a task:");

        // Set the choices (task names) and specify callback function for the player's choice
        $gameMessage.setChoices(taskChoices, 0, -1);

        // Handle the player's choice selection
        $gameMessage.setChoiceCallback(function(choiceIndex) {
            // When the player selects a task
            var selectedTask = tasks[choiceIndex];  // Get the selected task
            $gameVariables.setValue(1, selectedTask.id);  // Store the task ID in a game variable (e.g., variable 1)
        
            // Display the selected task in the message window **after** they choose
            $gameMessage.add("You have chosen the task: " + selectedTask.name);
            $gameMessage.add("Good luck with your task!");
    
            saveTaskToServer(selectedTask);
            // Wait for a few seconds before continuing the event and closing the message window
        });
        
    }

    // Make the function accessible globally to call when needed
    window.displayTasks = displayTasks;


    function saveTaskToServer(selectedTask) {
        var userId = 1; // Example user ID (replace with the actual user ID)
        var taskDataToSave = {
            userId: userId,
            taskId: selectedTask.id,
            taskName: selectedTask.name
        };

        // Use fetch to send the data to your server
        fetch('http://localhost:4001/saveTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskDataToSave)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Task saved successfully:', data);
        })
        .catch(error => {
            console.error('Error saving task to server:', error);
        });
    }

})();
