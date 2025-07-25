import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const specPath = path.join(process.cwd(), 'spec', 'swagger.yaml');
  try {
    const fileContents = await fs.readFile(specPath, 'utf8');
    res.setHeader('Content-Type', 'text/yaml'); // fallback to text/yaml for better browser support
    res.status(200).send(fileContents);
  } catch (error: any) {
    console.error('Error loading OpenAPI spec:', error);
    res.status(500).json({ error: 'Unable to load OpenAPI spec', details: error.message });
  }
}
