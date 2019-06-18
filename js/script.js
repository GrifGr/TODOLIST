
function get_todos() {
    let todos = [];
    let todos_str = localStorage.getItem('todo');
    if (todos_str != null) {
        todos = JSON.parse(todos_str);
    }
    return todos;
}

function add() {
    let taskText = document.getElementById('todos__add-task_input').value;

    if (taskText.length) {
        let todos = get_todos();

        let task = [getFormattedDate(), getFormattedTime(), 1, taskText, false];
        todos.push(task);

        save(todos);
    }
    document.getElementById('todos__add-task_input').value = '';

    return false;
}

function show(findFilter) {
    let todos = get_todos();

    let html = '';
    for (let i = 0; i < todos.length; i++) {
        if (findFilter !==  undefined && findFilter !== null && findFilter.length>0){
            if (todos[i][3].indexOf(findFilter)===-1){
                continue;
            }
        }
        html += '<div class="task" id="' + i + '"><div class="task__date cellData">' +
            '<div class="task__date-date">' + todos[i][0] + '</div>' +
            '<div class="task__date-time">' + todos[i][1] + '</div>' +
            '</div>' +

            '<div class="task__rang cellRang">' +
            '<div class="task__rang-square">' + todos[i][2] + '</div></div>' +

            '<div class="task__rangButton cellRangButton">' +
            '<img class="task__rangButton-up imgHover" src="img/arrowUp.jpg" alt="arrowUp"/>' +
            '<img class="task__rangButton-down imgHover" src="img/arrowDown.jpg" alt="arrowDown"/></div>';


        html += '<div class="task__text cellTask">' +
            '<input class="task__text-input ' + (todos[i][4]? 'taskDone': '') + '" name="task__text-input" type="text" placeholder="" value="' + todos[i][3] + '"></div>';

        html += '<div class="task__buttons cellButtton">' +
            '<img class="task__buttons-edit imgHover" src="img/iconsEdit.jpg" alt="iconsEdit"/>';
        html += createIconsAgreeDone(todos[i][4]);
        html += '<img class="task__buttons-trash imgHover" src="img/iconsTrash.jpg" alt="iconsTrash"/>' +
            '</div></div>';
    }


    document.getElementById('task').innerHTML = html;
    addEvent();
}

function createIconsAgreeDone(statusDone) {
    let textHTML;
    if (statusDone) {
        textHTML = '<img class="task__buttons-agree imgHover" src="img/iconsDone.jpg" alt="iconsAgreeDone"/>'+
        "";
    } else {
        textHTML = '<img class="task__buttons-agree imgHover" src="img/iconsAgree.jpg" alt="iconsAgreeDone"/>' +
        "";
    }

    return textHTML;
}

function addEvent() {
    let buttons = document.getElementsByClassName('task__buttons-trash');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', remove);
    }

    let buttonsUpRang = document.getElementsByClassName('task__rangButton-up');
    for (let i = 0; i < buttonsUpRang.length; i++) {
        buttonsUpRang[i].addEventListener('click', upRang);
    }

    let buttonsDounRang = document.getElementsByClassName('task__rangButton-down');
    for (let i = 0; i < buttonsDounRang.length; i++) {
        buttonsDounRang[i].addEventListener('click', downRang);
    }

    let buttonsEdit = document.getElementsByClassName('task__buttons-edit');
    for (let i = 0; i < buttonsEdit.length; i++) {
        buttonsEdit[i].addEventListener('click', edit);
    }

    let buttonsDone = document.getElementsByClassName('task__buttons-agree');
    for (let i = 0; i < buttonsDone.length; i++) {
        buttonsDone[i].addEventListener('click', done);
    }
}

function remove() {
    if (confirm("Delete item?")) {
        // let id = this.parentNode.parentNode.getAttribute('id');
        let id = getId(this);
        let todos = get_todos();
        todos.splice(id, 1);
        save(todos);
    }

    return false;
}

function edit() {
    let id = getId(this);
    let todos = get_todos();
    let textTask = todos[id][3];

    let newTextTask = prompt('Edit text', textTask);

    if (newTextTask !== null && newTextTask.length > 0) {
        todos[id][3] = newTextTask;
        save(todos);
    }

    return false;
}

function done() {
    let id = getId(this);
    let todos = get_todos();
    // let textTask = todos[id][4];

    todos[id][4] = !todos[id][4];
    save(todos);

    return false;
}

function upRang() {
    let id = getId(this);
    let todos = get_todos();
    let tekRang = Number(todos[id][2]);

    tekRang = (tekRang === 1) ? 1 : --tekRang;
    todos[id][2] = tekRang;

    // todos[id][2] = (todos[id][2] == 99) ? 99 : todos[id][2]++;
    save(todos);

    return false;
}

function downRang() {
    let id = getId(this);
    let todos = get_todos();
    let tekRang = Number(todos[id][2]);

    tekRang = (tekRang === 99) ? 99 : ++tekRang;
    todos[id][2] = tekRang;

    // todos[id][2] = (todos[id][2] == 99) ? 99 : todos[id][2]++;
    save(todos);

    return false;
}

function getId(el) {
    // return el.parentNode.parentNode.getAttribute('id');
    return el.parentElement.parentElement.getAttribute('id');
}

function getFormattedDate() {
    let date = new Date();
    let year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return day + '.' + month + '.' + year;
}

function getFormattedTime() {
    let date = new Date();

    let hour = date.getHours().toString();
    hour = hour.length > 1 ? hour : '0' + hour;

    let minutes = date.getMinutes().toString();
    minutes = minutes.length > 1 ? minutes : '0' + minutes;

    return hour + ':' + minutes;
}

function pressEnter(e) {
    if (e.key === "Enter") {
        add();
        return false;
    }
}

function find(){
    let findFilter = document.getElementById('todos__find-task_input').value;

        show(findFilter);
}

function save(todos){
    todos.sort(function (a, b) {
        if (a[2] > b[2]) {
            return 1;
        }
        if (a[2] < b[2]) {
            return -1;
        }
        // a должно быть равным b
        return 0;
    });

    localStorage.setItem('todo', JSON.stringify(todos));

    show();
}

document.getElementById('addButton').addEventListener('click', add);

show();