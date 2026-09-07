import { promises as fs } from 'fs'
import path from 'path'

const DATA = path.join(process.cwd(), 'data', 'videos.json')

async function ensureData(){
  try{
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true })
    await fs.access(DATA)
  }catch{
    await fs.writeFile(DATA, '[]')
  }
}

export default async function handler(req, res){
  await ensureData()
  if (req.method === 'GET'){
    const raw = await fs.readFile(DATA, 'utf8')
    return res.status(200).json(JSON.parse(raw))
  }
  if (req.method === 'POST'){
    const { metadata } = req.body || {}
    if (!metadata) return res.status(400).json({ error: 'Missing metadata' })
    const raw = await fs.readFile(DATA, 'utf8')
    const arr = JSON.parse(raw)
    // ensure _id
    const id = metadata._id || metadata.id || (Date.now() + '-' + Math.random()).toString(36)
    const entry = { ...metadata, _id: String(id) }
    // dedupe by _id
    const exists = arr.findIndex(x => x._id === entry._id)
    if (exists !== -1) arr[exists] = entry
    else arr.unshift(entry)
    await fs.writeFile(DATA, JSON.stringify(arr, null, 2), 'utf8')
    return res.status(200).json({ ok: true, id: entry._id })
  }
  res.status(405).json({ error: 'Method not allowed' })
}
