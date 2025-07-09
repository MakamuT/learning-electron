let notes = [];
let editingNoteId = null;

function loadNotes() {
  const savedNotes = localStorage.getItem("Smurfnotes");
  return savedNotes ? JSON.parse(savedNotes) : [];
}

function saveNote(e) {
  e.preventDefault();

  const titleInput = document.getElementById("noteTitle");
  const contentInput = document.getElementById("noteContent");
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  // Prevent adding empty notes
  if (!title && !content) {
    return;
  }

  if (editingNoteId) {
    //update existing note
    const noteIndex = notes.findIndex((note) => note.id === editingNoteId);
    notes[noteIndex] = {
      ...notes[noteIndex],
      title: title,
      content: content,
    };
    closeNoteDialog();
    saveNotes();
    renderNotes();
  } else {
    //add new note
    notes.unshift({
      id: generateId(),
      title: title,
      content: content,
    });

    closeNoteDialog();
    saveNotes();
    renderNotes();
  }
}

function generateId() {
  return Date.now().toString();
}

function saveNotes() {
  localStorage.setItem("Smurfnotes", JSON.stringify(notes));
}

function deleteNote(noteId) {
  notes = notes.filter((note) => note.id != noteId);
  saveNotes();
  renderNotes();
}

function renderNotes() {
  const notesContainer = document.getElementById("notesContainer");

  if (notes.length === 0) {
    notesContainer.innerHTML = `
        <div class="empty-state">
        <h2>No Notes yet</h2>
        <p>Create your first note to get started!</p>
        <button class="add-note-btn" onclick="openNoteDialog()">+ Add your first note</button>
        </div>
        `;
    return;
  }
  notesContainer.innerHTML = notes.map(note => `
    <div class="note-card" data-note-id="${note.id}">
    <h3 class="note-title">${note.title}</h3>
    <p class="note-content">${note.content}</p>
    <div class="note-actions">
    <button class="edit-btn" title="Edit Note"><i class="fa-solid fa-pen-to-square"></i></button>
    <button class="delete-btn" title="Delete Note"><i class="fa-solid fa-trash"></i></button>
    </div>
    </div>
    `).join('')

  // Attach event listeners after rendering
  notesContainer.querySelectorAll(".note-card").forEach((card) => {
    const noteId = card.getAttribute("data-note-id");
    card
      .querySelector(".edit-btn")
      .addEventListener("click", () => openNoteDialog(noteId));
    card
      .querySelector(".delete-btn")
      .addEventListener("click", () => deleteNote(noteId));
  });
}

function openNoteDialog(noteId = null) {
  const dialog = document.getElementById("noteDialog");
  const titleInput = document.getElementById("noteTitle");
  const contentInput = document.getElementById("noteContent");

  if (noteId) {
    // editing mode
    const noteToEdit = notes.find((note) => note.id === noteId);
    editingNoteId = noteId;
    document.getElementById("dialogTitle").textContent = "Edit Note";
    titleInput.value = noteToEdit.title;
    contentInput.value = noteToEdit.content;
  } else {
    // add mode
    editingNoteId = null;
    document.getElementById("dialogTitle").textContent = "Add Note";
    titleInput.value = "";
    contentInput.value = "";
  }

  dialog.showModal();
  titleInput.focus();
}

function closeNoteDialog() {
  document.getElementById("noteDialog").close();
}

document.addEventListener("DOMContentLoaded", function () {
  notes = loadNotes();
  renderNotes();

  document.getElementById("noteForm").addEventListener("submit", saveNote);

  document.getElementById("noteDialog").addEventListener("click", function (e) {
    if (e.target === this) {
      closeNoteDialog();
    }
  });
});
