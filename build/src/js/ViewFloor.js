// ViewFloor.js

import alfrid, { GL } from 'alfrid';

import Assets from './Assets';
import Params from './Params';
import vs from 'shaders/floor.vert';
import fs from 'shaders/floor.frag';

import vsOutline from 'shaders/outline.vert';
import fsOutline from 'shaders/outline.frag';

class ViewFloor extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this.shaderOutline = new alfrid.GLShader(vsOutline, fsOutline);
	}


	_init() {
		const size = 8;
		const numSeg = 10;

		const positions = [];
		const uvs = [];
		const indices = [];
		const normals = [];
		let count = 0;

		const getPosition = function(i, j) {
			const px = i/numSeg;
			const pz = j/numSeg;
			const dx = Math.sin(px*Math.PI);
			const dz = Math.sin(pz*Math.PI);
			const x = -size/2 + px * size;
			const z =  size/2 - pz * size; 
			const y = dx * dz - 1;

			return [x, y, z];
		}




		for(let i=0; i<numSeg; i++) {
			for(let j=0; j<numSeg; j++) {

				const p0 = getPosition(i, j);
				const p1 = getPosition(i+1, j);
				const p2 = getPosition(i+1, j+1);
				const p3 = getPosition(i, j+1);

				const v0 = vec3.create();
				const v1 = vec3.create();
				const n = vec3.create();
				vec3.sub(v0, p1, p0);
				vec3.sub(v1, p2, p0);
				vec3.cross(n, v0, v1);
				vec3.normalize(n, n);


				positions.push(p0);
				positions.push(p1);
				positions.push(p2);
				positions.push(p3);

				normals.push(n);
				normals.push(n);
				normals.push(n);
				normals.push(n);


				uvs.push([i/numSeg, j/numSeg]);
				uvs.push([(i+1)/numSeg, j/numSeg]);
				uvs.push([(i+1)/numSeg, (j+1)/numSeg]);
				uvs.push([i/numSeg, (j+1)/numSeg]);

				indices.push(count * 4 + 0);
				indices.push(count * 4 + 1);
				indices.push(count * 4 + 2);
				indices.push(count * 4 + 0);
				indices.push(count * 4 + 2);
				indices.push(count * 4 + 3);

				count ++;
			}
		}

		this.mesh = new alfrid.Mesh();
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoord(uvs);
		this.mesh.bufferIndex(indices);
		this.mesh.bufferNormal(normals);
		this.texture = Assets.get('texture_08');

		this.floorColor = [255, 217, 0];
		gui.addColor(this, 'floorColor');
	}


	render() {
		const color = this.floorColor.map((c)=>{return c/255;});
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		this.shader.uniform("uFloorColor", "vec3", color);
		GL.draw(this.mesh);

/*
		this.shaderOutline.bind();
		this.shaderOutline.uniform("uTime", "float", Params.time);
		this.shaderOutline.uniform("uOutlineColor", "vec3", Params.outlineColor);
		this.shaderOutline.uniform("uOutlineWidth", "float", Params.outlineWidth);
		this.shaderOutline.uniform("uOutlineNoise", "float", Params.outlineNoise);
		this.shaderOutline.uniform("uOutlineNoiseStrength", "float", Params.outlineNoiseStrength);

		GL.gl.cullFace(GL.gl.FRONT);
		GL.draw(this.mesh);
		GL.gl.cullFace(GL.gl.BACK);
*/
		
	}


}

export default ViewFloor;