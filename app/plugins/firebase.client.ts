import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin(() => {
  const firebaseConfig = {
    apiKey: "AIzaSyBYvXinM1OTk9GgPH9KtjYFcQ700fLpN5A",
    authDomain: "agendamento-4fec9.firebaseapp.com",
    projectId: "agendamento-4fec9",
    storageBucket: "agendamento-4fec9.firebasestorage.app",
    messagingSenderId: "800336076669",
    appId: "1:800336076669:web:37e97e2a328ee89288f614",
    measurementId: "G-C14TH826C6"
  };

  const app = initializeApp(firebaseConfig)

  const auth = getAuth(app)
  const db = getFirestore(app)

  return {
    provide: {
      auth,
      db
    }
  }
})
