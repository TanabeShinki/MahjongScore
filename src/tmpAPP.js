import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { withAuthenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css';
import { API, Storage } from 'aws-amplify';
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';
 
const initialFormState = { name: '', description: '' }
 
function App({ signOut, user }) {
  //State変数"notes"と"formData"を宣言し、関数コンポーネント間で値を保持することを可能にする
  //notesの初期値を"[]"、formDataの初期値を"initialFormState"
  //notesを更新する関数を"setNotes",formDataを更新する関数を"setformData"
  //関数内では"notes","formData"で読み出し、表示することが出来る。
  //
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
 
  //useEffectを使うことでレンダー後にfetchNotes()を実行する
  useEffect(() => {
    fetchNotes();
  }, []);
 
  async function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    fetchNotes();
  }
 
  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(notesFromAPI.map(async note => {
      if (note.image) {
        const image = await Storage.get(note.image);
        note.image = image;
      }
      return note;
    }))
    setNotes(apiData.data.listNotes.items);
  }
 
  async function createNote() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
  }
 
  async function deleteNote({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
  }
  return (
    <div className="App">
      <h1>My Notes App</h1>
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Note name"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="Note description"
        value={formData.description}
      />
      <input
        type="file"
        onChange={onChange}
      />
      <button onClick={createNote}>Create Note</button>
      <table className='table'>
        <thead>
            <tr>
              <th>タイプ</th>
              <th>名前</th>
            </tr>
        </thead>
        {this.state.feed.entryy}
      </table>
      <div style={{marginBottom: 30}}>
        {
          notes.map(note => (
            <div key={note.id || note.name}>
              <h2>{note.name}</h2>
              <p>{note.description}</p>
              <button onClick={() => deleteNote(note)}>Delete note</button>
              {
                note.image && <img src={note.image} style={{width: 400}} />
              }
            </div>
          ))
        }
      </div>
      <img src={logo} className="App-logo" alt="logo" />
      <h1>Hello {user.username}</h1>
      <button onClick={signOut}>Sign out</button>
    </div>

  );
}
 
export default withAuthenticator(App);