import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // To avoid the access restriction under the same-origin policy.
    //
    // Same-origin policy a policy on web application security, 
    // under which a web browser restricts scripts contained in a web page
    // from accessing data in the other web page if those web pages do not have the same origin.
    //
    // By below configuration,
    // a request to "http://localhost:5173/api" (5173 is default port for Vite)
    // will be handled as one to "http://localhost:3001/api",
    // and the vite dev server will access the target as a proxy instead of the browser ... in my understanding.
    proxy: {
      "/api": "http://localhost:3001"
    }
  }
});
