const DB_NAME = 'GrimlyProjectsDB';
const DB_VERSION = 1;

class ProjectDatabase {
    constructor() {
        this.db = null;
        this.initDatabase();
    }

    async initDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => {
                reject('Database error: ' + event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create stores for each project type
                if (!db.objectStoreNames.contains('gameUIProjects')) {
                    db.createObjectStore('gameUIProjects', { keyPath: 'id', autoIncrement: true });
                }
                if (!db.objectStoreNames.contains('gameDesignProjects')) {
                    db.createObjectStore('gameDesignProjects', { keyPath: 'id', autoIncrement: true });
                }
                if (!db.objectStoreNames.contains('blogPlans')) {
                    db.createObjectStore('blogPlans', { keyPath: 'id', autoIncrement: true });
                }
                if (!db.objectStoreNames.contains('assetDesignProjects')) {
                    db.createObjectStore('assetDesignProjects', { keyPath: 'id', autoIncrement: true });
                }
                if (!db.objectStoreNames.contains('logoDesignProjects')) {
                    db.createObjectStore('logoDesignProjects', { keyPath: 'id', autoIncrement: true });
                }
                // Add profile store
                if (!db.objectStoreNames.contains('profiles')) {
                    db.createObjectStore('profiles', { keyPath: 'id' });
                }
            };
        });
    }

    // Profile methods
    async getProfile() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = this.db.transaction(['profiles'], 'readonly');
            const store = transaction.objectStore('profiles');
            const request = store.get('current');

            request.onsuccess = () => {
                resolve(request.result || null);
            };

            request.onerror = (event) => {
                console.error('Error getting profile:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    async saveProfile(profileData) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = this.db.transaction(['profiles'], 'readwrite');
            const store = transaction.objectStore('profiles');
            const request = store.put({ ...profileData, id: 'current' });

            request.onsuccess = () => {
                console.log('Profile saved successfully');
                resolve();
            };

            request.onerror = (event) => {
                console.error('Error saving profile:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // Project methods
    async saveProject(storeName, projectData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);

            // Add timestamp
            projectData.timestamp = new Date().toISOString();

            const request = store.add(projectData);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async updateProject(storeName, id, projectData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);

            // Update timestamp
            projectData.timestamp = new Date().toISOString();
            projectData.id = id;

            const request = store.put(projectData);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteProject(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);

            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getAllProjects(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);

            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getProject(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);

            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}

// Create and export a single instance
const projectDB = new ProjectDatabase(); 