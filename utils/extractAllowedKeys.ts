import { errorMessage } from "@/constants";

type AllowedKey<T> = { field: keyof T; type: string };

export function extractAllowedKeys<T extends Record<string, any>>(
  payload: unknown,
  allowedKeys: AllowedKey<T>[]
): { success: true; data: Partial<T>, message?: string } | ReturnType<typeof errorMessage> {
  if (typeof payload !== "object" || payload === null) {
    return errorMessage("Payload must be a non-null object");
  }

  const result: Partial<T> = {};
  const map = new Map<keyof T, string>(
    allowedKeys.map(({ field, type }) => [field, type])
  );

  try {
    for (const [key, val] of Object.entries(payload)) {
      const typedKey = key as keyof T;
      const expectedType = map.get(typedKey);
      if (!expectedType || val === undefined) continue;

      const actualType = Array.isArray(val) ? "array" : typeof val;

      if (actualType !== expectedType) {
        throw new Error(
          `Field "${String(key)}" expected type "${expectedType}", got "${actualType}"`
        );
      }

      result[typedKey] = val as T[typeof typedKey];
    }

    return { success: true, data: result };
  } catch (err: any) {
    return errorMessage(err.message);
  }
}
