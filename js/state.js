/**
 * State management module
 * Manages application state and resources
 */

import * as THREE from "three";

// Application state
export const state = {
    mesh: null,
    camera: null,
    scene: null,
    renderer: null,
    effect: null,
    helper: null,
    controls: null,
    ready: false,
    isInitializing: false,
    clock: new THREE.Clock(),
    blobURLs: [] // Keep track of created blob URLs for cleanup
};

/**
 * Reset state to initial values
 */
export function resetState() {
    state.mesh = null;
    state.camera = null;
    state.scene = null;
    state.renderer = null;
    state.effect = null;
    state.helper = null;
    state.controls = null;
    state.ready = false;
}
