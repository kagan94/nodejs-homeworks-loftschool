/**
 * Created by Leo on 3/26/2018.
 */

describe('/GET main page', () => {
  it('test status code of main page', (done) => {
    request
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.a('string');
        expect(res.text.length).to.not.be.equal(0);
        done();
      });
  });
});

describe('/GET main page (duplicate) ', () => {
  it('test status code of main page', (done) => {
    request
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.a('string');
        expect(res.text.length).to.not.be.equal(0);
        done();
      });
  });
});
