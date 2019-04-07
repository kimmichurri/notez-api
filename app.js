import express from 'express';
const app = express();
import cors from 'cors';
import shortid from 'shortid';
app.use(cors());
app.use(express.json());

app.locals.notes = [
  { 
    id: '1', 
    title: 'fakeTitle', 
    listItems: [
      {id: shortid.generate(), text: 'faketext'}, 
      {id: shortid.generate(), text: 'faketextb'}
    ]},
  { 
    id: '2', 
    title: 'fakeTitle2', 
    listItems: [
      {id: shortid.generate(), text: 'faketext2'}
    ]}
];

app.get('/api/v1/notes/', (request, response) => {
  response.status(200).json(app.locals.notes);
});

app.get('/api/v1/notes/:id', (request, response) => {
  const { id } = request.params;
  const { notes } = app.locals;
  const foundNote = notes.find(note => note.id == id);
  if (!foundNote) {
    return response.status(404).json('Note does not exist');
  } else {
    return response.status(200).json(foundNote);
  }
})

app.delete('/api/v1/notes/:id', (request, response) => {
  const { id } = request.params;
  const { notes } = app.locals;
  const note = notes.find(note => note.id == id);
  const index = notes.indexOf(note);
  if (!note) {
    console.log('fail')
    return response.status(404).json('Note does not exist');
  } else {
    console.log('success')
    notes.splice(index, 1);
    return response.sendStatus(204);
  }
});

app.put('/api/v1/notes/:id', (request, response) => {
  const { title, listItems } = request.body;
  const { id } = request.params;
  let found = false;
  const updatedNotes = app.locals.notes.map(note => {
    if (note.id === id) {
      found = true;
      return { id, title, listItems };
    } else {
      return note;
    }
  });
  if (found === false) {
    return response.status(404).json('Note does not exist');
  } else if (!title || !listItems) {
    return response.status(422).json('Please enter a title and at least one list item');
  } else {
    app.locals.notes = updatedNotes;
    return response.status(204).json('Successful update');
  }
});

app.post('/api/v1/notes/', (request, response) => {
  const { title, listItems } = request.body;
  if (!title || listItems.length === 0) {
    return response.status(422).json('Please enter a title and at least one list item');
  } else {
    const newNote = {
      id: shortid.generate(),
      ...request.body
    }
    app.locals.notes.push(newNote);
    response.status(201).json(newNote);
  }
});

export default app;
