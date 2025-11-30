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
      // Merge all items in the array to find a common schema
      const mergedSchema = data.reduce((acc: SchemaNode | null, item, index) => {
        const itemSchema = parseJsonToSchema(item, `${path}[${index}]`);
        if (!acc) return itemSchema;
        return mergeSchemas(acc, itemSchema);
      }, null);
      
      // The children of an array node should be the single merged schema of its items
      // We wrap it in a generic "item" key
      if (mergedSchema) {
        mergedSchema.key = "item"; // Reset key for the generic item
        children = [mergedSchema];
      }
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

function mergeSchemas(nodeA: SchemaNode, nodeB: SchemaNode): SchemaNode {
  // If types are different, we might need a union type (not fully supported yet, defaulting to 'any' or keeping one)
  // For now, if types match, we merge. If not, we might need to mark it as mixed.
  if (nodeA.type !== nodeB.type) {
    // Simple handling: if one is null, take the other and make it optional (or nullable)
    // But for now, let's just return nodeA but maybe mark as mixed? 
    // Actually, a better approach for MVP is:
    // If types differ, return a "mixed" node or "any".
    // Let's try to keep it simple: if types differ, it becomes "any" (or we could implement union types later)
    return { ...nodeA, type: "any", children: undefined }; 
  }

  if (nodeA.type === "object") {
    // Merge children
    const allKeys = new Set([
      ...(nodeA.children?.map(c => c.key) || []),
      ...(nodeB.children?.map(c => c.key) || [])
    ]);
    
    const mergedChildren: SchemaNode[] = [];
    
    allKeys.forEach(key => {
      const childA = nodeA.children?.find(c => c.key === key);
      const childB = nodeB.children?.find(c => c.key === key);
      
      if (childA && childB) {
        mergedChildren.push(mergeSchemas(childA, childB));
      } else if (childA) {
        // Exists in A but not B -> Optional
        mergedChildren.push({ ...childA, isOptional: true });
      } else if (childB) {
        // Exists in B but not A -> Optional
        mergedChildren.push({ ...childB, isOptional: true });
      }
    });
    
    return { ...nodeA, children: mergedChildren };
  }
  
  // For primitives, just return one of them
  return nodeA;
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
