import express from 'express';
//We are importing express, a small framework built on top of the web server functionality 
//provided by Node.js.
//We have downloaded Babel, and therefore use 'import' instead of 'require'.
//Babel converts import and export declaration to CommonJS (require/module.exports) 

const app = express();
//This statement creates a new express application for you

import shortid from 'shortid';
//Shortid allows us to generate unique ids for child elements rendered to the DOM

import cors from 'cors';
app.use(cors());
//CORS is Cross Origin Resource Sharing.
//It allows you to make requests from one website to another website in the browser, 
//which is normally prohibited by another browser policy called the Same-Origin Policy (SOP).
//The statement above allows API calls from other domains.

app.use(express.json());
//Now your app parses the request body to json by default.

app.locals.notes = [
  { 
    id: '1', 
    title: 'fakeTitle', 
    listItems: [
      {id: shortid.generate(), text: 'faketext', completed: false}, 
      {id: shortid.generate(), text: 'faketextb', completed: false}
    ]},
  { 
    id: '2', 
    title: 'fakeTitle2', 
    listItems: [
      {id: shortid.generate(), text: 'faketext2', completed: false}
    ]}
];
//app.locals is a JS object. It's properties are local variables within the app, and they persist
//throughout the life of the application.

app.get('/api/v1/notes/', (request, response) => {
//This allows GET requests to the specified endpoint. 
  response.status(200).json(app.locals.notes);
  //The response returns a successful status code and the data inside our apps.locals.notes array
  //.json converts our data to JSON
});

app.get('/api/v1/notes/:id', (request, response) => {
//This allows a GET request to the specified endpoint, which is the unique id of a note.
  const { id } = request.params;
  //Destructuring to grab the desired id which should match the id of a note in our apps.locals.notes
  const { notes } = app.locals;
  //Destructuring notes
  const foundNote = notes.find(note => note.id == id);
  //Declaring a variable and setting the value to the note whose id matches the requested id
  if (!foundNote) {
    return response.status(404).json('Note does not exist');
    //If there is no matching note id, a response is given that contains the appropriate status code (Not Found) and a message
    //stating a note which matches that id doesn't exist.
  } else {
    return response.status(200).json(foundNote);
    //If a note matches the id, a status of 'Success' and the matching note (in JSON format) are given in the response
  }
})

app.delete('/api/v1/notes/:id', (request, response) => {
//Allows a DELETE request to the specified endpoint
  const { id } = request.params;
  //Destructuring the desired id
  const { notes } = app.locals;
  //Destructuring notes from our app.locals
  const note = notes.find(note => note.id == id);
  //Declaring variable, setting value to a note that matches the desired id
  const index = notes.indexOf(note);
  //Declaring variable, setting the value to the index of the found note
  if (!note) {
    return response.status(404).json('Note does not exist');
    //If there is no note that matches the desired id, a response is given with a status of Not Found and a message
  } else {
    notes.splice(index, 1);
    //Using splice to remove the matching card from the array of app.locals.notes
    return response.sendStatus(204);
    //Returning a response with a status of No Content, indicating the request has succeeded
  }
});

app.put('/api/v1/notes/:id', (request, response) => {
//Allows a PUT response to update the note with the matching id
  const { title, listItems } = request.body;
  //Destructuring title and listItems from the request body
  const { id } = request.params;
  //Destructuring the id from the request
  let found = false;
  //Declaring variable and setting default value to false
  const updatedNotes = app.locals.notes.map(note => {
  //Mapping over notes, assigning the value to a new variable
    if (note.id === id) {
      found = true;
      //If a note matches that id, reassign found to true
      return { id, title, listItems };
      //Return a new note object with the updated id, title, and listItems
    } else {
      return note;
      //If the note does not match the id, return the note
    }
  });
  if (found === false) {
    return response.status(404).json('Note does not exist');
    //If found is still false, return a response object with a Not Found status and a message
  } else if (!title || !listItems) {
    return response.status(422).json('Please enter a title and at least one list item');
    //If the title or listItems in the request body don't exist, return a status of Unprocessable Entity and instruct
    //user to include all necessary info
  } else {
    app.locals.notes = updatedNotes;
    //If found is true, reassign app.locals.notes to updatedNotes, which is the array of updated notes
    return response.sendStatus(204);
    //Return a response with a successful status code
  }
});

app.post('/api/v1/notes/', (request, response) => {
//Allows a POST request to add a new note to the specific endpoint
  const { title, listItems } = request.body;
  //Destructuring title and listItems from the request body
  if (!title || listItems.length === 0) {
    return response.status(422).json('Please enter a title and at least one list item');
    //If a title or listItem are missing, return a response with a status of Unprocessable Entity and a message
    //instructing the user to include both necessary fields
  } else {
    const newNote = {
      id: shortid.generate(),
      ...request.body
    }
    //If all fields are included, create a new object to add an id to the new note. 
    //Use spread operator to add all information from the request body into the new note
    app.locals.notes.push(newNote);
    //Add the new note to the app.locals.notes array
    response.status(201).json(newNote);
    //Return a response with a status of 'Created' and the note in JSON format

  }
});

export default app;
//export this component as a default export