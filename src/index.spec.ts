import { expect } from 'chai';
import 'mocha';
import * as nock from 'nock';

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

  it('should not return orgs if orgmode is off.', async () => {
    client = VerdaccioGithubAuthWrapper({org: null, orgmode: false}, {});

    client.authenticate(process.env.GITHUB_USERNAME, process.env.GITHUB_TOKEN, (a, teams) => {
      expect(teams).to.not.be.empty;
      expect(teams).to.not.contain('org:volcano');
    });
  });

  it('should return orgs if orgmode is on.', async () => {
    client = VerdaccioGithubAuthWrapper({org: null, orgmode: true}, {});

    client.authenticate(process.env.GITHUB_USERNAME, process.env.GITHUB_TOKEN, (a, teams) => {
      expect(teams).to.not.be.empty;
      expect(teams).to.contain('org:volcano');
    });
  });

  it('should not allow bad authentication', (done) => {
    client.adduser(process.env.GITHUB_USERNAME, 'thisisnotthetokenyouareafter', (err, good) => {
      expect(err).to.be.a.instanceof(Error);
      expect(good).to.be.false;
      done();
    });
  });

  it('should authenticate against custom Github URL', (done: (error?: any) => void) => {
    nock('http://localhost/api/v3')
        .get('/user')
        .reply(200, 'Ok');

    client = VerdaccioGithubAuthWrapper({octokit: {baseUrl: 'http://localhost/api/v3'}}, {});
    client.adduser(process.env.GITHUB_USERNAME, process.env.GITHUB_TOKEN, (a, teams) => {
      expect(a).to.be.null;
      expect(teams).to.be.true;

      done();
    });
  });
});
