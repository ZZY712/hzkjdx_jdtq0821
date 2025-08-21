import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import snowHeightTex from '../../snowHeightTex.png'
import { SnowCoverShader } from "./snowCoverShader";
import { WorldNormalShader } from "./worldNormalShader";
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass'
import * as THREE from 'three'
class SnowCoverPass extends ShaderPass {

	constructor(
		width,
		height,
		scene,
		camera,
	) {
		super()

		this.scene = scene
		this.camera = camera

		this.uniforms = {
			tDiffuse: { value: null },
			uNormals: { value: null },
		}

		let snowCoverMat = new THREE.ShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: SnowCoverShader.vertexShader,
			fragmentShader: SnowCoverShader.fragmentShader,
		})

		// this.material = snowCoverMat
		this.material = snowCoverMat
		this.fsQuad = new FullScreenQuad(this.material)

		const normalBuffer = new THREE.WebGLRenderTarget(width, height)

		normalBuffer.texture.format = THREE.RGBAFormat
		normalBuffer.texture.type = THREE.HalfFloatType
		normalBuffer.texture.minFilter = THREE.NearestFilter
		normalBuffer.texture.magFilter = THREE.NearestFilter
		normalBuffer.texture.generateMipmaps = false
		normalBuffer.stencilBuffer = false
		this.normalBuffer = normalBuffer
		let snowHeight = new THREE.TextureLoader().load(snowHeightTex)
		this.normalMaterial = new THREE.ShaderMaterial({
			uniforms: {
				tDiffuse: { value: null },
				snowHeight: {
					type: 't', value: snowHeight
				}
			},
			vertexShader: WorldNormalShader.vertexShader,
			fragmentShader: WorldNormalShader.fragmentShader,
		})
	}

	render(renderer, writeBuffer, readBuffer, /*maskActive */) {
		renderer.setRenderTarget(this.normalBuffer)
		const overrideMaterialValue = this.scene.overrideMaterial

		this.scene.overrideMaterial = this.normalMaterial
		renderer.render(this.scene, this.camera)
		this.scene.overrideMaterial = overrideMaterialValue

		this.material.uniforms.uNormals.value = this.normalBuffer.texture
		this.material.uniforms.tDiffuse.value = readBuffer.texture

		if (this.renderToScreen) {
			renderer.setRenderTarget(null)
			this.fsQuad.render(renderer)
		} else {
			renderer.setRenderTarget(writeBuffer)
			if (this.clear) renderer.clear()
			this.fsQuad.render(renderer)
		}
	}

	dispose() {

		this.material.dispose();

		this.fsQuad.dispose();

	}

}

export { SnowCoverPass };