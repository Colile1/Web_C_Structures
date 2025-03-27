# Key Technical Decisions

1. **Map vs Object Storage**  
   - `Map` preserves insertion order and handles keys better than plain objects.
   - Enforces type safety for node/beam lookups.

2. **Zod Validation**  
   - Catches corrupted/invalid files during import.
   - Provides clear error messages for users.

3. **MobX Optimization**  
   - Fine-grained reactivity only updates changed components.
   - Automatic dependency tracking for efficient renders.

4. **UUID Generation**  
   - Browser-native `crypto.randomUUID()` for security.
   - Fallback to `uuid` library if needed (Safari <15.4).

# Common Pitfalls & Solutions

**Problem:** Nodes/beams not rendering after add  
**Fix:** Ensure components are wrapped in `observer()` and store methods are `makeAutoObservable`.

**Problem:** Imported beams reference missing nodes  
**Fix:** Use Zod's `.refine()` to validate node references exist.

**Problem:** LocalStorage quota exceeded  
**Fix:** Implement LRU caching or IndexedDB for large structures.
