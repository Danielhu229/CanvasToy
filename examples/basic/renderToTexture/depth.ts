/// <reference path="../../../build/debug/canvas-toy.d.ts"/>
/// <reference path="../../../typings/index.d.ts"/>
/// <reference path="../../index.ts"/>

examples.push((canvas: HTMLCanvasElement) => {
    const renderer = new CanvasToy.Renderer(canvas);
    const scenes = Array(2, 0).map(() => new CanvasToy.Scene());
    const cameras = Array(2, 0).map(() => new CanvasToy.PerspectiveCamera());
    const light = new CanvasToy.PointLight();
    const cubes = [
        new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl),
            [new CanvasToy.StandardMaterial(renderer.gl)]),
    ];

    const image = new Image();
    image.src = "basic/images/chrome.png";
    cubes[0].materials[0].mainTexture = new CanvasToy.Texture2D(renderer.gl, image)
        .setFormat(renderer.gl.RGBA);
    cameras[0].setPosition([0, 0, 5]);
    scenes[0].ambientLight = vec3.fromValues(0.1, 0.1, 0.1);
    scenes[1].ambientLight = vec3.fromValues(0.1, 0.1, 0.1);
    light.setPosition([100, 0, 100]);
    scenes[0].addLight(light).addObject(cameras[0]).addObject(cubes[0]);

    const fbo = renderer.createFrameBuffer();
    fbo.attachments.depth
        .setType(renderer.gl, CanvasToy.AttachmentType.Texture)
        .targetTexture.setType(renderer.gl.UNSIGNED_SHORT);
    const rttTexture = fbo.attachments.depth.targetTexture;

    cubes.push(
        new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl),
            [new CanvasToy.StandardMaterial(renderer.gl, { mainTexture: rttTexture })]));
    cubes[0].registUpdate(() => {
        cubes.forEach((cube) => {
            cube.rotateY(0.01);
        });
    });

    cameras[1].setPosition([0, 0, 5]);
    scenes[1].addLight(light).addObject(cameras[1]).addObject(cubes[1]);
    scenes[0].addLight(light);
    renderer.renderFBO(scenes[0], cameras[0]);
    renderer.render(scenes[1], cameras[1]);
    return renderer;
});
