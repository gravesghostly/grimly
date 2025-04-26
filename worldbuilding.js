// worldbuilding.js

// --- IndexedDB Setup ---
const DB_NAME = 'worldbuildingDB';
const DB_VERSION = 1;
const STORE_DEFS = [
  { name: 'worlds', keyPath: 'id', fields: ['name', 'summary'] },
  { name: 'locations', keyPath: 'id', fields: ['name', 'description', 'worldId'] },
  { name: 'characters', keyPath: 'id', fields: ['name', 'description', 'worldId', 'locationId', 'factionId'] },
  { name: 'factions', keyPath: 'id', fields: ['name', 'description', 'worldId'] },
  { name: 'lore', keyPath: 'id', fields: ['title', 'content', 'worldId'] },
  { name: 'items', keyPath: 'id', fields: ['name', 'description', 'worldId'] },
  { name: 'religions', keyPath: 'id', fields: ['name', 'description', 'worldId'] },
  { name: 'languages', keyPath: 'id', fields: ['name', 'description', 'worldId'] },
  { name: 'magic', keyPath: 'id', fields: ['name', 'description', 'worldId'] },
  { name: 'technology', keyPath: 'id', fields: ['name', 'description', 'worldId'] },
  { name: 'flora', keyPath: 'id', fields: ['name', 'description', 'worldId'] },
  { name: 'fauna', keyPath: 'id', fields: ['name', 'description', 'worldId'] },
];

let db;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = function (e) {
      db = e.target.result;
      STORE_DEFS.forEach(def => {
        if (!db.objectStoreNames.contains(def.name)) {
          db.createObjectStore(def.name, { keyPath: def.keyPath });
        }
      });
    };
    req.onsuccess = function (e) {
      db = e.target.result;
      resolve(db);
    };
    req.onerror = function (e) {
      reject(e);
    };
  });
}

function getStore(storeName, mode = 'readonly') {
  return db.transaction([storeName], mode).objectStore(storeName);
}

function getAll(storeName) {
  return new Promise((resolve, reject) => {
    const store = getStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = reject;
  });
}

function addOrUpdate(storeName, obj) {
  return new Promise((resolve, reject) => {
    const store = getStore(storeName, 'readwrite');
    const req = store.put(obj);
    req.onsuccess = () => resolve(req.result);
    req.onerror = reject;
  });
}

function remove(storeName, id) {
  return new Promise((resolve, reject) => {
    const store = getStore(storeName, 'readwrite');
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = reject;
  });
}

// --- UI Setup ---
const CATEGORIES = [
  { key: 'worlds', label: 'Worlds', icon: '<i class="fa-solid fa-earth-americas"></i>' },
  { key: 'locations', label: 'Locations', icon: '<i class="fa-solid fa-location-dot"></i>' },
  { key: 'characters', label: 'Characters', icon: '<i class="fa-solid fa-users"></i>' },
  { key: 'factions', label: 'Factions', icon: '<i class="fa-solid fa-flag"></i>' },
  { key: 'lore', label: 'Lore', icon: '<i class="fa-solid fa-scroll"></i>' },
  { key: 'items', label: 'Items', icon: '<i class="fa-solid fa-key"></i>' },
  { key: 'religions', label: 'Religions', icon: '<i class="fa-solid fa-church"></i>' },
  { key: 'languages', label: 'Languages', icon: '<i class="fa-solid fa-language"></i>' },
  { key: 'magic', label: 'Magic', icon: '<i class="fa-solid fa-wand-sparkles"></i>' },
  { key: 'technology', label: 'Technology', icon: '<i class="fa-solid fa-microchip"></i>' },
  { key: 'flora', label: 'Flora', icon: '<i class="fa-solid fa-seedling"></i>' },
  { key: 'fauna', label: 'Fauna', icon: '<i class="fa-solid fa-paw"></i>' },
];

let currentCategory = 'worlds';

function renderSidebar() {
  const ul = document.getElementById('category-list');
  ul.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const li = document.createElement('li');
    li.innerHTML = `<button data-cat="${cat.key}" class="category-button">${cat.icon} ${cat.label}</button>`;
    if (cat.key === currentCategory) li.style.fontWeight = 'bold';
    li.querySelector('button').onclick = () => {
      currentCategory = cat.key;
      renderSidebar();
      renderMain();
    };
    ul.appendChild(li);
  });
}

function renderMain() {
  const main = document.getElementById('wb-main');
  main.innerHTML = '';
  // Render form
  main.appendChild(renderForm(currentCategory));
  // Render list
  renderList(currentCategory, main);
}

