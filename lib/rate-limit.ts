type Bucket = { tokens: number; lastRefill: number }
const buckets: Map<string, Bucket> = (globalThis as any).__rateBuckets || new Map<string, Bucket>()
;(globalThis as any).__rateBuckets = buckets

export function limit(key: string, limitPerMinute: number) {
  const now = Date.now()
  const bucket = buckets.get(key) || { tokens: limitPerMinute, lastRefill: now }
  // refill per minute
  const elapsed = now - bucket.lastRefill
  if (elapsed > 60_000) {
    bucket.tokens = limitPerMinute
    bucket.lastRefill = now
  }
  if (bucket.tokens <= 0) return false
  bucket.tokens -= 1
  buckets.set(key, bucket)
  return true
}

