// ==========================================
// DATA
// ==========================================

let projects = JSON.parse(
    localStorage.getItem("devtask_projects")
) || [

    {
        id: 1,
        name: "ProfileForge",
        description:
            "AI-powered resume and profile management platform.",
        status: "progress",
        progress: 72
    },

    {
        id: 2,
        name: "Octopus",
        description:
            "Agentic website interaction and information extraction platform.",
        status: "progress",
        progress: 48
    },

    {
        id: 3,
        name: "Portfolio Website",
        description:
            "Personal developer portfolio with projects and experience.",
        status: "completed",
        progress: 100
    }
];


let tasks = JSON.parse(
    localStorage.getItem("devtask_tasks")
) || [

    {
        id: 1,
        title: "Implement authentication",
        project: "ProfileForge",
        completed: true
    },

    {
        id: 2,
        title: "Build resume analysis API",
        project: "ProfileForge",
        completed: false
    },

    {
        id: 3,
        title: "Implement DOM extraction",
        project: "Octopus",
        completed: false
    },

    {
        id: 4,
        title: "Deploy production version",
        project: "Octopus",
        completed: false
    }

];


// ==========================================
// DOM
// ==========================================

const projectsGrid =
    document.getElementById("projectsGrid");

const taskList =
    document.getElementById("taskList");

const totalProjects =
    document.getElementById("totalProjects");

const activeProjects =
    document.getElementById("activeProjects");

const completedProjects =
    document.getElementById("completedProjects");

const totalTasks =
    document.getElementById("totalTasks");


// ==========================================
// SAVE DATA
// ==========================================

function saveData() {

    localStorage.setItem(
        "devtask_projects",
        JSON.stringify(projects)
    );

    localStorage.setItem(
        "devtask_tasks",
        JSON.stringify(tasks)
    );
}


// ==========================================
// RENDER PROJECTS
// ==========================================

function renderProjects() {

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();

    const filter =
        document
            .getElementById("statusFilter")
            .value;


    const filteredProjects =
        projects.filter(project => {

            const matchesSearch =
                project.name
                    .toLowerCase()
                    .includes(search);

            const matchesFilter =
                filter === "all" ||
                project.status === filter;

            return matchesSearch && matchesFilter;
        });


    projectsGrid.innerHTML = "";


    if (filteredProjects.length === 0) {

        projectsGrid.innerHTML = `
            <p style="color: var(--muted)">
                No projects found.
            </p>
        `;

        return;
    }


    filteredProjects.forEach(project => {

        const card =
            document.createElement("div");

        card.className = "project-card";


        const statusText = {

            planning: "Planning",

            progress: "In Progress",

            completed: "Completed"

        }[project.status];


        card.innerHTML = `

            <div class="project-top">

                <div class="project-title">
                    ${escapeHTML(project.name)}
                </div>

                <button
                    class="delete-btn"
                    onclick="deleteProject(${project.id})"
                >
                    🗑
                </button>

            </div>


            <span class="badge ${project.status}">
                ${statusText}
            </span>


            <p class="project-description">
                ${escapeHTML(project.description)}
            </p>


            <div class="progress-header">

                <span>Progress</span>

                <strong>
                    ${project.progress}%
                </strong>

            </div>


            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="width:${project.progress}%"
                ></div>

            </div>

        `;


        projectsGrid.appendChild(card);

    });

}


// ==========================================
// RENDER TASKS
// ==========================================

function renderTasks() {

    taskList.innerHTML = "";


    tasks.forEach(task => {

        const element =
            document.createElement("div");

        element.className =
            `task ${task.completed ? "completed" : ""}`;


        element.innerHTML = `

            <input
                type="checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${task.id})"
            >


            <div class="task-info">

                <div class="task-title">
                    ${escapeHTML(task.title)}
                </div>

                <div class="task-project">
                    ${escapeHTML(task.project)}
                </div>

            </div>

        `;


        taskList.appendChild(element);

    });

}


// ==========================================
// STATISTICS
// ==========================================

function updateStatistics() {

    totalProjects.textContent =
        projects.length;


    activeProjects.textContent =
        projects.filter(
            p => p.status === "progress"
        ).length;


    completedProjects.textContent =
        projects.filter(
            p => p.status === "completed"
        ).length;


    totalTasks.textContent =
        tasks.length;

}


// ==========================================
// DELETE PROJECT
// ==========================================

function deleteProject(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this project?"
        );

    if (!confirmed) return;


    projects =
        projects.filter(
            project => project.id !== id
        );


    saveData();

    renderAll();

}


// ==========================================
// TOGGLE TASK
// ==========================================

function toggleTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );

    if (!task) return;


    task.completed =
        !task.completed;


    saveData();

    renderTasks();

    updateStatistics();

}


// ==========================================
// MODAL
// ==========================================

const modal =
    document.getElementById("projectModal");


document
    .getElementById("addProjectBtn")
    .addEventListener("click", () => {

        modal.classList.remove("hidden");

    });


function closeModal() {

    modal.classList.add("hidden");

}


document
    .getElementById("closeProjectModal")
    .addEventListener(
        "click",
        closeModal
    );


document
    .getElementById("cancelProject")
    .addEventListener(
        "click",
        closeModal
    );


// Close modal when clicking outside

modal.addEventListener("click", event => {

    if (event.target === modal) {

        closeModal();

    }

});


// ==========================================
// PROGRESS RANGE
// ==========================================

const progressInput =
    document.getElementById(
        "projectProgress"
    );

const progressValue =
    document.getElementById(
        "progressValue"
    );


progressInput.addEventListener(
    "input",
    () => {

        progressValue.textContent =
            `${progressInput.value}%`;

    }
);


// ==========================================
// CREATE PROJECT
// ==========================================

document
    .getElementById("projectForm")
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                document
                    .getElementById("projectName")
                    .value
                    .trim();


            const description =
                document
                    .getElementById(
                        "projectDescription"
                    )
                    .value
                    .trim();


            const status =
                document
                    .getElementById("projectStatus")
                    .value;


            const progress =
                Number(
                    progressInput.value
                );


            const project = {

                id: Date.now(),

                name,

                description,

                status,

                progress

            };


            projects.push(project);


            saveData();

            renderAll();


            event.target.reset();

            progressInput.value = 0;

            progressValue.textContent = "0%";

            closeModal();

        }
    );


// ==========================================
// SEARCH
// ==========================================

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        renderProjects
    );


// ==========================================
// FILTER
// ==========================================

document
    .getElementById("statusFilter")
    .addEventListener(
        "change",
        renderProjects
    );


// ==========================================
// DARK MODE
// ==========================================

const themeToggle =
    document.getElementById(
        "themeToggle"
    );


themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );


        const dark =
            document.body.classList.contains(
                "dark"
            );


        themeToggle.textContent =
            dark
                ? "☀️ Light Mode"
                : "🌙 Dark Mode";


        localStorage.setItem(
            "devtask_theme",
            dark ? "dark" : "light"
        );

    }
);


// Restore theme

if (
    localStorage.getItem(
        "devtask_theme"
    ) === "dark"
) {

    document.body.classList.add("dark");

    themeToggle.textContent =
        "☀️ Light Mode";

}


// ==========================================
// SECURITY HELPER
// ==========================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


// ==========================================
// RENDER EVERYTHING
// ==========================================

function renderAll() {

    renderProjects();

    renderTasks();

    updateStatistics();

}


// Initial render

renderAll();
