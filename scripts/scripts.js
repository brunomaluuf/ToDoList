document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskDate = document.getElementById('task-date');
    const taskList = document.getElementById('task-list');

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
        tasks.forEach(task => {
            addTaskToDOM(task.text, task.date, task.completed);
        });
    };

    const addTaskToDOM = (taskText, taskDate, completed = false) => {
        const li = document.createElement('li');
        li.textContent = taskText;
        if (completed) {
            li.classList.add('completed');
        }

        if (taskDate) {
            const dateSpan = document.createElement('span');
            dateSpan.textContent = ` (Data: ${formatDate(taskDate)})`;
            dateSpan.classList.add('task-date');
            li.appendChild(dateSpan);
        }

        const btnGroup = document.createElement('div');
        btnGroup.classList.add('btn-group');

        const completeBtn = document.createElement('button');
        completeBtn.textContent = completed ? 'Desmarcar' : 'Concluir';
        completeBtn.classList.add(completed ? 'incomplete-btn' : 'complete-btn');
        completeBtn.onclick = () => {
            li.classList.toggle('completed');
            if (li.classList.contains('completed')) {
                taskList.appendChild(li);
                completeBtn.textContent = 'Desmarcar';
                completeBtn.classList.remove('complete-btn');
                completeBtn.classList.add('incomplete-btn');
            } else {
                taskList.insertBefore(li, taskList.querySelector('li.completed') || null);
                completeBtn.textContent = 'Concluir';
                completeBtn.classList.remove('incomplete-btn');
                completeBtn.classList.add('complete-btn');
            }
            saveTasks();
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Excluir';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = () => {
            taskList.removeChild(li);
            saveTasks();
        };

        btnGroup.appendChild(completeBtn);
        btnGroup.appendChild(deleteBtn);
        li.appendChild(btnGroup);

        if (completed) {
            taskList.appendChild(li);
        } else {
            taskList.insertBefore(li, taskList.querySelector('li.completed') || null);
        }
    };

    const saveTasks = () => {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            const taskText = li.firstChild.textContent;
            const taskDate = li.querySelector('.task-date') ? li.querySelector('.task-date').textContent.replace(' (Data: ', '').replace(')', '') : '';
            const completed = li.classList.contains('completed');
            const formattedDate = taskDate.split('/').reverse().join('-'); 
            tasks.push({ text: taskText, date: formattedDate, completed });
        });
        tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    
    const renderTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        taskList.innerHTML = '';
        tasks.forEach(task => {
            addTaskToDOM(task.text, task.date, task.completed);
        });
    };

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        const taskDateValue = taskDate.value;
        if (taskText !== '') {
            addTaskToDOM(taskText, taskDateValue);
            saveTasks();
            taskInput.value = '';
            taskDate.value = '';
            taskInput.focus();
        }
    });

   
    loadTasks();
});
