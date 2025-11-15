export default async function handler(req, res) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const prefix = 'ice/products/';  // ← PREFIXO CORRETO

  try {
    const list = await fetch(`https://blob.vercel-storage.com/?prefix=${prefix}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const text = await list.text();

    const products = [];
    const lines = text.split('\n').filter(line => line.endsWith('.ics'));

    lines.forEach(line => {
      const fullPath = line.trim();
      const fileName = fullPath.split('/').pop();           // Iptv Vitalício.ics
      const folderName = fileName.replace(/\.ics$/, '');     // Iptv Vitalício
      const displayName = decodeURIComponent(folderName);

      products.push({
        name: displayName,
        folder: folderName
      });
    });

    res.json(products);
  } catch (e) {
    console.error(e);
    res.json([]);
  }
}
