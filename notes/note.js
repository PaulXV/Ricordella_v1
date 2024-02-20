const btnEl = document.getElementById("btn");
const appEl = document.getElementById("app");
const logout = document.getElementById("logoutDiv");
let notes = [];   //variabile globale per contenere le note, da vedere se serve o meno
let idUser;       //userID dall'url in GET per avere le note corrispondenti - assume valore in riga 350

btnEl.addEventListener("click", addNote);

logout.addEventListener("click", function(){
  window.open("http://brugnola.bearzi.info/ricordella", "_self");
})

//funzione che fa comparire le note a schermo
function displayNotes(notes){
  notes.forEach((note)=>{
    if(note.idUtente == idUser){
      const noteEl = createNoteEl(note.id, note.title, note.priority, note.content, note.date, note.modifyDate, note.completed);
      appEl.insertBefore(noteEl, btnEl);
    }
    document.querySelectorAll('.delete').forEach((el) => {
      el.addEventListener("click", (event) => {
        const warning = confirm("Do you want to delete this note?");
        const nota = event.target.parentElement;
        let idNota = nota.querySelector(".idNota").value;
        if (warning) {
          deleteNote(idNota, nota);
        }
      });
    });
  });
}

//funzione che crea l'elemento nota e lo ritorna
function createNoteEl(id, title, priority, content, date, modifyDate, completed) {

  const element = document.createElement("div");
  element.classList.add("note");

  let idNota = document.createElement("input");
  idNota.type = "hidden";
  idNota.classList.add("idNota");
  idNota.value = id;
  element.appendChild(idNota);
  //da capire come gestire idUtente, potrebbe non servire, se serve decommentare le righe seguenti
  /*
  let idUtente = document.createElement("input");
  idUtente.classList.add("idUtente");
  idUtente.type = "hidden";
  idUtente.value = id;
  element.appendChild(idUtente);
  */

  let deleteIcon = '<i class="fa-regular fa-trash-can delete hidden" style="color: #ff0000;"></i>';
  element.insertAdjacentHTML('beforeend', deleteIcon);

  let titolo = document.createElement("input");
  titolo.type = "text";
  titolo.placeholder = "Titolo";
  titolo.value = title;
  titolo.classList.add("title");
  element.appendChild(titolo);

  let priorita = document.createElement("input");
  priorita.type = "number";
  priorita.min = 1;
  priorita.max = 5;
  priorita.step = 1;
  priorita.placeholder = "Priorità";
  priorita.value = priority;
  priorita.classList.add("priority");
  element.appendChild(priorita);

  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("checkbox");
  if(completed){
    checkbox.checked = true;
    let elem = '<label class="switch">';
    elem += checkbox.outerHTML.slice(0, -1) + "checked>";
    elem += '<span class="slider round"></span>'
    elem += '</label>'
    element.insertAdjacentHTML('beforeend', elem);
  }else{
    checkbox.checked = false;
    let elem = '<label class="switch">';
    elem += checkbox.outerHTML;
    elem += '<span class="slider round"></span>'
    elem += '</label>'
    element.insertAdjacentHTML('beforeend', elem);
  }

  let testo = document.createElement("textarea");
  testo.placeholder = "Insersci qui il tuo testo...";
  testo.value = content;
  testo.classList.add("textarea");
  element.appendChild(testo);

  let data = document.createElement("p");
  data.classList.add("date");

  let day;
  let month;
  let year;
  let creationIcon = '<i class="fa-solid fa-plus fa-2xs"></i>';
  let modifyIcon = '<i class="fa-regular fa-pen-to-square fa-2xs"></i>';

  if(!date){
    let dataOggi = new Date().toLocaleDateString();
    day = dataOggi.split("/")[1];
    if(day.length == 1){
      day = "0" + day;
    }
    month = dataOggi.split("/")[0];
    if(month.length == 1){
      month = "0" + month;
    }
    year = dataOggi.split("/")[2];
    data.innerHTML = creationIcon + createData(day, month, year).slice(0, -3);

  }else{
    day= date.split("-")[2];
    month = date.split("-")[1];
    year = date.split("-")[0];
    let dataCreazione = createData(day, month, year);

    if(modifyDate.length > 0){
      let dayMod= modifyDate.split("-")[2];
      let monthMod = modifyDate.split("-")[1];
      let yearMod = modifyDate.split("-")[0];
      let dataModifica = createData(dayMod, monthMod, yearMod).slice(0, -3);
      data.innerHTML = creationIcon + dataCreazione + modifyIcon + dataModifica;
    }else{
      data.innerHTML = creationIcon + dataCreazione.slice(0, -3);
    }
  }
  element.appendChild(data);

  let saveBtn = document.createElement("button");
  saveBtn.innerHTML = "save  " + '<i class="fa-solid fa-file-arrow-up fa-2xs"></i>';
  saveBtn.classList.add("saveBtn");
  saveBtn.classList.add("hidden");
  saveBtn.addEventListener("click", () => {
    updateNote(id, titolo.value, priorita.value, testo.value, checkbox.checked);
  });
  element.appendChild(saveBtn);

  element.addEventListener("dblclick", () => {
    const warning = confirm("Do you want to delete this note?");
    if (warning) {
      deleteNote(id, element);
    }
  });

  titolo.addEventListener("input", () => {
    saveBtn.classList.remove("hidden");
  });

  priorita.addEventListener("input", () => {
    saveBtn.classList.remove("hidden");
  });

  testo.addEventListener("input", () => {
    saveBtn.classList.remove("hidden");
  });

  checkbox.addEventListener("click", () => {
    saveBtn.classList.remove("hidden");
  });

  return element;

}

