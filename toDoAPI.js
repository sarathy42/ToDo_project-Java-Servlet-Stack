// Function to load the todo
function loadData() {
    const urlLoad = 'http://localhost:8080/ToDoSite/loadToDo';

    fetch(urlLoad, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            displayTasks(data);
        })
        .catch(error => console.error("Fetch error:", error));
}

// Function to add a new task
function addTask() {
    let addTitleInput = document.getElementsByClassName("headToDo")[0];
    let addContentInput = document.getElementsByClassName("textToDo")[0];

    let title = addTitleInput.value.trim();
    let content = addContentInput.value.trim();

    if (title === "" || content === "") {
        alert("Please enter both a title and content.");
        return;
    }

    const urlAdd = 'http://localhost:8080/ToDoSite/addToDo';
    const addData = { title: title, content: content };

    fetch(urlAdd, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(addData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            loadData();
        })
        .catch(error => console.error("Fetch error:", error));

    // Clear input fields
    addTitleInput.value = "";
    addContentInput.value = "";
}

async function updateTask(index) {
    let updateTitleInput = document.getElementsByClassName("headToDo")[0];
    let updateContentInput = document.getElementsByClassName("textToDo")[0];

    let id = index;
    let title = updateTitleInput.value.trim();
    let content = updateContentInput.value.trim();

    const urlupdate = `http://localhost:8080/ToDoSite/updateToDo`;
    const updateData = { id: id, title: title, content: content };

    try {
        const response = await fetch(urlupdate, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json" // capital "C"
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Update successful:", data);
        loadData();
    } catch (error) {
        console.error("Update failed:", error);
    }
    let form = document.getElementById("addFormToDo");
    let head = form.children[0];
    let button = form.children[5];
    head.innerText = "Add ToDo";
    button.value = "add";
    updateTitleInput.value = "";
    updateContentInput.value = "";
}

// Function to delete a task
function deletetoDo(index) {
    const urlDelete = 'http://localhost:8080/ToDoSite/deleteToDo';
    const deleteData = { id: index };

    fetch(urlDelete, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(deleteData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        loadData();
    })
    .catch(error => console.error("Fetch error:", error));
}
