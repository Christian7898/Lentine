import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

function formatItalian(date, id) {
  const formatted = date.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return `${formatted} (ID: ${id})`;
}

async function deleteRecord(id){
  await deleteDoc(doc(db, "Lentine", id));
  console.log("ELIMINATO ", id);
}


async function loadDays() {
  const list = document.querySelector(".days-list");
  list.innerHTML = ""; // pulisci

  const snapshot = await getDocs(collection(db, "Lentine"));

  let count = 0;

  snapshot.forEach(docu => {
    const data = docu.data();

    const dataUtil = data.dataUtilizzati.toDate();
    const dataCreazione = data.dataCreazioneRecord.toDate();

    const html = `
    <div class="day-card" data-id="${docu.id}">
      <div class="day-main">
        <span class="day-date">${formatItalian(dataUtil, docu.id)}</span>
        <span class="day-sub">Creato il ${formatItalian(dataCreazione)}</span>
      </div>
      <div class="day-meta">
        <strong>${data.oreUtilizzo} ore</strong>
        <span class="chip">${data.tipoLenti === "monthly" ? "Mensili" : data.tipoLenti}</span>
      </div>
    </div>
  `;

    list.insertAdjacentHTML("beforeend", html);

    // prende l’ultimo elemento inserito
    const card = list.lastElementChild;
    const btnDel = document.getElementById('btnDelate');
    card.addEventListener("click", () => {
      
      btnDel.style.display = 'initial';
      btnDel.textContent = 'Elimina giorno ' +docu.id;
      console.log("Hai cliccato:", docu.id);   
      btnDel.addEventListener("click", () =>{
        deleteRecord(docu.id);

        setTimeout(function(){
          location.reload();
        }, 2000);

      });   
    });

    count++;
  });

  document.querySelector(".days-summary strong").textContent = count;

}

document.addEventListener("DOMContentLoaded", loadDays);
