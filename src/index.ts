import * as Octokit from '@octokit/rest';
import * as moment from 'moment';

interface IGithubConfig {
  org?: string;
  mode?: string;
  cachettl?: number;
}

interface ITeamCache {
  teams: string[];
  ttl: moment.Moment;
}

function VerdaccioGithubAuthWrapper(config, other): any {
  return new VerdaccioGithubAuth(config, other);
}

class VerdaccioGithubAuth {
  private org: string;
  private mode: string;
  private cachettl: number;

  private octokit: Octokit;
  
  // TODO: hook into a not-in-memory cache
  private teamCache: any = {};

  constructor(config: IGithubConfig = {}, other: any = {}) {
    this.org = config.org || '';
    // Mode defaults to token.
    this.mode = config.mode || 'token';
    this.cachettl = config.cachettl || 5;

    this.octokit = new Octokit();
  }

  /**
   * Authenticates against github and returns teams the user
   * is a member of, for the organization in question.
   * 
   * @param username 
   * @param password 
   * @param callback 
   */
  public async authenticate(username, password, callback): Promise<void> {
    if (this.mode === 'token') {
      this.octokit.authenticate({
        type: 'token',
        token: password
      });
    } else if (this.mode === 'basic') {
      this.octokit.authenticate({
        type: 'basic',
        username: username,
        password: password
      });
    }
    
    const teams = await this.getUserTeams(username);
    callback(null, teams);
  }

  /**
   * 
   * @todo Loop to grab all teams.
   * @param bypassCache 
   */
  private async getUserTeams(forUser: string, bypassCache: boolean = false): Promise<any> {
    let teams;
    const cachedTeams = this.teamCache[forUser] as ITeamCache;

    if (!bypassCache && cachedTeams && cachedTeams.ttl.isAfter()) {
      return cachedTeams.teams;
    }

    teams = await this.octokit.users.getTeams({per_page: 100}).then(resp => {
      return resp.data.filter((team) => {
        if (!this.org) {
          return true;
        }

        return team.organization.login == this.org;
      }).map((team) => team.slug);
    }).catch(err => {
      return false;
    });

    if (teams) {
      teams.push(forUser);
    }

    this.teamCache[forUser] = {
      teams,
      ttl: moment().add(this.cachettl, 'minutes'),
    }

    return this.teamCache[forUser].teams;
  }

  /**
   * Validates whether or not a given mode is valid
   * 
   * @param {String} mode
   */
  private validateMode(mode: string) {
    const validMethods = [
      'token',
      'basic',
    ];

    return validMethods.indexOf(mode) > -1;
  }
}

export = VerdaccioGithubAuthWrapper;