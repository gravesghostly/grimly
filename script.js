// Project workflow definitions with checklists and explanations
const workflows = {
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

// Sponsor data
const sponsors = {
    'sponsor1': {
        name: 'Sponsor 1',
        landmark: 'Landmark 1'
    },
    'sponsor2': {
        name: 'Sponsor 2',
        landmark: 'Landmark 2'
    },
    'sponsor3': {
        name: 'Sponsor 3',
        landmark: 'Landmark 3'
    }
};

// Tag suggestions
const tagSuggestions = {
    'blog-second-life': ['Second Life', 'Virtual World', 'Fashion', 'Photography', 'Events', 'Shopping'],
    'blog-gaming': ['Gaming', 'Reviews', 'News', 'Indie Games', 'PC Gaming', 'Console Gaming']
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
const projectTypeForms = document.querySelectorAll('.project-type-form');

// Current project state
let currentProject = null;
let tasks = [];
let referenceImages = [];
let assets = [];
let projectNotes = '';
let savedProjects = JSON.parse(localStorage.getItem('projects')) || [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Hide all project type forms initially
    projectTypeForms.forEach(form => {
        form.style.display = 'none';
    });

    // Hide workflow container initially
    workflowContainer.style.display = 'none';
});

// Project Type Selection
projectCards.forEach(card => {
    card.addEventListener('click', () => {
        const projectType = card.getAttribute('data-type');
        
        // Hide project selection and show workflow container
        projectSelection.style.display = 'none';
        workflowContainer.style.display = 'block';
        
        // Hide all forms
        projectTypeForms.forEach(form => {
            form.style.display = 'none';
        });
        
        // Show the selected form
        const selectedForm = document.getElementById(`${projectType}-form`);
        if (selectedForm) {
            selectedForm.style.display = 'block';
        }
        
        // Update project title
        const projectTitle = card.querySelector('h3').textContent;
        document.getElementById('project-title').textContent = projectTitle;
        
        // Load workflow steps
        loadWorkflowSteps(projectType);
    });
});

// Load Workflow Steps
function loadWorkflowSteps(projectType) {
    const workflow = workflows[projectType];
    if (!workflow) return;

    workflowSteps.innerHTML = '';
    
    workflow.steps.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = 'workflow-step';
        stepElement.innerHTML = `
            <div class="step-header">
                <div class="step-number">${index + 1}</div>
                <div class="step-title">
                    <h4>${step.name}</h4>
                </div>
            </div>
            <div class="step-description">${step.description}</div>
            <div class="step-checklist">
                ${step.checklist.map(item => `
                    <div class="checklist-item">
                        <input type="checkbox" id="step-${index}-${item.replace(/\s+/g, '-')}">
                        <label for="step-${index}-${item.replace(/\s+/g, '-')}">${item}</label>
                    </div>
                `).join('')}
            </div>
        `;
        workflowSteps.appendChild(stepElement);
    });
}

// Event Listeners
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

// Tab Switching
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Show corresponding content
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Form Validation
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                
                // Add error message if it doesn't exist
                if (!field.nextElementSibling?.classList.contains('error-message')) {
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'This field is required';
                    field.parentNode.insertBefore(errorMessage, field.nextSibling);
                }
            } else {
                field.classList.remove('error');
                const errorMessage = field.nextElementSibling;
                if (errorMessage?.classList.contains('error-message')) {
                    errorMessage.remove();
                }
            }
        });
        
        if (isValid) {
            // Handle form submission
            console.log('Form submitted successfully');
            // You can add your form submission logic here
        }
    });
});

// Portfolio Image Upload and Management
const portfolioUpload = document.getElementById('portfolio-upload');
const portfolioImages = document.querySelector('.portfolio-images');

