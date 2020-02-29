//Define UI variables
const form = document.querySelector("#task-form");
const taskList = document.querySelector(".collection");
const clearBtn = document.querySelector(".clear-tasks");
const filter = document.querySelector("#filter");
const taskInput = document.querySelector("#task");

// Load all event listeners
loadEventListeners();

// Load all event listeners

function loadEventListeners() {
    //dom load event
    document.addEventListener("DOMContentLoaded", getTasks);

    //Add task event
    form.addEventListener("submit", addTask);
    //Remove task Event
    taskList.addEventListener("click", removeTask);
    // Clear task event
    clearBtn.addEventListener("click", clearTasks);

}
//Get Tasks from local storage
function getTasks() {
    let tasks;
    if (localStorage.getItem("tasks") === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    tasks.forEach(function(task) {
        const li = document.createElement("li");
        // Add a class
        li.className = "collection-item";
        //create text Node and appendChild to the li
        li.appendChild(document.createTextNode(task));
        // Create new link element
        const link = document.createElement("a");
        // add a class
        link.className = "delete-item secondary-content";
        //Add icon html
        link.innerHTML = "<i class='fa fa-remove'></i>";
        //Append the link to li
        li.appendChild(link);
        //Append li to ul
        taskList.appendChild(li);
    });

}

//Add Task
function addTask(e) {
    if (taskInput.value === "") {
        alert("Add a task!");
    }

    //Create li element
    const li = document.createElement("li");
    // Add a class
    li.className = "collection-item";
    //create text Node and appendChild to the li
    li.appendChild(document.createTextNode(taskInput.value));
    // Create new link element
    const link = document.createElement("a");
    // add a class
    link.className = "delete-item secondary-content";
    //Add icon html
    link.innerHTML = "<i class='fa fa-remove'></i>";
    //Append the link to li
    li.appendChild(link);
    //Append li to ul
    taskList.appendChild(li);

    // STORE IN LCAL STORAGE
    storeTaksInLocalStorage(taskInput.value);



    //Clear input
    taskInput.value = "";



    e.preventDefault();
}

//Store task func
function storeTaksInLocalStorage(task) {
    let tasks;
    if (localStorage.getItem("tasks") === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }

    tasks.push(task);

    localStorage.setItem("tasks", JSON.stringify(tasks));

}




//Remove Task
function removeTask(e) {
    if (e.target.parentElement.classList.contains("delete-item")) {
        if (confirm("Are you sure?")) {
            e.target.parentElement.parentElement.remove();

            //remove from local storage
            removeTaskFromLocalStorage(e.target.parentElement.parentElement);

        }
    }
}

//remove from local storage
function removeTaskFromLocalStorage(taskItem) {
    let tasks;
    if (localStorage.getItem("tasks") === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    tasks.forEach(function(task, index) {
        if (taskItem.textContent === task) {
            tasks.splice(index, 1);
        }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}





function clearTasks() {
    // u can do this
    // taskList.innerHTML = "";
    //or
    //faster
    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }
    clearTasksFromLocalStorage();
}

//Clear task from LS
function clearTasksFromLocalStorage() {
    localStorage.clear();
}




//filter
function filterTasks(e) {
    const text = e.target.value.toLowerCase();

    document.querySelectorAll(".collection-item").forEach(function(task) {
        const item = task.firstChild.textContent;
        if (item.toLowerCase().indexOf(text) != -1) {
            task.style.display = "block";
        } else {
            task.style.display = "none";
        }
    });


}