import { SchemaNode } from "./jsonParser";

export function generateZodSchema(node: SchemaNode, level = 0): string {
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

export function generateReactHookForm(rootName: string): string {
  const hookName = `use${rootName}Form`;
  
  return `import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ${rootName}Schema } from "./schemas"; // Assuming schema is exported
import { ${rootName} } from "./types";

export function ${hookName}() {
  return useForm<${rootName}>({
    resolver: zodResolver(${rootName}Schema),
  });
}`;
}

export function generateTypeScript(node: SchemaNode, rootName: string = "Root"): string {
  return `export interface ${rootName} ${generateTypeDefinition(node)}`;
}

function generateTypeDefinition(node: SchemaNode, level = 1): string {
  const indent = "  ".repeat(level);
  
  switch (node.type) {
    case "object":
      if (!node.children || node.children.length === 0) return "{}";
      const props = node.children.map(child => {
        const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(child.key) ? child.key : `"${child.key}"`;
        const optional = child.isOptional ? "?" : "";
        return `${indent}${key}${optional}: ${generateTypeDefinition(child, level + 1)};`;
      });
      return `{\n${props.join("\n")}\n${"  ".repeat(level - 1)}}`;
      
    case "array":
      if (node.children && node.children.length > 0) {
        // Naive approach: use first child's type
        return `${generateTypeDefinition(node.children[0], level)}[]`;
      }
      return "any[]";
      
    case "string": return "string";
    case "number": return "number";
    case "boolean": return "boolean";
    case "null": return "null";
    default: return "any";
  }
}
