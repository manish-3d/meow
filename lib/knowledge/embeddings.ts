/**
 * Meow Vector Embeddings Generator
 *
 * Generates 1,536-dimensional normalized vector embeddings for document chunks
 * and search queries. Uses OpenAI text-embedding-3-small when an API key is available,
 * with deterministic normalized semantic hashing for offline environments and testing.
 */

export const EMBEDDING_DIMENSION = 1536;

export class EmbeddingService {
  /**
   * Generates a 1,536-dimensional vector for a single text input.
   */
  public static async generateEmbedding(text: string): Promise<number[]> {
    const trimmed = text.trim();
    if (!trimmed) {
      return new Array(EMBEDDING_DIMENSION).fill(0);
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // Use live OpenAI API if valid API key is present
    if (apiKey && !apiKey.includes("placeholder") && apiKey.startsWith("sk-")) {
      try {
        const response = await fetch("https://api.openai.com/v1/embeddings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "text-embedding-3-small",
            input: trimmed,
            dimensions: EMBEDDING_DIMENSION,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data[0] && Array.isArray(data.data[0].embedding)) {
            return data.data[0].embedding;
          }
        }
      } catch (err) {
        console.warn("OpenAI embedding API call failed, falling back to deterministic vector:", err);
      }
    }

    // Deterministic semantic embedding generator (Normalized 1536-dim unit vector)
    return this.generateDeterministicVector(trimmed);
  }

  /**
   * Generates embeddings for a batch of text chunks.
   */
  public static async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((t) => this.generateEmbedding(t)));
  }

  /**
   * Deterministic 1,536-dimensional vector generator.
   * Maps word tokens and character 3-grams into vector coordinates and
   * normalizes to a unit vector (L2 norm = 1.0).
   */
  public static generateDeterministicVector(text: string): number[] {
    const vec = new Float64Array(EMBEDDING_DIMENSION);
    const normalizedText = text.toLowerCase().trim();
    const words = normalizedText.split(/\W+/).filter(Boolean);

    // 1. Project words into vector coordinates via FNV-1a hash
    for (const word of words) {
      let hash = 2166136261;
      for (let i = 0; i < word.length; i++) {
        hash ^= word.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
      }
      const index = Math.abs(hash) % EMBEDDING_DIMENSION;
      vec[index] += 1.0;

      // Also hash character 3-grams for substring similarity
      for (let i = 0; i <= word.length - 3; i++) {
        const gram = word.slice(i, i + 3);
        let gHash = 2166136261;
        for (let j = 0; j < gram.length; j++) {
          gHash ^= gram.charCodeAt(j);
          gHash = Math.imul(gHash, 16777619);
        }
        const gIdx = Math.abs(gHash) % EMBEDDING_DIMENSION;
        vec[gIdx] += 0.5;
      }
    }

    // 2. Compute L2 norm (magnitude)
    let sumSquares = 0;
    for (let i = 0; i < EMBEDDING_DIMENSION; i++) {
      sumSquares += vec[i] * vec[i];
    }

    // Handle empty text fallback
    if (sumSquares === 0) {
      vec[0] = 1.0;
      sumSquares = 1.0;
    }

    const norm = Math.sqrt(sumSquares);

    // 3. Return normalized unit vector as regular number[]
    const result = new Array<number>(EMBEDDING_DIMENSION);
    for (let i = 0; i < EMBEDDING_DIMENSION; i++) {
      // Round to 6 decimal places for PostgreSQL vector compatibility
      result[i] = Math.round((vec[i] / norm) * 1000000) / 1000000;
    }

    return result;
  }
}

