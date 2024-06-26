import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default async function handler(req, res) {
  const { filename } = req.query;

  // Path to the JSON file
  const jsonFilePath = path.join(process.cwd(), 'public', 'sitedata', 'docs_catalog.json');

  // Read and parse the JSON file
  let jsonData = fs.readFileSync(jsonFilePath, 'utf8');
  // Remove BOM if present
  jsonData = jsonData.replace(/^\uFEFF/, '');
  const records = JSON.parse(jsonData);

  // Find the document's metadata in the JSON, ensure it has an index of 1
  const documentMetadata = records.find(doc => doc['name'] === filename && doc['index'] === 1);
  if (!documentMetadata) {
    return res.status(404).json({ error: 'Document not found or does not have the correct index' });
  }

  // Path to the Markdown file within the project
  const markdownFilePath = path.join(process.cwd(), 'posts', 'docs', `${filename}.md`);

  try {
    // Read and parse the Markdown file
    let markdownContent = fs.readFileSync(markdownFilePath, 'utf8');
    // Remove BOM if present
    markdownContent = markdownContent.replace(/^\uFEFF/, '');
    const { content: markdownParsedContent } = matter(markdownContent);

    // Combine metadata from JSON and content from Markdown
    res.status(200).json({
      metadata: documentMetadata,
      content: markdownParsedContent
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
