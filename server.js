const express = require('express');
const app = express();
const shortid = require('shortid');
app.use(express.json());

app.locals.notes = [
  { id: shortid.generate(), title: 'fakeTitle', body: [{id: shortid.generate(), text: 'faketext'}] },
  { id: shortid.generate(), title: 'fakeTitle2', body: [{id: shortid.generate(), text: 'faketext2'}] }
];

app.listen('3001', () => {
  console.log('Server is now running at http://localhost:3001')
});

app.get('/api/v1/', (request, response) => {
  response.status(200).json(app.locals.notes);
});