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
 * Initialize with preset model but custom animation/stage files
 */
export async function hybridInit(model, vmd, audio, cameraFiles, isCustomAnimation = false, isCustomStage = false) {
    console.log("Hybrid init: preset model with custom animation/stage");

    if (state.isInitializing) {
        console.warn("Already initializing");
        return;
    }

    state.isInitializing = true;

    try {
        // Collect custom files (animation and/or stage)
        let customFiles = [];

        // Add custom animation files if selected
        if (isCustomAnimation) {
            const customAnimFiles = document.getElementById("custom-animation").files;
            if (customAnimFiles.length === 0) {
                state.isInitializing = false;
                return alert("Please upload custom animation files!");
            }
            customFiles = customFiles.concat(Array.from(customAnimFiles));
            console.log("Custom animation files added:", Array.from(customAnimFiles).map(f => f.name));
        }

        // Add custom stage files if selected
        if (isCustomStage) {
            const customStageFiles = document.getElementById("custom-stage").files;
            if (customStageFiles.length === 0) {
                state.isInitializing = false;
                return alert("Please upload custom stage files!");
            }
            customFiles = customFiles.concat(Array.from(customStageFiles));
            console.log("Custom stage files added:", Array.from(customStageFiles).map(f => f.name));
        }

        console.log("All custom files to load:", customFiles.map(f => f.name));

        document.getElementById(
            "info-text"
        ).innerHTML = `Downloading <a id="percent" style="color:white;">0</a>%`;

        // Initialize scene with custom files only (no model in custom files)
        const loader = initializeSceneWithManager(customFiles);
        
        const modelFile = model;
        const vmdFiles = vmd;
        const audioFile = audio;

        const onProgress = createProgressCallback(vmd, cameraFiles);

        console.log("Loading preset model:", modelFile);
        console.log("With VMD files:", vmdFiles);

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
        console.error("Error in hybridInit:", error);
        state.isInitializing = false;
        cleanup();
        throw error;
    }
}

/**
 * Initialize application with custom model
 */
export async function customModelInit(vmd, audio, cameraFiles, isCustomAnimation = false, isCustomStage = false) {
    console.log("Custom model Initiation");

    if (state.isInitializing) {
        console.warn("Already initializing");
        return;
    }

    state.isInitializing = true;

    try {
        // Collect all files that need to be loaded
        let allFiles = [];
        
        // Add custom model files (REQUIRED for this function)
        let customModel = document.getElementById("custom-model");
        let modelFiles = customModel.files;
        if (modelFiles.length == 0) {
            state.isInitializing = false;
            return alert("Custom Model Not Uploaded Yet!");
        }
        allFiles = allFiles.concat(Array.from(modelFiles));

        // Add custom animation files if selected
        if (isCustomAnimation) {
            const customAnimFiles = document.getElementById("custom-animation").files;
            if (customAnimFiles.length === 0) {
                state.isInitializing = false;
                return alert("Please upload custom animation files!");
            }
            allFiles = allFiles.concat(Array.from(customAnimFiles));
            console.log("Custom animation files added:", Array.from(customAnimFiles).map(f => f.name));
        }

        // Add custom stage files if selected
        if (isCustomStage) {
            const customStageFiles = document.getElementById("custom-stage").files;
            if (customStageFiles.length === 0) {
                state.isInitializing = false;
                return alert("Please upload custom stage files!");
            }
            allFiles = allFiles.concat(Array.from(customStageFiles));
            console.log("Custom stage files added:", Array.from(customStageFiles).map(f => f.name));
        }

        console.log("All files to load:", allFiles.map(f => f.name));

        document.getElementById(
            "info-text"
        ).innerHTML = `Downloading <a id="percent" style="color:white;">0</a>%`;

        const loader = initializeSceneWithManager(allFiles);
        console.log("Loader initialized with manager");

        // Find the model file
        let theModel = allFiles.find(
            (e) => e.name.includes(".pmx") || e.name.includes(".pmd")
        );
        
        if (!theModel) {
            state.isInitializing = false;
            return alert("No valid model file (.pmx or .pmd) found!");
        }

        const modelFile = theModel.name;
        
        // Use vmd parameter which should contain the animation files
        const vmdFiles = vmd;
        const audioFile = audio;
        const audioParams = { delayTime: 0 };

        console.log("Model file:", modelFile);
        console.log("VMD files:", vmdFiles);

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
 * Check if custom animation is selected
 */
function isCustomAnimation() {
    return document.getElementById("animation").value === "custom";
}

/**
 * Check if custom stage is selected
 */
function isCustomStage() {
    return document.getElementById("stage").value === "custom";
}

/**
 * Check if custom model is selected
 */
function isCustomModel() {
    const modelSelect = document.getElementById("model");
    return modelSelect.selectedIndex === modelSelect.options.length - 1;
}

/**
 * Check if device is mobile
 */
function isDeviceMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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

            const useCustomModel = isCustomModel();
            const useCustomAnimation = isCustomAnimation();
            const useCustomStage = isCustomStage();

            console.log("Configuration:", {
                customModel: useCustomModel,
                customAnimation: useCustomAnimation,
                customStage: useCustomStage,
                animFiles: animFiles
            });

            // Routing logic:
            // 1. If custom model is selected -> use customModelInit (may include custom anim/stage)
            // 2. If preset model but custom anim/stage -> use hybridInit
            // 3. If all preset -> use standard init
            
            if (useCustomModel) {
                // Custom model (with or without custom animation/stage)
                customModelInit(
                    animFiles,
                    audioPath[document.getElementById("animation").selectedIndex],
                    cameraPath[document.getElementById("animation").selectedIndex],
                    useCustomAnimation,
                    useCustomStage
                );
            } else if (useCustomAnimation || useCustomStage) {
                // Preset model with custom animation and/or custom stage
                hybridInit(
                    pmxPath[document.getElementById("model").selectedIndex],
                    animFiles,
                    audioPath[document.getElementById("animation").selectedIndex],
                    cameraPath[document.getElementById("animation").selectedIndex],
                    useCustomAnimation,
                    useCustomStage
                );
            } else {
                // All preset (standard initialization)
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