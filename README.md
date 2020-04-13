# verdaccio-github-auth

![Travis Build Status](https://travis-ci.org/cthonic-studios/verdaccio-github-auth.svg?branch=master)

This is a simple Github Authentication plugin for verdaccio. 

## Config

```yml
github-auth:
     org: cthos # OPTIONAL: Filter the user's teams to this organization
     mode: token # token or basic. Token expects an auth token as the password. Basic is raw username/password for github. DEFAULT: token
     cachettl: 5 # OPTIONAL: How long to cache the user's teams in minutes. DEFAULT: 5
     orgmode: true # OPTIONAL: allow orgs to be placed in the `access` stanza.

    octokit: { # OPTIONAL: Configuration options to override Octokit
        baseUrl: https://git.myorg.com/v3 # The endpoint to use for the Github API
    }


    '**':
    # Access is determined by team permissions, but github username is also valid.
      access: team1 team2 awesomteam cthos

    '@volcano/*':
      access: org:volcano # allows access to everyone in the volcano org
```

## Gotchas

* You cannot use `basic` with 2FA as far as I'm aware - you'd need to use the token type.
* The personal access token needs `read:org` and `read:user`. 

## Current Limitations

* Teams are cached in Memory, so a lot of users could result in high memory usage and I've not profiled the impact.