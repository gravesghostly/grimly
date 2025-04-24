// Project workflow definitions with checklists
const workflows = {
    'logo-personal': {
        title: 'Personal Logo Design',
        steps: [
            {
                name: 'Initial Concept',
                checklist: [
                    'Define brand identity',
                    'Research competitors',
                    'Create mood board',
                    'Sketch initial ideas'
                ]
            },
            {
                name: 'Research & Inspiration',
                checklist: [
                    'Collect visual references',
                    'Analyze color schemes',
                    'Study typography options',
                    'Document design trends'
                ]
            },
            {
                name: 'Sketching',
                checklist: [
                    'Create rough sketches',
                    'Refine best concepts',
                    'Experiment with variations',
                    'Select top 3 concepts'
                ]
            },
            {
                name: 'Digital Draft',
                checklist: [
                    'Vectorize selected concepts',
                    'Create color variations',
                    'Test different typography',
                    'Prepare presentation'
                ]
            },
            {
                name: 'Refinement',
                checklist: [
                    'Gather feedback',
                    'Make necessary adjustments',
                    'Finalize color scheme',
                    'Prepare final files'
                ]
            },
            {
                name: 'Final Delivery',
                checklist: [
                    'Export all file formats',
                    'Create style guide',
                    'Prepare documentation',
                    'Archive project files'
                ]
            }
        ]
    },
    'logo-commission': {
        title: 'Commissioned Logo Design',
        steps: [
            'Client Brief',
            'Research & Mood Board',
            'Initial Concepts',
            'Client Review',
            'Refinement',
            'Final Approval',
            'Delivery & Files'
        ]
    },
    'blog-secondlife': {
        title: 'Second Life Blog',
        steps: [
            'Topic Research',
            'Content Planning',
            'Writing Draft',
            'Editing',
            'Image Selection',
            'SEO Optimization',
            'Publishing'
        ]
    },
    'blog-gaming': {
        title: 'Gaming Blog',
        steps: [
            'Game Selection',
            'Research & Notes',
            'Writing Draft',
            'Editing',
            'Screenshot Selection',
            'SEO Optimization',
            'Publishing'
        ]
    },
    'game-ui': {
        title: 'Game UI Design',
        steps: [
            'Requirements Analysis',
            'Wireframing',
            'UI Design',
            'Prototyping',
            'User Testing',
            'Implementation',
            'Final Review'
        ]
    },
    'game-design': {
        title: 'Game Design',
        steps: [
            'Concept Development',
            'Game Mechanics',
            'Level Design',
            'Prototyping',
            'Playtesting',
            'Refinement',
            'Documentation'
        ]
    },
    'asset-design': {
        title: 'Game Asset Design',
        steps: [
            'Asset Planning',
            'Concept Art',
            'Modeling',
            'Texturing',
            'Optimization',
            'Implementation',
            'Final Review'
        ]
    }
};

// DOM Elements
const projectCards = document.querySelectorAll('.project-card');
const workflowContainer = document.querySelector('.workflow-container');
const projectSelection = document.getElementById('project-selection');
const projectTitle = document.getElementById('project-title');
const workflowSteps = document.querySelector('.workflow-steps');
const taskInput = document.getElementById('new-task');
const addTaskBtn = document.getElementById('add-task');
const tasksList = document.getElementById('tasks');
const fileUpload = document.getElementById('file-upload');
const referenceGallery = document.querySelector('.reference-gallery');
const generateEstimateBtn = document.getElementById('generate-estimate');
const saveProjectBtn = document.getElementById('save-project');
const viewHistoryBtn = document.getElementById('view-history');
const newProjectBtn = document.getElementById('new-project');
const projectHistory = document.querySelector('.project-history');
const projectsList = document.querySelector('.projects-list');
const searchProjects = document.getElementById('search-projects');
const filterType = document.getElementById('filter-type');

// Current project state
let currentProject = null;
let tasks = [];
let referenceImages = [];
let assets = [];
let projectNotes = '';
let savedProjects = JSON.parse(localStorage.getItem('projects')) || [];

// Event Listeners
projectCards.forEach(card => {
    card.addEventListener('click', () => {
        const projectType = card.dataset.type;
        selectProject(projectType);
    });
});

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

