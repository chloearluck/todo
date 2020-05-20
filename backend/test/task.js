const request = require('supertest');
const should = require('should');
const app = require('../app.js');

let cookie, taskDays;

describe('POST /signup', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .post('/signup')
      .send({ email: 'mocha@test.com', password: 'password', confirmPassword: 'password' })
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        [cookie] = res.headers['set-cookie'][0].split(';');
        done();
      });
  });
});

describe('GET /task', () => {
  it('should return 200 OK with json data', (done) => {
    request(app)
      .get('/task')
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        taskDays = res.body;
        taskDays.length.should.equal(4);
        done();
      });
  });
});

describe('POST /task', () => {
  it('should return 201 Created', (done) => {
    request(app)
      .post('/task')
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .send({ name: 'make a sandwhich', date: taskDays[0].date, dayId: taskDays[0].day_id })
      .expect(201)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

describe('GET /task', () => {
  it('should return 200 OK with json data', (done) => {
    request(app)
      .get('/task')
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        taskDays = res.body;
        done();
      });
  });
});


describe('POST /task/completion', () => {
  it('should return 202 Accepted', (done) => {
    request(app)
      .post('/task/completion')
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .send({ taskId: taskDays[0].task_ids[0], completed: 'on' })
      .expect(202)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});


describe('GET /task', () => {
  it('should return 200 OK with new task', (done) => {
    request(app)
      .get('/task')
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        taskDays = res.body;
        taskDays[0].tasks[0].name.should.equal('make a sandwhich');
        taskDays[0].tasks[0].completed.should.equal(true);
        done();
      });
  });
});

describe('POST /task/delete', () => {
  it('should return 202 Accepted', (done) => {
    request(app)
      .post('/task/delete')
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .send({ taskId: taskDays[0].task_ids[0], dayId: taskDays[0].day_id })
      .expect(202)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

describe('GET /task', () => {
  it('should return 200 OK with json data', (done) => {
    request(app)
      .get('/task')
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        taskDays = res.body;
        taskDays[0].task_ids.length.should.equal(0);
        done();
      });
  });
});

describe('POST /account/delete (authorized)', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .post('/account/delete')
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});
