# TypedLoom

**TypedLoom** is a visual schema builder and code generator for **TypeScript** and **Zod**.  
Paste JSON, visually refine your schema, and generate type-safe code in seconds.

> 🔗 **Live demo:** https://typed-loom.vercel.app/editor

![TypedLoom Preview](./assets/placeholder.png)

---

## ✨ Key Features

- **Visual JSON & Schema Editor**
  - Paste existing JSON or start from scratch.
  - Explore and edit your data structure in a **tree view**.
  - Rename fields, toggle optional (`?`), and tweak types without hand-editing JSON.

- **Advanced Type Builder**
  - **Union Types**: Create unions like `string | number` directly from the UI.
  - **Literal Types**: Manage literal unions such as `"active" | "inactive"` or `1 | 2` with a tag-based interface.
  - **Type Overrides**: Override inferred types (e.g. `string` → `UserId`) and keep everything in sync.

- **Real-time Code Generation**
  - Instantly generate:
    - ✅ **TypeScript interfaces / type aliases**
    - ✅ **Zod schemas** for runtime validation
  - Tree view edits are reflected live in the generated code.

- **Smart JSON Editor**
  - Full-featured JSON editor with:
    - Syntax highlighting
    - Error reporting
    - Auto-formatting & repair (powered by `jsonrepair`)
  - Works great as a “Paste API response → Fix → Convert” flow.

- **Privacy First**
  - All processing happens **entirely in your browser**.
  - No data is sent to any server – ideal for **private or internal API payloads**.

---

## 🔍 Example

Given JSON like this:

    {
      "id": 1,
      "name": "Alice",
      "status": "active",
      "tags": ["admin", "beta"],
      "profile": {
        "email": "alice@example.com",
        "age": 30
      }
    }

TypedLoom lets you:

1. Paste this JSON into the editor.
2. Use the tree view to:
   - Rename `profile` → `userProfile`
   - Mark `age` as optional
   - Turn `status` into a literal union (`"active" | "inactive" | "banned"`).

…and then generates code like:

    // TypeScript (example)

    export interface User {
      id: number;
      name: string;
      status: "active" | "inactive" | "banned";
      tags: string[];
      userProfile?: UserProfile;
    }

    export interface UserProfile {
      email: string;
      age?: number;
    }

    // Zod schema (example)

    import { z } from "zod";

    export const userProfileSchema = z.object({
      email: z.string().email(),
      age: z.number().optional(),
    });

    export const userSchema = z.object({
      id: z.number(),
      name: z.string(),
      status: z.enum(["active", "inactive", "banned"]),
      tags: z.array(z.string()),
      userProfile: userProfileSchema.optional(),
    });

    export type User = z.infer<typeof userSchema>;

(Exact output may differ depending on your options and overrides.)

---

## 🛠️ Getting Started

Clone the repository and install dependencies:

    npm install
    # or
    yarn install

Run the development server:

    npm run dev
    # or
    yarn dev

Open [http://localhost:3000](http://localhost:3000) in your browser to use TypedLoom locally.

---

## 💻 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Code Editor**: CodeMirror (`@uiw/react-codemirror`)
- **Utilities**:
  - [`quicktype-core`](https://github.com/glideapps/quicktype) – type inference & codegen
  - [`jsonrepair`](https://github.com/josdejong/jsonrepair) – fixing invalid JSON input

---

## 🤝 Contributing

Contributions are welcome!

- Found a bug? Open an issue in [Issues](https://github.com/nomore12/TypedLoom/issues).
- Want to add a feature or improve the UI?  
  Fork the repo and submit a Pull Request.

Please include screenshots or small JSON/code examples when reporting issues related to parsing or generation.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
