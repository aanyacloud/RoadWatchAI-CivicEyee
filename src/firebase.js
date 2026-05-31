import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDZ3b_lAhBt-ug-tgekCOcOIii5GCZI-xg",
  authDomain: "roadwatch-1e941.firebaseapp.com",
  projectId: "roadwatch-1e941",
  storageBucket: "roadwatch-1e941.firebasestorage.app",
  messagingSenderId: "248845884665",
  appId: "1:248845884665:web:ecfbf53871af581d471628",
  measurementId: "G-KWV10G1QT9"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const storage = getStorage(app)