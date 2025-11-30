export type SchemaType = "object" | "array" | "string" | "number" | "boolean" | "null";

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface SchemaNode {
  id: string;
  key: string;
  type: SchemaType;
  children?: SchemaNode[];
  value?: JsonValue;
  isOptional?: boolean;
  originalKey?: string; // For rename tracking
}

export interface SchemaModifications {
  [id: string]: {
    isOptional?: boolean;
    renamedKey?: string;
  };
}

export function parseJsonToSchema(data: JsonValue, path: string = "root"): SchemaNode {
  const type = getSchemaType(data);
  const id = path;
  const key = path.split(".").pop() || "root";

  let children: SchemaNode[] | undefined;

  if (type === "object" && data !== null && !Array.isArray(data)) {
    children = Object.entries(data as { [key: string]: JsonValue }).map(([k, v]) => 
      parseJsonToSchema(v, `${path}.${k}`)
    );
  } else if (type === "array" && Array.isArray(data)) {
    children = data.map((v, i) => 
      parseJsonToSchema(v, `${path}[${i}]`)
    );
  }

  return {
    id,
    key,
    type,
    children,
    value: (type !== "object" && type !== "array") ? data : undefined,
  };
}

export function applyModifications(node: SchemaNode, mods: SchemaModifications): SchemaNode {
  const mod = mods[node.id];
  const newNode = { ...node };

  if (mod) {
    if (mod.isOptional !== undefined) {
      newNode.isOptional = mod.isOptional;
    }
    if (mod.renamedKey !== undefined) {
      newNode.originalKey = newNode.key;
      newNode.key = mod.renamedKey;
    }
  }

  if (newNode.children) {
    newNode.children = newNode.children.map(child => applyModifications(child, mods));
  }

  return newNode;
}

function getSchemaType(data: JsonValue): SchemaType {
  if (data === null) return "null";
  if (Array.isArray(data)) return "array";
  return typeof data as SchemaType;
}
