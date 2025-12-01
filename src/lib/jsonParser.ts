export type SchemaType = "object" | "array" | "string" | "number" | "boolean" | "null" | "any";

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface SchemaNode {
  id: string;
  key: string;
  type: SchemaType;
  children?: SchemaNode[];
  value?: JsonValue;
  isOptional?: boolean;
  originalKey?: string; // For rename tracking
  typeOverride?: string; // For manual type override
}

export interface SchemaModifications {
  [id: string]: {
    isOptional?: boolean;
    renamedKey?: string;
    typeOverride?: string;
  };
}

export function parseJsonToSchema(data: JsonValue, path: string = "root"): SchemaNode {
  // ... (existing code)
  const type = getSchemaType(data);
  const id = path;
  const key = path.split(".").pop() || "root";

  let children: SchemaNode[] | undefined;

  if (type === "object" && data !== null && !Array.isArray(data)) {
    children = Object.entries(data as { [key: string]: JsonValue }).map(([k, v]) => 
      parseJsonToSchema(v, `${path}.${k}`)
    );
  } else if (type === "array" && Array.isArray(data)) {
    if (data.length === 0) {
      children = [];
    } else {
      // Map all items as individual children (Data View)
      children = data.map((item, index) => {
        const itemNode = parseJsonToSchema(item, `${path}[${index}]`);
        // Set key to index for display
        itemNode.key = String(index);
        return itemNode;
      });
    }
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
    if (mod.typeOverride !== undefined) {
      newNode.typeOverride = mod.typeOverride;
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
