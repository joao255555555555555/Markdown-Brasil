const DB_NAME = 'MarkdownEditorDB';
const DB_VERSION = 2; // MUDANÇA AQUI: Alterado de 1 para 2 para forçar a atualização.
const STORE_NAME = 'versions';
let db;

export function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            const error = event.target.error;
            console.error(`Erro no IndexedDB: ${error.name}`, error);
            reject(new Error(`Não foi possível abrir o banco de dados: ${error.message || 'causa desconhecida'}`));
        };

        request.onupgradeneeded = (event) => {
            console.log("Atualizando a estrutura do banco de dados para a versão 2...");
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
        };

        request.onsuccess = (event) => {
            console.log("Banco de dados conectado com sucesso.");
            db = event.target.result;
            resolve(db);
        };
    });
}

function getStore(mode = 'readonly') {
    if (!db) throw new Error("Banco de dados não foi inicializado com sucesso.");
    return db.transaction(STORE_NAME, mode).objectStore(STORE_NAME);
}

export function saveVersion(version) {
    return new Promise((resolve, reject) => {
        try {
            const store = getStore('readwrite');
            const request = store.add(version);
            request.onsuccess = (event) => resolve(event.target.result);
            request.onerror = (event) => reject(new Error(`Erro ao salvar versão: ${event.target.error}`));
        } catch(error) {
            reject(error);
        }
    });
}

export function getAllVersions() {
    return new Promise((resolve, reject) => {
        try {
            const store = getStore();
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result.sort((a, b) => b.timestamp - a.timestamp));
            request.onerror = (event) => reject(new Error(`Erro ao buscar versões: ${event.target.error}`));
        } catch(error) {
            reject(error);
        }
    });
}

export function getVersion(id) {
    return new Promise((resolve, reject) => {
        try {
            const store = getStore();
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(new Error(`Erro ao buscar versão: ${event.target.error}`));
        } catch(error) {
            reject(error);
        }
    });
}

export function deleteVersion(id) {
    return new Promise((resolve, reject) => {
        try {
            const store = getStore('readwrite');
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(new Error(`Erro ao deletar versão: ${event.target.error}`));
        } catch(error) {
            reject(error);
        }
    });
}

export function updateVersion(version) {
    return new Promise((resolve, reject) => {
        try {
            const store = getStore('readwrite');
            const request = store.put(version);
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(new Error(`Erro ao atualizar versão: ${event.target.error}`));
        } catch(error) {
            reject(error);
        }
    });
}