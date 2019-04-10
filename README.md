# Trapper Keeper

This repository will serve as the Trapper Keeper "backend".

## Project Setup

* Clone down this repo and run `npm install`
* cd into this directory
* npm start 

## API Endpoints

* ##### GET notes '/api/v1/notes/'
  Allows users to view notes saved in the backend. 
  
* ##### GET note by ID '/api/v1/notes/:id'
  Allows users to view an indivudual note using the unique note ID. 

* ##### DELETE '/api/v1/notes/:id'
  Allows users to delete an indivudual note using the unique note ID. 

* ##### PUT '/api/v1/notes/:id'
  Allows users to update an indivudual note using the unique note ID. 

* ##### POST '/api/v1/notes/'
  Allows users to create a new note and save it in the backend.