if (portfolioUpload) {
    portfolioUpload.addEventListener('change', (e) => {
        const files = e.target.files;
        
        for (let file of files) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    const imageContainer = document.createElement('div');
                    imageContainer.className = 'portfolio-image';
                    
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    
                    const actions = document.createElement('div');
                    actions.className = 'image-actions';
                    
                    const deleteBtn = document.createElement('button');
                    deleteBtn.innerHTML = '×';
                    deleteBtn.title = 'Delete image';
                    deleteBtn.addEventListener('click', () => {
                        imageContainer.remove();
                    });
                    
                    actions.appendChild(deleteBtn);
                    imageContainer.appendChild(img);
                    imageContainer.appendChild(actions);
                    portfolioImages.appendChild(imageContainer);
                };
                
                reader.readAsDataURL(file);
            }
        }
        
        // Reset the input
        portfolioUpload.value = '';
    });
}

// Project Type Toggle
const projectTypeSelect = document.getElementById('project-type');
const gameInfoSection = document.querySelector('.game-info-section');

if (projectTypeSelect && gameInfoSection) {
    projectTypeSelect.addEventListener('change', (e) => {
        if (e.target.value === 'game') {
            gameInfoSection.style.display = 'block';
        } else {
            gameInfoSection.style.display = 'none';
        }
    });
}

