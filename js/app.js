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

        document.getElementById(
            "info-text"
        ).innerHTML = `Downloading <a id="percent" style="color:white;">0</a>%`;

        const loader = initializeSceneWithManager(files);

        let theModel = Array.from(files).find(
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
                    for (const material of state.mesh.material) {
                        material.emissive.set(0x000000);
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

            if (
                document.getElementById("model").selectedIndex ==
                document.getElementById("model").options.length - 1
            ) {
                customModelInit(
                    vmdPath[document.getElementById("animation").selectedIndex],
                    audioPath[document.getElementById("animation").selectedIndex],
                    cameraPath[document.getElementById("animation").selectedIndex]
                );
            } else {
                init(
                    pmxPath[document.getElementById("model").selectedIndex],
                    vmdPath[document.getElementById("animation").selectedIndex],
                    audioPath[document.getElementById("animation").selectedIndex],
                    cameraPath[document.getElementById("animation").selectedIndex]
                );
            }
        });
    });
}
