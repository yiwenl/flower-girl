// ViewFloor.js

import alfrid, { GL } from 'alfrid';

import Assets from './Assets';
import vs from 'shaders/floor.vert';
import fs from 'shaders/floor.frag';

class ViewFloor extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const size = 8;
		const numSeg = 10;

		const positions = [];
		const uvs = [];
		const indices = [];
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
				positions.push(getPosition(i, j));
				positions.push(getPosition(i+1, j));
				positions.push(getPosition(i+1, j+1));
				positions.push(getPosition(i, j+1));


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
		this.texture = Assets.get('spot');

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
	}


}

export default ViewFloor;