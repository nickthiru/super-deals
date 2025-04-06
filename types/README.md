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
