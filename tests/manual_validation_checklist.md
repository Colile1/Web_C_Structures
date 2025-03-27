# Manual Validation Checklist

## 1. Node Operations
- [ ] Add nodes at various positions.
- [ ] Verify UUID generation uniqueness.
- [ ] Check localStorage persistence after refresh.

## 2. Beam Operations
- [ ] Create beams between valid nodes.
- [ ] Attempt invalid beams (same node, non-existent nodes).
- [ ] Verify material defaults.

## 3. Import/Export
- [ ] Export empty structure → Validate JSON schema.
- [ ] Import sample structure from Frame3DD.
- [ ] Test error handling for malformed files.
