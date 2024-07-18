## Snippet
We will return to the frontend.
- We will be **testing** the **React** code
- We will implement **token based authentication** which will enable users to log in to our application 

## Notes
### 1. Connect frontend with backend, through a proxy
Navigate to `vite.config.js`, change the port number of the proxy, so that the request will be redirected to the server at http://localhost:3003

### 2. Start dev frontend
```
$ cd frontend
$ npm run dev
```