function renderForm(category) {
  const def = STORE_DEFS.find(d => d.name === category);
  const form = document.createElement('form');
  form.className = 'form-section';
  form.innerHTML = `<h2>${CATEGORIES.find(c => c.key === category).icon} ${CATEGORIES.find(c => c.key === category).label}</h2>`;
  def.fields.forEach(field => {
    if (field === 'worldId') {
      form.innerHTML += `<div class="form-group"><label>World</label><select name="worldId" id="form-worldId"></select></div>`;
    } else if (field.endsWith('Id') && field !== 'worldId') {
      form.innerHTML += `<div class="form-group"><label>${field.replace('Id','')}</label><select name="${field}" id="form-${field}"></select></div>`;
    } else if (field === 'description' || field === 'content' || field === 'summary') {
      form.innerHTML += `<div class="form-group"><label>${capitalize(field)}</label><textarea name="${field}" id="form-${field}" rows="3"></textarea></div>`;
    } else {
      form.innerHTML += `<div class="form-group"><label>${capitalize(field)}</label><input type="text" name="${field}" id="form-${field}"></div>`;
    }
  });
  form.innerHTML += `<button type="submit">Add ${CATEGORIES.find(c => c.key === category).label.slice(0,-1)}</button>`;
  form.onsubmit = async function(e) {
    e.preventDefault();
    const obj = { id: Date.now() };
    def.fields.forEach(field => {
      obj[field] = form.querySelector(`[name='${field}']`)?.value || '';
    });
    await addOrUpdate(category, obj);
    renderMain();
  };
  // Populate dropdowns for relations
  setTimeout(() => populateDropdowns(form, def.fields), 0);
  return form;
}

async function populateDropdowns(form, fields) {
  if (fields.includes('worldId')) {
    const worlds = await getAll('worlds');
    const select = form.querySelector('#form-worldId');
    select.innerHTML = '<option value="">-- Select World --</option>' + worlds.map(w => `<option value="${w.id}">${w.name}</option>`).join('');
  }
  if (fields.includes('locationId')) {
    const locs = await getAll('locations');
    const select = form.querySelector('#form-locationId');
    select.innerHTML = '<option value="">-- Select Location --</option>' + locs.map(l => `<option value="${l.id}">${l.name}</option>`).join('');
  }
  if (fields.includes('factionId')) {
    const facs = await getAll('factions');
    const select = form.querySelector('#form-factionId');
    select.innerHTML = '<option value="">-- Select Faction --</option>' + facs.map(f => `<option value="${f.id}">${f.name}</option>`).join('');
  }
}

async function renderList(category, main) {
  const list = document.createElement('div');
  list.className = 'journal-entries';
  const entries = await getAll(category);
  if (!entries.length) {
    displayEmptyState();
    return;
  }
  entries.forEach(entry => {
    const div = document.createElement('div');
    div.className = 'journal-entry';
    div.innerHTML = displayEntry(entry);
    div.querySelector('.delete-btn').onclick = async () => {
      await remove(category, entry.id);
      renderMain();
    };
    list.appendChild(div);
  });
  main.appendChild(list);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, ' $1');
}

function getDisplayValue(key, value) {
  if (key.endsWith('Id') && value) {
    // Try to resolve name for relations
    const store = key.replace('Id', '') + 's';
    // This is async, so for now just show ID
    return value;
  }
  return value;
}

function createCategoryButton(cat) {
    const li = document.createElement('li');
    li.innerHTML = `<button data-cat="${cat.key}" class="category-button">${cat.icon} ${cat.label}</button>`;
    return li;
}

function displayEmptyState() {
    const list = document.getElementById('wb-main');
    list.innerHTML = '<p class="empty-state">No entries yet.</p>';
}

function displayEntryField(key, value) {
    return `<span class="entry-field-label">${capitalize(key)}:</span> ${getDisplayValue(key, v)}<br>`;
}

function displayEntry(entry) {
    return `
        <h3>${entry.name || entry.title}</h3>
        ${Object.entries(entry)
            .filter(([k]) => k !== 'id' && k !== 'name' && k !== 'title')
            .map(([k, v]) => v ? displayEntryField(k, v) : '')
            .join('')}
    `;
}

// --- Import/Export ---
document.getElementById('exportBtn').onclick = async function() {
  const exportData = {};
  for (const def of STORE_DEFS) {
    exportData[def.name] = await getAll(def.name);
  }
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'worldbuilding_export.json';
  a.click();
  URL.revokeObjectURL(url);
};

document.getElementById('importBtn').onclick = function() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.onchange = async function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    try {
      const data = JSON.parse(text);
      for (const def of STORE_DEFS) {
        if (Array.isArray(data[def.name])) {
          for (const entry of data[def.name]) {
            await addOrUpdate(def.name, entry);
          }
        }
      }
      renderMain();
      alert('Import successful!');
    } catch (err) {
      alert('Import failed: ' + err.message);
    }
  };
  input.click();
};

// --- Init ---
openDB().then(() => {
  renderSidebar();
  renderMain();
}); 