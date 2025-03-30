import { type } from 'arktype';

// Input validation schema
export const photoSchema = type({
  title: "string",
  url: "string",
  description: "string?"
});

// Response type for success
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Infer the type from the schema
export type PhotoInput = {
  title: string;
  url: string;
  description?: string;
}; 