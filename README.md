
## Environment variables

```sh
heroku config:set NPM_CONFIG_PRODUCTION=false
```

Add following environment variables in [Heroku Dashboard](https://dashboard.heroku.com)  

`GOAL_SERVE_API_KEY`  
`PORT`  
`JWT_SECRET`  

## Installation

```sh
npm install
npm run dev
```

## Seeds

### Seeding initial data

```sh
npm run seed
```

### Seeding test data

```sh
npm run seed-test
```

## Deployment

```sh
npm run heroku-deploy
heroku logs -t
heroku open
```

## Domains

### Development

The deployment at development stage is from `dev` branch.  
The URL is https://icast-backend.herokuapp.com/graphql.

### Production

We do not have production server yet.

## TODOs

- MongoDB
  * IP whitelist at MongoDB Atlas
  * Indexing should be set-up

- GraphQL
  * Disable GraphQL playground on release
  * Clean up the whitelist origins
