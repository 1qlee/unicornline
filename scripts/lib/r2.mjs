import { AwsClient } from "aws4fetch"

const REQUIRED_ENV = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"]

export function createR2Client(env) {
  const missing = REQUIRED_ENV.filter((name) => !env[name])
  if (missing.length) throw new Error(`Missing R2 settings in .env: ${missing.join(", ")}`)

  const client = new AwsClient({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    service: "s3",
    region: "auto",
  })
  const bucketUrl = `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${env.R2_BUCKET}`

  async function request(pathAndQuery, init = {}) {
    const response = await client.fetch(`${bucketUrl}${pathAndQuery}`, init)
    if (!response.ok && response.status !== 404) {
      throw new Error(`R2 ${init.method ?? "GET"} ${pathAndQuery} failed: ${response.status} ${await response.text()}`)
    }
    return response
  }

  return {
    async headObject(key) {
      const response = await request(`/${encodeKey(key)}`, { method: "HEAD" })
      if (response.status === 404) return null
      return { size: Number(response.headers.get("content-length")) }
    },
    async putObject(key, body, headers) {
      await request(`/${encodeKey(key)}`, { method: "PUT", body, headers })
    },
  }
}

function encodeKey(key) {
  return key.split("/").map(encodeURIComponent).join("/")
}
