import * as yup from "yup";
import DOMPurify from "dompurify"; // optional, for HTML sanitization

export type FieldTypeInfo<T extends object = any> = {
  field: keyof T;
  type: string;
};

/**
 * Extract field names and types from a Yup object schema.
 * @param schema - Yup ObjectSchema
 * @returns Array of field/type mappings
 */
export function getAllowedKeysAndType<T extends object>(
  schema: yup.ObjectSchema<any>
): FieldTypeInfo<T>[] {
  const fields = (schema as any).fields as Record<string, yup.Schema<any>>;
  if (!fields) return [];

  return Object.entries(fields).map(([name, fieldSchema]) => {
    const desc = (fieldSchema as yup.Schema<any>).describe();
    return {
      field: name as keyof T,
      type: typeof desc.type === "string" ? desc.type : "unknown",
    };
  });
}

/**
 * Sanitize input object based on a Yup schema.
 * - Removes extra fields
 * - Trims strings
 * - Optionally strips HTML
 * @param schema - Yup ObjectSchema
 * @param data - Raw input object
 */
export function sanitizeInput<T extends object>(
  schema: yup.ObjectSchema<any>,
  data: Record<string, any>
): Partial<T> {
  const allowedFields = getAllowedKeysAndType<T>(schema).map((f) => f.field);
  const sanitized: Partial<T> = {};

  for (const key of allowedFields) {
    const k = key as string; // 👈 cast so we can safely use it on `data`

    if (data[k] !== undefined) {
      let value = data[k];

      // Get type from schema
      const type = (schema as any).fields[k].describe().type;

      if (type === "string" && typeof value === "string") {
        value = value.trim();
        value = DOMPurify.sanitize(value); // strip dangerous HTML
      } else if (type === "number" && typeof value === "string") {
        value = Number(value);
      }

      sanitized[key] = value as any; // 👈 cast back to Partial<T>
    }
  }

  return sanitized;
}
