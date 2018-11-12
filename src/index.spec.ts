import { expect } from 'chai';
import 'mocha';

declare var process;

import VerdaccioGithubAuthWrapper = require('./index');

describe('Verdaccio Github Auth', () => {
  let client;

  beforeEach(() => {
    client = VerdaccioGithubAuthWrapper({org: 'volcano'}, {});
  })

  it('should produce the Auth Client', () => {
    expect(client).to.exist;
  });

  it('should return teams', async () => {
    client.authenticate(process.env.GITHUB_USERNAME, process.env.GITHUB_TOKEN, (a, teams) => {
      expect(teams).to.not.be.empty;
      expect(teams.length).to.equal(3);
    });
  });

  it('should return teams with no org set.', async () => {
    client = VerdaccioGithubAuthWrapper({org: null}, {});

    client.authenticate(process.env.GITHUB_USERNAME, process.env.GITHUB_TOKEN, (a, teams) => {
      expect(teams).to.not.be.empty;
      expect(teams.length).to.be.greaterThan(3);
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
