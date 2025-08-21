import { Vector2 } from "three";

const IceShader = {
  name: 'IceShader',

  uniforms: {
    // 噪声取样步长
    'step': { value: 1 },
    // 噪声起始位置
    'origin': { value: new Vector2(66.0, 66.0) },
    // 冰柱长度
    'iceHeight': { value: 1 },
  },

  vertexShader: /* glsl */`
    #define PI 3.1415926535897932384626433832795
		varying vec2 vUv;
    varying vec3 vNormal;
    uniform float step;
    uniform vec2 origin;
    uniform float iceHeight;

    vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}

    float cnoise(vec2 P){
      vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
      vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
      Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
      vec4 ix = Pi.xzxz;
      vec4 iy = Pi.yyww;
      vec4 fx = Pf.xzxz;
      vec4 fy = Pf.yyww;
      vec4 i = permute(permute(ix) + iy);
      vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
      vec4 gy = abs(gx) - 0.5;
      vec4 tx = floor(gx + 0.5);
      gx = gx - tx;
      vec2 g00 = vec2(gx.x,gy.x);
      vec2 g10 = vec2(gx.y,gy.y);
      vec2 g01 = vec2(gx.z,gy.z);
      vec2 g11 = vec2(gx.w,gy.w);
      vec4 norm = 1.79284291400159 - 0.85373472095314 *
      vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
      g00 *= norm.x;
      g01 *= norm.y;
      g10 *= norm.z;
      g11 *= norm.w;
      float n00 = dot(g00, vec2(fx.x, fy.x));
      float n10 = dot(g10, vec2(fx.y, fy.y));
      float n01 = dot(g01, vec2(fx.z, fy.z));
      float n11 = dot(g11, vec2(fx.w, fy.w));
      vec2 fade_xy = fade(Pf.xy);
      vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
      float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
      return 2.3 * n_xy;
    }

		void main() {
			vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 newWorldPosition = vec4(position, 1.0);
      if (normal.z < 0.0) {
        float deltaHeight = iceHeight * abs(cnoise(origin + step * newWorldPosition.xz));
        newWorldPosition.y -= deltaHeight * deltaHeight * deltaHeight * deltaHeight;
      } 
      vec4 modelPosition = modelMatrix * newWorldPosition;
			gl_Position = projectionMatrix * viewMatrix * modelPosition;
		}`,

  fragmentShader: /* glsl */`
    precision mediump float;

    varying vec3 vNormal;

    void main() {
      // 光照相关变量
      vec3 lightColor = vec3(1.0, 1.0, 1.0);  // 光源颜色
      vec3 lightDirection = normalize(vec3(1.0, 3.0, 1.0));  // 光源方向
      float ambientIntensity = 0.2;  // 环境光强度
      float diffuseIntensity = 0.8;  // 漫反射强度

      // 计算法线向量
      vec3 normal = normalize(vNormal);

      // 计算漫反射光照强度
      float diffuseFactor = max(0.0, dot(normal, -lightDirection));
      vec3 diffuseLight = lightColor * diffuseFactor * diffuseIntensity;

      // 计算最终颜色
      vec3 finalColor = (ambientIntensity + diffuseLight) * vec3(0.8, 0.8, 0.8);

      gl_FragColor = vec4(finalColor, 0.8);
    }
    `

}

export { IceShader };