import * as Octokit from '@octokit/rest';

export class VerdaccioGithubAuth {
  private org: string;

  constructor(config: any = {}) {
    this.org = !!config.org ? config.org : '';
  }

  /**
   * Authenticates against github and returns teams the user
   * is a member of, for the organization in question.
   * 
   * @param username 
   * @param password 
   * @param callback 
   */
  public authenticate(username, password, callback) {
    let octokit = new Octokit();

    octokit.authenticate({
      type: 'token',
      token: password
    });

    octokit.users.getTeams({per_page: 100}).then(resp => {
      const teams = resp.data.filter((team) => {
        if (!this.org) {
          return true;
        }

        return team.organization.login == this.org;
      }).map((team) => team.slug);
      
      callback(null, teams);
    }).catch(err => {
      callback(null, false);
    });
  }
}