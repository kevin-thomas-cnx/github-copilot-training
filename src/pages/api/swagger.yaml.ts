

import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * API route handler for serving the OpenAPI (Swagger) specification YAML file.
 *
 * Reads the `swagger.yaml` file from the `/spec` directory and returns its contents as YAML.
 *
 * @remarks
 * This endpoint is useful for exposing the OpenAPI spec to tools like Swagger UI or for documentation purposes.
 * If the file cannot be read, a 500 error is returned with details.
 *
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 *
 * @example
 * // Example usage with Swagger UI:
 * // <SwaggerUI url="/api/swagger.yaml" />
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const specPath = path.join(process.cwd(), 'spec', 'swagger.yaml');
  try {
    const fileContents = await fs.readFile(specPath, 'utf8');
    res.setHeader('Content-Type', 'text/yaml');
    res.status(200).send(fileContents);
  } catch (error: any) {
    console.error('Error loading OpenAPI spec:', error);
    res.status(500).json({ error: 'Unable to load OpenAPI spec', details: error.message });
  }
}
