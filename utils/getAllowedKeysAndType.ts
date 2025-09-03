import * as yup from 'yup';

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
      type: typeof desc.type === 'string' ? desc.type : 'unknown',
    };
  });
}
