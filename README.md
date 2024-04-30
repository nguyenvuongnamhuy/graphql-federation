1. npm install

2. npm run start:dev

3. access http://localhost:3030

Input:

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
