// lib/markdown.js

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ApiOpenDataSources from '../components/ApiOpenDataSources';


const methodsDirectory = path.join(process.cwd(), 'posts/methodes');
const usagesDirectory = path.join(process.cwd(), 'posts/usages');
const datasetsDirectory = path.join(process.cwd(), 'posts/datasets');
const cellsDirectory = path.join(process.cwd(), 'posts/cells');

// Méthodes
export function getAllMethods() {
  const fileNames = fs.readdirSync(methodsDirectory);
  const allMethodsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(methodsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const tags = data.tags ? data.tags : [];
    const type = data.type ? data.type : null;
    const collection = data.collection ? data.collection : [];
    

    // Trouver tous les titres dans le contenu Markdown
    const titles = content.match(/#+\s+(.*)/g).map((match) => match.replace(/^#+\s+/, ''));

    return {
      slug,
      content,
      title: data.title || '',
      image: data.image || null,
      description: data.description || '',
      datasets: data.datasets || null,
      usages: data.usages || null,
      tags,
      type: data.type || '',
      collection,
      titles,
      index: data.index || 0, 
      lastupdate: data.lastupdate,
    };
  });

  const filteredMethods = allMethodsData.filter((method) => method.index !== 0);
  return filteredMethods;
}

// Cells

export function getAllCells() {
  const fileNames = fs.readdirSync(cellsDirectory);
  const allCellsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(cellsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Trouver tous les titres dans le contenu Markdown
    const titles = content
      .match(/#+\s+(.*)/g)
      .map((match) => match.replace(/^#+\s+/, ''));

    return {
      slug,
      content,
      title: data.title || '',
      image: data.image || null,
      description: data.description || '',
      titles,
      index: data.index || 0,
    };
  });

  const filteredCells = allCellsData.filter((cell) => cell.index !== 0);
  return filteredCells;
}

export function getCellBySlug(slug) {
  const fullPath = path.join(cellsDirectory, `${slug}.md`);

  try {
    fs.accessSync(fullPath);
  } catch (error) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const titles = content
    .match(/#+\s+(.*)/g)
    .map((match) => match.replace(/^#+\s+/, ''));
  if (!content) return [];

  return {
    slug,
    titles,
    content,
    ...data,
  };
}


export function getAllCellsSlugs() {
  const fileNames = fs.readdirSync(cellsDirectory);
  return fileNames.map((fileName) => fileName.replace(/\.md$/, ''));
}



export function getAllCollections() {
  const methods = getAllMethods();
  const collection = new Set();
  methods.forEach((method) => {
    method.collection.forEach((c) => {
      collection.add(c);
    });
  });
  return Array.from(collection);
}


export function getMethodsByCollection(collection) {
  const methods = getAllMethods();
  return methods.filter((method) => method.collection.includes(collection));
}

export function getMethodBySlug(slug) {
  const fullPath = path.join(methodsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const next_method = data['next-method']
    ? {
        slug: data['next-method'].split('|')[0].trim(),
        title: data['next-method'].split('|')[1].trim(),
      }
    : null; // récupération et traitement de la valeur du tag next-method

  const method = {
    slug,
    title: data.title,
    description: data.description,
    content,
    image: data.image || null,
    usages: data.usages || [],
    datasets: data.datasets || [],
    discourse_id: data.discourse_id || [],
    collection: data.collection || null,
    next_method, // ajout de la propriété next_method
    type: data.type,
    lastupdate: data.lastupdate,
  };
  return method;
}


export function generateTableOfContents(content) {
  const headings = content.match(/#{1,6}\s.+?(?:\n|$)/g) || [];
  const toc = headings.map((heading) => {
    const matches = heading.match(/^(#{1,6})\s(.+)/);
    const level = matches[1].length;
    const title = matches[2];
    const slug = title.toLowerCase().replace(/[^\w]+/g, '-');
    return {
      level,
      title,
      slug,
    };
  });
  return toc;
}


export function getAllMethodSlugs() {
  const fileNames = fs.readdirSync(methodsDirectory);
  return fileNames.map((fileName) => fileName.replace(/\.md$/, ''));
}

// Cas d'usage
export function getAllUsages() {
  const fileNames = fs.readdirSync(usagesDirectory);
  const allUsagesData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(usagesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug,
      ...data,
    };
  });

  return allUsagesData;
}

export function getUsagesBySlugs(slugs) {
    if (!slugs) {
      return [];
    }
    return slugs.map((slug) => {
      const usage = getUsageBySlug(slug);
      return {
        ...usage,
        slug,
      };
    });
  }

export function getUsageBySlug(slug) {
  const fullPath = path.join(usagesDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const relatedMethods = getAllMethods().filter(
    (method) => method.usages && method.usages.includes(slug)
  );

  return {
    slug,
    ...data,
    content,
    relatedMethods,
  };
}

export function getAllUsageSlugs() {
  const fileNames = fs.readdirSync(usagesDirectory);
  return fileNames.map((fileName) => fileName.replace(/\.md$/, ''));
}

export function getMethodsByTag(tag) {
  const allMethods = getAllMethods();
  return allMethods.filter((method) => method.tags && method.tags.includes(tag));
}

// Tags 

export function getAllTags() {
  const allMethods = getAllMethods();
  const tags = allMethods.reduce((acc, method) => {
    if (method.tags) {
      method.tags.forEach((tag) => {
        if (!acc.includes(tag)) {
          acc.push(tag);
        }
      });
    }
    return acc;
  }, []);
  return tags;
}


export function getAllTagsForSlug(slug) {
  const allMethods = getAllMethods();
  const tags = allMethods.reduce((acc, method) => {
    if (method.slug === slug && method.tags) {
      method.tags.forEach((tag) => {
        if (!acc.includes(tag)) {
          acc.push(tag);
        }
      });
    }
    return acc;
  }, []);
  return tags;
}

export function getTagsBySlug(slug, tags) {
  const allTags = getAllTagsForSlug(slug);
  if (!tags || !Array.isArray(tags)) {
    return [];
  }
  return tags.filter((tag) => allTags.includes(tag));
}

export function getTypeForSlug(slug) {
  const method = getMethodBySlug(slug);
  if (!method || !method.type) {
    return [];
  }
  return method.type;
}

export function getLastupdateForSlug(slug) {
  const method = getMethodBySlug(slug);
  if (!method || !method.lastupdate) {
    return null;
  }
  // Convertir la chaîne de caractères en objet Date
  const dateObject = new Date(method.lastupdate);
  
  // Convertir la date en chaîne de caractères conviviale
  return dateObject.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}


export function getTypeBySlug(slug, type) {
  const methodType = getTypesForSlug(slug);
  if (!type || !Array.isArray(type) || !methodType) {
    return [];
  }
  return type.filter((type) => type === methodType);
}


// Jeux de données
export function getAllDatasets() {
  const fileNames = fs.readdirSync(datasetsDirectory);
  const allDatasetsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(datasetsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug,
      ...data,
    };
  });

  return allDatasetsData;
}


export function getDatasetsBySlugs(slugs) {
    if (!slugs || !Array.isArray(slugs)) {
      return [];
    }
    
    return slugs.map((slug) => {
      const dataset = getDatasetsBySlugs(slug);
      return {
        ...dataset,
        uid: slug,
      };
    });
  }

  export async function getStaticProps({ params }) {
    const { slug } = params;
    const method = getMethodBySlug(slug);
    console.log("Method data: ", method); // Ajout du console.log pour vérifier les données de la méthode
  
    const usages = getUsagesBySlugs(method.usages);
    const datasets = getDatasetsBySlugs(method.datasets);
    const allMethods = getAllMethods();
  
    const tags = [...new Set(allMethods.flatMap((method) => method.tags))];
    console.log(tags); // Ajout du console.log pour vérifier l'extraction des tags
  
    const type = [...new Set(allMethods.map((method) => method.type))];
    console.log(type); // Ajout du console.log pour vérifier l'extraction des types
  
    return {
      props: {
        method,
        usages,
        datasets,
        tags,
        type,
        lastupdate,
      },
    };
  }
  
