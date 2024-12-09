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
                assignedTaskId = data.task._id; // Store the assigned task ID
                console.log("Assigned Task ID:", assignedTaskId);
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
        const userId = getUserIdFromUrl();
        if (!taskData) {
            $gameMessage.add("You don't have any assigned tasks.");
            return;
        }
 
 
        $gameMessage.add("Have you completed the task: " + taskData.task.title + "?");
 
 
        // Show Yes/No choices
        $gameMessage.setChoices(["Yes", "No"], 0, -1);
        $gameMessage.setChoiceCallback(async function (choiceIndex) {
            if (choiceIndex === 0) {
                // Player selected "Yes"
                $gameMessage.add("Great! Updating your task status...");
                const success = await updateTaskStatus(taskData.task._id, userId);
                if (success) {
                    $gameMessage.add("The task status has been updated. Please wait for approval.");
                } else {
                    $gameMessage.add("Failed to update the task status. Please try again later.");
                }
            } else {
                // Player selected "No"
                $gameMessage.add("Keep working on your task!");
            }
        });
    }
 
 
    // Function to update task status
    async function updateTaskStatus(taskId, userId) {
        if (!userId || !taskId) {
            console.error("User ID or Task ID is missing.");
            return false;
        }
   
        try {
            console.log(taskId);
            console.log(userId);
            const response = await fetch('http://localhost:3000/api/updateStatus', {
                method: 'POST',  // Change from PATCH/PUT to POST
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    taskId: taskId,
                    taskStatus: 'waiting for approval',
                    userTaskStatus: 'in-progress'
                })
            });
   
            if (!response.ok) {
                throw new Error('Failed to update task status. Status: ' + response.status);
            }
   
            console.log("Task status updated successfully.");
            return true;
        } catch (error) {
            console.error("Error updating task status:", error);
            return false;
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
 