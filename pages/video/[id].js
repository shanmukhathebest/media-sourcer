import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function VideoPage(){
  const router = useRouter()
  const { id } = router.query
  const [video, setVideo] = useState(null)

  useEffect(()=>{
    if (!id) return
    async function load(){
      const res = await fetch('/api/list')
      const list = await res.json()
      const v = list.find(x => x._id === id)
      setVideo(v)
    }
    load()
  },[id])

  if (!video) return <div className="container"><p>Loading...</p></div>

  // Basic embed handling for YouTube
  const isYouTube = video.extractor === 'youtube'
  let embed = null
  if (isYouTube && video.id) {
    // video.id from yt-dlp is the video id for YouTube
    embed = <iframe title={video.title} width="800" height="450" src={`https://www.youtube.com/embed/${video.id}`} frameBorder="0" allowFullScreen></iframe>
  } else {
    // fallback: show thumbnail and link to original
    embed = <div className="fallback">
      <a href={video.webpage_url} target="_blank" rel="noreferrer">
        <img src={video.thumbnail} alt="thumb" style={{maxWidth: '100%'}} />
        <p>Open on original platform</p>
      </a>
    </div>
  }

  return (
    <div className="container">
      <header>
        <h1>{video.title}</h1>
        <p>By <a href={video.uploader_url || video.uploader}>{video.uploader || video.uploader_id}</a></p>
      </header>

      <main>
        <div className="player">{embed}</div>

        <aside className="details">
          <h3>Attribution & sources</h3>
          <p><strong>Original URL:</strong> <a href={video.webpage_url} target="_blank" rel="noreferrer">{video.webpage_url}</a></p>
          <p><strong>Extractor:</strong> {video.extractor}</p>
          <p><strong>Publish date:</strong> {video.upload_date || video.uploaded_at || 'unknown'}</p>

          <h4>All thumbnails</h4>
          <div className="thumbs">
            {(video.thumbnails || []).map((t,i)=> (
              <img key={i} src={t.url || t} alt={`thumb-${i}`} />
            ))}
          </div>

          <h4>Auto-generated attribution</h4>
          <pre className="attribution">{`Source: ${video.webpage_url}\nTitle: ${video.title}\nBy: ${video.uploader || video.uploader_id}`}</pre>
        </aside>
      </main>
    </div>
  )
}
