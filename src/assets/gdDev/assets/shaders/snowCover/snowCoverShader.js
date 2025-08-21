const SnowCoverShader = {

    name: 'SnowCoverShader',

    uniforms: {
        'tDiffuse': { value: null },
        'uNormals': { value: null },
    },

    vertexShader: /* glsl */`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

    fragmentShader: /* glsl */`
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        uniform sampler2D uNormals;

        void main()
        {
            float param = 0.2;
            vec4 normal = texture2D( uNormals, vUv );
            float snowRatio = max(normal.y, 0.0);
            snowRatio = snowRatio/(snowRatio + param);
            vec4 snowColor = vec4(1, 1, 1, 1);
            vec4 texel = texture2D( tDiffuse, vUv );
            gl_FragColor = mix(texel, snowColor, snowRatio);
            // gl_FragColor = normal;
        }`

}

export { SnowCoverShader };