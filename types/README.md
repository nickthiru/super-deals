# Super Deals - Shared Type Definitions

This package contains shared JSDoc type definitions for the Super Deals project. It serves as a central location for type definitions that are used across multiple projects, including the SvelteKit frontend and AWS CDK backend.

## Overview

Instead of duplicating type definitions across different projects or trying to reference types across project boundaries (which can be problematic, especially with AWS CDK), this package provides a clean solution by:

1. Centralizing all type definitions in one place
2. Making them available as a local NPM package
3. Allowing both SvelteKit and AWS CDK projects to import them consistently

## Package Structure

```
types/
├── dist/                 # Compiled output (generated)
├── src/                  # Source files
│   ├── index.js          # Main entry point
│   ├── merchants/        # Merchant-related types
│   │   └── index.js      # Exports all merchant types
│   ├── deals/            # Deal-related types (to be added)
│   └── ...               # Other domain-specific types
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## JSDoc Approach

This package uses JSDoc comments for type definitions rather than TypeScript interfaces. This approach:

1. Works well with JavaScript codebases
2. Provides type checking and intellisense in IDEs
3. Doesn't require TypeScript compilation in consuming projects

Example of a type definition:

```javascript
/**
 * @typedef {Object} MerchantSignUpData
 * @property {string} businessName - The name of the merchant's business
 * @property {string} email - The merchant's email address
 * @property {string} password - The merchant's password
 * @property {string} registrationNumber - Business registration number
 */
```

## Usage

### Installation

To use these types in your project, install the package locally:

```bash
# From SvelteKit project
npm install ../types

# From AWS CDK project
npm install ../../types
```

This will add a dependency in your `package.json` like:

```json
"dependencies": {
  "@super-deals/types": "file:../types"
}
```

### Importing Types

In your JavaScript files, import the types using JSDoc comments:

```javascript
/**
 * @typedef {import('@super-deals/types').MerchantSignUpData} MerchantSignUpData
 */

/**
 * Creates a new merchant
 * @param {MerchantSignUpData} data - Merchant signup data
 * @returns {Promise<Object>} The created merchant
 */
async function createMerchant(data) {
  // Implementation
}
```

For more specific imports:

```javascript
/**
 * @typedef {import('@super-deals/types/merchants').MerchantProfile} MerchantProfile
 */
```

## Development Workflow

### Adding New Types

1. Identify the domain for your type (merchants, deals, etc.)
2. Add the type definition to the appropriate file in the `src/` directory
3. If creating a new domain, create a new directory and index.js file
4. Update the main `src/index.js` to re-export your new types
5. Build the package

### Building the Package

```bash
npm run build
```

This compiles the JSDoc comments to TypeScript declaration files (.d.ts) in the `dist/` directory.

### After Making Changes

After making changes to the types package:

1. Run `npm run build` in the types directory
2. The changes will be immediately available to projects that depend on it

## Best Practices

1. **Organize by Domain**: Keep related types together in domain-specific directories
2. **Document Thoroughly**: Add detailed JSDoc comments to explain each property
3. **Be Consistent**: Use consistent naming and structure across all type definitions
4. **Avoid Circular Dependencies**: Structure your types to avoid circular references
5. **Version Carefully**: Consider the impact of changes on dependent projects

## Troubleshooting

### Common Issues

1. **Types Not Recognized**: Ensure you've built the package with `npm run build`
2. **Import Errors**: Check that the path in your import statement is correct
3. **CDK Bundling Issues**: If CDK has trouble with the types during synthesis, ensure your package.json references are correct

## Migration Strategy

As the project evolves, we'll gradually migrate existing type definitions into this central package:

1. Identify existing JSDoc types in the codebase
2. Move them to the appropriate location in this package
3. Update references in the original code to import from this package
4. Build and test to ensure everything works as expected

This approach allows for incremental migration without disrupting ongoing development.

## JSDoc to Zod

Inferring Zod schemas directly from JSDoc types is not natively supported by Zod, as Zod schemas are designed to define validation rules and infer TypeScript types, whereas JSDoc types are primarily static annotations for documentation and tooling. However, there are workarounds to achieve compatibility between JSDoc types and Zod schemas.

### Workaround: Using `ts-to-zod` to Generate Zod Schemas from TypeScript Types

If you have JSDoc annotations that correspond to TypeScript types, you can convert those TypeScript types into Zod schemas using tools like `ts-to-zod`. Here’s how:

1. **Define JSDoc Types in a TypeScript File**:

   ```typescript
   /**
    * @typedef {Object} Person
    * @property {string} name
    * @property {number} age
    */
   export type Person = {
     name: string;
     age: number;
   };
   ```

2. **Generate Zod Schemas**:
   Use `ts-to-zod` to convert the `Person` type into a Zod schema:

   ```bash
   npx ts-to-zod src/types.ts src/schemas.ts
   ```

   This will produce:

   ```typescript
   import { z } from "zod";

   export const PersonSchema = z.object({
     name: z.string(),
     age: z.number(),
   });
   ```

3. **Use the Schema for Validation**:

   ```javascript
   import { PersonSchema } from "./schemas";

   const personData = { name: "Alice", age: 30 };
   const result = PersonSchema.safeParse(personData);

   if (!result.success) {
     console.error("Validation failed:", result.error);
   } else {
     console.log("Validated data:", result.data);
   }
   ```

---

### Alternative Approach: Manual Mapping Between JSDoc Types and Zod Schemas

If you don’t want to rely on external tools, you can manually create Zod schemas that match your JSDoc types:

1. **Define JSDoc Types**:

   ```javascript
   /**
    * @typedef {Object} Product
    * @property {string} name
    * @property {number} price
    */
   ```

2. **Manually Create Matching Zod Schema**:

   ```javascript
   import { z } from "zod";

   const ProductSchema = z.object({
     name: z.string(),
     price: z.number(),
   });
   ```

3. **Validate Data**:
   Use the schema for runtime validation while relying on JSDoc for static type hints.

---

### Key Considerations

- **JSDoc Limitations**: JSDoc types are static and cannot enforce runtime validation. Zod provides runtime validation but does not directly parse or infer schemas from JSDoc annotations.
- **Tooling Requirement**: Tools like `ts-to-zod` bridge the gap between TypeScript (or JSDoc-based TypeScript types) and Zod schemas, ensuring compatibility.
- **Manual Synchronization**: If you manually create Zod schemas based on JSDoc types, ensure they stay in sync to avoid mismatches.

In summary, while Zod cannot directly infer schemas from JSDoc types, tools like `ts-to-zod` can generate schemas from TypeScript definitions that align with your JSDoc annotations[4][5]. Alternatively, manual mapping is a straightforward solution for smaller projects.

Citations:  
[1] https://stackoverflow.com/questions/76354177/how-to-infer-zod-type-in-jsdoc-without-typescript  
[2] https://egghead.io/lessons/typescript-parse-and-infer-data-being-fetched-in-sveltekit-with-zod-and-jsdoc  
[3] https://dev.to/_domenicocolandrea/master-schema-validation-in-typescript-with-zod-28dc  
[4] https://www.npmjs.com/package/ts-to-zod  
[5] https://github.com/fabien0102/ts-to-zod  
[6] https://www.totaltypescript.com/workshops/advanced-typescript-patterns/external-libraries/create-a-runtime-and-type-safe-function-with-generics-and-zod/solution  
[7] https://blog.jim-nielsen.com/2023/types-in-jsdoc-with-zod/  
[8] https://github.com/colinhacks/zod/issues/200

---
