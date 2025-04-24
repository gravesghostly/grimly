// Project workflow definitions
const workflows = {
    'logo-personal': {
        title: 'Personal Logo Design',
        steps: [
            'Initial Concept',
            'Research & Inspiration',
            'Sketching',
            'Digital Draft',
            'Refinement',
            'Final Delivery'
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
const projectTitle = document.getElementById('project-title');
const workflowSteps = document.querySelector('.workflow-steps');
const taskInput = document.getElementById('new-task');
const addTaskBtn = document.getElementById('add-task');
const tasksList = document.getElementById('tasks');
const fileUpload = document.getElementById('file-upload');
const referenceGallery = document.querySelector('.reference-gallery');
const generateEstimateBtn = document.getElementById('generate-estimate');

// Current project state
let currentProject = null;
let tasks = [];
let referenceImages = [];

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

// Functions
function selectProject(projectType) {
    currentProject = projectType;
    const workflow = workflows[projectType];
    
    // Update UI
    projectTitle.textContent = workflow.title;
    workflowContainer.style.display = 'block';
    
    // Create workflow steps
    workflowSteps.innerHTML = '';
    workflow.steps.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = 'workflow-step';
        stepElement.innerHTML = `
            <div class="step-number">${index + 1}</div>
            <div class="step-content">
                <h4>${step}</h4>
                <div class="step-progress">
                    <input type="range" min="0" max="100" value="0" class="progress-slider">
                    <span class="progress-value">0%</span>
                </div>
            </div>
        `;
        workflowSteps.appendChild(stepElement);
    });

    // Reset tasks and references
    tasks = [];
    referenceImages = [];
    updateTasksList();
    updateReferenceGallery();
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
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                referenceImages.push(e.target.result);
                updateReferenceGallery();
            };
            reader.readAsDataURL(file);
        }
    });
}

function updateReferenceGallery() {
    referenceGallery.innerHTML = '';
    referenceImages.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = `Reference ${index + 1}`;
        referenceGallery.appendChild(img);
    });
}

function generateEstimate() {
    if (!currentProject) return;

    const workflow = workflows[currentProject];
    const estimate = {
        projectType: workflow.title,
        steps: workflow.steps,
        tasks: tasks,
        referenceCount: referenceImages.length,
        date: new Date().toLocaleDateString()
    };

    // Create and download estimate PDF
    const estimateText = `
        Project Estimate
        ===============
        
        Project Type: ${estimate.projectType}
        Date: ${estimate.date}
        
        Workflow Steps:
        ${workflow.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}
        
        Tasks:
        ${tasks.map(task => `- ${task.text} (${task.completed ? 'Completed' : 'Pending'})`).join('\n')}
        
        Reference Materials: ${estimate.referenceCount} images
        
        Terms of Service:
        1. All work is subject to client approval
        2. Payment terms: 50% upfront, 50% upon completion
        3. Revisions: 2 rounds of revisions included
        4. Delivery: All final files will be delivered in appropriate formats
        5. Copyright: Client receives full rights to final deliverables
    `;

    const blob = new Blob([estimateText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflow.title.replace(/\s+/g, '_')}_Estimate_${estimate.date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
} 