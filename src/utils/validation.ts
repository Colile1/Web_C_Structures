import { z } from "zod";

const Vector3Schema = z.tuple([
  z.number(), z.number(), z.number()
]);

export const StructureSchema = z.object({
  nodes: z.array(z.object({
    id: z.string().uuid(),
    position: Vector3Schema,
    constraints: z.object({
      x: z.boolean(),
      y: z.boolean(),
      z: z.boolean(),
      rotation: z.boolean()
    }),
    loads: z.array(z.object({
      force: Vector3Schema,
      moment: Vector3Schema
    }))
  })),
  beams: z.array(z.object({
    id: z.string().uuid(),
    startNodeId: z.string().uuid(),
    endNodeId: z.string().uuid(),
    material: z.object({
      youngsModulus: z.number().positive(),
      area: z.number().positive(),
      inertia: z.object({
        x: z.number().positive(),
        y: z.number().positive(),
        z: z.number().positive()
      })
    })
  }))
});
