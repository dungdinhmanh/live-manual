import { XMLParser } from 'fast-xml-parser'

export interface DebianNewsItem {
  title: string
  link: string
  description: string
  date: string
}

const RSS_URL = 'https://www.debian.org/News/news'

declare const data: DebianNewsItem[]
export { data }

export default {
  async load(): Promise<DebianNewsItem[]> {
    // Runs at SSR/build time. A network failure (offline, or debian.org down)
    // must not crash the build — fall back to an empty feed, which the component
    // renders as "No news available."
    try {
      const res = await fetch(RSS_URL)
      if (!res.ok) {
        console.warn(`[debian-news] Failed to fetch: ${res.status}`)
        return []
      }

      const xml = await res.text()

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        // RDF uses namespaces; strip the prefixes so keys are plain.
        removeNSPrefix: true,
      })

      const parsed = parser.parse(xml)

      // RDF structure: RDF.item (array or single object)
      const rawItems = parsed?.RDF?.item ?? []
      const items: DebianNewsItem[] = (
        Array.isArray(rawItems) ? rawItems : [rawItems]
      ).map((item: any) => ({
        title: item.title ?? '',
        link: item.link ?? item['@_about'] ?? '',
        description: cleanHtml(item.description ?? ''),
        date: item.date ?? '',
      }))

      return items
    } catch (err) {
      console.warn(`[debian-news] Failed to load feed:`, err)
      return []
    }
  },
}

function cleanHtml(str: string): string {
  return str
    .replace(/<[^>]+>/g, '')   // strip tags
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}
