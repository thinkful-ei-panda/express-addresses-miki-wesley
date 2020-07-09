const app = require('../src/app');
const supertest = require('supertest');
const { expect } = require('chai');

describe('App', () => {
  it('GET responds with 200 and \'Hello Boilerplate\'', () =>{
    return supertest(app)
      .get('/')
      .expect(200,'Hello Boilerplate');
  });

  describe('GET /address', () => {
    it('responds with a 200 and array of addresses', () => {
      return supertest(app)
        .get('/address')
        .expect(200)
        .expect('Content-type',/json/)
        .then(res => {
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.be.an('object');
        });
    });
  });

  describe('POST /address', () => {
    it('responds with a 201, location url, and the posted address', () => {
      return supertest(app)
        .post('/address')
        .send({
          id: 'UUID',
          firstName: 'String',
          lastName: 'String',
          address1: 'String',
          address2: 'String',
          city: 'String',
          state: 'CA',
          zip: '12345'
        })
        .expect(201)
        .expect('Content-type',/json/)
        .then(res => {
          expect(res.body)
            .to.be.an('object')
            .to.include.all.keys('id','firstName','lastName','address1','address2','city','state','zip');
        });
    });
    describe('400', () => {      
      const requiredParams = ['firstName','lastName','address1','city','state','zip'];
      requiredParams.forEach(requiredParam => {
        it(`should return 400 if ${requiredParam} doesn't exist`, () => {
          let address={
            id: 'UUID',
            firstName: 'String',
            lastName: 'String',
            address1: 'String',
            address2: 'String',
            city: 'String',
            state: 'String',
            zip: 'Number'
          };
          address[requiredParam]=null;
          return supertest(app)
            .post('/address')
            .send(address)
            .expect(400,`Address must include ${requiredParam}`);
        });
      });
      it('should return 400 if state value is invalid', () => {
        let address={
          id: 'UUID',
          firstName: 'String',
          lastName: 'String',
          address1: 'String',
          address2: 'String',
          city: 'String',
          state: 'String',
          zip: 'Number'
        };
        return supertest(app)
          .post('/address')
          .send(address)
          .expect(400,'Please enter a valid 2 letter state code');
      });
      it('should return 400 if zip value is invalid', () => {
        let address={
          id: 'UUID',
          firstName: 'String',
          lastName: 'String',
          address1: 'String',
          address2: 'String',
          city: 'CA',
          state: 'CA',
          zip: 1234
        };
        return supertest(app)
          .post('/address')
          .send(address)
          .expect(400,'Please enter a valid 5 digit zip code');
      });     
    });    
  });
});

