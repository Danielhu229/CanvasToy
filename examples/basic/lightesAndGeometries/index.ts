/// <reference path="../../../build/debug/canvas-toy.d.ts"/>
/// <reference path="../../../typings/index.d.ts"/>
/// <reference path="../../index.ts"/>

examples.push((canvas: HTMLCanvasElement) => {
    const renderer = new CanvasToy.Renderer(canvas);

    const scene = new CanvasToy.Scene();
    const camera = new CanvasToy.PerspectiveCamera();
    const checkerBoard = new CanvasToy.StandardMaterial(renderer.gl);
    checkerBoard.debug = true;
    const objectMaterial = new CanvasToy.StandardMaterial(renderer.gl,
        { mainTexture: new CanvasToy.Texture2D(renderer.gl, "resources/images/wood.jpg") });
    const tile = new CanvasToy.Mesh(new CanvasToy.TileGeometry(renderer.gl).build(), [checkerBoard])
        .setPosition([0, -1, -3]).rotateX(-Math.PI / 2).setScaling([5, 5, 5]);
    const box = new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl).build(), [objectMaterial])
        .setPosition([-2, 0, -5]).setScaling([0.5, 0.5, 0.5]);
    const sphere = new CanvasToy.Mesh(
        new CanvasToy.SphereGeometry(renderer.gl)
            .setWidthSegments(50)
            .setHeightSegments(50)
            .build(),
        [objectMaterial])
        .setPosition([0, 0, -5]).setScaling([0.5, 0.5, 0.5]);
    scene.addObject(tile, box, sphere, camera);
    scene.addLight(new CanvasToy.DirectionalLight(renderer.gl).setDirection([-1, -1, 0]));
    const pointLight = new CanvasToy.PointLight(renderer.gl)
        .setPosition([-1, 0, 0]).setIdensity(40).setRadius(8); // .setRadius(1);
    scene.addLight(pointLight);
    let time = 0;
    scene.addOnUpdateListener((delta) => {
        time += delta;
        pointLight.setPosition(vec3.add(vec3.create(), pointLight.position,
        [0, 0.05 * Math.sin(time / 600), 0]));
    });
    scene.ambientLight = [0.2, 0.2, 0.2];
    renderer.render(scene, camera);
    return renderer;
});
