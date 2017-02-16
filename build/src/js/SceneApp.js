// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewFloor from './ViewFloor';
import ViewChar from './ViewChar';
import Assets from './Assets';
import Params from './Params';
import VIVEUtils from './utils/VIVEUtils';

const scissor = function(x, y, w, h) {
	GL.scissor(x, y, w, h);
	GL.viewport(x, y, w, h);
}

class SceneApp extends Scene {
	constructor() {
		super();
		
		//	ORBITAL CONTROL
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.1;
		this.orbitalControl.radius.value = 10;
		this.orbitalControl.rx.limit(0, Math.PI - 0.2);


		//	VR CAMERA
		this.cameraVR = new alfrid.Camera();

		//	MODEL MATRIX
		this._modelMatrix = mat4.create();
		console.log('Has VR :', VIVEUtils.hasVR);

		if(VIVEUtils.hasVR) {
			mat4.translate(this._modelMatrix, this._modelMatrix, vec3.fromValues(0, 0, -2));
			GL.enable(GL.SCISSOR_TEST);
			this.toRender();

			this.resize();
		} else {
			mat4.translate(this._modelMatrix, this._modelMatrix, vec3.fromValues(0, -1, 0));
		}
	}

	_initTextures() {
		console.log('init textures');
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();

		this._vFloor = new ViewFloor();
		this._vChar = new ViewChar();
	}


	render() {
		if(!VIVEUtils.hasVR) { this.toRender(); }
	}


	toRender() {
		if(VIVEUtils.hasVR) {	VIVEUtils.vrDisplay.requestAnimationFrame(()=>this.toRender());	}		
		Params.time += 0.01;

		if(VIVEUtils.hasVR) {
			VIVEUtils.getFrameData();
			const w2 = GL.width/2;
			VIVEUtils.setCamera(this.cameraVR, 'left');

			scissor(0, 0, w2, GL.height);
			GL.setMatrices(this.cameraVR);
			GL.rotate(this._modelMatrix);
			this.renderScene();


			VIVEUtils.setCamera(this.cameraVR, 'right');
			scissor(w2, 0, w2, GL.height);
			GL.setMatrices(this.cameraVR);
			GL.rotate(this._modelMatrix);
			this.renderScene();

			VIVEUtils.submitFrame();

			//	re-render whole
			scissor(0, 0, GL.width, GL.height);

			GL.clear(0, 0, 0, 0);
			mat4.copy(this.cameraVR.projection, this.camera.projection);

			GL.setMatrices(this.cameraVR);
			GL.rotate(this._modelMatrix);
			this.renderScene();

		} else {
			GL.setMatrices(this.camera);
			GL.rotate(this._modelMatrix);
			this.renderScene();
		}
	}


	renderScene() {
		const g = .95;
		GL.clear(g, g, g, 1);
		this._vFloor.render();
		this._vChar.render(Assets.get('studio_radiance'), Assets.get('irr'));
	}


	resize() {
		const scale = VIVEUtils.hasVR ? 2 : 1;
		GL.setSize(window.innerWidth * scale, window.innerHeight * scale);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;