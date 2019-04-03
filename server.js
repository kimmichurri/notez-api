const express = require('express');
const app = express();
const shortid = require('shortid');
app.use(express.json());

app.locals.notes = [
  { id: '1', title: 'fakeTitle', body: [{id: shortid.generate(), text: 'faketext'}] },
  { id: '2', title: 'fakeTitle2', body: [{id: shortid.generate(), text: 'faketext2'}] }
];

app.listen('3001', () => {
  console.log('Server is now running at http://localhost:3001')
});

app.get('/api/v1/', (request, response) => {
  response.status(200).json(app.locals.notes);
});

app.delete('/api/v1/:id', (request, response) => {
  const { id } = request.params
  const { notes } = app.locals
  const note = notes.find(note => note.id == id)
  const index = notes.indexOf(note)


  if (!note) {
    return response.sendStatus(404).json('Note does not exist')
  } else {
    notes.splice(index, 1)
    return response.status(206).json(note)
  }
})