const searchInput = document.getElementById('search');
const taskList = document.getElementById('task-list');
const newTaskInput = document.getElementById('new-task');
const newTaskDate = document.getElementById('new-task-date');
const addTaskBtn = document.getElementById('add-task');

let tasks = [];

loadFromLocalStorage();
renderTasks();

function addTask() {
    const text = newTaskInput.value.trim();
    const date = newTaskDate.value;

    if (text.length < 3 || text.length > 255) {
        alert('Treść zadania musi mieć od 3 do 255 znaków.');
        return;
    }

    if (date) {
        const selectedDate = new Date(date);
        const now = new Date();
        if (selectedDate <= now) {
            alert('Data musi być pusta lub z przyszłości.');
            return;
        }
    }

    const newTask = {
        id: Date.now(),
        text,
        date: date || null
    };

    tasks.push(newTask);
    saveToLocalStorage();
    renderTasks();

    newTaskInput.value = '';
    newTaskDate.value = '';
}

function renderTasks(searchTerm = "") {
    taskList.innerHTML = '';

    tasks
        .filter(task => searchTerm.length < 2 || task.text.toLowerCase().includes(searchTerm.toLowerCase()))
        .forEach(task => {
            const li = document.createElement('li');

            let textHTML = task.text;

            if (searchTerm.length >= 2) {
                const regex = new RegExp(`(${searchTerm})`, "gi");
                textHTML = textHTML.replace(regex, `<span class="highlight">$1</span>`);
            }

            if (task.date) {
                const dateObj = new Date(task.date);
                const formattedDate = dateObj.toLocaleString('pl-PL', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });
                textHTML += ` — ${formattedDate}`;
            }

            li.innerHTML = textHTML;

            const deleteBtn = document.createElement('span');
            deleteBtn.textContent = "🗑";
            deleteBtn.classList.add('delete-btn');

            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTask(task.id);
            });

            li.appendChild(deleteBtn);

            li.addEventListener('click', () => editTask(task.id, li));

            taskList.appendChild(li);
        });
}

function editTask(id, liElement) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const input = document.createElement('input');
    input.value = task.text;
    liElement.innerHTML = "";
    liElement.classList.add('editing');
    liElement.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
        const updatedText = input.value.trim();

        if (updatedText.length >= 3 && updatedText.length <= 255) {
            task.text = updatedText;
        } else {
            alert("Tekst po edycji musi mieć od 3 do 255 znaków.");
        }

        liElement.classList.remove('editing');
        saveToLocalStorage();
        renderTasks(searchInput.value.trim());
    });
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveToLocalStorage();
    renderTasks(searchInput.value.trim());
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadFromLocalStorage() {
    const data = localStorage.getItem('tasks');
    if (data) {
        tasks = JSON.parse(data);
    }
}

addTaskBtn.addEventListener('click', addTask);
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim();
    renderTasks(searchTerm);
});
