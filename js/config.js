/**
 * Configuration module
 * Contains paths and constants for the application
 */

export const pmxPath = [
    "model/char_model/cj/Generic_item_new.pmx",
    "model/char_model/miku/miku_v2.pmd",
    "model/char_model/gumi/Gumi.pmx"
];

export const vmdPath = [
    [
        "model/mmd/animations/kewerkewer/trace_no001_original.vmd", // Kewer Kewer
    ],
    [
        "model/mmd/animations/yoasobi/trace_no001_original.vmd", // Yoasobi
        "model/mmd/animations/yoasobi/trace_no002_original.vmd",
        "model/mmd/animations/yoasobi/trace_no003_original.vmd",
        "model/mmd/animations/yoasobi/trace_no004_original.vmd",
        "model/mmd/animations/yoasobi/trace_no005_original.vmd",
        "model/mmd/animations/yoasobi/trace_no006_original.vmd",
        "model/mmd/animations/yoasobi/trace_no007_original.vmd",
        "model/mmd/animations/yoasobi/trace_no008_original.vmd",
        "model/mmd/animations/yoasobi/trace_no009_original.vmd",
        "model/mmd/animations/yoasobi/trace_no010_original.vmd",
        "model/mmd/animations/yoasobi/trace_no011_original.vmd",
        "model/mmd/animations/yoasobi/trace_no012_original.vmd",
        "model/mmd/animations/yoasobi/trace_no013_original.vmd",
    ],
    [
        "model/mmd/animations/yoasobi/yoasobi_new_trace.vmd", // Yoasobi V2
    ],
    [
        "model/mmd/animations/heavy-rotation/Heavy-Rotation.vmd", // Heavy Rotation
    ],
];

export const audioPath = [
    "model/mmd/audios/kewerkewer.mp3",
    "model/mmd/audios/yoasobi.mp3",
    "model/mmd/audios/アイドル-YOASOBI.wav",
    "model/mmd/audios/heavy-rotation.mp3",
];

export const cameraPath = [
    false,
    false,
    "model/mmd/camera/yoasobi.vmd",
    "model/mmd/camera/heavy-rotation.vmd",
];

export const stagePath = "model/stage/EPT.pmx";

/**
 * Lighting presets
 */
export const lightingPresets = {
    default: {
        ambient: { color: 0xaaaaaa, intensity: 3 },
        directional: { color: 0xffffff, intensity: 3 }
    },
    bright: {
        ambient: { color: 0xffffff, intensity: 4 },
        directional: { color: 0xffffff, intensity: 4 }
    },
    dark: {
        ambient: { color: 0x555555, intensity: 1.5 },
        directional: { color: 0xaaaaaa, intensity: 2 }
    },
    warm: {
        ambient: { color: 0xffddaa, intensity: 3 },
        directional: { color: 0xffeecc, intensity: 3 }
    },
    cool: {
        ambient: { color: 0xaaddff, intensity: 3 },
        directional: { color: 0xccddff, intensity: 3 }
    }
};
