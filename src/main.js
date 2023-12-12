/*import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
*/

const app = Vue.createApp({
  data() {
    return {
      notes: [],
      newNote: {
        title: '',
        body: '',
        isFavorite: false,
        completed: false, // Add completed property to the newNote object
      },
    };
  },
  methods: {
    fetchNotes() {
      fetch('http://localhost:3000/notes/')
        .then(response => response.json())
        .then(data => {
          this.notes = data.map(note => ({ ...note, editing: false }));
        })
        .catch(error => {
          console.error('Error fetching notes:', error);
        });
    },
    saveNote() {
      if (this.newNote.title.trim() !== '' && this.newNote.body.trim() !== '') {
        // New note - create using POST
        fetch('http://localhost:3000/notes/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.newNote),
        })
          .then(response => response.json())
          .then(newNote => {
            // Add the new note to the list
            this.notes.push({ ...newNote, editing: false });
            this.clearNewNote();
          })
          .catch(error => {
            console.error('Error adding note:', error);
          });
      }
    },
    deleteNote(noteId) {
      fetch(`http://localhost:3000/notes/${noteId}`, {
        method: 'DELETE',
      })
        .then(() => {
          this.notes = this.notes.filter(note => note.id !== noteId);
        })
        .catch(error => {
          console.error('Error deleting note:', error);
        });
    },
    toggleFavorite(noteId) {
      const note = this.notes.find(note => note.id === noteId);
      if (note) {
        note.isFavorite = !note.isFavorite;
      }
    },
    toggleEdit(note) {
      note.editing = !note.editing;
      if (note.id) {
        fetch(`http://localhost:3000/notes/${note.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(note),
        })
          .then(response => response.json())
          .then(updatedNote => {
            const index = this.notes.findIndex(n => n.id === updatedNote.id);
            if (index !== -1) {
              this.$set(this.notes, index, { ...this.notes[index], ...updatedNote });
            }
          })
          .catch(error => {
            console.error('Error updating note:', error);
          });
      }
    },
    toggleCompleted(note) {
      // Toggle the completed status using PATCH
      fetch(`http://localhost:3000/notes/${note.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !note.completed }),
      })
        .then(() => {
          note.completed = !note.completed;
          // Move completed note to the bottom of the list
          this.notes = this.notes.filter(n => n.id !== note.id);
          this.notes.push(note);
        })
        .catch(error => {
          console.error('Error toggling completed status:', error);
        });
    },
    clearNewNote() {
      this.newNote = { title: '', body: '', completed: false };
    },
  },
  mounted() {
    this.fetchNotes();
  },
});

app.mount('#app');
