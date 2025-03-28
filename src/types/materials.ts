export interface Material {
  name: string;
  color: string;
  opacity?: number;
  texture?: string; // Optional property for texture
}

export const materials: Material[] = [
  {
    name: 'Wood',
    color: '#8B4513',
    opacity: 1,
  },
  {
    name: 'Metal',
    color: '#C0C0C0',
    opacity: 1,
  },
  {
    name: 'Glass',
    color: '#FFFFFF',
    opacity: 0.5,
    texture: 'path/to/glass_texture.png',
  },
  // Add more materials as needed
];
