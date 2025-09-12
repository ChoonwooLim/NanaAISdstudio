import { Project, AppState, StoryboardPanel } from '../types';

const DB_NAME = 'AI-Storyboard-Gallery';
const DB_VERSION = 1;
const PROJECT_STORE = 'projects';
const ASSET_STORE = 'assets';

let db: IDBDatabase;

// Utility to convert a data URL or blob URL to a Blob object
export const urlToBlob = async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    return await response.blob();
};

// Utility to convert a data URL or blob URL to a base64 string
export const urlToBase64 = async (url: string): Promise<string> => {
    const blob = await urlToBlob(url);
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};


export const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (db) {
            return resolve(db);
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('IndexedDB error:', request.error);
            reject('Error opening IndexedDB.');
        };

        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const tempDb = (event.target as IDBOpenDBRequest).result;
            if (!tempDb.objectStoreNames.contains(PROJECT_STORE)) {
                tempDb.createObjectStore(PROJECT_STORE, { keyPath: 'id' });
            }
            if (!tempDb.objectStoreNames.contains(ASSET_STORE)) {
                tempDb.createObjectStore(ASSET_STORE, { keyPath: 'id' });
            }
        };
    });
};

export const saveProject = async (appState: AppState): Promise<void> => {
    const db = await initDB();
    const id = Date.now().toString();
    const title = appState.mode === 'DESCRIPTION' ? appState.productName : appState.storyIdea;
    
    // Process assets: convert URLs to Blobs and store them separately
    const assetPromises = appState.storyboardPanels.map(async (panel, index) => {
        let imageBlob: Blob | null = null;
        let videoBlob: Blob | null = null;

        if (panel.imageUrl && panel.imageUrl.startsWith('data:') || panel.imageUrl.startsWith('blob:')) {
            imageBlob = await urlToBlob(panel.imageUrl);
            const assetId = `${id}-img-${index}`;
            await saveAsset(assetId, imageBlob);
        }
        if (panel.videoUrl && panel.videoUrl.startsWith('blob:')) {
            videoBlob = await urlToBlob(panel.videoUrl);
            const assetId = `${id}-vid-${index}`;
            await saveAsset(assetId, videoBlob);
        }
        return { ...panel, imageUrl: imageBlob ? `${id}-img-${index}` : panel.imageUrl, videoUrl: videoBlob ? `${id}-vid-${index}`: panel.videoUrl };
    });

    const panelsWithAssetIds = await Promise.all(assetPromises);

    const project: Omit<Project, 'thumbnailUrl'> = {
        id,
        title: title || 'Untitled Project',
        timestamp: Date.now(),
        appState: { ...appState, storyboardPanels: panelsWithAssetIds },
    };

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(PROJECT_STORE, 'readwrite');
        const store = transaction.objectStore(PROJECT_STORE);
        const request = store.put(project);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
};

const saveAsset = (id: string, blob: Blob): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        const db = await initDB();
        const transaction = db.transaction(ASSET_STORE, 'readwrite');
        const store = transaction.objectStore(ASSET_STORE);
        store.put({ id, blob });
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
};

const getAsset = (id: string): Promise<Blob | null> => {
     return new Promise(async (resolve, reject) => {
        const db = await initDB();
        const transaction = db.transaction(ASSET_STORE, 'readonly');
        const store = transaction.objectStore(ASSET_STORE);
        const request = store.get(id);
        request.onsuccess = () => {
            resolve(request.result ? request.result.blob : null);
        };
        request.onerror = () => reject(request.error);
    });
}

export const getProjects = async (): Promise<Project[]> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(PROJECT_STORE, 'readonly');
        const store = transaction.objectStore(PROJECT_STORE);
        const request = store.getAll();

        request.onerror = () => reject(request.error);
        request.onsuccess = async () => {
            const projectsData = request.result as Omit<Project, 'thumbnailUrl'>[];
            
            const projectsWithThumbnails = await Promise.all(projectsData.map(async (p) => {
                let thumbnailUrl = '';
                const firstPanel = p.appState.storyboardPanels[0];
                if (firstPanel && (firstPanel.imageUrl as string).includes('-img-')) {
                     const imageBlob = await getAsset(firstPanel.imageUrl);
                     if(imageBlob) thumbnailUrl = URL.createObjectURL(imageBlob);
                }
                return { ...p, thumbnailUrl };
            }));
            
            resolve(projectsWithThumbnails.sort((a, b) => b.timestamp - a.timestamp));
        };
    });
};

export const getProjectState = async (id: string): Promise<AppState | null> => {
    const db = await initDB();
    const projectData = await new Promise<Omit<Project, 'thumbnailUrl'>>((resolve, reject) => {
        const transaction = db.transaction(PROJECT_STORE, 'readonly');
        const store = transaction.objectStore(PROJECT_STORE);
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
    
    if(!projectData) return null;

    const hydratedPanels = await Promise.all(projectData.appState.storyboardPanels.map(async (panel) => {
        const newPanel = { ...panel };
        if ((panel.imageUrl as string).includes('-img-')) {
            const blob = await getAsset(panel.imageUrl);
            newPanel.imageUrl = blob ? URL.createObjectURL(blob) : 'error';
        }
         if (panel.videoUrl && (panel.videoUrl as string).includes('-vid-')) {
            const blob = await getAsset(panel.videoUrl);
            newPanel.videoUrl = blob ? URL.createObjectURL(blob) : 'error';
        }
        return newPanel;
    }));

    return { ...projectData.appState, storyboardPanels: hydratedPanels };
};


export const deleteProject = async (id: string): Promise<void> => {
    const db = await initDB();
    const projectState = await getProjectState(id);

    // Also delete associated assets
    if(projectState) {
        for(const panel of projectState.storyboardPanels) {
            if((panel.imageUrl as string).includes('-img-')) await deleteAsset(panel.imageUrl);
            if(panel.videoUrl && (panel.videoUrl as string).includes('-vid-')) await deleteAsset(panel.videoUrl);
        }
    }

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(PROJECT_STORE, 'readwrite');
        const store = transaction.objectStore(PROJECT_STORE);
        const request = store.delete(id);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
};

const deleteAsset = (id: string): Promise<void> => {
     return new Promise(async (resolve, reject) => {
        const db = await initDB();
        const transaction = db.transaction(ASSET_STORE, 'readwrite');
        const store = transaction.objectStore(ASSET_STORE);
        const request = store.delete(id);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
}
