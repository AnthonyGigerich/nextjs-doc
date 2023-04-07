function getApiUrl() {
  console.log("NODE_ENV:", process.env.NODE_ENV)
  console.log("API_URL:", process.env.API_URL)
  console.log("VERCEL_URL:", process.env.VERCEL_URL)
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000/api/yaml';
  } else if (process.env.API_URL) {
    return `https://${process.env.API_URL}/api/yaml`;
  } else if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/yaml`;
  } else {
    // Utiliser l'URL actuelle pour les environnements de production
    return '/api/yaml';
  }
}

export async function getCellDataFromApi() {
  console.log("entering getCellDataFromApi")
  const apiUrl = getApiUrl();
  console.log("apiUrl:", apiUrl)
  console.log("Fetching data from URL:", apiUrl);
  const res = await fetch(apiUrl);
  console.log("Received response:", res);

  const contentType = res.headers.get('content-type');
  console.log("Content-Type header:", contentType);

  // Vérifier si le contenu est du JSON
  if (contentType?.includes('application/json')) {
    console.log("Response is JSON, attempting to parse...");
    const data = await res.json();
    console.log("Parsed response data:", data);
    return data;
  } else {
    console.error(`Erreur : L'API a renvoyé un format de contenu inattendu à l'URL ${apiUrl}`);
    console.log("Response body:", await res.text());
    throw new Error("Format de contenu inattendu");
  }
}
