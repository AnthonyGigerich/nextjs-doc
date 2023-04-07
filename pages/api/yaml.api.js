import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default async function handler(req, res) {

  console.log("___________________________________________", req, res)

  // Vérifiez la méthode HTTP (GET dans ce cas)
  if (req.method === 'GET') {

    console.log("entering yaml.js")
    try {
      // Obtenez le chemin du dossier contenant les fichiers Markdown
      const markdownDirectory = path.join(process.cwd(), 'posts/cells');

      // Lisez le contenu du dossier
      const fileNames = fs.readdirSync(markdownDirectory);

      // Lisez, extrayez et convertissez les métadonnées YAML en JSON pour chaque fichier Markdown
      const yamlMetadataAsJson = fileNames.map((fileName) => {
        const filePath = path.join(markdownDirectory, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);
        return data;
      });

      // Retournez les métadonnées YAML converties en JSON
      console.log("Yaml to JSON successful", yamlMetadataAsJson)
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(yamlMetadataAsJson);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la lecture des fichiers Markdown', error: error.message });
    }
  } else {
    // Gérez les autres méthodes HTTP non prises en charge
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
