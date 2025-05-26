class DB {
    constructor() {
        this.dbName = 'grimlyHubDB';
        this.dbVersion = 1;
        this.db = null;
        this.init();
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (event) => {
                console.error('Database error:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('Database initialized successfully');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores
                if (!db.objectStoreNames.contains('profiles')) {
                    db.createObjectStore('profiles', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('projects')) {
                    db.createObjectStore('projects', { keyPath: 'id' });
                }
            };
        });
    }

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

    async getAllProjects(storeName) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result || []);
            };

            request.onerror = (event) => {
                console.error('Error getting projects:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    async saveProject(storeName, projectData) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(projectData);

            request.onsuccess = () => {
                console.log('Project saved successfully');
                resolve();
            };

            request.onerror = (event) => {
                console.error('Error saving project:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    async deleteProject(storeName, id) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);

            request.onsuccess = () => {
                console.log('Project deleted successfully');
                resolve();
            };

            request.onerror = (event) => {
                console.error('Error deleting project:', event.target.error);
                reject(event.target.error);
            };
        });
    }
}

// Create a global instance
const db = new DB(); 