import { Hono } from 'hono'
import { logger } from 'hono/logger'
import photosRoute from './routes/photos'
import type { Context } from 'hono'

import { createFiberplane } from "@fiberplane/hono";

const app = new Hono()

// Middleware
app.use('*', logger())

// Root route
app.get('/', (c: Context) => {
  return c.text('Hello Hono!')
})

// Mount photo routes
app.route('/api/photos', photosRoute)

// Serve OpenAPI documentation
app.get('/openapi.json', (c: Context) => {
  const spec = {
    openapi: '3.0.3',
    info: {
      title: "Hono + Drizzle + ArkType API",
      version: "1.0.0",
      description: "Modern TypeScript API using Hono, Drizzle ORM, and ArkType validation"
    },
    servers: [
      {
        url: "http://localhost:8787",
        description: "Development server"
      }
    ],
    paths: {
      "/api/photos": {
        get: {
          tags: ["photos"],
          summary: "Get all photos",
          description: "Retrieves a list of all photos ordered by creation date",
          responses: {
            "200": {
              description: "List of photos retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Photo" }
                      }
                    }
                  }
                }
              }
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: false },
                      error: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ["photos"],
          summary: "Create a new photo",
          description: "Creates a new photo with the provided data",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PhotoInput" }
              }
            }
          },
          responses: {
            "201": {
              description: "Photo created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/Photo" }
                    }
                  }
                }
              }
            },
            "400": {
              description: "Invalid input",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: false },
                      error: { type: "string" }
                    }
                  }
                }
              }
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: false },
                      error: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/photos/{id}": {
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid"
            },
            description: "The ID of the photo"
          }
        ],
        get: {
          tags: ["photos"],
          summary: "Get a photo by ID",
          description: "Retrieves a single photo by its ID",
          responses: {
            "200": {
              description: "Photo retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/Photo" }
                    }
                  }
                }
              }
            },
            "404": {
              description: "Photo not found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: false },
                      error: { type: "string" }
                    }
                  }
                }
              }
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: false },
                      error: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        },
        put: {
          tags: ["photos"],
          summary: "Update a photo",
          description: "Updates an existing photo with the provided data",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PhotoInput" }
              }
            }
          },
          responses: {
            "200": {
              description: "Photo updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/Photo" }
                    }
                  }
                }
              }
            },
            "400": {
              description: "Invalid input",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: false },
                      error: { type: "string" }
                    }
                  }
                }
              }
            },
            "404": {
              description: "Photo not found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: false },
                      error: { type: "string" }
                    }
                  }
                }
              }
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: false },
                      error: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        },
        delete: {
          tags: ["photos"],
          summary: "Delete a photo",
          description: "Deletes a photo by its ID",
          responses: {
            "200": {
              description: "Photo deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: { type: "string" }
                    }
                  }
                }
              }
            },
            "404": {
              description: "Photo not found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: false },
                      error: { type: "string" }
                    }
                  }
                }
              }
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: false },
                      error: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    components: {
      schemas: {
        Photo: {
          type: "object",
          required: ["id", "title", "url", "createdAt", "updatedAt"],
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string" },
            url: { type: "string", format: "uri" },
            description: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        PhotoInput: {
          type: "object",
          required: ["title", "url"],
          properties: {
            title: { type: "string" },
            url: { type: "string", format: "uri" },
            description: { type: "string", nullable: true }
          }
        },
        APIResponse: {
          type: "object",
          required: ["success"],
          properties: {
            success: { type: "boolean" },
            data: { 
              oneOf: [
                { $ref: "#/components/schemas/Photo" },
                { 
                  type: "array",
                  items: { $ref: "#/components/schemas/Photo" }
                }
              ]
            },
            error: { type: "string" },
            message: { type: "string" }
          }
        }
      }
    },
    tags: [
      {
        name: "photos",
        description: "Photo management endpoints"
      }
    ]
  };
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

// Serve Swagger UI
app.get('/docs', async (c: Context) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="SwaggerUI" />
    <title>SwaggerUI</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js" crossorigin></script>
    <script>
        window.onload = () => {
            window.ui = SwaggerUIBundle({
                url: '/openapi.json',
                dom_id: '#swagger-ui',
            });
        };
    </script>
</body>
</html>
  `);
});

export default app
