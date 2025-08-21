const WorldNormalShader = {

    name: 'WorldNormalShader',

    uniforms: {
        'tDiffuse': { value: null },
        'snowHeight': { value: null }
    },

    vertexShader: /* glsl */`
        varying vec3 vNormal;
        varying vec2 vUv;

		void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

    fragmentShader: /* glsl */`
        varying vec3 vNormal;
        varying vec2 vUv;
        uniform sampler2D snowHeight;

        void main()
        {
            vec4 sh = texture2D( snowHeight, vUv );
            gl_FragColor = vec4(vNormal * sh.y, 1.0);
        }`

}

export { WorldNormalShader };