// Functions
function selectProject(projectType) {
    currentProject = projectType;
    const workflow = workflows[projectType];
    
    // Update UI
    projectTitle.textContent = workflow.title;
    workflowContainer.style.display = 'block';
    projectSelection.style.display = 'none';
    projectHistory.style.display = 'none';
    
    // Create workflow steps with checklists and explanations
    workflowSteps.innerHTML = '';
    workflow.steps.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = 'workflow-step';
        stepElement.innerHTML = `
            <div class="step-header">
                <div class="step-number">${index + 1}</div>
                <div class="step-title">
                    <h4>${step.name}</h4>
                </div>
            </div>
            <div class="step-description">${step.description}</div>
            <div class="step-checklist">
                ${step.checklist.map(item => `
                    <div class="checklist-item">
                        <input type="checkbox" id="step-${index}-${item.replace(/\s+/g, '-')}">
                        <label for="step-${index}-${item.replace(/\s+/g, '-')}">${item}</label>
                    </div>
                `).join('')}
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
            completed: false,
            date: new Date().toLocaleDateString()
        });
        taskInput.value = '';
        updateTasksList();
    }
}

function updateTasksList() {
    const taskChecklist = document.querySelector('.task-checklist');
    taskChecklist.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-checklist-item ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <input type="checkbox" id="task-${index}" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
            <div class="task-content">
                <span class="task-text">${task.text}</span>
                <span class="task-date">Added: ${task.date}</span>
            </div>
            <div class="task-actions">
                <button class="btn-delete" onclick="deleteTask(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        taskChecklist.appendChild(taskElement);
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

// Initialize Select2 for better select inputs
document.addEventListener('DOMContentLoaded', () => {
    const selectElements = document.querySelectorAll('select');
    selectElements.forEach(select => {
        if (select.multiple) {
            // Initialize multiple select
            select.addEventListener('change', () => {
                const selectedOptions = Array.from(select.selectedOptions).map(option => option.value);
                console.log('Selected options:', selectedOptions);
            });
        }
    });
});

function showWorkflowForm(projectType) {
    // Hide all forms first
    const allForms = document.querySelectorAll('.workflow-form');
    allForms.forEach(form => {
        form.classList.add('hidden');
    });

    // Show the selected form
    const selectedForm = document.getElementById(`form-${projectType}`);
    if (selectedForm) {
        selectedForm.classList.remove('hidden');
        // Scroll to the form
        selectedForm.scrollIntoView({ behavior: 'smooth' });
    }
}

function saveFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const formData = new FormData(form);
    const data = {};

    // Handle file inputs
    const fileInputs = form.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        if (input.files.length > 0) {
            data[input.name] = Array.from(input.files).map(file => ({
                name: file.name,
                type: file.type,
                size: file.size
            }));
        }
    });

    // Handle checkbox groups
    const checkboxGroups = form.querySelectorAll('.checkbox-group');
    checkboxGroups.forEach(group => {
        const checkboxes = group.querySelectorAll('input[type="checkbox"]');
        const selectedValues = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        data[checkboxes[0].name] = selectedValues;
    });

    // Handle other form elements
    Array.from(form.elements).forEach(input => {
        if (input.type !== "button" && input.type !== "file" && input.type !== "checkbox") {
            data[input.name] = input.value;
        }
    });

    // Save to localStorage
    localStorage.setItem(formId, JSON.stringify(data));
    alert("Project plan saved successfully!");
}

function loadFormData(formId) {
    const savedData = localStorage.getItem(formId);
    if (savedData) {
        const formData = JSON.parse(savedData);
        const form = document.getElementById(formId);

        // Handle file inputs
        const fileInputs = form.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            if (formData[input.name]) {
                // Note: We can't actually set the file input value for security reasons
                // We can only show the previously selected file names
                const fileList = formData[input.name];
                if (fileList.length > 0) {
                    input.nextElementSibling.textContent = fileList.map(file => file.name).join(', ');
                }
            }
        });

        // Handle checkbox groups
        const checkboxGroups = form.querySelectorAll('.checkbox-group');
        checkboxGroups.forEach(group => {
            const checkboxes = group.querySelectorAll('input[type="checkbox"]');
            const selectedValues = formData[checkboxes[0].name] || [];
            checkboxes.forEach(checkbox => {
                checkbox.checked = selectedValues.includes(checkbox.value);
            });
        });

        // Handle other form elements
        Array.from(form.elements).forEach(input => {
            if (input.type !== "button" && input.type !== "file" && input.type !== "checkbox") {
                if (formData[input.name]) {
                    input.value = formData[input.name];
                }
            }
        });
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data for all forms
    const forms = document.querySelectorAll('.workflow-form');
    forms.forEach(form => {
        loadFormData(form.querySelector('form').id);
    });

    // Add event listeners for tag generation
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            const formId = this.closest('form').id;
            updateTagSuggestions(formId, this.value);
        });
    });
});

function updateSponsorCredits() {
    const sponsorSelect = event.target;
    const manualCredits = document.getElementById('manual-credits');
    const creatorName = document.getElementById('creator-name');
    const landmark = document.getElementById('landmark');

    if (sponsorSelect.value === 'none') {
        manualCredits.classList.remove('hidden');
        creatorName.required = true;
        landmark.required = true;
    } else if (sponsorSelect.value) {
        manualCredits.classList.add('hidden');
        creatorName.required = false;
        landmark.required = false;
        // Auto-fill sponsor details
        const sponsor = sponsors[sponsorSelect.value];
        if (sponsor) {
            creatorName.value = sponsor.name;
            landmark.value = sponsor.landmark;
        }
    }
}

function generateTags(content) {
    // Simple tag generation based on content
    const words = content.toLowerCase().split(/\s+/);
    const commonWords = new Set(['the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'with', 'by']);
    const tags = new Set();

    words.forEach(word => {
        if (word.length > 3 && !commonWords.has(word)) {
            tags.add(word);
        }
    });

    return Array.from(tags);
}

function updateTagSuggestions(formId, content) {
    const suggestedTags = document.getElementById('suggested-tags');
    const projectType = formId.replace('Form', '').toLowerCase();
    const baseTags = tagSuggestions[projectType] || [];
    const contentTags = generateTags(content);
    const allTags = [...new Set([...baseTags, ...contentTags])];

    suggestedTags.innerHTML = allTags.map(tag => 
        `<div class="tag-suggestion" onclick="addTag('${tag}')">${tag}</div>`
    ).join('');
}

function addTag(tag) {
    const tagsInput = document.getElementById('tags');
    const currentTags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t);
    
    if (!currentTags.includes(tag)) {
        currentTags.push(tag);
        tagsInput.value = currentTags.join(', ');
    }
} 