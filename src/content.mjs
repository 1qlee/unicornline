import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

async function readJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"))
  } catch (error) {
    throw new Error(`Could not read ${filePath}: ${error instanceof Error ? error.message : error}`)
  }
}

export async function loadContent(contentDir) {
  const productDir = path.join(contentDir, "products")
  const productFiles = (await readdir(productDir)).filter((name) => name.endsWith(".json")).sort()

  return {
    company: await readJson(path.join(contentDir, "company.json")),
    categories: await readJson(path.join(contentDir, "categories.json")),
    featured: await readJson(path.join(contentDir, "featured.json")),
    products: await Promise.all(
      productFiles.map(async (file) => ({ file, data: await readJson(path.join(productDir, file)) })),
    ),
  }
}
