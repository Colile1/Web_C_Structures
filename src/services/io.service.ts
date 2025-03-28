import { StructureSchema } from "../utils/validation";
import { structureStore } from "../stores/structure";

export class StructureIO {
  static export() {
    return JSON.stringify({
      nodes: Array.from(structureStore.nodes.entries()),
      beams: Array.from(structureStore.beams.entries())
    });
  }

  static import(json: string) {
    const raw = JSON.parse(json);
    const result = StructureSchema.safeParse(raw);
    
    if (!result.success) {
      throw new Error("Invalid structure file: " + 
        result.error.issues.map(i => i.message).join(", "));
    }

    structureStore.nodes = new Map(result.data.nodes.map(n => [n.id, n]));
    structureStore.beams = new Map(result.data.beams.map(b => [b.id, b]));
  }
}
