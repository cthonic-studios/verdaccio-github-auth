import { expect } from 'chai';
import 'mocha';

declare var process;

import VerdaccioGithubAuthWrapper = require('./index');

describe('Verdaccio Github Auth', () => {
  let client;

  beforeEach(() => {
    client = VerdaccioGithubAuthWrapper({org: 'pfizer'}, {});
  })

  it('should produce the Auth Client', () => {
    expect(client).to.exist;
  });

  it('should return teams', (done) => {

    client.authenticate(process.env.GITHUB_USERNAME, process.env.GITHUB_TOKEN, (a, teams) => {
      expect(teams).to.not.be.empty;
      done();
    });
  });

  it('should not allow bad authentication', (done) => {
    client.adduser(process.env.GITHUB_USERNAME, 'thisisnotthetokenyouareafter', (err, good) => {
      expect(err).to.be.a.instanceof(Error);
      expect(good).to.be.false;
      done();
    });
  });
});
