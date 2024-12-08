(function () {
    var assignedTaskId = null; // Track the current assigned task ID

    // Function to fetch the assigned task status
    async function fetchAssignedTaskStatus() {
        const userId = getUserIdFromUrl();
        if (!userId) {
            console.error("User ID not found in URL.");
            $gameMessage.add("Error: User ID is required to check tasks.");
            return null;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/user-task-status/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch assigned task status. Status: ' + response.status);
            }

            const data = await response.json();
            console.log("Assigned task status:", data);

            if (data.status === 'pending') {
                assignedTaskId = data.taskId; // Store the assigned task ID
                return data;
            } else {
                assignedTaskId = null; // No pending task
                return null;
            }
        } catch (error) {
            console.error("Error fetching assigned task status:", error);
            return null;
        }
    }

    // Function to handle interaction with the character
    async function interactWithCharacter() {
        const taskData = await fetchAssignedTaskStatus();

        if (!taskData) {
            $gameMessage.add("You don't have any assigned tasks.");
            return;
        }

        $gameMessage.add("Have you completed the task: " + taskData.taskName + "?");

        // Show Yes/No choices
        $gameMessage.setChoices(["Yes", "No"], 0, -1);
        $gameMessage.setChoiceCallback(async function (choiceIndex) {
            if (choiceIndex === 0) {
                // Player selected "Yes"
                $gameMessage.add("Great! Updating your task status...");
                await updateTaskStatus(taskData.taskId);
                $gameMessage.add("The task status has been updated. Please wait for approval.");
            } else {
                // Player selected "No"
                $gameMessage.add("Keep working on your task!");
            }
        });
    }

    // Function to update task status
    async function updateTaskStatus(taskId) {
        const userId = getUserIdFromUrl();

        if (!userId || !taskId) {
            console.error("User ID or Task ID is missing.");
            $gameMessage.add("Error: Cannot update task status.");
            return;
        }

        try {
            // Update the task in the tasks table
            const taskUpdateResponse = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'waiting for approval' })
            });

            if (!taskUpdateResponse.ok) {
                throw new Error('Failed to update task status in tasks table.');
            }

            console.log("Task status updated in tasks table.");

            // Update the user-task in the user-task table
            const userTaskUpdateResponse = await fetch(`http://localhost:3000/api/user-tasks/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'in progress' })
            });

            if (!userTaskUpdateResponse.ok) {
                throw new Error('Failed to update task status in user-task table.');
            }

            console.log("Task status updated in user-task table.");
        } catch (error) {
            console.error("Error updating task status:", error);
            $gameMessage.add("Failed to update task status. Please try again later.");
        }
    }

    // Get the user ID from the URL
    function getUserIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('userId');
    }

    // Make the interaction function accessible globally
    window.interactWithCharacter = interactWithCharacter;
})();
