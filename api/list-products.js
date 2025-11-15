export default async function handler(req, res) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const prefix = 'ice/';

  try {
    const list = await fetch(`https://blob.vercel-storage.com/?prefix=${prefix}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const text = await list.text();

    const folders = new Set();
    text.split('\n').forEach(line => {
      if (line.includes('/')) {
        const folder = line.split('/')[1];
        if (folder && folder.includes('-')) folders.add(folder);
      }
    });

    res.json(Array.from(folders));
  } catch (e) {
    res.json([]);
  }
}
