const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const connection = require('../lib/setup-mongoose');
const app = require('../lib/app');

describe ('images API E2E testing', () => {

  const test_image = { // eslint-disable-line no-unused-vars
    title: 'Attack Cat',
    description: 'Incredibly scary cat',
    category: 'animals',
    url: 'www.attackcat.com/attackcat.jpg'
  };

  before((done) => {
    const CONNECTED = 1;
    if (connection.readyState === CONNECTED) dropCollection();
    else connection.on('open', dropCollection);

    function dropCollection() {
      const name = 'images';
      connection.db
        .listCollections({ name })
        .next((err, collInfo) => {
          if (!collInfo) return done();
          connection.db.dropCollection(name, done);
        });
    }
  });

  const request = chai.request(app);

  it ('GET /images should return empty array', (done) => {
    request
      .get('/images')
      .then((res) => {
        expect(res.body).to.deep.equal([]);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  let test_id; // eslint-disable-line no-unused-vars

  it ('POST /images to database', (done) => {
    request
      .post('/images')
      .send({ title: 'Attack Cat', category: 'animals', url: 'www.attackcat.com' })
      .then((res) => {
        test_id = res.body._id;
        done();
      })
      .catch(done);
  });
});