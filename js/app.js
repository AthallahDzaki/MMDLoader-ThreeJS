/**
 * Main application module
 * Entry point for the MMD Loader application
 */

import * as THREE from "three";
import { MMDLoader } from "three/addons/loaders/MMDLoader.js";

import { pmxPath, vmdPath, audioPath, cameraPath } from "./config.js";
import { state } from "./state.js";
import { cleanup } from "./cleanup.js";
import { loadMMD, createProgressCallback } from "./loader.js";
import { initializeScene, initializeSceneWithManager } from "./scene.js";

/**
 * Initialize application with standard model
 */
export async function init(model, vmd, audio, cameraFiles) {
    console.log(cameraFiles);

    if (state.isInitializing) {
        console.warn("Already initializing");
        return;
    }

    state.isInitializing = true;

    try {
        document.getElementById(
            "info-text"
        ).innerHTML = `Downloading <a id="percent" style="color:white;">0</a>%`;

        initializeScene();

        const loader = new MMDLoader();
        const modelFile = model;
        const vmdFiles = vmd;
        const audioFile = audio;
        const audioParams = { delayTime: 0 };

        const onProgress = createProgressCallback(vmd, cameraFiles);

        if (
            document.getElementById("enable-camera").checked &&
            cameraFiles != false
        ) {
            let mmd = await loadMMD(loader, modelFile, vmdFiles, onProgress);
            state.mesh = mmd.mesh;

            // Fix for black materials - ensure proper emissive values
            if (state.mesh.material) {
                const materials = Array.isArray(state.mesh.material) ? state.mesh.material : [state.mesh.material];
                materials.forEach(material => {
                    if (material.emissive) {
                        material.emissive.set(0x000000);
                    }
                });
            }

            state.helper.add(state.mesh, {
                animation: mmd.animation,
                physics: true,
            });

            loader.loadAnimation(
                cameraFiles,
                state.camera,
                function (cameraAnimation) {
                    state.helper.add(state.camera, {
                        animation: cameraAnimation,
                    });
                    state.scene.add(state.mesh);
                    state.ready = true;
                },
                onProgress,
                null
            );
        } else {
            let mmd = await loadMMD(loader, modelFile, vmdFiles, onProgress);
            console.log(mmd);
            state.mesh = mmd.mesh;

            // Fix for black materials - ensure proper emissive values
            if (state.mesh.material) {
                const materials = Array.isArray(state.mesh.material) ? state.mesh.material : [state.mesh.material];
                materials.forEach(material => {
                    if (material.emissive) {
                        material.emissive.set(0x000000);
                    }
                });
            }

            state.helper.add(state.mesh, {
                animation: mmd.animation,
                physics: true,
            });
            state.scene.add(state.mesh);
            state.ready = true;
        }

        state.isInitializing = false;
    } catch (error) {
        console.error("Error in init:", error);
        state.isInitializing = false;
        cleanup();
        throw error;
    }
}

/**
 * Initialize application with custom model
 */
