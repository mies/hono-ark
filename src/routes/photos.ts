import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import db from '../db';
import { photos } from '../db/schema';
import { photoSchema, type APIResponse, type PhotoInput } from '../types/photo';

const photosRoute = new Hono();

// GET all photos
photosRoute.get('/', async (c) => {
  try {
    const photosList = await db.select().from(photos).orderBy(photos.createdAt);
    return c.json<APIResponse<typeof photosList>>({ 
      success: true, 
      data: photosList 
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return c.json<APIResponse<never>>({ 
      success: false, 
      error: 'Failed to fetch photos' 
    }, 500);
  }
});

// GET a single photo by ID
photosRoute.get('/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    const [photo] = await db.select()
      .from(photos)
      .where(eq(photos.id, id))
      .limit(1);
    
    if (!photo) {
      return c.json<APIResponse<never>>({ 
        success: false, 
        error: 'Photo not found' 
      }, 404);
    }
    
    return c.json<APIResponse<typeof photo>>({ 
      success: true, 
      data: photo 
    });
  } catch (error) {
    console.error(`Error fetching photo with id ${id}:`, error);
    return c.json<APIResponse<never>>({ 
      success: false, 
      error: 'Failed to fetch photo' 
    }, 500);
  }
});

// POST a new photo
photosRoute.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    // Validate input data
    const result = photoSchema(body);
    if (result instanceof Error) {
      return c.json<APIResponse<never>>({ 
        success: false, 
        error: result.message 
      }, 400);
    }
    
    const [photo] = await db.insert(photos)
      .values(result as PhotoInput)
      .returning();

    return c.json<APIResponse<typeof photo>>({ 
      success: true, 
      data: photo 
    }, 201);
  } catch (error) {
    console.error('Error creating photo:', error);
    return c.json<APIResponse<never>>({ 
      success: false, 
      error: 'Failed to create photo' 
    }, 500);
  }
});

// PUT (update) a photo
photosRoute.put('/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    const body = await c.req.json();
    
    // Validate input data
    const result = photoSchema(body);
    if (result instanceof Error) {
      return c.json<APIResponse<never>>({ 
        success: false, 
        error: result.message 
      }, 400);
    }
    
    const [photo] = await db.update(photos)
      .set(result as PhotoInput)
      .where(eq(photos.id, id))
      .returning();
    
    if (!photo) {
      return c.json<APIResponse<never>>({ 
        success: false, 
        error: 'Photo not found' 
      }, 404);
    }
    
    return c.json<APIResponse<typeof photo>>({ 
      success: true, 
      data: photo 
    });
  } catch (error) {
    console.error(`Error updating photo with id ${id}:`, error);
    return c.json<APIResponse<never>>({ 
      success: false, 
      error: 'Failed to update photo' 
    }, 500);
  }
});

// DELETE a photo
photosRoute.delete('/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    const [photo] = await db.delete(photos)
      .where(eq(photos.id, id))
      .returning();
    
    if (!photo) {
      return c.json<APIResponse<never>>({ 
        success: false, 
        error: 'Photo not found' 
      }, 404);
    }
    
    return c.json<APIResponse<string>>({ 
      success: true, 
      message: 'Photo deleted successfully' 
    });
  } catch (error) {
    console.error(`Error deleting photo with id ${id}:`, error);
    return c.json<APIResponse<never>>({ 
      success: false, 
      error: 'Failed to delete photo' 
    }, 500);
  }
});

export default photosRoute;