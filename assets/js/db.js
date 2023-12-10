import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, deleteDoc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

class wordDB {
    constructor() {
        this.db = null;
        this.isAvailable = false;
    }

    open() {
        return new Promise((resolve, reject) => {
            try {
                // Your web app's Firebase configuration
                const firebaseConfig = {
                    apiKey: "AIzaSyAyLeAR1_4MyzNiDJAO9UFu7HFBtoXIYls",
                    authDomain: "pwa-project-f6a87.firebaseapp.com",
                    projectId: "pwa-project-f6a87",
                    storageBucket: "pwa-project-f6a87.appspot.com",
                    messagingSenderId: "805738882878",
                    appId: "1:805738882878:web:14f6ef7f0d6184cf936e6f"
                };

                // Initialize Firebase
                const app = initializeApp(firebaseConfig);

                // Initialize Cloud Firestore and get a reference to the service
                const db = getFirestore(app);

                if (db) {
                    this.db = db;
                    this.isAvailable = true;
                    resolve();
                } else {
                    reject('The DB is not available.');
                }
            } catch (error) {
                console.error(error.message);
                reject(error.message);
            }
        });
    }

    add(word, definition, figOfSpeech, transcription) {
        return addDoc(collection(this.db, 'words'), {
            word,
            definition,
            figOfSpeech,
            transcription,
        });
    }

    remove(docId) {
        return deleteDoc(doc(this.db, 'words', docId));
    }

    getAllWords() {
        return getDocs(collection(this.db, 'words'));
    }

    
}

const wordsDB = new wordDB();

export default wordsDB;
