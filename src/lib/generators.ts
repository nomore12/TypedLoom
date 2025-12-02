import { SchemaNode } from "./jsonParser";

export function generateZodSchema(node: SchemaNode, level = 0, toCamelCase = false): string {
  if (node.typeOverride) return `z.custom<${node.typeOverride}>()`;

  const indent = "  ".repeat(level);
  const nextIndent = "  ".repeat(level + 1);

  let schema = "";

  switch (node.type) {
    case "object":
      if (!node.children || node.children.length === 0) {
        schema = "z.object({})";
      } else {
        const props = node.children.map((child) => {
          const key = child.key;
          // If key has special characters, quote it
          const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
          return `${nextIndent}${safeKey}: ${generateZodSchema(child, level + 1, toCamelCase)},`;
        });
        schema = `z.object({\n${props.join("\n")}\n${indent}})`;

        if (toCamelCase) {
          // Add transform to camelCase
          // We only need to transform keys that are actually snake_case or different
          // But to be safe and consistent, we reconstruct the object with camelCase keys
          const transforms = node.children.map(child => {
            const originalKey = child.key;
            const camelKey = snakeToCamel(originalKey);
            // Accessing the property from the object 'obj'
            // If original key has special chars, obj["key"]
            const access = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(originalKey) ? `. ${originalKey}` : `["${originalKey}"]`;
            
            // If the child itself is transformed (e.g. nested object), it's already in correct format
            return `${nextIndent}${camelKey}: obj${access.trim() === ("." + originalKey) ? "." + originalKey : access},`;
          });
          
          schema += `.transform((obj) => ({\n${transforms.join("\n")}\n${indent}}))`;
        }
      }
      break;
    case "array":
      if (node.children && node.children.length > 0) {
        schema = `z.array(${generateZodSchema(node.children[0], level, toCamelCase)})`;
      } else {
        schema = "z.array(z.any())";
      }
      break;
    case "string":
      schema = "z.string()";
      break;
    case "number":
      schema = "z.number()";
      break;
    case "boolean":
      schema = "z.boolean()";
      break;
    case "null":
      schema = "z.null()";
      break;
    default:
      schema = "z.any()";
  }

  if (node.isOptional) {
    schema += ".optional()";
  }

  return schema;
}

export function generateReactQueryHook(rootName: string): string {
  const hookName = `use${rootName}`;
  const queryKey = rootName.toLowerCase();

  return `import { useQuery } from "@tanstack/react-query";
import { ${rootName} } from "./types"; // Assuming types are generated in a file

export function ${hookName}() {
  return useQuery<${rootName}>({
    queryKey: ["${queryKey}"],
    queryFn: async () => {
      const response = await fetch("/api/${queryKey}");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}`;
}

export function generateReactHookForm(node: SchemaNode, rootName: string): string {
  const hookName = `use${rootName}Form`;
  
  return `import { useForm } from "react-hook-form";
import { ${rootName} } from "./types";

export function ${hookName}() {
  return useForm<${rootName}>({
    defaultValues: ${generateDefaultValues(node)},
  });
}`;
}

function generateDefaultValues(node: SchemaNode, level = 2): string {
  const indent = "  ".repeat(level);
  const nextIndent = "  ".repeat(level + 1);

  switch (node.type) {
    case "object":
      if (!node.children || node.children.length === 0) return "{}";
      const props = node.children.map(child => {
        const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(child.key) ? child.key : `"${child.key}"`;
        return `${nextIndent}${key}: ${generateDefaultValues(child, level + 1)},`;
      });
      return `{\n${props.join("\n")}\n${indent}}`;

    case "array":
      if (!node.children || node.children.length === 0) return "[]";
      const items = node.children.map(child => generateDefaultValues(child, level + 1));
      return `[\n${items.map(item => `${nextIndent}${item},`).join("\n")}\n${indent}]`;

    case "string":
      return node.value !== undefined ? JSON.stringify(node.value) : '""';
    case "number":
      return node.value !== undefined ? String(node.value) : "0";
    case "boolean":
      return node.value !== undefined ? String(node.value) : "false";
    case "null":
      return "null";
    default:
      return "null";
  }
}

