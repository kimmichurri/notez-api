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

})