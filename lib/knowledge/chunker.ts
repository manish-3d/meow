/**
 * Meow Recursive Character Text Chunker
 *
 * Slices long documents (Markdown, code, text) into semantically coherent
 * chunks with sliding-window overlap to prevent context fragmentation.
 */

export interface ChunkOptions {
  maxChunkSize?: number; // Maximum characters per chunk (default: 800 chars ~ 200 tokens)
  chunkOverlap?: number;  // Characters of overlap between adjacent chunks (default: 100 chars)
  separators?: string[];  // Split separators in order of semantic preference
}

export interface DocumentChunkResult {
  chunkIndex: number;
  content: string;
  charLength: number;
}

const DEFAULT_SEPARATORS = [
  "\n## ",
  "\n### ",
  "\n\n",
  "\n",
  ". ",
  "? ",
  "! ",
  "; ",
  ", ",
  " ",
  "",
];

export class TextChunker {
  /**
   * Recursively splits a text into overlapping chunks respecting natural boundaries.
   */
  public static splitText(
    text: string,
    options: ChunkOptions = {},
  ): DocumentChunkResult[] {
    const maxChunkSize = options.maxChunkSize ?? 800;
    const chunkOverlap = options.chunkOverlap ?? 100;
    const separators = options.separators ?? DEFAULT_SEPARATORS;

    if (!text || text.trim().length === 0) {
      return [];
    }

    const rawChunks = this.splitRecursively(text.trim(), separators, maxChunkSize);

    // Merge and apply sliding-window overlap
    const mergedChunks = this.mergeWithOverlap(rawChunks, maxChunkSize, chunkOverlap);

    return mergedChunks.map((content, chunkIndex) => ({
      chunkIndex,
      content,
      charLength: content.length,
    }));
  }

  private static splitRecursively(
    text: string,
    separators: string[],
    maxChunkSize: number,
  ): string[] {
    if (text.length <= maxChunkSize || separators.length === 0) {
      return [text];
    }

    const separator = separators[0];
    const nextSeparators = separators.slice(1);

    const splits = text.split(separator);
    const result: string[] = [];

    for (let i = 0; i < splits.length; i++) {
      const piece = splits[i].trim();
      if (!piece) continue;

      if (piece.length <= maxChunkSize) {
        result.push(piece);
      } else {
        const subPieces = this.splitRecursively(piece, nextSeparators, maxChunkSize);
        result.push(...subPieces);
      }
    }

    return result;
  }

  private static mergeWithOverlap(
    pieces: string[],
    maxChunkSize: number,
    chunkOverlap: number,
  ): string[] {
    const chunks: string[] = [];
    let currentChunk = "";

    for (const piece of pieces) {
      if (!currentChunk) {
        currentChunk = piece;
        continue;
      }

      if (currentChunk.length + piece.length + 1 <= maxChunkSize) {
        currentChunk += "\n" + piece;
      } else {
        chunks.push(currentChunk);

        // Calculate overlap tail from previous chunk
        if (chunkOverlap > 0 && currentChunk.length > chunkOverlap) {
          const overlapTail = currentChunk.slice(-chunkOverlap);
          currentChunk = overlapTail + "\n" + piece;
        } else {
          currentChunk = piece;
        }
      }
    }

    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }
}

