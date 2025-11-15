/**
 * Loader module
 * Handles MMD model and animation loading
 */

import { MMDLoader } from "three/addons/loaders/MMDLoader.js";

/**
 * Load MMD model with animation
 */
export async function loadMMD(loader, modelFile, vmdFiles, onProgress) {
    return new Promise((resolve, reject) => {
        loader.loadWithAnimation(
            modelFile,
            vmdFiles,
            function (mmd) {
                resolve(mmd);
            },
            onProgress,
            (error) => {
                reject(error);
            }
        );
    });
}

/**
 * Create progress callback for loading
 */
export function createProgressCallback(vmd, cameraFiles) {
    let count = 0;

    return function onProgress(xhr) {
        if (xhr.lengthComputable) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            if (document.getElementById("overlay") != undefined) {
                document.getElementById("percent").innerHTML = Math.round(
                    percentComplete,
                    2
                );
            }
            console.log(Math.round(percentComplete, 2) + "% downloaded");
            if (percentComplete >= 100) {
                let vmdLength =
                    vmd.length +
                    (cameraFiles != false &&
                    document.getElementById("enable-camera").checked
                        ? 1
                        : 0);
                if (count < vmdLength) {
                    console.log("count :", count, vmdLength);
                    count++;
                } else {
                    const overlay = document.getElementById("overlay");
                    overlay.remove();
                }
            }
        }
    };
}
