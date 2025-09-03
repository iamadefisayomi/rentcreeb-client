// utils/sanitize.ts

import { Document } from 'mongoose';

/**
 * Recursively sanitize a Mongoose document by:
 * - Converting to plain object
 * - Removing __v and other internal fields
 * - Optionally transforming _id to id
 */
export function sanitizeDoc<T = any>(doc: Document | T): T {
  if (!doc) return doc as T;

  // If it's a Mongoose document
  if ((doc as Document).toObject) {
    const obj = (doc as Document).toObject({ virtuals: true });

    // Remove internal fields
    delete (obj as any).__v;

    // Optional: convert _id to id
    if (obj._id && typeof obj._id === 'object') {
      obj.id = obj._id.toString();
      delete obj._id;
    }

    // Recursively sanitize nested objects or arrays
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        obj[key] = obj[key].map((item: any) => sanitizeDoc(item));
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        obj[key] = sanitizeDoc(obj[key]);
      }
    }

    return obj;
  }

  return doc as T;
}
