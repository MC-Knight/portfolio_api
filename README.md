[![Coverage Status](https://coveralls.io/repos/github/MC-Knight/portfolio_api/badge.svg?branch=ft-api-docs)](https://coveralls.io/github/MC-Knight/portfolio_api?branch=ft-api-docs) [![CircleCI](https://dl.circleci.com/status-badge/img/circleci/RtbdVRXgZz5Z7PJ9hEnSq2/K1p6p4riRfzxw4jDN19cRS/tree/main.svg?style=svg&circle-token=CCIPRJ_4Pn373XEVN1ZqUt3HU1HMe_da26dd8e954259f29b3eb1449fec7e39652189f5)](https://dl.circleci.com/status-badge/redirect/circleci/RtbdVRXgZz5Z7PJ9hEnSq2/K1p6p4riRfzxw4jDN19cRS/tree/main)

## portfolio_api

my portfolio restApi

# Description

This is a RESTful API for managing personal blogs. It allows admin users to create, read, update and delete their own blogs. This RESTful API built using Node.js with Typescript,MongoDb and Express.js.

## Documentation

### base endpoint

/api

```
Blog:
  POST /blogs
  GET /blogs
  GET /blogs/{id}
  PUT /blogs/{id}
  DELETE /blogs/{id}
  PUT /blogs/view/{id}
  PUT /blog/like/{id}
  PUT /blog/unlike/{id}

Comment:
  POST /comments
  DELETE /comments/{id}

User:
  POST /users/register
  POST /users/login
  POST /users/token
  POST /users/logout
```

## Setup

### Dependencies

```
  node.js
  npm
```

### Getting Started

```
git clone  https://github.com/MC-Knight/portfolio_api.git
cd portfolio_api
npm i
set all environmental variable
npm run server
```

## Testing

```
npm run test
```
