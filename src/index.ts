import * as Octokit from '@octokit/rest';

interface IGithubConfig {
  org?: string;
  mode?: string;
}

function VerdaccioGithubAuthWrapper(config, other): any {
  return new VerdaccioGithubAuth(config, other);
}

class VerdaccioGithubAuth {
  private org: string;
  private mode: string;

  constructor(config: any = {}, other: any = {}) {
    this.org = !!config.org ? config.org : '';
    // Mode defaults to token.
    this.mode = !!config.mode ? config.mode : 'token';

    console.log(config);
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

    if (this.mode === 'token') {
      octokit.authenticate({
        type: 'token',
        token: password
      });  
    }
    
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

  private validateMode() {

  }
}

export = VerdaccioGithubAuthWrapper;