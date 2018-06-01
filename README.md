# verdaccio-github-auth

> ⚠ WARNING - This is an experimental plugin!!

This is a simple Github Authentication plugin for verdaccio. 

## Config

```yml
github-auth:
     org: cthos # OPTIONAL: Filter the user's teams to this organization
     mode: token # token or basic. Token expects an auth token as the password. Basic is raw username/password for github. DEFAULT: token
     cachettl: 5 # OPTIONAL: How long to cache the user's teams in minutes. DEFAULT: 5


    '**':
    # Access is determined by team permissions, but github username is also valid.
    access: team1 team2 awesomteam cthos
```

## Gotchas

* You cannot use `basic` with 2FA as far as I'm aware - you'd need to use the token type.
* The personal access token needs `read:org` and `read:user`. 

## Planned Enhancements

* (Optionally) Allow the access permissions to be based off of org membership, not just team access.

## Current Limitations

* The Team call doesn't currently iterate, so if you are a member of more than 100 teams, it won't load them all (Willfix)
* Teams are cached in Memory, so a lot of users could result in high memory usage and I've not profiled the impact.