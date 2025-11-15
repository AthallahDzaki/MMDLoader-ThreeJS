import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OutlineEffect } from "three/addons/effects/OutlineEffect.js";
import { MMDLoader } from "three/addons/loaders/MMDLoader.js";
import { MMDAnimationHelper } from "three/addons/animation/MMDAnimationHelper.js";

let mesh, camera, scene, renderer, effect;
let helper;

let ready = false;

const clock = new THREE.Clock();

let pmxPath = [
    "model/char_model/cj/Generic_item_new.pmx",
    "model/char_model/miku/miku_v2.pmd",
	"model/char_model/gumi/Gumi.pmx"
];

let vmdPath = [
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

let audioPath = [
    "model/mmd/audios/kewerkewer.mp3",
    "model/mmd/audios/yoasobi.mp3",
    "model/mmd/audios/アイドル-YOASOBI.wav",
    "model/mmd/audios/heavy-rotation.mp3",
];

let cameraPath = [
    false,
    false,
    "model/mmd/camera/yoasobi.vmd",
    "model/mmd/camera/heavy-rotation.vmd",
];

if (params.debug) {
    let vmdPath = prompt("input your VMD path! (DEV ONLY)");
    if (vmdPath)
        Ammo().then(function () {
            init(
                pmxPath[document.getElementById("model").selectedIndex],
                [vmdPath],
                "model/mmd/audios/heavy-rotation.mp3",
                "model/mmd/camera/heavy-rotation.vmd"
            );
        });
}

const startButton = document.getElementById("startButton");
startButton.addEventListener("click", function () {
    Ammo().then(function () {
        if (
            document.getElementById("enable-camera").checked &&
            document.getElementById("animation").selectedIndex == 2 &&
            isDeviceMobile()
        )
            alert(
                "The output from the camera perspective is not very good on mobile devices."
            );

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

async function LoadMMD(loader, modelFile, vmdFiles, onProgress) {
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

async function customModelInit(vmd, audio, cameraFiles) {
    console.log("Custom model Initiation");

    let customModel = document.getElementById("custom-model");
    let files = customModel.files;
    if (files.length == 0) return alert("Custom Model Not Uploaded Yet!");

    //   let customAnimation = [];
    //   if(document.getElementById("animation").selectedIndex == document.getElementById("animation").options.length -1) {
    //       // Custom Animation
    //       let customAnimFiles = document.getElementById("custom-animation").files;
    //       if(customAnimFiles.length == 0)
    //       {
    //           return alert("Custom Anim not Uploaded Yet!");
    //       }
    //       Array.from(customAnimFiles).forEach(x => {
    //           customAnimation.push(x.name); // Push the Animation name
    //       })
    //       files.concat(customAnimFiles); // Now files has our model
    //   }

    // blob loaded
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
            url = URL.createObjectURL(new Blob([find]));
        }
        console.log(url);
        return url;
    });

    document.getElementById(
        "info-text"
    ).innerHTML = `Downloading <a id="percent" style="color:white;">0</a>%`;

    const container = document.createElement("div");
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        2000
    );
    camera.position.z = 50;
    camera.position.y = 35;

    // scene

    helper = new MMDAnimationHelper();

    const loader = new MMDLoader(manager);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // scene.add( new THREE.PolarGridHelper( 30, 0 ) );

    loader.load(
        "model/stage/EPT.pmx",
        function (mesh) {
            scene.add(mesh);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        null
    );

    const listener = new THREE.AudioListener();
    camera.add(listener);
    scene.add(camera);

    const ambient = new THREE.AmbientLight(0xaaaaaa, 3);
    scene.add(ambient);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(-1, 1, 1).normalize();
    scene.add(directionalLight);

    //

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    container.appendChild(renderer.domElement);

    effect = new OutlineEffect(renderer);

    // model

    let count = 0;

    function onProgress(xhr) {
        if (xhr.lengthComputable) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            if (document.getElementById("overlay") != undefined)
                document.getElementById("percent").innerHTML = Math.round(
                    percentComplete,
                    2
                );
            console.log(Math.round(percentComplete, 2) + "% downloaded");
            if (percentComplete >= 100) {
                let vmdLength =
                    vmd.length +
                    // 1 +
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
    }

    let theModel = Array.from(files).find(
        (e) => e.name.includes(".pmx") || e.name.includes(".pmd")
    ).name;
    const modelFile = theModel;
    const vmdFiles = vmd;
    const audioFile = audio;
    const audioParams = { delayTime: 0 };

    if (
        document.getElementById("enable-camera").checked &&
        cameraFiles != false
    ) {
        loader.loadWithAnimation(
            modelFile,
            vmdFiles,
            function (mmd) {
                mesh = mmd.mesh;
//                for (const material of mesh.material) {
//                    material.emissive.set(0x000000);
//                }
                helper.add(mesh, {
                    animation: mmd.animation,
                    physics: true,
                });

                loader.loadAnimation(
                    cameraFiles,
                    camera,
                    function (cameraAnimation) {
                        helper.add(camera, {
                            animation: cameraAnimation,
                        });
                        // new THREE.AudioLoader().load(
                        //     audioFile,
                        //     function (buffer) {
                        //         const audio = new THREE.Audio(
                        //             listener
                        //         ).setBuffer(buffer);

                        //         helper.add(audio, audioParams);
                        scene.add(mesh);

                        ready = true;
                        //     },
                        //     onProgress,
                        //     null
                        // );
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
                mesh = mmd.mesh;
                for (const material of mesh.material) {
                    material.emissive.set(0x000000);
                }

                helper.add(mesh, {
                    animation: mmd.animation,
                    physics: true,
                });
                // new THREE.AudioLoader().load(
                //     audioFile,
                //     function (buffer) {
                //         const audio = new THREE.Audio(listener).setBuffer(
                //             buffer
                //         );

                //         helper.add(audio, audioParams);
                scene.add(mesh);

                ready = true;
                //     },
                //     onProgress,
                //     null
                // );
            },
            onProgress,
            null
        );
    }
    //

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 10;
    controls.maxDistance = 100;

    window.addEventListener("resize", onWindowResize);
}

async function init(model, vmd, audio, cameraFiles) {
    console.log(cameraFiles);

    document.getElementById(
        "info-text"
    ).innerHTML = `Downloading <a id="percent" style="color:white;">0</a>%`;

    const container = document.createElement("div");
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        2000
    );
    camera.position.z = 50;
    camera.position.y = 35;

    // scene

    helper = new MMDAnimationHelper();

    const loader = new MMDLoader();
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // scene.add( new THREE.PolarGridHelper( 30, 0 ) );

    loader.load(
        "model/stage/EPT.pmx",
        function (mesh) {
            scene.add(mesh);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        null
    );

    const listener = new THREE.AudioListener();
    camera.add(listener);
    scene.add(camera);

    const ambient = new THREE.AmbientLight(0xaaaaaa, 3);
    scene.add(ambient);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(-1, 1, 1).normalize();
    scene.add(directionalLight);

    //

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    container.appendChild(renderer.domElement);

    effect = new OutlineEffect(renderer);

    // model

    let count = 0;

    function onProgress(xhr) {
        if (xhr.lengthComputable) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            if (document.getElementById("overlay") != undefined)
                document.getElementById("percent").innerHTML = Math.round(
                    percentComplete,
                    2
                );
            console.log(Math.round(percentComplete, 2) + "% downloaded");
            if (percentComplete >= 100) {
                let vmdLength =
                    vmd.length +
                    // 1 +
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
    }

    const modelFile = model;
    const vmdFiles = vmd;
    const audioFile = audio;
    const audioParams = { delayTime: 0 };
    // 160 * 1 / 30 };

    if (
        document.getElementById("enable-camera").checked &&
        cameraFiles != false
    ) {
        let mmd = await LoadMMD(loader, modelFile, vmdFiles, onProgress);
        mesh = mmd.mesh;

        helper.add(mesh, {
            animation: mmd.animation,
            physics: true,
        });

        loader.loadAnimation(
            cameraFiles,
            camera,
            function (cameraAnimation) {
                helper.add(camera, {
                    animation: cameraAnimation,
                });
                // new THREE.AudioLoader().load(
                //     audioFile,
                //     function (buffer) {
                //         const audio = new THREE.Audio(
                //             listener
                //         ).setBuffer(buffer);

                //         helper.add(audio, audioParams);
                scene.add(mesh);

                ready = true;
                //     },
                //     onProgress,
                //     null
                // );
            },
            onProgress,
            null
        );
    } else {
        let mmd = await LoadMMD(loader, modelFile, vmdFiles, onProgress);
        console.log(mmd);
        mesh = mmd.mesh;

        helper.add(mesh, {
            animation: mmd.animation,
            physics: true,
        });
        // new THREE.AudioLoader().load(
        //     audioFile,
        //     function (buffer) {
        //         const audio = new THREE.Audio(listener).setBuffer(
        //             buffer
        //         );

        //         helper.add(audio, audioParams);
        scene.add(mesh);

        ready = true;
        //     },
        //     onProgress,
        //     null
        // );
    }
    //

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 10;
    controls.maxDistance = 100;

    window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    effect.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
    if (ready) {
        helper.update(clock.getDelta());
    }

    effect.render(scene, camera);
}
