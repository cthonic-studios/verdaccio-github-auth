# verdaccio-github-auth

> ⚠ WARNING - This is an experimental plugin!!

This is a simple Github Authentication plugin for verdaccio.

## Config

```yml
github-auth:
     org: cthos # OPTIONAL: Filter the user's teams to this organization
     mode: token # token or basic. Token expects an auth token as the password. Basic is raw username/password for github. DEFAULT: token
     cachettl: 5 # OPTIONAL: How long to cache the user's teams in minutes. DEFAULT: 5
```