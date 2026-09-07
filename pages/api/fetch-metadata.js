import { execFile } from 'child_process'
import { promises as fs } from 'fs'

export default async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { url } = req.body || {}
  if (!url) return res.status(400).json({ error: 'Missing url in body' })

  try{
    // Run yt-dlp to get metadata only
    const stdout = await new Promise((resolve, reject) => {
      execFile('yt-dlp', ['--skip-download', '--dump-json', '--no-warnings', url], { maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
        if (err) return reject(new Error(stderr || err.message))
        resolve(stdout)
      })
    })

    // yt-dlp may output multiple JSON objects (e.g., playlist). Try to parse the first object.
    const firstLine = stdout.trim().split('\n')[0]
    const data = JSON.parse(firstLine)

    // Normalize minimal fields
    const normalized = {
      _raw: data,
      _id: data.id || data.url || data.webpage_url || (Date.now() + '-' + Math.random()).toString(36),
      id: data.id,
      title: data.title,
      uploader: data.uploader,
      uploader_id: data.uploader_id,
      uploader_url: data.uploader_url,
      webpage_url: data.webpage_url || url,
      thumbnail: data.thumbnail || (data.thumbnails && data.thumbnails[0] && data.thumbnails[0].url),
      thumbnails: data.thumbnails || (data.thumbnail ? [{ url: data.thumbnail }] : []),
      extractor: data.extractor,
      upload_date: data.upload_date,
      duration: data.duration,
      description: data.description
    }

    return res.status(200).json(normalized)
  }catch(err){
    console.error('yt-dlp error', err)
    return res.status(500).json({ error: String(err.message || err) })
  }
}
