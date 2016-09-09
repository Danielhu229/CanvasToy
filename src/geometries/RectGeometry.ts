/// <reference path="./Geometry.ts"/>

module CanvasToy {
    export class RectGeometry extends Geometry {
        constructor() {
            super();
            this.positions = [
                -1.0, -1.0, 0.0,
                1.0, -1.0, 0.0,
                -1.0, 1.0, 0.0,
                1.0, 1.0, 0.0,
            ];
            this.uvs = [
                0.0, 0.0,
                1.0, 0.0,
                0.0, 1.0,
                1.0, 1.0
            ];
            this.normals = [
                1, 0, 0,
                0, 1, 0,
                0, 0, 1,
                0, 1, 1,
            ];
            this.faces = [
                0, 1, 2,
                2, 1, 3
            ];
        }
    }
}
