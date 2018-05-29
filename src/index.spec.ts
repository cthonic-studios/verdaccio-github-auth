import { expect } from 'chai';
import 'mocha';

declare var process;

import {VerdaccioGithubAuth} from './index';

describe('Newton Person', () => {
  let client: VerdaccioGithubAuth;

  beforeEach(() => {
    client = new VerdaccioGithubAuth({org: 'pfizer'});
  })

  it('should produce the Auth Client', () => {
    expect(client).to.exist;
  });

  it('should return teams', (done) => {

    client.authenticate(process.env.GITHUB_USERNAME, process.env.GITHUB_TOKEN, (a, teams) => {
      console.log(teams);

      expect(teams).to.not.be.empty;
      done();
    });
  });

});
