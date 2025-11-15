/**
 * Cleanup module
 * Handles proper disposal of Three.js objects and resources
 */

import { state, resetState } from "./state.js";

/**
 * Helper function to dispose a material and its textures
 */
export function disposeMaterial(material) {
    if (!material) return;

    // Dispose textures
    const textures = [
        'map', 'lightMap', 'bumpMap', 'normalMap', 'specularMap',
        'envMap', 'alphaMap', 'aoMap', 'displacementMap', 'emissiveMap',
        'gradientMap', 'metalnessMap', 'roughnessMap'
    ];

    textures.forEach(textureName => {
        if (material[textureName]) {
            material[textureName].dispose();
        }
    });

    material.dispose();
}

/**
 * Cleanup function to properly dispose of Three.js objects and prevent memory leaks
 */
export function cleanup() {
    console.log("Cleaning up previous scene...");
    
    state.ready = false;

    // Stop animation loop
    if (state.renderer) {
        state.renderer.setAnimationLoop(null);
    }

    // Dispose controls
    if (state.controls) {
        state.controls.dispose();
        state.controls = null;
    }

    // Dispose helper
    if (state.helper) {
        state.helper = null;
    }

    // Dispose mesh
    if (state.mesh) {
        if (state.mesh.geometry) {
            state.mesh.geometry.dispose();
        }
        if (state.mesh.material) {
            if (Array.isArray(state.mesh.material)) {
                state.mesh.material.forEach(material => disposeMaterial(material));
            } else {
                disposeMaterial(state.mesh.material);
            }
        }
        if (state.scene) {
            state.scene.remove(state.mesh);
        }
        state.mesh = null;
    }

    // Dispose scene
    if (state.scene) {
        state.scene.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => disposeMaterial(material));
                } else {
                    disposeMaterial(object.material);
                }
            }
        });
        state.scene = null;
    }

    // Dispose renderer
    if (state.renderer) {
        state.renderer.dispose();
        if (state.renderer.domElement && state.renderer.domElement.parentNode) {
            state.renderer.domElement.parentNode.removeChild(state.renderer.domElement);
        }
        state.renderer = null;
    }

    // Dispose effect
    if (state.effect) {
        state.effect = null;
    }

    // Clean up camera
    if (state.camera) {
        state.camera = null;
    }

    // Revoke all blob URLs
    state.blobURLs.forEach(url => {
        URL.revokeObjectURL(url);
    });
    state.blobURLs.length = 0;

    // Remove window resize listener (will be re-added in init)
    window.removeEventListener("resize", onWindowResize);
}

/**
 * Window resize handler
 */
export function onWindowResize() {
    if (!state.camera || !state.effect) return;
    
    state.camera.aspect = window.innerWidth / window.innerHeight;
    state.camera.updateProjectionMatrix();

    state.effect.setSize(window.innerWidth, window.innerHeight);
}
