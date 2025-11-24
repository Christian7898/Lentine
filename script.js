import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"; // Aggiunto getDocs

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDiDYvcCFMtkCTZGVRWuAkr8OSgXn4dCtI",
  authDomain: "lentine-faabe.firebaseapp.com",
  projectId: "lentine-faabe",
  storageBucket: "lentine-faabe.firebasestorage.app",
  messagingSenderId: "49011017992",
  appId: "1:49011017992:web:bb58e985798454bf54c4bd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const button = document.getElementById('addbtn');
const counter = document.getElementById('counter'); // Rimosso dall'interno della funzione per un accesso più facile

// Funzione per contare i documenti
async function getDocumentCount(collectionName) {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.size;
  } catch (error) {
    console.error("Errore nel conteggio dei documenti:", error);
    return 0; // In caso di errore, restituisci 0
  }
}

// Funzione per inizializzare il contatore all'avvio
async function initializeCounter() {
  const initialCount = await getDocumentCount("Lentine");
  counter.textContent = initialCount;
}

// Chiamiamo la funzione di inizializzazione all'avvio della pagina
document.addEventListener('DOMContentLoaded', initializeCounter);


button.addEventListener('click', (event) => {
  event.preventDefault(); 
  registraLentineUsate();
});

async function registraLentineUsate() {
  try {
    const inputDateElement = document.getElementById('date');
    const inputLensTypeElement = document.getElementById('lens-type');
    const inputHoursElement = document.getElementById('hours');

    const inputDate = inputDateElement.value;
    const inputLensType = inputLensTypeElement.value;
    const inputHours = parseInt(inputHoursElement.value, 10);

    const dateToSave = inputDate ? new Date(inputDate) : new Date();

    const idDocument = dateToSave.toISOString().split("T")[0];


    const docRef = await setDoc(doc(db, "Lentine", idDocument), {
      dataUtilizzati: dateToSave,
      tipoLenti: inputLensType,
      oreUtilizzo: isNaN(inputHours) ? 0 : inputHours,
      dataCreazioneRecord: new Date()
    });

    console.log("Documento scritto con ID: ", idDocument);
    alert(`Utilizzo lentine aggiunto al db con id: ${idDocument}`);

    // Aggiorna il contatore dopo aver aggiunto un nuovo documento
    const updatedCount = await getDocumentCount("Lentine");
    counter.textContent = updatedCount;

    // Pulisci i campi del form
    inputDateElement.value = '';
    inputHoursElement.value = '';
    // inputLensTypeElement.value = 'default_value_if_any'; 

  } catch (e) {
    console.error("Errore durante l'aggiunta del documento: ", e);
    alert("Errore durante la registrazione. Controlla la console per i dettagli.");
  }
}
