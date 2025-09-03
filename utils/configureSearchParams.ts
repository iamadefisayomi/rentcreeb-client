export function configureSearchParams<Data extends Record<string, any>>(data: Data): string {
  const flattened: [string, string][] = [];
  const visit = (obj: any, prefix = ""): void => {
    if (obj == null || obj === "") return;
    if (typeof obj === "object" && !Array.isArray(obj)) {
      for (const [key, val] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key;
        if (val == null || val === "") continue;
        if (typeof val === "object") visit(val, path);
        else flattened.push([path, String(val)]);
      }
    } else {
      flattened.push([prefix, String(obj)]);
    }
  };
  visit(data);

  return new URLSearchParams(flattened).toString();
}