# CLAUDE.md - Project Guidelines for Boston Visit

## TypeScript Import Guidelines for Vite Projects

### Problem
When using Vite with TypeScript, mixing type and value imports can cause module resolution errors like:
```
Uncaught SyntaxError: The requested module 'xxx.ts' does not provide an export named 'YYY'
```

### Solution
Always separate type imports from value imports:

#### ❌ DON'T DO THIS:
```typescript
// This can cause module resolution errors in Vite
import { someFunction, SomeInterface } from './module';
```

#### ✅ DO THIS INSTEAD:
```typescript
// Separate type imports from value imports
import { someFunction } from './module';
import type { SomeInterface } from './module';
```

#### ✅ OR USE TYPE-ONLY IMPORTS:
```typescript
// When importing only types
import type { SomeInterface, AnotherType } from './module';
```

### Why This Happens
- Vite serves TypeScript files directly to the browser during development
- The browser doesn't understand TypeScript types
- Mixing type and value imports can confuse the module system
- Using `import type` ensures types are stripped during transpilation

### Best Practices for This Project
1. Always use `import type` for TypeScript interfaces, types, and type aliases
2. Keep value imports (functions, constants, classes) separate from type imports
3. When in doubt, use two separate import statements
4. For React components, `React.FC` is a type, so use `import type` when needed

### Examples from This Project
```typescript
// Good - types are clearly separated
import { itineraryData } from './types/itinerary';
import type { ItineraryItem } from './types/itinerary';

// Good - all type imports together
import type { RouteInfo, LocationData } from './services/directions';

// Good - function imports separate from types
import { calculateRoute, formatDistance } from './services/directions';
import type { RouteOptions } from './services/directions';
```

## Google Maps React Best Practices

### Preventing LoadScript Reload Warning
When using `@react-google-maps/api`, define the libraries array outside the component:

#### ❌ DON'T DO THIS:
```typescript
const { isLoaded } = useJsApiLoader({
  googleMapsApiKey: KEY,
  libraries: ['places'] // This creates a new array on every render!
});
```

#### ✅ DO THIS INSTEAD:
```typescript
// Define outside component
const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ['places'];

// Inside component
const { isLoaded } = useJsApiLoader({
  googleMapsApiKey: KEY,
  libraries // Use the constant reference
});
```

### Using MarkerF Instead of Marker
Google Maps deprecated `Marker` in favor of `AdvancedMarkerElement`. In React:

#### ❌ DON'T USE:
```typescript
import { Marker } from '@react-google-maps/api';
```

#### ✅ USE INSTEAD:
```typescript
import { MarkerF } from '@react-google-maps/api';
// MarkerF is the functional component version that avoids deprecation warnings
```

## Additional Project Notes

### Environment Variables
- All environment variables must be prefixed with `VITE_` to be accessible in the app
- Access them using `import.meta.env.VITE_VARIABLE_NAME`

### API Keys
- Google Maps API Key: `VITE_GOOGLE_MAPS_TOKEN`
- Mapbox Token: `VITE_MAPBOX_TOKEN`

### Running the Project
```bash
npm install
npm run dev
```

### Linting
Before committing, run:
```bash
npm run lint
npm run typecheck  # if available
```