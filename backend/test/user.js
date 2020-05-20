const request = require('supertest');
const should = require('should');
const app = require('../app.js');

let cookie;

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

describe('POST /login', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .post('/login')
      .send({ email: 'mocha@test.com', password: 'password' })
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        [cookie] = res.headers['set-cookie'][0].split(';');
        done();
      });
  });
});

describe('POST /logout', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/logout')
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

describe('GET /account (old session token)', () => {
  it('should return 401 Unauthorized', (done) => {
    request(app)
      .get('/account')
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(401)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

describe('POST /login', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .post('/login')
      .send({ email: 'mocha@test.com', password: 'password' })
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        [cookie] = res.headers['set-cookie'][0].split(';');
        done();
      });
  });
});

describe('GET /account (authorized)', () => {
  it('should return 200 OK and  json data', (done) => {
    request(app)
      .get('/account')
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        res.body.email.should.equal('mocha@test.com');
        should.not.exist(res.body.name);
        should.not.exist(res.body.timezone);
      })
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

describe('GET /account (unauthorized)', () => {
  it('should return 401 Unauthorized', (done) => {
    request(app)
      .get('/account')
      .set('Accept', 'application/json')
      .expect(401)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

describe('POST /account/profile (authorized)', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .post('/account/profile')
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .send({ name: 'senor mocha', timezone: 'America/New_York' })
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

describe('POST /account/profile (unauthorized)', () => {
  it('should return 401 Unauthorized', (done) => {
    request(app)
      .post('/account/profile')
      .set('Accept', 'application/json')
      .send({ name: 'evil doer' })
      .expect(401)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});


describe('GET /account (authorized)', () => {
  it('should return 200 OK and updated json data', (done) => {
    request(app)
      .get('/account')
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        res.body.email.should.equal('mocha@test.com');
        res.body.name.should.equal('senor mocha');
        res.body.timezone.should.equal('America/New_York');
      })
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

describe('POST /account/password (authorized)', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .post('/account/password')
      .send({ password: 'newPassword', confirmPassword: 'newPassword' })
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

describe('POST /account/password (unauthorized)', () => {
  it('should return 401 Unauthorized', (done) => {
    request(app)
      .post('/account/password')
      .send({ password: 'badPassword', confirmPassword: 'badPassword' })
      .set('Accept', 'application/json')
      .expect(401)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

describe('POST /login (after password reset', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .post('/login')
      .send({ email: 'mocha@test.com', password: 'newPassword' })
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        [cookie] = res.headers['set-cookie'][0].split(';');
        done();
      });
  });
});

describe('POST /account/delete (unauthorized)', () => {
  it('should return 401 Unauthorized', (done) => {
    request(app)
      .post('/account/delete')
      .set('Accept', 'application/json')
      .expect(401)
      .end((err) => {
        if (err) return done(err);
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
