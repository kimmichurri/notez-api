import express from 'express';
//we are importing the express framework so that we can write out our code with a different syntax (considered by many developers to be easier to read and write, and I like it too)
//notice we aren't using the 'require' syntax- this is because we installed babel and can use ES6 'import'
const app = express();
//here we are stating that our app is an express app
import cors from 'cors';
app.use(cors());
//CORS prevents requests made across domains, but we want to be able to be able to make requests from a front-end that is hosted at another domain so we need to use cors here
import shortid from 'shortid';
//this is just a little npm package for generating ids for our data
app.use(express.json());
//this ensures that the data is parsed as JSON, which is what we want to be dealing with here

app.locals.notes = [
  { 
    id: 10,
    title: 'fakeTitle', 
    listItems: [
      {id: 'a', text: 'faketext', completed: false},
      {id: 'b', text: 'faketextb', completed: false}
    ]},
  { 
    id: 11,
    title: 'fakeTitle2', 
    listItems: [
      {id: 'c', text: 'faketext2', completed: false}
    ]}
];
//app.locals is a place where we can store data in our backend, kinda like how we can store data in localStorage in front-end- Both are short-term solutions for data storage
//we gave it a property of notes to store an array of note objects. We could add more properties and store more information of various data types

app.get('/api/v1/notes/', (request, response) => {
  //app is an object that we assign to be an express application at the top of our file
  //app.get is the method from Express we use to make our GET request at the API endpoint listed as the first argument
  //the second argument is a callback function that is called when a request is made to this route- so these methods are sitting and waiting/listening for requests
  response.status(200).json(app.locals.notes);
  //this sets the status code of the response, which is 200 for a successful reponse
  //after that we are chaining on the JSON that will be sent back with the response, which will be our array of notes stored as a property on app.locals
  //.json can also be used to convert data to JSON, which we will see later
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
    return response.sendStatus(204);
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