fileUpload.addEventListener('change', handleFileUpload);
generateEstimateBtn.addEventListener('click', generateEstimate);
saveProjectBtn.addEventListener('click', saveProject);
viewHistoryBtn.addEventListener('click', showProjectHistory);
newProjectBtn.addEventListener('click', showProjectSelection);
searchProjects.addEventListener('input', filterProjects);
filterType.addEventListener('change', filterProjects);

// Functions
function selectProject(projectType) {
    currentProject = projectType;
    const workflow = workflows[projectType];
    
    // Update UI
    projectTitle.textContent = workflow.title;
    workflowContainer.style.display = 'block';
    projectSelection.style.display = 'none';
    projectHistory.style.display = 'none';
    
    // Create workflow steps with checklists
    workflowSteps.innerHTML = '';
    workflow.steps.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = 'workflow-step';
        stepElement.innerHTML = `
            <div class="step-number">${index + 1}</div>
            <div class="step-content">
                <h4>${step.name}</h4>
                <div class="step-checklist">
                    ${step.checklist.map(item => `
                        <div class="checklist-item">
                            <input type="checkbox" id="step-${index}-${item.replace(/\s+/g, '-')}">
                            <label for="step-${index}-${item.replace(/\s+/g, '-')}">${item}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        workflowSteps.appendChild(stepElement);
    });

    // Reset project data
    tasks = [];
    referenceImages = [];
    assets = [];
    projectNotes = '';
    updateTasksList();
    updateReferenceGallery();
    updateAssetsTable();
    document.getElementById('project-notes').value = '';
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        tasks.push({
            text: taskText,
            completed: false
        });
        taskInput.value = '';
        updateTasksList();
    }
}

function updateTasksList() {
    tasksList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <div class="task-actions">
                <button class="btn-complete" onclick="toggleTask(${index})">
                    <i class="fas fa-${task.completed ? 'check-circle' : 'circle'}"></i>
                </button>
                <button class="btn-delete" onclick="deleteTask(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        tasksList.appendChild(li);
    });
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    updateTasksList();
}

function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        if (file.type.startsWith('image/') || file.type.includes('pdf') || file.type.includes('document')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                referenceImages.push({
                    name: file.name,
                    type: file.type,
                    data: e.target.result
                });
                updateReferenceGallery();
            };
            reader.readAsDataURL(file);
        }
    });
}

function updateReferenceGallery() {
    referenceGallery.innerHTML = '';
    referenceImages.forEach((file, index) => {
        const fileElement = document.createElement('div');
        fileElement.className = 'reference-file';
        if (file.type.startsWith('image/')) {
            fileElement.innerHTML = `
                <img src="${file.data}" alt="${file.name}">
                <div class="file-info">
                    <span>${file.name}</span>
                    <button onclick="deleteReference(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        } else {
            fileElement.innerHTML = `
                <div class="document-preview">
                    <i class="fas fa-file"></i>
                </div>
                <div class="file-info">
                    <span>${file.name}</span>
                    <button onclick="deleteReference(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }
        referenceGallery.appendChild(fileElement);
    });
}

function deleteReference(index) {
    referenceImages.splice(index, 1);
    updateReferenceGallery();
}

function addAsset() {
    const name = document.getElementById('asset-name').value.trim();
    const version = document.getElementById('asset-version').value.trim();
    const status = document.getElementById('asset-status').value.trim();
    
    if (name && version && status) {
        assets.push({
            name,
            version,
            status,
            date: new Date().toLocaleDateString()
        });
        
        document.getElementById('asset-name').value = '';
        document.getElementById('asset-version').value = '';
        document.getElementById('asset-status').value = '';
        
        updateAssetsTable();
    }
}

function updateAssetsTable() {
    const tbody = document.querySelector('#assets-table tbody');
    tbody.innerHTML = '';
    
    assets.forEach((asset, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${asset.name}</td>
            <td>${asset.version}</td>
            <td>${asset.status}</td>
            <td>${asset.date}</td>
            <td>
                <button onclick="deleteAsset(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function deleteAsset(index) {
    assets.splice(index, 1);
    updateAssetsTable();
}

function saveProject() {
    if (!currentProject) return;
    
    const project = {
        type: currentProject,
        title: document.getElementById('project-name').value,
        client: {
            name: document.getElementById('client-name').value,
            email: document.getElementById('client-email').value
        },
        tasks,
        referenceImages,
        assets,
        notes: document.getElementById('project-notes').value,
        date: new Date().toLocaleDateString(),
        lastModified: new Date().toISOString()
    };
    
    savedProjects.push(project);
    localStorage.setItem('projects', JSON.stringify(savedProjects));
    
    alert('Project saved successfully!');
}

function showProjectHistory() {
    projectHistory.style.display = 'block';
    workflowContainer.style.display = 'none';
    projectSelection.style.display = 'none';
    filterProjects();
}

function showProjectSelection() {
    projectSelection.style.display = 'grid';
    workflowContainer.style.display = 'none';
    projectHistory.style.display = 'none';
}

function filterProjects() {
    const searchTerm = searchProjects.value.toLowerCase();
    const typeFilter = filterType.value;
    
    const filteredProjects = savedProjects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm) ||
                            project.client.name.toLowerCase().includes(searchTerm);
        const matchesType = typeFilter === 'all' || project.type === typeFilter;
        return matchesSearch && matchesType;
    });
    
    displayProjects(filteredProjects);
}