//funzione che crea la data in formato gg/mm/aaaa per la visualizzazione in nota
function createData(day, month, year){
  return ("  " + day + '/' + month + "/" + year + " | ");
}

//funzione che crea la data in formato aaaa-mm-gg per la visualizzazione in database
function getDataPerDatabase(){
  let dataOggi = new Date().toLocaleDateString();
  let day = dataOggi.split("/")[1];
  if(day.length == 1){
    day = "0" + day;
  }
  let month = dataOggi.split("/")[0];
  if(month.length == 1){
    month = "0" + month;
  }
  let year = dataOggi.split("/")[2];
  return year + "-" + month + "-" + day;
}

//controllare se funziona
//funzione che elimina la nota dal database e dalla pagina
function deleteNote(id, element) {
  const note = notes.filter((note)=>note.id != id);
  appEl.removeChild(element);
  $.ajax({
    url: "../scripts/deleteNote.php",
    data: {'idNota':note.id},
    success: function(){
      console.log('completata la rimozione');
    },
    error: function (richiesta,stato,errori) {
      alert("E' evvenuto un errore. Il stato della chiamata: "+stato);
    }
  });
}

//da vedere se funziona se lascio l'array notes, che viene popolato con il getNotes() iniziale al caricamento
//funzione che aggiorna la nota nel database e nella pagina
function updateNote(id, title, priority, content, completed) {
  notes.filter((note) => {
    if (note.id == id) {
      note.title = title;
      note.priority = priority;
      note.content = content;
      note.modifyDate = getDataPerDatabase();
      note.completed = completed;
      saveNote(note);
      window.location.reload(); //forse non serve, basta la funzione saveNote()
    }
  });
}

//funzione che aggiunge una nota vuota alla pagina e nel database
function addNote() {
  const noteObj = {
    id: Math.floor(Math.random() * 100000),
    title: "",
    priority: "",
    content: "",
    date: "",
    modifyDate: "",
    completed: false,
    idUtente: idUser,
  };
  const noteEl = createNoteEl(noteObj.id, noteObj.title, noteObj.priority, noteObj.content, noteObj.date, noteObj.modifyDate, noteObj.completed);
  appEl.insertBefore(noteEl, btnEl);

  notes.push(noteObj);

  saveNote(noteObj);
}

//da verificare il funzionamento
//funzione che salva la nota nel database
function saveNote(note) {
  $.ajax({
    url: "../scripts/saveNote.php",
    data: {'idNota':note.id, 'title':note.title,
      'priority':note.priority, 'content':note.content,
      'date':note.date, 'modifyDate':note.modifyDate, 'completed':note.completed, 'idUser':idUser},
    success: function(){
      console.log('nota inserita con successo');
    },
    error: function (richiesta,stato,errori) {
      alert("E' evvenuto un errore. Il stato della chiamata: "+stato);
    }
  });
}

//da verificare il risultato
//funzione che recupera le note dal database, le salva nella variabile notes e le fa comparire a schermo
function getNotes() {
  $.ajax({
    async: false,
    url: "../scripts/getNotes.php",
    data: {'idUser':idUser},
    success: function(data){
      console.log(data);
      //notes = data;
      //displayNotes(data);
    },
    error: function (richiesta,stato,errori) {
      alert("E' evvenuto un errore. Il stato della chiamata: "+stato);
    }
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////
//filter part
//filter by title
$(document).ready(function(){
  $("#searchInTitiles").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#container #app div .title").filter(function() {
      $(this.parentElement).toggle((this.parentElement.querySelector(".title").value.toLowerCase().indexOf(value)) > -1);
    });
  });
});

//filter by priority
$(document).ready(function(){
  $("#searchByPriority").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#container #app div .priority").filter(function() {
      $(this.parentElement).toggle((this.parentElement.querySelector(".priority").value.toLowerCase().indexOf(value)) > -1);
    });
  });
});

//filter by creation date
$(document).ready(function(){
  $("#searchByDate").on("change", function() {
    let date = $(this).val();
    console.log("data: "+date);
    let parts = date.split('-');
    let value = parts[2] + '/' + parts[1] + '/' + parts[0];
    console.log("data come filtro: "+value);
    document.querySelectorAll('#app div .date').forEach((el) => {
      let part = el.innerHTML.split('|')[0];
      part = part.split('</i>')[1];
      part = part.split(' ');
      let dataCreazione = part[2];
      console.log("data della nota: "+ dataCreazione);
      if(dataCreazione == value){
        console.log("ciao");
        el.parentElement.style.display = "block";
      }else{
        console.log("ciao2");
        el.parentElement.style.display = "none";
      }
    });
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////
//responsive part
window.addEventListener('resize', function() {
  let larghezza = window.innerWidth;
  if(larghezza < 768){
    document.querySelectorAll('i.hidden').forEach((el) => {
      el.classList.remove('hidden');
    });
  }else{
    this.document.querySelectorAll('.delete').forEach((el) => {
      el.classList.add('hidden');
    });
  }
});

//responsive part + popolazione delle note al caricamento della pagina
window.addEventListener('load', function() {
  let larghezza = window.innerWidth;
  if(larghezza < 768){
    document.querySelectorAll('i.hidden').forEach((el) => {
      el.classList.remove('hidden');
    });
  }else{
    this.document.querySelectorAll('.delete').forEach((el) => {
      el.classList.add('hidden');
    });
  }

  let header = window.location.href.split("?")[1];
  console.log(header);
  idUser = header.split("=")[1];

  getNotes();
});
///////////////////////////////////////////////////////////////////////////////////////////////////////