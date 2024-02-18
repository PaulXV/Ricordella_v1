const btnEl = document.getElementById("btn");
const appEl = document.getElementById("app");
const logout = document.getElementById("logout");

let header = window.location.href.split("?");
console.log(header);

//da togliere non appena ci sono note nel database e getnotes() funziona
let notes = [];
notes[0] = {
  id: 1,
  title: "Titolo",
  priority: 3,
  content: "Testo",
  date: ""
}
notes[1] = {
  id: 2,
  title: "Titolo2",
  priority: 2,
  content: "Testo2",
  date: "15/02/2024"
}
/////////////////////////////////////////////////////////////////////////


btnEl.addEventListener("click", addNote);
logout.addEventListener("click", function(){
  window.open("http://brugnola.bearzi.info/ricordella", "_self");
})

//cambiando la funzione getNotes() questo dovrebbe andare
notes.forEach((note) => {
  const noteEl = createNoteEl(note.id, note.title, note.priority, note.content, note.date);
  appEl.insertBefore(noteEl, btnEl);
});

function createNoteEl(id, title, priority, content, date) {
  const element = document.createElement("div");
  element.classList.add("note");

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

  let testo = document.createElement("textarea");
  testo.placeholder = "Insersci qui il tuo testo...";
  testo.value = content;
  testo.classList.add("textarea");
  element.appendChild(testo);

  let data = document.createElement("p");
  data.classList.add("date");
  if(date){
    data.innerText = "DataCreazione: "+date;
  }else{
    data.innerText = "DataCreazione: "+(new Date().toLocaleDateString());
  }
  element.appendChild(data);

  element.addEventListener("dblclick", () => {
    const warning = confirm("Do you want to delete this note?");
    if (warning) {
      deleteNote(id, element);
    }
  });

  titolo.addEventListener("input", () => {
    updateNote(id, titolo.value, priorita.value, testo.value);
  });

  priorita.addEventListener("input", () => {
    updateNote(id, titolo.value, priorita.value, testo.value);
  });

  testo.addEventListener("input", () => {
    updateNote(id, titolo.value, priorita.value, testo.value);
  });

  return element;
}

function deleteNote(id, element) {
  const note = notes.filter((note)=>note.id != id);
  saveNote(note);
  appEl.removeChild(element);
}

//da vedere se funziona una volta modificato il getNotes()
function updateNote(id, title, priority, content) {
  const notes = getNotes().filter((note) => {
    if (note.id == id) {
      note.title = title;
      note.priority = priority;
      note.content = content;
    }
  });
}

function addNote() {
  //const tutteLeNote = getNotes(); //sara da cambiare con la funzione getNotes() una volta che funziona
  const noteObj = {
    id: Math.floor(Math.random() * 100000),
    title: "",
    priority: "",
    content: "",
    date: new Date().toLocaleDateString(),
  };
  const noteEl = createNoteEl(noteObj.id, noteObj.title, noteObj.priority, noteObj.content, noteObj.date);
  appEl.insertBefore(noteEl, btnEl);

  notes.push(noteObj);

  saveNote(notes);
}

//da cambiare e integrare con il mandare i dati a php
function saveNote(notes) {
  //console.log(JSON.stringify(notes));
  localStorage.setItem("note-app", JSON.stringify(notes));
}

/*da cambiare prendendo i dati dal database
function getNotes() {
  return JSON.parse(localStorage.getItem("note-app") || "[]");
}*/