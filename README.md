## Install

```bash
npm i
```

## Start

Require: start docs-service first

```bash
npm run start:dev
```

## Send Request

1. Access to http://localhost:3030/graphql
2. Input then run:

```bash
query {
  findAllUsers {
    id,
    email
  }
  findAllPosts {
    id,
    title
  }
  getQueueList {
    id,
    bookingNumber
  }
}
```
