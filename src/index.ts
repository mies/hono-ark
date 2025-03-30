import { Hono } from 'hono'
import { logger } from 'hono/logger'
import photosRoute from './routes/photos'

import { createFiberplane, createOpenAPISpec } from "@fiberplane/hono";


const app = new Hono()

// Middleware
app.use('*', logger())

// Root route
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// Mount photo routes
app.route('/api/photos', photosRoute)

app.get("/openapi.json", (c) => {
  const spec = createOpenAPISpec(app, {
    info: { title: "My API", version: "1.0.0" }
  });
  return c.json(spec);
});

app.use(
  "/fp/*",
  createFiberplane({
    openapi: {
      url: "/openapi.json"
    }
  })
);

export default app
