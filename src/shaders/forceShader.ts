export const forceShader = `
  uniform float forceValue;
  uniform vec3 colorTension;
  uniform vec3 colorCompression;
  uniform float maxAbsForce;

  varying vec3 vColor;

  void main() {
    float normalizedForce = forceValue / maxAbsForce;
    
    vec3 color = mix(
      colorCompression,
      colorTension,
      smoothstep(-1.0, 1.0, normalizedForce)
    );

    gl_FragColor = vec4(color, 1.0);
  }
`;
