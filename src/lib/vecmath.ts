// Tiny vector helpers with NO model/transformers dependency, so runtime code
// (the /api/semantic cosine) can use them without pulling onnxruntime into the
// serverless function bundle.

export const EMBED_DIM = 384;

// Cosine similarity for unit-normalized vectors == dot product.
export function dot(a: Float32Array, b: Float32Array): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}
