const tryWikipedia = async (name) => {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`,
      { signal: AbortSignal.timeout(4000) }
    )
    const data = await res.json()
    if (data?.originalimage?.source) return data.originalimage.source
    if (data?.thumbnail?.source) return data.thumbnail.source.replace(/\/\d+px-/, '/800px-')
  } catch { return null }
  return null
}

const hashName = (str) =>
  Math.abs(str.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0)) % 1000

export const GetPlaceImage = async (placeName) => {
  if (!placeName) return '/placeholder.jpg'
  const words = placeName.trim().split(' ')

  let img = await tryWikipedia(placeName)
  if (img) return img

  if (words.length > 3) {
    img = await tryWikipedia(words.slice(0, 3).join(' '))
    if (img) return img
  }

  if (words.length > 2) {
    img = await tryWikipedia(words.slice(0, 2).join(' '))
    if (img) return img
  }

  img = await tryWikipedia(words[0])
  if (img) return img

  const seed = hashName(placeName)
  return `https://picsum.photos/seed/${seed}/600/400`
}