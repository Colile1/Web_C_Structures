import { ShaderMaterial, Color } from 'three';
import { forceShader } from '../shaders/forceShader';

export class ForceMaterial extends ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        forceValue: { value: 0 },
        maxAbsForce: { value: 1 },
        colorTension: { value: new Color(0x0000ff) },
        colorCompression: { value: new Color(0xff0000) }
      },
      vertexShader: `
        varying vec3 vColor;
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vColor = color;
        }
      `,
      fragmentShader: forceShader
    });
  }

  updateForce(force: number) {
    this.uniforms.forceValue.value = force;
  }

  setMaxForce(maxForce: number) {
    this.uniforms.maxAbsForce.value = maxForce;
  }
}
