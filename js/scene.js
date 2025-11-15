/**
 * Scene module
 * Handles Three.js scene initialization and setup
 */

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OutlineEffect } from "three/addons/effects/OutlineEffect.js";
import { MMDLoader } from "three/addons/loaders/MMDLoader.js";
import { MMDAnimationHelper } from "three/addons/animation/MMDAnimationHelper.js";

import { state } from "./state.js";
import { stagePath } from "./config.js";
import { onWindowResize } from "./cleanup.js";

/**
 * Initialize basic scene, camera, and renderer
 */
export function initializeScene() {
    const container = document.createElement("div");
    document.body.appendChild(container);

    state.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        2000
    );
    state.camera.position.z = 50;
    state.camera.position.y = 35;

    // scene
    state.helper = new MMDAnimationHelper();

    state.scene = new THREE.Scene();
    state.scene.background = new THREE.Color(0xffffff);

    // Load stage
    const loader = new MMDLoader();
    loader.load(
        stagePath,
        function (mesh) {
            state.scene.add(mesh);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        null
    );

    const listener = new THREE.AudioListener();
    state.camera.add(listener);
    state.scene.add(state.camera);

    const ambient = new THREE.AmbientLight(0xaaaaaa, 3);
    state.scene.add(ambient);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(-1, 1, 1).normalize();
    state.scene.add(directionalLight);

    // Renderer
    state.renderer = new THREE.WebGLRenderer({ antialias: true });
    state.renderer.setPixelRatio(window.devicePixelRatio);
    state.renderer.setSize(window.innerWidth, window.innerHeight);
    state.renderer.setAnimationLoop(animate);
    container.appendChild(state.renderer.domElement);

    state.effect = new OutlineEffect(state.renderer);

    // Controls
    state.controls = new OrbitControls(state.camera, state.renderer.domElement);
    state.controls.minDistance = 10;
    state.controls.maxDistance = 100;

    window.addEventListener("resize", onWindowResize);
}

/**
 * Initialize scene with loading manager for custom models
 */
export function initializeSceneWithManager(files) {
    const container = document.createElement("div");
    document.body.appendChild(container);

    state.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        2000
    );
    state.camera.position.z = 50;
    state.camera.position.y = 35;

    // scene
    state.helper = new MMDAnimationHelper();

    const manager = new THREE.LoadingManager();

    manager.setURLModifier((url) => {
        console.log("Old URL", url);
        if (/tex(ture(s)?)?/gi.test(url) || /sph/gi.test(url) || /Toon/gi.test(url) || /s/gi.test(url))  {
            url = url.replace(String.fromCharCode(92), String.fromCharCode(47));
            let index = url.lastIndexOf("/") + 1;
            url = url.substring(index);
            console.log("include", url);
        }
        console.log(files);
        let find = Array.from(files).find(
            (e) =>
                e.name.toLowerCase() == url.toLowerCase() ||
                e.name.toLowerCase() == url.replace("./", "")
        );
        if (find) {
            const blobURL = URL.createObjectURL(new Blob([find]));
            state.blobURLs.push(blobURL); // Track blob URL for cleanup
            url = blobURL;
        }
        console.log(url);
        return url;
    });

    const loader = new MMDLoader(manager);
    state.scene = new THREE.Scene();
    state.scene.background = new THREE.Color(0xffffff);

    // Load stage
    loader.load(
        stagePath,
        function (mesh) {
            state.scene.add(mesh);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        null
    );

    const listener = new THREE.AudioListener();
    state.camera.add(listener);
    state.scene.add(state.camera);

    const ambient = new THREE.AmbientLight(0xaaaaaa, 3);
    state.scene.add(ambient);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(-1, 1, 1).normalize();
    state.scene.add(directionalLight);

    // Renderer
    state.renderer = new THREE.WebGLRenderer({ antialias: true });
    state.renderer.setPixelRatio(window.devicePixelRatio);
    state.renderer.setSize(window.innerWidth, window.innerHeight);
    state.renderer.setAnimationLoop(animate);
    container.appendChild(state.renderer.domElement);

    state.effect = new OutlineEffect(state.renderer);

    // Controls
    state.controls = new OrbitControls(state.camera, state.renderer.domElement);
    state.controls.minDistance = 10;
    state.controls.maxDistance = 100;

    window.addEventListener("resize", onWindowResize);

    return loader;
}

/**
 * Animation loop
 */
export function animate() {
    if (state.ready) {
        state.helper.update(state.clock.getDelta());
    }

    state.effect.render(state.scene, state.camera);
}
