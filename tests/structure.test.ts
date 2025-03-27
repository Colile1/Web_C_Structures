import { structureStore } from "../src/stores/structure";
import { StructureIO } from "../src/services/io.service";

describe("Structure Model", () => {
  beforeEach(() => {
    structureStore.nodes.clear();
    structureStore.beams.clear();
  });

  test("Add valid beam", () => {
    structureStore.addNode([0, 0, 0]);
    structureStore.addNode([3, 0, 0]);
    const nodes = Array.from(structureStore.nodes.keys());
    expect(() => structureStore.addBeam(nodes[0], nodes[1])).not.toThrow();
  });

  test("Export/import roundtrip", () => {
    // ...Test full cycle with validation
  });
});
