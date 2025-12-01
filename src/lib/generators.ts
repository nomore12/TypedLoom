import { SchemaNode } from "./jsonParser";

export function generateZodSchema(node: SchemaNode, level = 0): string {
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
          return `${nextIndent}${safeKey}: ${generateZodSchema(child, level + 1)},`;
        });
        schema = `z.object({\n${props.join("\n")}\n${indent}})`;
      }
      break;
    case "array":
      if (node.children && node.children.length > 0) {
        // For arrays, we usually take the first child as the schema for all items
        // or merge them. For this MVP, let's assume homogeneous array and take the first child.
        // If multiple children exist (heterogeneous), we might need z.union, but let's stick to simple case.
        schema = `z.array(${generateZodSchema(node.children[0], level)})`;
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
  } else if (node.type === "null") {
    // z.null() doesn't need optional usually, but if it can be undefined too...
    // Let's assume isOptional handles the undefined case.
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
  separateNested: boolean = false
): string {
  if (!separateNested) {
    if (typeDefinition === "type") {
      return `export type ${rootName} = ${generateTypeDefinition(node)}`;
    }
    return `export interface ${rootName} ${generateTypeDefinition(node)}`;
  }

  const definitions: string[] = [];
  
  function collectDefinitions(currentNode: SchemaNode, currentName: string) {
    if (currentNode.type === "object") {
      const children = currentNode.children || [];
      const props = children.map(child => {
        const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(child.key) ? child.key : `"${child.key}"`;
        const optional = child.isOptional ? "?" : "";
        
        let typeStr = "any";
        
        if (child.type === "object" && child.children && child.children.length > 0) {
          const childTypeName = capitalize(child.key);
          collectDefinitions(child, childTypeName);
          typeStr = childTypeName;
        } else if (child.type === "array" && child.children && child.children.length > 0 && child.children[0].type === "object") {
           const itemTypeName = capitalize(child.key) + "Item";
           collectDefinitions(child.children[0], itemTypeName);
           typeStr = `${itemTypeName}[]`;
        } else {
          typeStr = generateTypeDefinition(child, 1, true); // true for inline simple types
        }
        
        return `  ${key}${optional}: ${typeStr};`;
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

  collectDefinitions(node, rootName);
  return definitions.reverse().join("\n\n");
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateTypeDefinition(node: SchemaNode, level = 1, inline = false): string {
  if (node.typeOverride) return node.typeOverride;

  const indent = "  ".repeat(level);
  
  switch (node.type) {
    case "object":
      if (!node.children || node.children.length === 0) return "{}";
      // If inline is true, we still generate nested structure if we are here (meaning it wasn't separated)
      const props = node.children.map(child => {
        const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(child.key) ? child.key : `"${child.key}"`;
        const optional = child.isOptional ? "?" : "";
        return `${indent}${key}${optional}: ${generateTypeDefinition(child, level + 1, inline)};`;
      });
      return `{\n${props.join("\n")}\n${"  ".repeat(level - 1)}}`;
      
    case "array":
      if (node.children && node.children.length > 0) {
        return `${generateTypeDefinition(node.children[0], level, inline)}[]`;
      }
      return "any[]";
      
    case "string": return "string";
    case "number": return "number";
    case "boolean": return "boolean";
    case "null": return "null";
    default: return "any";
  }
}
