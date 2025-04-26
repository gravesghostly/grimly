class ProjectDashboard {
    constructor() {
        this.projects = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.init();
    }

    async init() {
        await this.loadAllProjects();
        this.setupEventListeners();
        this.updateDashboard();
    }

    async loadAllProjects() {
        try {
            // Load projects from all stores
            const stores = ['gameUIProjects', 'gameDesignProjects', 'blogPlans', 'assetDesignProjects', 'logoDesignProjects'];
            this.projects = [];

            for (const store of stores) {
                const storeProjects = await projectDB.getAllProjects(store);
                this.projects.push(...storeProjects.map(project => ({
                    ...project,
                    projectType: store
                })));
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            alert('Failed to load projects. Please try again.');
        }
    }

    setupEventListeners() {
        // Search input handler
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.updateDashboard();
        });

        // Filter buttons handler
        const filterButtons = document.querySelectorAll('.filter-button');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.currentFilter = button.dataset.filter;
                this.updateDashboard();
            });
        });
    }

    updateDashboard() {
        const filteredProjects = this.filterProjects();
        this.updateStats(filteredProjects);
        this.renderProjects(filteredProjects);
    }

    filterProjects() {
        return this.projects.filter(project => {
            const matchesSearch = 
                (project.name?.toLowerCase().includes(this.searchTerm) ||
                project.title?.toLowerCase().includes(this.searchTerm) ||
                project.description?.toLowerCase().includes(this.searchTerm));

            if (!matchesSearch) return false;

            if (this.currentFilter === 'all') return true;
            return project.status === this.currentFilter;
        });
    }

    updateStats(filteredProjects) {
        document.getElementById('totalProjects').textContent = this.projects.length;
        document.getElementById('completedProjects').textContent = 
            this.projects.filter(p => p.status === 'completed').length;
        document.getElementById('inProgressProjects').textContent = 
            this.projects.filter(p => p.status === 'in-progress').length;
        document.getElementById('draftProjects').textContent = 
            this.projects.filter(p => p.status === 'draft').length;
    }

    renderProjects(projects) {
        const container = document.getElementById('projectsContainer');
        
        if (!projects.length) {
            container.innerHTML = `
                <div class="empty-state">
                    No projects found matching your criteria.
                </div>`;
            return;
        }

        container.innerHTML = projects.map(project => `
            <div class="project-item">
                <div class="project-header">
                    <h3>${this.getProjectTitle(project)}</h3>
                    <span class="status-badge status-${project.status || 'draft'}">${this.formatStatus(project.status)}</span>
                </div>
                <div class="project-type-label">${this.formatProjectType(project.projectType)}</div>
                <div class="project-date">Last updated: ${new Date(project.timestamp).toLocaleDateString()}</div>
                ${project.description ? `<p>${project.description}</p>` : ''}
                <div class="project-actions">
                    <button class="secondary-button" onclick="dashboard.viewProject('${project.projectType}', ${project.id})">View</button>
                    <button class="secondary-button" onclick="dashboard.editProject('${project.projectType}', ${project.id})">Edit</button>
                </div>
            </div>
        `).join('');
    }

    getProjectTitle(project) {
        return project.name || project.title || 'Untitled Project';
    }

    formatStatus(status) {
        if (!status) return 'Draft';
        return status.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatProjectType(type) {
        const typeMap = {
            'gameUIProjects': 'Game UI',
            'gameDesignProjects': 'Game Design',
            'blogPlans': 'Blog',
            'assetDesignProjects': 'Asset Design',
            'logoDesignProjects': 'Logo Design'
        };
        return typeMap[type] || type;
    }

    async viewProject(projectType, id) {
        try {
            const project = await projectDB.getProject(projectType, id);
            // Redirect to the appropriate project page based on type
            const pageMap = {
                'gameUIProjects': 'game-ui.html',
                'gameDesignProjects': 'game-design.html',
                'blogPlans': 'blog-planner.html',
                'assetDesignProjects': 'asset-design.html',
                'logoDesignProjects': 'logo-design.html'
            };
            
            const page = pageMap[projectType];
            if (page) {
                window.location.href = `${page}?id=${id}`;
            }
        } catch (error) {
            console.error('Error viewing project:', error);
            alert('Failed to load project. Please try again.');
        }
    }

    async editProject(projectType, id) {
        try {
            const project = await projectDB.getProject(projectType, id);
            // Similar to viewProject, but with edit mode
            const pageMap = {
                'gameUIProjects': 'game-ui.html',
                'gameDesignProjects': 'game-design.html',
                'blogPlans': 'blog-planner.html',
                'assetDesignProjects': 'asset-design.html',
                'logoDesignProjects': 'logo-design.html'
            };
            
            const page = pageMap[projectType];
            if (page) {
                window.location.href = `${page}?id=${id}&mode=edit`;
            }
        } catch (error) {
            console.error('Error editing project:', error);
            alert('Failed to load project for editing. Please try again.');
        }
    }
}

// Initialize the dashboard
const dashboard = new ProjectDashboard(); 