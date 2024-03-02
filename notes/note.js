const btnEl = document.getElementById("btn");
const appEl = document.getElementById("app");
const logout = document.getElementById("logoutDiv");
let notes = [];   //variabile globale per contenere le note, da vedere se serve o meno
let idUser;       //userID dall'url in GET per avere le note corrispondenti - assume valore in riga 350

btnEl.addEventListener("click", addNote);

logout.addEventListener("click", function(){
  window.open("https://brugnola.bearzi.info/ricordella", "_self");
})

//funzione che fa comparire le note a schermo
function displayNotes(notes){
  notes.forEach((note)=>{
      const noteEl = createNoteEl(note['id'], note['titolo'], note['priorita'], note['testo'], note['dataCreazione'], note['dataModifica'], note['completed']);
      appEl.insertBefore(noteEl, btnEl);
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

  let div = document.createElement("div");
  div.classList.add("actions");

  let shareIcon = '<div class="mail-div"><i class="fa-regular fa-paper-plane fa-sm mail" style="color: #247BA0  ;"></i></div>';
  div.insertAdjacentHTML('beforeend', shareIcon);

  let deleteIcon = '<div class="delete-div"><i class="fa-regular fa-trash-can fa-sm delete" style="color: #ff0000;"></i></div>';
  div.insertAdjacentHTML('beforeend', deleteIcon);

  element.appendChild(div);
  element.querySelector('.mail').addEventListener('click', mailFunc);
  element.querySelector('.delete').addEventListener('click', delNote);

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
  if(completed==1){
    checkbox.checked = true;
    let elem = '<label class="switch">';
    elem += checkbox.outerHTML.slice(0, -1) + "checked>";
    elem += '<span class="slider round"></span>';
    elem += '</label>';
    element.insertAdjacentHTML('beforeend', elem);
  }else{
    checkbox.checked = false;
    let elem = '<label class="switch">';
    elem += checkbox.outerHTML;
    elem += '<span class="slider round"></span>';
    elem += '</label>';
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
  saveBtn.addEventListener('click', upNote);
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

//funzione che elimina la nota dal database e dalla pagina
function deleteNote(id, element) {
  appEl.removeChild(element);
  notes.filter((note) => {
    if(note["id"]==id)
      notes.splice(notes.indexOf(note), 1);
  })
  $.ajax({
    url: "../scripts/deleteNote.php",
    data: {'idNota':id},
    success: function(){
      //console.log('completata la rimozione');
    },
    error: function (richiesta,stato,errori) {
      alert("E' evvenuto un errore. Il stato della chiamata: "+stato);
    }
  });
}

//funzione che aggiorna la nota nel database e nella pagina
function updateNote(id, title, priority, content, completed) {
  notes.filter((note) => {
    if (note.id == id) {
      $.ajax({
        async: false,
        url: "../scripts/update.php",
        data: {'idNota':note.id, 'title':title,
          'priority':priority, 'content':content,
          'date':note.dataCreazione, 'modifyDate':getDataPerDatabase(), 'completed':completed, 'idUser':idUser},
        success: function(){
          window.location.reload();
          //console.log('nota aggiornata con successo');
        },
        error: function (richiesta,stato,errori) {
          alert("E' evvenuto un errore. Il stato della chiamata: "+stato);
        }
      });
    }
  });
}

//funzione che aggiunge una nota vuota alla pagina e nel database
function addNote() {
  const noteObj = {
    id: Math.floor(Math.random() * 100000),
    titolo: "",
    priorita: "",
    testo: "",
    dataCreazione: getDataPerDatabase(),
    dataModifica: "",
    completed: false,
    idUtente: idUser,
  };
  saveNote(noteObj);
  const noteEl = createNoteEl(noteObj.id, noteObj.titolo, noteObj.priorita, noteObj.testo, noteObj.dataCreazione, noteObj.dataModifica, noteObj.completed);
  appEl.insertAdjacentElement('afterbegin',noteEl);
  notes.push(noteObj);
}

//funzione che salva la nota nel database
function saveNote(note) {
  //la mantengo asicrona cosi me la salva ma posso fare altro
  $.ajax({
    url: "../scripts/saveNote.php",
    data: {'idNota':note.id, 'title':note.titolo,
      'priority':note.priorita, 'content':note.testo,
      'date':note.dataCreazione, 'modifyDate':note.dataModifica, 'completed':note.completed, 'idUser':idUser},
    success: function(){},
    error: function (richiesta,stato,errori) {
      alert("E' evvenuto un errore. Il stato della chiamata: "+stato);
    }
  });
}

//funzione che recupera le note dal database, le salva nella variabile notes e le fa comparire a schermo
function getNotes(idUser) {
  $.ajax({
    async: false,
    url: "../scripts/getNotes.php",
    data: {'idUser':idUser},
    success: function(data){
      //console.log(data);
      notes = $.parseJSON(data);
      displayNotes(notes);
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
    let parts = date.split('-');
    let value = parts[2] + '/' + parts[1] + '/' + parts[0];
    document.querySelectorAll('#app div .date').forEach((el) => {
      let part = el.innerHTML.split('|')[0];
      part = part.split('</i>')[1];
      part = part.split(' ');
      let dataCreazione = part[2];
      if(dataCreazione == value){
        el.parentElement.style.display = "block";
      }else{
        el.parentElement.style.display = "none";
      }
    });
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////
//popolazione delle note al caricamento della pagina
window.addEventListener('load', function() {
  let header = window.location.href.split("?")[1];
  idUser = header.split("=")[1];
  //console.log(idUser);
  getNotes(idUser);
});

///////////////////////////////////////////////////////////////////////////////////////////////////////
//funzioni per gli addEventListener
function delNote(event){
  const warning = confirm("Sei sicuro di eliminare questa nota?");
  const nota = event.target.parentElement.parentElement.parentElement;
  let idNota = nota.querySelector(".idNota").value;
  if (warning) {
    deleteNote(idNota, nota);
  }
}

function upNote(event){
  let parentEl = event.target.parentElement;
  let idNota = parentEl.querySelector('.idNota').value;
  let titolo = parentEl.querySelector('.title').value;
  let priorita = parentEl.querySelector('.priority').value;
  let testo = parentEl.querySelector('.textarea').value;
  let check = parentEl.querySelector('.checkbox').checked;
  check = (check) ? check=1 : check=0;
  updateNote(idNota, titolo, priorita, testo, check);
}

function mailFunc(event){
  let email = prompt("Inserisci la mail del destinatario: ");
  const nota = event.target.parentElement.parentElement.parentElement;
  //console.log(nota);
  if(email){
    let destinatario = email;
    let oggetto = "Promemoria n°"+nota.querySelector('.idNota').value;
    let testo = "titolo: "+nota.querySelector('.title').value;
    testo += "\nPriorità: " + nota.querySelector('.priority').value;
    testo += "\nContenuto: " + nota.querySelector('.textarea').value;
    $.ajax({
      url: '../scripts/mailService.php',
      data: {"destinatario":destinatario, "oggetto": oggetto, "testo":testo},
      success: ()=>{
        alert("Email inviata con successo!");
      },
      error: ()=>{
        alert("E' avvenuto un errore... ci dispiace");
      }
    });
  }
}