import { JsonValue } from "./jsonParser";

export function addNodeToJson(json: string, path: string, key: string, value: JsonValue): string {
  try {
    let data: JsonValue = {};
    if (json.trim()) {
      data = JSON.parse(json);
    }

    if (path === "root") {
      // Adding to root object
      if (typeof data === "object" && data !== null && !Array.isArray(data)) {
        data = { ...data, [key]: value };
      } else if (Array.isArray(data)) {
        // If root is array, add item
        data = [...data, value];
      }
    } else {
      // Traverse to path
      const parts = path.split(".").filter(p => p !== "root");
      let current: JsonValue = data;
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        // Handle array indices like "items[0]"
        const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
        
        if (arrayMatch) {
          const [_, arrayKey, indexStr] = arrayMatch;
          const index = parseInt(indexStr, 10);
          current = ((current as { [key: string]: JsonValue })[arrayKey] as JsonValue[])[index];
        } else {
          current = (current as { [key: string]: JsonValue })[part];
        }
      }

      // Add the new key/value
      if (Array.isArray(current)) {
        current.push(value);
      } else if (typeof current === "object" && current !== null) {
        current[key] = value;
      }
    }

    return JSON.stringify(data, null, 2);
  } catch (e) {
    console.error("Failed to add node to JSON", e);
    return json;
  }
}

export function removeNodeFromJson(json: string, path: string): string {
  try {
    if (!json.trim()) return json;
    const data = JSON.parse(json);

    if (path === "root") {
      return "{}"; // Clearing root
    }

    const parts = path.split(".").filter(p => p !== "root");
    const targetKey = parts.pop(); // The key to remove
    
    if (!targetKey) return json;

    let current: JsonValue = data;
    
    // Traverse to parent
    for (const part of parts) {
      const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
      if (arrayMatch) {
        const [_, arrayKey, indexStr] = arrayMatch;
        const index = parseInt(indexStr, 10);
        current = ((current as { [key: string]: JsonValue })[arrayKey] as JsonValue[])[index];
      } else {
        current = (current as { [key: string]: JsonValue })[part];
      }
    }

    // Remove the target
    const arrayMatch = targetKey.match(/^(.+)\[(\d+)\]$/);
    if (arrayMatch) {
      // Removing item from array (e.g. items[0])
      // This is tricky because path usually points to the item itself.
      // If path was "root.items[0]", targetKey is "items[0]".
      // But we need to access "items" and splice index 0.
      // Actually, my parsing logic in jsonParser uses "key" as the property name.
      // Let's re-evaluate how path is constructed.
      // In jsonParser: parseJsonToSchema(v, `${path}.${k}`)
      // So path is "root.user.address".
      // For array items: `${path}[${index}]`.
      
      // If targetKey looks like "items[0]", it means the parent is an object containing "items".
      // But wait, if I am removing "items[0]", I need to access `current["items"]` and remove index 0.
      const [_, arrayKey, indexStr] = arrayMatch;
      const index = parseInt(indexStr, 10);
      if (Array.isArray((current as { [key: string]: JsonValue })[arrayKey])) {
        ((current as { [key: string]: JsonValue })[arrayKey] as JsonValue[]).splice(index, 1);
      }
    } else {
      // Removing object property
      if (Array.isArray(current)) {
        // If current is array, targetKey might be index?
        // No, path construction for array items uses [index].
        // If we are here, it's likely a standard object property.
        // But wait, if the path was "root.items[0]", then parts=["items"], targetKey="0"? No.
        // Let's look at jsonParser again.
        // parseJsonToSchema(item, `${path}[${index}]`)
        // So path is "root.items[0]".
        // parts = ["items[0]"]. pop() -> "items[0]".
        // So the loop above (parts) is empty. current is root.
        // targetKey is "items[0]".
        // So the arrayMatch logic above is correct.
      } else {
        delete (current as { [key: string]: JsonValue })[targetKey];
      }
    }

    return JSON.stringify(data, null, 2);
  } catch (e) {
    console.error("Failed to remove node from JSON", e);
    return json;
  }
}

export function updateNodeValueInJson(json: string, path: string, newValue: JsonValue): string {
  try {
    console.log("updateNodeValueInJson called", { path, newValue });
    if (!json.trim()) return json;
    const data = JSON.parse(json);

    if (path === "root") {
      return JSON.stringify(newValue, null, 2);
    }

    const parts = path.split(".").filter(p => p !== "root");
    const targetKey = parts.pop();
    
    if (!targetKey) {
      console.warn("No target key found for path", path);
      return json;
    }

    let current: JsonValue = data;
    
    // Traverse to parent
    for (const part of parts) {
      const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
      if (arrayMatch) {
        const [_, arrayKey, indexStr] = arrayMatch;
        const index = parseInt(indexStr, 10);
        current = ((current as { [key: string]: JsonValue })[arrayKey] as JsonValue[])[index];
      } else {
        current = (current as { [key: string]: JsonValue })[part];
      }
    }

    // Update the target
    const arrayMatch = targetKey.match(/^(.+)\[(\d+)\]$/);
    if (arrayMatch) {
      const [_, arrayKey, indexStr] = arrayMatch;
      const index = parseInt(indexStr, 10);
      ((current as { [key: string]: JsonValue })[arrayKey] as JsonValue[])[index] = newValue;
    } else {
      (current as { [key: string]: JsonValue })[targetKey] = newValue;
    }

    return JSON.stringify(data, null, 2);
  } catch (e) {
    console.error("Failed to update node value in JSON", e);
    return json;
  }
}
