document.addEventListener('DOMContentLoaded', () => {
    const tasksContainer = document.getElementById('tasks-container');
    const addTaskButton = document.getElementById('add-task');
    const peopleContainer = document.getElementById('people-container');
    const addPersonButton = document.getElementById('add-person');
    const assignButton = document.getElementById('assign-button');
    const resultsContainer = document.getElementById('results-container');

    let tasks = [];

    const updateTasks = () => {
        tasks = [];
        document.querySelectorAll('.task-item').forEach((taskElement, index) => {
            const taskName = taskElement.querySelector('.task-name').value.trim();
            if (taskName) {
                tasks[index] = taskName;
            }
        });
        updateAllPersonTaskCheckboxes();
    };

    const createTaskItem = () => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item fade-in';
        taskItem.innerHTML = `
            <input type="text" class="task-name" placeholder="任务名称">
            <input type="number" class="task-demand" placeholder="需求人数" min="0">
            <button class="remove-task">删除任务</button>
        `;
        tasksContainer.appendChild(taskItem);
        taskItem.querySelector('.task-name').addEventListener('input', updateTasks);
        taskItem.querySelector('.remove-task').addEventListener('click', () => {
            taskItem.remove();
            updateTasks();
        });
        updateTasks();
    };

    const createPersonItem = () => {
        const personItem = document.createElement('div');
        personItem.className = 'person-item fade-in';
        personItem.innerHTML = `
            <input type="text" class="person-name" placeholder="姓名">
            <div class="tasks-checkboxes"></div>
            <button class="remove-person">删除人员</button>
        `;
        peopleContainer.appendChild(personItem);
        updatePersonTaskCheckboxes(personItem);
        personItem.querySelector('.remove-person').addEventListener('click', () => {
            personItem.remove();
        });
    };

    const updatePersonTaskCheckboxes = (personItem) => {
        const checkboxesContainer = personItem.querySelector('.tasks-checkboxes');
        checkboxesContainer.innerHTML = '';
        tasks.forEach((task, index) => {
            if (task) {
                const checkboxId = `task-${Date.now()}-${index}`;
                const label = document.createElement('label');
                label.innerHTML = `
                    <input type="checkbox" value="${index}"> ${task}
                `;
                checkboxesContainer.appendChild(label);
            }
        });
    };

    const updateAllPersonTaskCheckboxes = () => {
        document.querySelectorAll('.person-item').forEach(updatePersonTaskCheckboxes);
    };

    const assignTasks = () => {
        resultsContainer.innerHTML = '';
        const currentTasks = [];
        document.querySelectorAll('.task-item').forEach(el => {
            const name = el.querySelector('.task-name').value.trim();
            const demand = parseInt(el.querySelector('.task-demand').value) || 0;
            if (name) {
                currentTasks.push({ name, demand, applicants: [] });
            }
        });

        const people = [];
        document.querySelectorAll('.person-item').forEach((el, personIndex) => {
            const name = el.querySelector('.person-name').value.trim();
            if (name) {
                const person = { name, signedUpTasks: [] };
                el.querySelectorAll('.tasks-checkboxes input:checked').forEach(checkbox => {
                    const taskIndex = parseInt(checkbox.value);
                    if (!isNaN(taskIndex) && currentTasks[taskIndex]) {
                        currentTasks[taskIndex].applicants.push(personIndex);
                        person.signedUpTasks.push(taskIndex);
                    }
                });
                people.push(person);
            }
        });

        const assignments = {};
        const assignedPersonIndices = new Set();

        currentTasks.forEach((task, taskIndex) => {
            assignments[task.name] = [];
            let availableApplicants = task.applicants.filter(personIndex => !assignedPersonIndices.has(personIndex));
            
            // Shuffle available applicants to ensure randomness
            for (let i = availableApplicants.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [availableApplicants[i], availableApplicants[j]] = [availableApplicants[j], availableApplicants[i]];
            }

            const numToAssign = Math.min(task.demand, availableApplicants.length);

            for (let i = 0; i < numToAssign; i++) {
                const applicantIndex = availableApplicants[i];
                const personName = people[applicantIndex].name;
                assignments[task.name].push(personName);
                assignedPersonIndices.add(applicantIndex);
            }
        });

        displayResults(assignments);
    };

    const displayResults = (assignments) => {
        for (const taskName in assignments) {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item fade-in';
            const assignedPeople = assignments[taskName].join(', ') || '无人中签';
            resultItem.innerHTML = `<strong>${taskName}:</strong> ${assignedPeople}`;
            resultsContainer.appendChild(resultItem);
        }
    };

    addTaskButton.addEventListener('click', createTaskItem);
    addPersonButton.addEventListener('click', createPersonItem);
    assignButton.addEventListener('click', assignTasks);

    // Initial items
    createTaskItem();
    createPersonItem();
});