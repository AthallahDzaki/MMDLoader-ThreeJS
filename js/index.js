/**
 * MMD Loader Application
 * Main entry point - now using modular architecture
 */

import { pmxPath, vmdPath } from "./config.js";
import { startApp, init } from "./app.js";

// Debug mode support
if (params.debug) {
    let vmdPathDebug = prompt("input your VMD path! (DEV ONLY)");
    if (vmdPathDebug)
        Ammo().then(function () {
            init(
                pmxPath[document.getElementById("model").selectedIndex],
                [vmdPathDebug],
                "model/mmd/audios/heavy-rotation.mp3",
                "model/mmd/camera/heavy-rotation.vmd"
            );
        });
}

// Initialize the application
startApp();
