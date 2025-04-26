class ProjectList {
    constructor(containerId, storeName, formId) {
        this.container = document.getElementById(containerId);
        this.storeName = storeName;
        this.form = document.getElementById(formId);
        this.projects = [];
        this.statusSelector = null;
    }

    init() {
        this.loadProjects();
        this.setupStatusSelector();
        this.setupEventListeners();
    }

    setupStatusSelector() {
        // Create a container for the status selector if it doesn't exist
        let statusContainer = this.form.querySelector('#statusContainer');
        if (!statusContainer) {
            statusContainer = document.createElement('div');
            statusContainer.id = 'statusContainer';
            // Insert it before the form's submit button
            const submitButton = this.form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.parentNode.insertBefore(statusContainer, submitButton);
            } else {
                this.form.appendChild(statusContainer);
            }
        }
        
        // Initialize the status selector
        this.statusSelector = new StatusSelector('statusContainer');
    }

    loadProjects() {
        const storedProjects = localStorage.getItem(this.storeName);
        this.projects = storedProjects ? JSON.parse(storedProjects) : [];
        this.renderProjects();
    }

    renderProjects() {
        if (!this.projects.length) {
            this.container.innerHTML = `
                <div class="empty-state">
                    No projects found. Create a new project to get started.
                </div>`;
            return;
        }

        this.container.innerHTML = this.projects.map((project, index) => `
            <div class="project-item">
                <div class="project-header">
                    <h3>${this.getProjectTitle(project)}</h3>
                    <span class="status-badge status-${project.status || 'draft'}">${this.formatStatus(project.status)}</span>
                </div>
                <div class="project-date">Last updated: ${new Date(project.date).toLocaleDateString()}</div>
                <div class="project-actions">
                    <button class="secondary-button" onclick="projectList.loadProject(${index})">Load</button>
                    <button class="secondary-button" onclick="projectList.deleteProject(${index})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    getProjectTitle(project) {
        switch (this.storeName) {
            case 'worldbuilding':
                return project.name || 'Untitled World';
            case 'journal':
                return project.title || new Date(project.date).toLocaleDateString();
            case 'shopping':
                return project.listName || 'Untitled List';
            default:
                return 'Untitled Project';
        }
    }

    formatStatus(status) {
        if (!status) return 'Draft';
        return status.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    setupEventListeners() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProject();
            });
        }
    }

    saveProject() {
        try {
            const formData = this.getFormData();
            formData.date = new Date().toISOString();
            formData.status = this.statusSelector.getValue();
            this.projects.push(formData);
            localStorage.setItem(this.storeName, JSON.stringify(this.projects));
            this.renderProjects();
            alert('Project saved successfully!');
            this.form.reset();
            this.statusSelector.setValue('draft'); // Reset status to draft
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Failed to save project. Please try again.');
        }
    }

    loadProject(index) {
        try {
            const project = this.projects[index];
            this.setFormData(project);
            this.statusSelector.setValue(project.status || 'draft');
        } catch (error) {
            console.error('Error loading project:', error);
            alert('Failed to load project. Please try again.');
        }
    }

    deleteProject(index) {
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                this.projects.splice(index, 1);
                localStorage.setItem(this.storeName, JSON.stringify(this.projects));
                this.renderProjects();
                alert('Project deleted successfully!');
            } catch (error) {
                console.error('Error deleting project:', error);
                alert('Failed to delete project. Please try again.');
            }
        }
    }

    getFormData() {
        const formData = {};
        const formElements = this.form.elements;
        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];
            if (element.name && element.type !== 'submit') {
                formData[element.name] = element.value;
            }
        }
        return formData;
    }

    setFormData(data) {
        const formElements = this.form.elements;
        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];
            if (element.name && data[element.name]) {
                element.value = data[element.name];
            }
        }
    }
} 