export async function customModelInit(vmd, audio, cameraFiles) {
    console.log("Custom model Initiation");

    if (state.isInitializing) {
        console.warn("Already initializing");
        return;
    }

    state.isInitializing = true;

    try {
        let customModel = document.getElementById("custom-model");
        let files = customModel.files;
        if (files.length == 0) {
            state.isInitializing = false;
            return alert("Custom Model Not Uploaded Yet!");
        }

        // Merge custom animation files if selected
        let allFiles = Array.from(files);
        if (document.getElementById("animation").value === "custom") {
            const customAnimFiles = document.getElementById("custom-animation").files;
            if (customAnimFiles.length > 0) {
                allFiles = allFiles.concat(Array.from(customAnimFiles));
            }
        }

        // Merge custom stage files if selected
        if (document.getElementById("stage").value === "custom") {
            const customStageFiles = document.getElementById("custom-stage").files;
            if (customStageFiles.length > 0) {
                allFiles = allFiles.concat(Array.from(customStageFiles));
            }
        }

        document.getElementById(
            "info-text"
        ).innerHTML = `Downloading <a id="percent" style="color:white;">0</a>%`;

        const loader = initializeSceneWithManager(allFiles);

        let theModel = allFiles.find(
            (e) => e.name.includes(".pmx") || e.name.includes(".pmd")
        ).name;
        const modelFile = theModel;
        const vmdFiles = vmd;
        const audioFile = audio;
        const audioParams = { delayTime: 0 };

        const onProgress = createProgressCallback(vmd, cameraFiles);

        if (
            document.getElementById("enable-camera").checked &&
            cameraFiles != false
        ) {
            loader.loadWithAnimation(
                modelFile,
                vmdFiles,
                function (mmd) {
                    state.mesh = mmd.mesh;

                    // Fix for black materials - ensure proper emissive values
                    if (state.mesh.material) {
                        const materials = Array.isArray(state.mesh.material) ? state.mesh.material : [state.mesh.material];
                        materials.forEach(material => {
                            if (material.emissive) {
                                material.emissive.set(0x000000);
                            }
                        });
                    }

                    state.helper.add(state.mesh, {
                        animation: mmd.animation,
                        physics: true,
                    });

                    loader.loadAnimation(
                        cameraFiles,
                        state.camera,
                        function (cameraAnimation) {
                            state.helper.add(state.camera, {
                                animation: cameraAnimation,
                            });
                            state.scene.add(state.mesh);
                            state.ready = true;
                        },
                        onProgress,
                        null
                    );
                },
                onProgress,
                null
            );
        } else {
            loader.loadWithAnimation(
                modelFile,
                vmdFiles,
                function (mmd) {
                    state.mesh = mmd.mesh;
                    
                    // Fix for black materials - ensure proper emissive values
                    if (state.mesh.material) {
                        const materials = Array.isArray(state.mesh.material) ? state.mesh.material : [state.mesh.material];
                        materials.forEach(material => {
                            if (material.emissive) {
                                material.emissive.set(0x000000);
                            }
                        });
                    }

                    state.helper.add(state.mesh, {
                        animation: mmd.animation,
                        physics: true,
                    });
                    state.scene.add(state.mesh);
                    state.ready = true;
                },
                onProgress,
                null
            );
        }

        state.isInitializing = false;
    } catch (error) {
        console.error("Error in customModelInit:", error);
        state.isInitializing = false;
        cleanup();
        throw error;
    }
}

/**
 * Get animation files (custom or preset)
 */
function getAnimationFiles() {
    const animationSelect = document.getElementById("animation");
    const animationIndex = animationSelect.selectedIndex;
    
    if (animationSelect.value === "custom") {
        const customAnimFiles = document.getElementById("custom-animation").files;
        if (customAnimFiles.length === 0) {
            alert("Please upload custom animation files!");
            return null;
        }
        // Convert FileList to array of file names for custom animations
        return Array.from(customAnimFiles).map(f => f.name);
    }
    
    return vmdPath[animationIndex];
}

/**
 * Start the application
 */
export function startApp() {
    const startButton = document.getElementById("startButton");
    startButton.addEventListener("click", function () {
        // Prevent multiple simultaneous initializations
        if (state.isInitializing) {
            console.warn("Initialization already in progress");
            return;
        }

        Ammo().then(function () {
            if (
                document.getElementById("enable-camera").checked &&
                document.getElementById("animation").selectedIndex == 2 &&
                isDeviceMobile()
            )
                alert(
                    "The output from the camera perspective is not very good on mobile devices."
                );

            // Clean up previous instance before starting new one
            cleanup();

            const animFiles = getAnimationFiles();
            if (!animFiles) return; // User needs to upload animation

            if (
                document.getElementById("model").selectedIndex ==
                document.getElementById("model").options.length - 1
            ) {
                customModelInit(
                    animFiles,
                    audioPath[document.getElementById("animation").selectedIndex],
                    cameraPath[document.getElementById("animation").selectedIndex]
                );
            } else {
                init(
                    pmxPath[document.getElementById("model").selectedIndex],
                    animFiles,
                    audioPath[document.getElementById("animation").selectedIndex],
                    cameraPath[document.getElementById("animation").selectedIndex]
                );
            }
        });
    });
}
