import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const specPath = path.join(process.cwd(), 'public', 'swagger.yaml');
    const fileContents = await fs.readFile(specPath, 'utf8');
    res.setHeader('Content-Type', 'text/yaml');
    res.status(200).send(fileContents);
  } catch (error: any) {
    console.error('Error loading OpenAPI spec:', error);
    res.status(500).json({ error: 'Unable to load OpenAPI spec', details: error.message });
  }
}
