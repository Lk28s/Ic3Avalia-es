export default async function handler(req, res) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const { product, data } = req.method === 'GET'
    ? { product: req.query.product }
    : await req.json();

  const file = `ice/${product}/reviews.json`;

  if (req.method === 'GET') {
    try {
      const blob = await fetch(`https://blob.vercel-storage.com/${file}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      res.json(blob.ok ? await blob.json() : { reviews: [], sum: 0 });
    } catch {
      res.json({ reviews: [], sum: 0 });
    }
  } else {
    await fetch(`https://blob.vercel-storage.com/${file}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    res.json({ success: true });
  }
}
