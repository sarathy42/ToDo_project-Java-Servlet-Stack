// toggle between the update and add
function ToggleHandler() {
    let x = document.getElementById("taskBtn").value;
    if (x.includes("update")) {
        let i = x.match(/\d+$/);
        updateTask(i[0]);
        return;
    } if (x = "add") {
        addTask();
        return;
    }
}

// Function to switch edit
function edittoDo(index) {
    let form = document.getElementById("addFormToDo");
    let head = form.children[0];
    let input = document.getElementById("headOfToDo");
    let textarea = form.children[4];
    let button = form.children[5];
    head.innerText = "update ToDo";
    input.value = document.getElementById(index).children[0].innerText;
    textarea.innerText = document.getElementById(index).children[1].innerText;
    button.value = `update ${index}`;
}

// Function to display all toDos
function displayTasks(data) {
    let cardHolder = document.getElementById("cardHolder");
    cardHolder.innerHTML = "";

    data.forEach((toDo) => {
        let card = document.createElement("div");
        card.classList.add("cardd");
        card.id = `${toDo.id}`;

        // Apply opacity if completed (assuming you add a "completed" field)
        if (toDo.completed) {
            card.style.opacity = "0.5";
        }

        let head = document.createElement("h4");
        head.textContent = toDo.title;

        let content = document.createElement("p");
        content.textContent = toDo.content;

        let btnHol = document.createElement("div");

        let updateBtn = document.createElement("button");
        updateBtn.textContent = "update";
        updateBtn.onclick = function () {
            edittoDo(toDo.id);
        };

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Done";
        deleteBtn.onclick = function () {
            deletetoDo(toDo.id);
        };

        btnHol.appendChild(updateBtn);
        btnHol.appendChild(deleteBtn);
        card.appendChild(head);
        card.appendChild(content);
        card.appendChild(btnHol);
        cardHolder.appendChild(card);
    });
}

function switchBetweenSisu() {
    let parent = document.getElementById("loginHol");
    let firstChi = parent.children[0];
    let secondChi = parent.children[1];
    let loginHelloDesidn = document.getElementById("loginHello");
    if (secondChi.tagName == "DIV") {
        loginHelloDesidn.style.backgroundImage = `radial-gradient(circle at right center, #ffffff, #007bff),
                        repeating-radial-gradient(circle at right center, #007bff, #007bff, 5px, transparent 30px, transparent 30px)`;
    } else {
        loginHelloDesidn.style.backgroundImage = `radial-gradient(circle at left center, #ffffff, #007bff),
        repeating-radial-gradient(circle at left center, #007bff, #007bff, 5px, transparent 30px, transparent 30px)`;
    }
    const firstChiNext = firstChi.nextSibling;
    const secondChiNext = secondChi.nextSibling;
    parent.classList.add("animation");
    setTimeout(() => {
        parent.replaceChild(secondChi, firstChi);
        setTimeout(() => {
            parent.classList.remove("animation");
        }, 500)
        parent.appendChild(firstChi);
    }, 1000)
}

function createFrom(params) {
    let form = document.getElementById("fromSign");
    form.innerHTML = '';

    let formHead = document.createElement("h4");
    if (params == "in") {
        formHead.innerText = "Already have a account";    
    } else {
        formHead.innerText = "Create a new account";
    }
    
    let otherOption = document.createElement("div");
    otherOption.setAttribute("class", "otop");
    let icon1 = document.createElement("i");
    icon1.setAttribute("class", "bi bi-google");
    let icon2 = document.createElement("i");
    icon2.setAttribute("class", "bi bi-facebook");
    let icon3 = document.createElement("i");
    icon3.setAttribute("class", "bi bi-telephone-fill");
    let napa = document.createElement("p");
    napa.innerText = "or name & password";
    
    let labelUser = document.createElement("label");
    labelUser.setAttribute("for", "username");
    labelUser.innerText = "Name"
    let inputUser = document.createElement("input");
    inputUser.setAttribute("type", "text");
    inputUser.setAttribute("name", "username");
    inputUser.setAttribute("placeholder", "username here");
    
    let labelPass = document.createElement("label");
    labelPass.setAttribute("for", "password");
    labelPass.innerText = "Password"
    let inputPass = document.createElement("input");
    inputPass.setAttribute("type", "password");
    inputPass.setAttribute("name", "password");
    inputPass.setAttribute("placeholder", "password here");

    let processHol = document.createElement("div");
    processHol.setAttribute("class", "processHol");

    let btn1 = document.createElement("button");
    btn1.setAttribute("type", "button");
    btn1.setAttribute("class", "btn");
    btn1.innerText = "Proceed";
    let btn2 = document.createElement("button");
    btn2.setAttribute("type", "button");
    btn2.setAttribute("class", "btn");
    btn2.innerText = "cancel";
    btn2.addEventListener('click', () => {
        document.getElementById("loginBg").style.display = "none";
    });

    form.appendChild(formHead);
    otherOption.appendChild(icon1);
    otherOption.appendChild(icon2);
    otherOption.appendChild(icon3);
    otherOption.appendChild(napa);
    form.appendChild(otherOption);
    form.appendChild(labelUser);
    form.appendChild(inputUser);
    form.appendChild(labelPass);
    form.appendChild(inputPass);
    processHol.appendChild(btn1);
    processHol.appendChild(btn2);
    form.appendChild(processHol);
    

    if (params == "in") {
        let forgotop = document.createElement("a");
        forgotop.href = "#";
        forgotop.innerText = "Forgot password?";
        let creOrSign = document.createElement("p");
        creOrSign.innerText = "Create a new account";
        creOrSign.addEventListener('click', () => {
            createFrom("up");
            switchBetweenSisu();
        });
        form.appendChild(forgotop);
        form.appendChild(creOrSign);
    } else {
        let creOrSign = document.createElement("p");
        creOrSign.innerText = "already have a account";
        creOrSign.addEventListener('click', () => {
            createFrom("in");
            switchBetweenSisu();
        });
        form.appendChild(creOrSign);
    }   
}

function openSignForm() {
    let navSignForm = document.getElementById("navSignForm");
    
    let signBtn = document.createElement("button");
    signBtn.type = "button"
    signBtn.setAttribute("class", "btn")
    signBtn.innerText = "register"
    signBtn.addEventListener('click', () => {opensign();});

    navSignForm.appendChild(signBtn)
}
function opensign() {
    let x  = document.getElementById("loginBg");
    x.style.display = "flex";
    createFrom("in");
    switchBetweenSisu();
    return;
}

function loadFunction() {
    loadData();
    openSignForm();
}

// Load toDos when the page loads
document.addEventListener("DOMContentLoaded", loadFunction);