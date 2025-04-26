class StatusSelector {
    constructor(containerId, initialStatus = 'draft') {
        this.container = document.getElementById(containerId);
        this.initialStatus = initialStatus;
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="form-group">
                <label for="projectStatus">Project Status</label>
                <select id="projectStatus" name="status" class="form-control">
                    <option value="draft" ${this.initialStatus === 'draft' ? 'selected' : ''}>Draft</option>
                    <option value="in-progress" ${this.initialStatus === 'in-progress' ? 'selected' : ''}>In Progress</option>
                    <option value="completed" ${this.initialStatus === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="canceled" ${this.initialStatus === 'canceled' ? 'selected' : ''}>Canceled</option>
                </select>
            </div>
            <style>
                .form-group {
                    margin-bottom: 1rem;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: #495057;
                    font-weight: 500;
                }
                
                .form-control {
                    display: block;
                    width: 100%;
                    padding: 0.375rem 0.75rem;
                    font-size: 1rem;
                    line-height: 1.5;
                    color: #495057;
                    background-color: #fff;
                    background-clip: padding-box;
                    border: 1px solid #ced4da;
                    border-radius: 0.25rem;
                    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                }
                
                .form-control:focus {
                    color: #495057;
                    background-color: #fff;
                    border-color: #80bdff;
                    outline: 0;
                    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
                }
            </style>
        `;
    }

    setupEventListeners() {
        const select = this.container.querySelector('select');
        select.addEventListener('change', (e) => {
            // Dispatch a custom event when status changes
            const event = new CustomEvent('statusChange', {
                detail: { status: e.target.value }
            });
            this.container.dispatchEvent(event);
        });
    }

    getValue() {
        return this.container.querySelector('select').value;
    }

    setValue(status) {
        const select = this.container.querySelector('select');
        if (select) {
            select.value = status || 'draft';
        }
    }
} 