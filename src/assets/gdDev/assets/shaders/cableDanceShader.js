const CableDanceShader = {

  name: 'CableDanceShader',

  uniforms: {
    'iTime': { value: 0.1 },
    'amplitude': { value: 10 },
    'frequency': {
      value: 1
    },
    'phase': {
      value: 1.0471975
    }
  },

  vertexShader: /* glsl */`
		varying vec2 vUv;
    uniform float iTime;
    uniform float amplitude;
    uniform float frequency;
    uniform float phase;

		void main() {
			vUv = uv;
      vec4 newWorldPosition = vec4(position, 1.0);
      newWorldPosition.x += amplitude * 0.5 * sin(newWorldPosition.z / 30.0 + phase + iTime * frequency * 2.0);
      newWorldPosition.y += amplitude * sin(newWorldPosition.z / 500.0 + phase + iTime * frequency);
      vec4 modelPosition = modelMatrix * newWorldPosition;
			gl_Position = projectionMatrix * viewMatrix * modelPosition;
		}`,

  fragmentShader: /* glsl */`
    precision mediump float;

    void main(){
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }`

}

export { CableDanceShader };