function displayProjects(projects) {
    projectsList.innerHTML = '';
    
    projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'project-history-card';
        card.innerHTML = `
            <h3>${project.title}</h3>
            <p>Client: ${project.client.name}</p>
            <p>Type: ${workflows[project.type].title}</p>
            <p class="date">Last Modified: ${new Date(project.lastModified).toLocaleDateString()}</p>
            <div class="card-actions">
                <button class="btn" onclick="loadProject(${index})">Open</button>
                <button class="btn" onclick="deleteProject(${index})">Delete</button>
            </div>
        `;
        projectsList.appendChild(card);
    });
}

function loadProject(index) {
    const project = savedProjects[index];
    selectProject(project.type);
    
    // Restore project data
    document.getElementById('project-name').value = project.title;
    document.getElementById('client-name').value = project.client.name;
    document.getElementById('client-email').value = project.client.email;
    tasks = project.tasks;
    referenceImages = project.referenceImages;
    assets = project.assets;
    document.getElementById('project-notes').value = project.notes;
    
    updateTasksList();
    updateReferenceGallery();
    updateAssetsTable();
}

function deleteProject(index) {
    if (confirm('Are you sure you want to delete this project?')) {
        savedProjects.splice(index, 1);
        localStorage.setItem('projects', JSON.stringify(savedProjects));
        filterProjects();
    }
}

function generateEstimate() {
    if (!currentProject) return;

    const workflow = workflows[currentProject];
    const estimate = {
        projectType: workflow.title,
        clientName: document.getElementById('client-name').value,
        projectName: document.getElementById('project-name').value,
        date: new Date().toLocaleDateString(),
        steps: workflow.steps,
        tasks: tasks,
        referenceCount: referenceImages.length,
        assets: assets
    };

    const estimateText = `
        Project Estimate
        ===============
        
        Project: ${estimate.projectName}
        Client: ${estimate.clientName}
        Type: ${estimate.projectType}
        Date: ${estimate.date}
        
        Workflow Steps:
        ${workflow.steps.map((step, i) => `
            ${i + 1}. ${step.name}
            ${step.checklist.map(item => `   - ${item}`).join('\n')}
        `).join('\n')}
        
        Tasks:
        ${tasks.map(task => `- ${task.text} (${task.completed ? 'Completed' : 'Pending'})`).join('\n')}
        
        Assets:
        ${assets.map(asset => `- ${asset.name} (v${asset.version}) - ${asset.status}`).join('\n')}
        
        Reference Materials: ${estimate.referenceCount} files
        
        Terms of Service:
        1. All work is subject to client approval
        2. Payment terms: 50% upfront, 50% upon completion
        3. Revisions: 2 rounds of revisions included
        4. Delivery: All final files will be delivered in appropriate formats
        5. Copyright: Client receives full rights to final deliverables
        6. Project timeline: To be determined based on scope
        7. Additional revisions beyond included rounds will be billed at hourly rate
        8. Rush fees may apply for expedited delivery
    `;

    const blob = new Blob([estimateText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${estimate.projectName.replace(/\s+/g, '_')}_Estimate_${estimate.date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
} 