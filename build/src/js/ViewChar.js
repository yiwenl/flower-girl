// ViewChar.js

import alfrid, { GL } from 'alfrid';

import Assets from './Assets';
import Params from './Params';
import vs from '../shaders/pbr.vert';
import fs from '../shaders/pbr.frag';
import vsOutline from 'shaders/outline.vert';
import fsOutline from 'shaders/outline.frag';

class ViewChar extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this.shaderOutline = new alfrid.GLShader(vsOutline, fsOutline);
	}


	_init() {
		this.mesh = Assets.get('kuafu');

		this.roughness = 1;
		this.specular = 0;
		this.metallic = 0;
		this.baseColor = [1, 1, 1];

		this.position = [0, 0, 0];
		const s = 0.5;
		this.scale = [s, s, s];


		this.texture = Assets.get('texture_04');
	}


	render(textureRad, textureIrr) {
		this.shader.bind();
		this.shader.uniform('uRadianceMap', 'uniform1i', 0);
		this.shader.uniform('uIrradianceMap', 'uniform1i', 1);
		textureRad.bind(0);
		textureIrr.bind(1);

		this.shader.uniform('uBaseColor', 'uniform3fv', this.baseColor);
		this.shader.uniform('uRoughness', 'uniform1f', this.roughness);
		this.shader.uniform('uMetallic', 'uniform1f', this.metallic);
		this.shader.uniform('uSpecular', 'uniform1f', this.specular);
		this.shader.uniform("uPosition", "vec3", this.position);
		this.shader.uniform("uScale", "vec3", this.scale);

		this.shader.uniform('uExposure', 'uniform1f', params.exposure);
		this.shader.uniform('uGamma', 'uniform1f', params.gamma);

		GL.draw(this.mesh);


		this.shaderOutline.bind();
		this.shaderOutline.uniform("uPosition", "vec3", this.position);
		this.shaderOutline.uniform("uScale", "vec3", this.scale);
		this.shaderOutline.uniform("uTime", "float", Params.time);
		this.shaderOutline.uniform("uOutlineColor", "vec3", Params.outlineColor);
		this.shaderOutline.uniform("uOutlineWidth", "float", Params.outlineWidth);
		this.shaderOutline.uniform("uOutlineNoise", "float", Params.outlineNoise);
		this.shaderOutline.uniform("uOutlineNoiseStrength", "float", Params.outlineNoiseStrength);
		this.shaderOutline.uniform("uRatio", "float", GL.aspectRatio);
		this.shaderOutline.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);

		GL.gl.cullFace(GL.gl.FRONT);
		GL.draw(this.mesh);
		GL.gl.cullFace(GL.gl.BACK);
	}


}

export default ViewChar;