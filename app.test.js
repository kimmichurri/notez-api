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
  })

  describe('get to /notes', () => {
    it('should return a status of 200 with a notes array', async () => {
      const response = await request(app).get('/api/v1/notes');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(notes);
    })
  })

  describe('get to /notes/:id', () => {
    it('should return a status of 200 with a note object', async () => {
      const response = await request(app).get('/api/v1/notes/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(notes[0]);
    })
    it('should return a status of 404 with a message of "Note does not exist"', async () => {
      const response = await request(app).get('/api/v1/notes/12345');
      expect(response.status).toBe(404);
      expect(response.body).toBe('Note does not exist');
    })
  })

})



