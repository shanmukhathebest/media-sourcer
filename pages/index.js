import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [videos, setVideos] = useState([])

  useEffect(() => { fetchList() }, [])

  async function fetchList(){
    const res = await fetch('/api/list')
    const data = await res.json()
    setVideos(data || [])
  }

  async function handleAdd(e){
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try{
      const res = await fetch('/api/fetch-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed')
      // save
      const save = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metadata: json })
      })
      if (!save.ok) throw new Error('Save failed')
      setUrl('')
      fetchList()
      setMessage('Saved successfully')
    }catch(err){
      setMessage(String(err.message || err))
    }finally{ setLoading(false) }
  }

  return (
    <div className="container">
      <header>
        <h1>Media Sourcer</h1>
        <p>Enter a YouTube or TikTok URL to fetch metadata and embed the official player.</p>
      </header>

      <main>
        <form onSubmit={handleAdd} className="add-form">
          <input placeholder="Paste video or channel URL" value={url} onChange={e=>setUrl(e.target.value)} />
          <button disabled={loading}>{loading? 'Fetching...' : 'Fetch & Save'}</button>
        </form>
        {message && <p className="message">{message}</p>}

        <section className="list">
          {videos.length === 0 && <p>No saved videos yet. Add one above.</p>}
          {videos.map(v => (
            <article key={v._id} className="video-card">
              <Link href={`/video/${encodeURIComponent(v._id)}`}>
                <a>
                  <img src={v.thumbnail || '/placeholder.png'} alt="thumb" />
                  <div className="meta">
                    <h3>{v.title}</h3>
                    <p className="uploader">{v.uploader || v.uploader_id}</p>
                    <p className="source"><a href={v.webpage_url} target="_blank" rel="noreferrer">Original</a></p>
                  </div>
                </a>
              </Link>
            </article>
          ))}
        </section>
      </main>

      <footer>
        <p>Metadata-only -- videos are embedded from original platforms to respect copyright.</p>
      </footer>
    </div>
  )
}
