import request from 'supertest';
import '@babel/polyfill';
import app from './app';
import shortid from 'shortid';

describe('/api/v1/notes', () => {
  let notes;
  beforeEach(() => {
    notes = [
      { id: '1', title: 'fakeTitle', body: [{id: shortid.generate(), text: 'faketext'}] },
      { id: '2', title: 'fakeTitle2', body: [{id: shortid.generate(), text: 'faketext2'}] }
    ];
    app.locals.notes = notes;
  });

  describe('GET to /notes', () => {
    it('should return a status of 200 with a notes array', async () => {
      const response = await request(app).get('/api/v1/notes');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(notes);
    });
  });

  describe('GET to /notes/:id', () => {
    it('should return a status of 200 with a note object', async () => {
      const response = await request(app).get('/api/v1/notes/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(notes[0]);
    });
    it('should return a status of 404 with a message of "Note does not exist"', async () => {
      const response = await request(app).get('/api/v1/notes/1012');
      expect(response.status).toBe(404);
      expect(response.body).toBe('Note does not exist');
    });
  });

  describe('PUT to /notes/:id', () => {
    it('should return a status of 204 and update note object', async () => {
      expect(app.locals.notes[0]).toEqual(notes[0]);

      shortid.generate = jest.fn().mockImplementation(() => '329');
      const noteUpdate = {
        title: 'newTitle', 
        body: [{ id: shortid.generate(), text: 'newFaketext' }] 
      };
      const response = await request(app).put('/api/v1/notes/1')
        .send(noteUpdate);

      expect(response.status).toBe(204);
      expect(app.locals.notes[0]).toEqual({ id: notes[0].id, title: 'newTitle', body: [{ id: shortid.generate(), text: 'newFaketext' }] });
    });
    
    it('should return a status of 404 with a message of "Note does not exist"', async () => {
      expect(app.locals.notes[0]).toEqual(notes[0]);

      const noteUpdate = {
        title: 'newTitle', 
        body: [{ id: shortid.generate(), text: 'newFaketext' }] 
      };
      const response = await request(app).put('/api/v1/notes/51')
        .send(noteUpdate);
      expect(response.status).toBe(404);
      expect(app.locals.notes[0]).toEqual(notes[0]);
    });

    it('should return a 422 and error message if the request body is not "ok"', async () => {
      expect(app.locals.notes[0]).toEqual(notes[0]);
      
      const badNoteUpdate = {
        title: 'newTitle', 
        bboddy: [{ id: shortid.generate(), text: 'newFaketext' }] 
      };
      const response = await request(app).put('/api/v1/notes/1')
        .send(badNoteUpdate);
      expect(response.status).toBe(422);
      expect(app.locals.notes[0]).toEqual(notes[0]);
    });
  });

  describe('POST to /notes', () => {
    it('should return a status of 201 with an updated notes array', async () => {
      expect(app.locals.notes.length).toBe(2);

      shortid.generate = jest.fn().mockImplementation(() => '329');
      const newNote = {
        id: '329',
        title: 'newTitle', 
        body: [{ id: shortid.generate(), text: 'newFaketext' }]
      };
      const response = await request(app).post('/api/v1/notes')
        .send(newNote);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(newNote);
      expect(app.locals.notes.length).toBe(3);
    });

    it('should return a status of 422 with a non-modified array of notes', () => {

    });
  });

  describe('DELETE to /notes/:id', () => {
    it('should return a status of 204 with an updated notes array', () => {

    });
    
    it('should return a status of 404 with a non-modified array of notes', () => {

    });
  });
});



