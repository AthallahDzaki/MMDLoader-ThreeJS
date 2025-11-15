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
import { stagePath, lightingPresets } from "./config.js";
import { onWindowResize } from "./cleanup.js";

/**
 * Get lighting configuration
 */
function getLightingConfig() {
    const lightingSelect = document.getElementById("lighting");
    const lightingValue = lightingSelect.value;

    if (lightingValue === "custom") {
        const ambientColor = document.getElementById("ambient-color").value;
        const ambientIntensity = parseFloat(document.getElementById("ambient-intensity").value);
        const directionalColor = document.getElementById("directional-color").value;
        const directionalIntensity = parseFloat(document.getElementById("directional-intensity").value);

        return {
            ambient: { 
                color: parseInt(ambientColor.replace('#', '0x')), 
                intensity: ambientIntensity 
            },
            directional: { 
                color: parseInt(directionalColor.replace('#', '0x')), 
                intensity: directionalIntensity 
            }
        };
    }

    return lightingPresets[lightingValue] || lightingPresets.default;
}

/**
 * Get stage path (default or custom)
 */
function getStageConfig() {
    const stageSelect = document.getElementById("stage");
    if (stageSelect.value === "custom") {
        const customStageInput = document.getElementById("custom-stage");
        return { isCustom: true, files: customStageInput.files };
    }
    return { isCustom: false, path: stagePath };
}

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
    const stageConfig = getStageConfig();
    if (!stageConfig.isCustom) {
        const loader = new MMDLoader();
        loader.load(
            stageConfig.path,
            function (mesh) {
                state.scene.add(mesh);
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
            null
        );
    }

    const listener = new THREE.AudioListener();
    state.camera.add(listener);
    state.scene.add(state.camera);

    // Apply lighting configuration
    const lighting = getLightingConfig();
    
    const ambient = new THREE.AmbientLight(lighting.ambient.color, lighting.ambient.intensity);
    state.scene.add(ambient);

    const directionalLight = new THREE.DirectionalLight(lighting.directional.color, lighting.directional.intensity);
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
    const stageConfig = getStageConfig();
    if (stageConfig.isCustom && stageConfig.files.length > 0) {
        // Load custom stage using the same manager
        const stageFile = Array.from(stageConfig.files).find(
            (e) => e.name.includes(".pmx") || e.name.includes(".pmd") || e.name.includes(".x")
        );
        if (stageFile) {
            loader.load(
                stageFile.name,
                function (mesh) {
                    state.scene.add(mesh);
                },
                function (xhr) {
                    console.log((xhr.loaded / xhr.total) * 100 + "% stage loaded");
                },
                null
            );
        }
    } else {
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
    }

    const listener = new THREE.AudioListener();
    state.camera.add(listener);
    state.scene.add(state.camera);

    // Apply lighting configuration
    const lighting = getLightingConfig();
    
    const ambient = new THREE.AmbientLight(lighting.ambient.color, lighting.ambient.intensity);
    state.scene.add(ambient);

    const directionalLight = new THREE.DirectionalLight(lighting.directional.color, lighting.directional.intensity);
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
