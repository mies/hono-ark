import { type } from 'arktype';

type OpenAPISchemaRef = {
  $ref: string;
};

type OpenAPISchemaBase = {
  type: string;
  format?: string;
  nullable?: boolean;
  properties?: Record<string, OpenAPISchema>;
  required?: string[];
  items?: OpenAPISchema;
};

type OpenAPISchema = OpenAPISchemaBase | OpenAPISchemaRef;

/**
 * Converts an ArkType schema to OpenAPI schema format
 */
export function arkTypeToOpenAPI(schema: ReturnType<typeof type>): OpenAPISchemaBase {
  // Get the raw type definition from ArkType
  const def = (schema as any).definition;
  
  // Handle primitive types
  if (typeof def === 'string') {
    // Handle optional types (ending with ?)
    const isOptional = def.endsWith('?');
    const type = isOptional ? def.slice(0, -1) : def;

    return {
      type: type,
      ...(isOptional && { nullable: true })
    };
  }

  // Handle object types
  if (def && typeof def === 'object') {
    const properties: Record<string, OpenAPISchema> = {};
    const required: string[] = [];

    for (const [key, value] of Object.entries(def)) {
      // Handle optional properties (ending with ?)
      const isOptional = key.endsWith('?');
      const propertyName = isOptional ? key.slice(0, -1) : key;
      
      if (!isOptional) {
        required.push(propertyName);
      }

      // Convert the property type
      if (typeof value === 'string') {
        // Handle optional types in property values
        const isValueOptional = value.endsWith('?');
        const type = isValueOptional ? value.slice(0, -1) : value;

        properties[propertyName] = {
          type,
          ...(isOptional || isValueOptional ? { nullable: true } : {})
        };
      } else if (value && typeof value === 'object') {
        properties[propertyName] = arkTypeToOpenAPI(type(value));
      }
    }

    return {
      type: 'object',
      properties,
      ...(required.length > 0 && { required })
    };
  }

  // Default to string if type cannot be determined
  return { type: 'string' };
}

/**
 * Creates an OpenAPI schema reference
 */
export function createSchemaRef(name: string): OpenAPISchemaRef {
  return { $ref: `#/components/schemas/${name}` };
}

/**
 * Creates a standard API response schema
 */
export function createAPIResponseSchema(dataSchema: OpenAPISchema): OpenAPISchemaBase {
  return {
    type: 'object',
    required: ['success'],
    properties: {
      success: { type: 'boolean' },
      data: dataSchema,
      error: { type: 'string', nullable: true },
      message: { type: 'string', nullable: true }
    }
  };
} 