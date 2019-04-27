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
  //we are using the same method here that we used to get all of the notes before but now we are targeting a specific note by id
  const { id } = request.params;
  //in order to match up the ids we sent over an id in our request and it can be found in the params
  const { notes } = app.locals;
  //here we are just destructuring the notes property off of the app.locals object in order to make our code more legible down below
  const foundNote = notes.find(note => note.id == id);
  //here we are declaring a variable of found note to store the note whose id matches the one we sent over in the request.params
  if (!foundNote) {
  //a conditional for error handling because we want to handle the case if the note cannot be found
    return response.status(404).json('Note does not exist');
    //this will return the appropriate status code of 404 indicating that the thing they were looking for was not found with a JSON response of 'Note does not exist'
  } else {
    return response.status(200).json(foundNote);
    //in the case that the note was set the status code of 200 for a successful response and we also return the note that we found by matching up the IDs
  }
})

app.delete('/api/v1/notes/:id', (request, response) => {
  //we are targeting a specific note by id in order to delete it
  const { id } = request.params;
  //in order to match up the ids we sent over an id in our request and it can be found in the params
  const { notes } = app.locals;
  //here we are just destructuring the notes property off of the app.locals object in order to make our code more legible down below
  const note = notes.find(note => note.id == id);
  //here we are declaring a variable of note to store the note whose id matches the one we sent over in the request.params
  const index = notes.indexOf(note);
  //since we captured that note we were targeting above with a variable we can now get its index in that notes array that we destructured from app.locals in order to splice it later
  if (!note) {
    return response.status(404).json('Note does not exist');
    //in the event that the note the user is trying to delete doesn't exist we will set the status code as 404 and a JSON response of 'Note does not exist'
  } else {
    notes.splice(index, 1);
    return response.sendStatus(204);
    //if that note exists and therefore able to be deleted we will splice it from the notes array using that index we grabbed before
    //we will also set the status code of 204 indicating that there is no content and that the request has succeeded
    //since we are using 'sendStatus' not only is the status code set but the code will also be sent as a string in the response body (there is no point in sending the deleted note back to the user because they wanted to get rid of it)
  }
});

app.put('/api/v1/notes/:id', (request, response) => {
  //we are targeting a specific note by id here because we basically want to copy over that note in a new mapped over array and then reset that array to app.locals
  const { title, listItems } = request.body;
  //here we destructured the title and listItems off of the request body
  const { id } = request.params;
  //in order to match up the ids we sent over an id in our request and it can be found in the params
  let found = false;
  //here we are declaring a variable and initializing it as false because we want to toggle that later if we are able to find a note with a matching id and then conditonally set some response information with that later
  const updatedNotes = app.locals.notes.map(note => {
    //we are going to map over the existing array of notes because we are returning an array of the same length but we are just changing the content of one of the notes so we'll copy over what was there before
    //it would be best to have destructured this notes array off of app.locals like we did before for consistency and readability
    if (note.id === id) {
      found = true;
      //if we are able to match ids to find a note let's go ahead and toggle that found variable to true
      return { id, title, listItems };
      //here we are returning the same id (that shouldn't change) and the title and listItems that were sent over in the request.body because those are the changes the user made that we want to reflect here in our backend storage
    } else {
      return note;
      //if we cannot find a note whose id matches that from the request.params then we just return that note they sent over and handle that below because the value of the found variable is still false under this condition
    }
  });
  if (found === false) {
    return response.status(404).json('Note does not exist');
    //so if we weren't able to find that note by id we set a status of 404 not found and a JSON response of 'Note does not exist'
  } else if (!title || !listItems) {
    return response.status(422).json('Please enter a title and at least one list item');
    //if what is sent over is missing either the title or listItems then we want to set of the status of 422 unprocessable entity (which basically indicate the user needs to change something in the request in order for it to be successful) and we also send that JSON message to the user
  } else {
    app.locals.notes = updatedNotes;
    //if we were able to successfully find the note by id then that means we were able to copy over the new content of that note and that is all captured in 'updatedNotes'
    //since 'updatedNotes' contains the changes the user wanted to make we want to reassign the original array in app.locals to that updatedNotes array
    return response.sendStatus(204);
    //since we are using 'sendStatus' not only is the status code set but the code will also be sent as a string in the response body
  }
});

app.post('/api/v1/notes/', (request, response) => {
  //here we get to make a post request! Which means the user can add things to the notes array in app.locals
  const { title, listItems } = request.body;
  //here we destructured the title and listItems off of the request body
  if (!title || listItems.length === 0) {
    //if the user has forgotten to give a title to their note or write anything in their list (listItems is an array of strings) then...
    return response.status(422).json('Please enter a title and at least one list item');
    //we want to set of the status of 422 unprocessable entity (which basically indicate the user needs to change something in the request in order for it to be successful) and we also send that JSON message to the user
  } else {
    //if they did everything right then we create a newNote with the information they sent over in the request.body
    const newNote = {
      id: shortid.generate(),
      //of course every new note needs an id
      ...request.body
      // and then we are spreading in the request.body but it would probably be better here to just set the title and listItems to control this a little better
    }
    app.locals.notes.push(newNote);
    //now that we have that new note we can go ahead and push that onto the end of the app.locals.notes array
    response.status(201).json(newNote);
    //finally, we set the status here as 201 that indicated that the new resource was successfully created and we also send the newNote back as JSON
  }
});

export default app;
//never forget your imports and exports, and make sure they are done correctly!
