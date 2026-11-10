export interface DocMatch {
  readonly id: string;
  readonly title: string;
  readonly score: number;
}

export interface DocRepository {
  retrieve(vector: readonly number[], topK: number): Promise<DocMatch[]>;
}

/** Vectorize adapter for RAG documentation retrieval. */
export const createVectorizeDocRepository = (index: VectorizeIndex): DocRepository => ({
  async retrieve(vector: readonly number[], topK: number): Promise<DocMatch[]> {
    const { matches } = await index.query(vector as number[], { topK, returnMetadata: 'none' });
    return matches.map((match) => ({
      id: match.id,
      title: match.id,
      score: match.score,
    }));
  },
});