export function generateTypeScript(
  node: SchemaNode, 
  rootName: string = "Root", 
  typeDefinition: "interface" | "type" = "interface",
  separateNested: boolean = false,
  toCamelCase: boolean = false
): string {
  const definitions: string[] = [];
  
  function collectDefinitions(currentNode: SchemaNode, currentName: string) {
    if (currentNode.type === "object") {
      const children = currentNode.children || [];
      const props = children.map(child => {
        const originalKey = child.key;
        let key = originalKey;
        
        if (toCamelCase) {
          key = snakeToCamel(key);
        }
        
        // Quote if necessary (though camelCase usually doesn't need quotes)
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
        const optional = child.isOptional ? "?" : "";
        
        let typeStr = "any";
        
        if (child.type === "object" && child.children && child.children.length > 0) {
          const childTypeName = capitalize(key); // Use converted key for type name
          collectDefinitions(child, childTypeName);
          typeStr = childTypeName;
        } else if (child.type === "array" && child.children && child.children.length > 0 && child.children[0].type === "object") {
           const itemTypeName = capitalize(key) + "Item";
           collectDefinitions(child.children[0], itemTypeName);
           typeStr = `${itemTypeName}[]`;
        } else {
          typeStr = generateTypeDefinition(child, 1, true); // true for inline simple types
        }
        
        return `  ${safeKey}${optional}: ${typeStr};`;
      });

      const def = typeDefinition === "type"
        ? `export type ${currentName} = {\n${props.join("\n")}\n}`
        : `export interface ${currentName} {\n${props.join("\n")}\n}`;
      
      definitions.push(def);
    } else if (currentNode.type === "array" && currentNode.children && currentNode.children.length > 0) {
       // Root is array
       const child = currentNode.children[0];
       if (child.type === "object") {
          const childName = rootName + "Item";
          collectDefinitions(child, childName);
          definitions.push(`export type ${rootName} = ${childName}[];`);
       } else {
          definitions.push(`export type ${rootName} = ${generateTypeDefinition(currentNode)};`);
       }
    } else {
       // Root is primitive
       definitions.push(`export type ${rootName} = ${generateTypeDefinition(currentNode)};`);
    }
  }

  if (!separateNested) {
    // If not separating nested, we still need to handle camelCase for inline objects
    // But for MVP, let's force separateNested logic if toCamelCase is true, or implement inline conversion
    // Actually, let's just use the recursive function but maybe inline it?
    // To keep it simple, let's reuse the logic but maybe we need a different approach for inline.
    // Let's stick to the separateNested logic structure but adapted for inline if needed.
    // BUT, the user asked for a toggle. If separateNested is false, we should output nested structure.
    
    if (toCamelCase) {
      // If converting to camelCase, we MUST generate a mapper, so separateNested is preferred for clarity,
      // but let's try to support inline too.
      return `export ${typeDefinition} ${rootName} ${generateTypeDefinition(node, 1, false, toCamelCase)}`;
    }

    if (typeDefinition === "type") {
      return `export type ${rootName} = ${generateTypeDefinition(node)}`;
    }
    return `export interface ${rootName} ${generateTypeDefinition(node)}`;
  }

  collectDefinitions(node, rootName);
  
  let code = definitions.reverse().join("\n\n");
  
  if (toCamelCase) {
    code += `\n\n// Utility to convert snake_case to camelCase
function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCase(v));
  } else if (obj !== null && typeof obj === 'object' && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}`;
  }
  
  return code;
}

function snakeToCamel(s: string) {
  return s.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateTypeDefinition(node: SchemaNode, level = 1, inline = false, toCamelCase = false): string {
  if (node.typeOverride) return node.typeOverride;

  const indent = "  ".repeat(level);
  
  switch (node.type) {
    case "object":
      if (!node.children || node.children.length === 0) return "{}";
      // If inline is true, we still generate nested structure if we are here (meaning it wasn't separated)
      const props = node.children.map(child => {
        let key = child.key;
        if (toCamelCase) key = snakeToCamel(key);
        
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
        const optional = child.isOptional ? "?" : "";
        return `${indent}${safeKey}${optional}: ${generateTypeDefinition(child, level + 1, inline, toCamelCase)};`;
      });
      return `{\n${props.join("\n")}\n${"  ".repeat(level - 1)}}`;
      
    case "array":
      if (node.children && node.children.length > 0) {
        return `${generateTypeDefinition(node.children[0], level, inline, toCamelCase)}[]`;
      }
      return "any[]";
      
    case "string": return "string";
    case "number": return "number";
    case "boolean": return "boolean";
    case "null": return "null";
    default: return "any";
  }
}
