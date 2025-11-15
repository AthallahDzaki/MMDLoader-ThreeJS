# Modular Architecture

The application has been refactored into a modular structure for better maintainability and code organization.

## Module Structure

### 📄 index.js (Entry Point)
- Main entry point for the application
- Minimal code, just imports and initialization
- Handles debug mode setup

### ⚙️ config.js
- Configuration constants
- Model paths (PMX/PMD files)
- Animation paths (VMD files)
- Audio paths
- Camera paths

### 🔧 state.js
- Application state management
- Global state object containing:
  - Three.js objects (mesh, camera, scene, renderer, effect)
  - Animation helper
  - Controls
  - Flags (ready, isInitializing)
  - Resources (clock, blobURLs)
- State reset functionality

### 🧹 cleanup.js
- Resource disposal and cleanup
- Memory leak prevention
- Functions:
  - `cleanup()` - Main cleanup function
  - `disposeMaterial()` - Material and texture disposal
  - `onWindowResize()` - Window resize handler

### 📦 loader.js
- MMD model and animation loading utilities
- Functions:
  - `loadMMD()` - Async MMD loading
  - `createProgressCallback()` - Progress tracking

### 🎬 scene.js
- Three.js scene initialization
- Camera and renderer setup
- Lighting configuration
- Functions:
  - `initializeScene()` - Standard scene setup
  - `initializeSceneWithManager()` - Scene with loading manager for custom models
  - `animate()` - Animation loop

### 🚀 app.js
- Main application logic
- Model initialization (standard and custom)
- Event handling
- Functions:
  - `init()` - Initialize with standard model
  - `customModelInit()` - Initialize with custom model
  - `startApp()` - Start button event handler

## Benefits

✅ **Better Organization**: Each module has a single responsibility
✅ **Easier Maintenance**: Changes to one feature don't affect others
✅ **Better Testing**: Modules can be tested independently
✅ **Code Reusability**: Modules can be reused across projects
✅ **Improved Readability**: Smaller files are easier to understand
✅ **Scalability**: Easy to add new features without cluttering existing code

## Import/Export Pattern

All modules use ES6 module syntax:
```javascript
// Exporting
export const config = { ... };
export function myFunction() { ... }

// Importing
import { config, myFunction } from "./module.js";
```

## Module Dependencies

```
index.js
  ├── config.js
  └── app.js
        ├── config.js
        ├── state.js
        ├── cleanup.js
        ├── loader.js
        └── scene.js
              ├── state.js
              ├── config.js
              └── cleanup.js
```
