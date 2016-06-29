var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CanvasToy;
(function (CanvasToy) {
    var version = 2;
    CanvasToy.debug = true;
})(CanvasToy || (CanvasToy = {}));
CanvasToy.glMatrix = glMatrix;
CanvasToy.vec2 = vec2;
CanvasToy.vec3 = vec3;
CanvasToy.vec4 = vec4;
CanvasToy.mat2 = mat2;
CanvasToy.mat2d = mat2d;
CanvasToy.mat3 = mat3;
CanvasToy.mat4 = mat4;
CanvasToy.quat = quat;
var CanvasToy;
(function (CanvasToy) {
    var Geometry = (function () {
        function Geometry(size) {
            this.positions = [];
            this.uvs = [];
            this.normals = [];
            this.indices = [];
        }
        Geometry.prototype.addVertex = function (index, position, uv, normal) {
            this.indices.push.apply(index);
            this.positions.push.apply(position);
            (!!uv) ? this.uvs.push.apply(uv) : 0;
            (!!normal) ? this.normals.push.apply : 0;
        };
        return Geometry;
    }());
    CanvasToy.Geometry = Geometry;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Texture = (function () {
        function Texture(path, customOnLoad) {
            var _this = this;
            this.active = false;
            this.image = new Image();
            var gl = CanvasToy.engine.gl;
            this.glTexture = gl.createTexture();
            CanvasToy.engine.preloadRes.push(this);
            this.image.src = path;
            this.image.onload = function () {
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, _this.glTexture);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _this.image);
                _this.active = true;
                CanvasToy.engine.preloadRes.splice(CanvasToy.engine.preloadRes.indexOf(_this, 1));
                if (customOnLoad) {
                    customOnLoad();
                }
                console.log("texture loaded");
            };
        }
        return Texture;
    }());
    CanvasToy.Texture = Texture;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    CanvasToy.colors = {
        white: CanvasToy.vec4.fromValues(1, 1, 1, 1),
        black: CanvasToy.vec4.fromValues(0, 0, 0, 1),
        gray: CanvasToy.vec4.fromValues(0.5, 0.5, 0.5, 1),
        red: CanvasToy.vec4.fromValues(1, 0, 0, 1)
    };
    (function (ShadingMode) {
        ShadingMode[ShadingMode["flatShading"] = 0] = "flatShading";
        ShadingMode[ShadingMode["smoothShading"] = 1] = "smoothShading";
    })(CanvasToy.ShadingMode || (CanvasToy.ShadingMode = {}));
    var ShadingMode = CanvasToy.ShadingMode;
    var Material = (function () {
        function Material() {
            this.attributes = {};
            this.uniforms = {};
            this.samplers = {};
            this.ambient = CanvasToy.vec3.fromValues(0.1, 0.1, 0.1);
            this.diffuse = CanvasToy.vec3.fromValues(0.8, 0.8, 0.8);
            this.specular = CanvasToy.vec3.fromValues(1, 1, 1);
            this.opacity = CanvasToy.vec3.fromValues(0, 0, 0);
            this.shadingMode = ShadingMode.smoothShading;
        }
        Material.prototype.addAttribute = function (name, data) {
            this.attributes[name] = data;
        };
        Material.prototype.addUniform = function (name, data) {
            this.uniforms[name] = data;
        };
        return Material;
    }());
    CanvasToy.Material = Material;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Object3d = (function () {
        function Object3d() {
            this.updateEvents = [];
            this.startEvents = [];
            this.modelViewMatrix = CanvasToy.mat4.create();
            this.translate(0, 0, 0);
            this.matrix = CanvasToy.mat4.create();
            this.position = CanvasToy.vec4.create();
            this.size = CanvasToy.vec3.create();
        }
        Object3d.prototype.registerUpdate = function (updateFunction) {
            this.updateEvents.push(updateFunction);
        };
        Object3d.prototype.registerStart = function (updateFunction) {
            this.startEvents.push(updateFunction);
        };
        Object3d.prototype.start = function () {
            for (var _i = 0, _a = this.startEvents; _i < _a.length; _i++) {
                var event_1 = _a[_i];
                event_1();
            }
        };
        Object3d.prototype.update = function (dt) {
            for (var _i = 0, _a = this.updateEvents; _i < _a.length; _i++) {
                var event_2 = _a[_i];
                event_2(dt);
            }
        };
        Object3d.prototype.translate = function (deltaX, deltaY, deltaZ) {
            this.modelViewMatrix = CanvasToy.mat4.translate(CanvasToy.mat4.create(), this.modelViewMatrix, CanvasToy.vec3.fromValues(deltaX, deltaY, deltaZ));
        };
        Object3d.prototype.translateTo = function (deltaX, deltaY, deltaZ) { };
        Object3d.prototype.rotateX = function (angle) {
            this.modelViewMatrix = CanvasToy.mat4.rotateX(CanvasToy.mat4.create(), this.modelViewMatrix, angle);
        };
        Object3d.prototype.rotateY = function (angle) {
            this.modelViewMatrix = CanvasToy.mat4.rotateY(CanvasToy.mat4.create(), this.modelViewMatrix, angle);
        };
        Object3d.prototype.rotateZ = function (angle) {
            this.modelViewMatrix = CanvasToy.mat4.rotateZ(CanvasToy.mat4.create(), this.modelViewMatrix, angle);
        };
        Object3d.prototype.scale = function (rateX, rateY, rateZ) {
            if (rateY == undefined) {
                var rateY = rateX;
            }
            if (rateZ == undefined) {
                var rateZ = rateX;
            }
            this.modelViewMatrix = CanvasToy.mat4.scale(CanvasToy.mat4.create(), this.modelViewMatrix, CanvasToy.vec3.fromValues(rateX, rateY, rateZ));
        };
        return Object3d;
    }());
    CanvasToy.Object3d = Object3d;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Node = (function (_super) {
        __extends(Node, _super);
        function Node() {
            _super.call(this);
            this.parent = null;
            this.children = [];
            this.relativeMatrix = CanvasToy.mat4.create();
        }
        Node.prototype.addChild = function (child) {
            this.children.push(child);
            child.parent = this;
        };
        Node.prototype.compuseMatrixs = function () {
            var parentMatrix = this.parent.matrix;
            this.modelViewMatrix = CanvasToy.mat4.mul(CanvasToy.mat4.create(), this.relativeMatrix, parentMatrix);
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var child = _a[_i];
                child.compuseMatrixs();
            }
        };
        return Node;
    }(CanvasToy.Object3d));
    CanvasToy.Node = Node;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Program = (function () {
        function Program() {
            this.uniforms = {};
            this.uniformUpdaters = {};
            this.attributes = {};
            this.drawMode = CanvasToy.engine.gl.STATIC_DRAW;
            this.vertexBuffers = {};
        }
        Program.prototype.Program = function (parameter) {
            this.uniforms = parameter.uniforms;
            this.attributes = parameter.attributes;
            for (var name_1 in parameter.uniforms) {
                this.uniforms[name_1] = CanvasToy.engine.getUniformLocation(this, name_1);
            }
            for (var _i = 0, _a = parameter.attributes; _i < _a.length; _i++) {
                var buffer = _a[_i];
                buffer.index = CanvasToy.engine.gl.getAttribLocation(this, name);
                this.vertexBuffers[name] = buffer;
            }
        };
        Program.prototype.setAttribute0 = function (newVertexBuffer) {
            this.attribute0 = newVertexBuffer;
            this.attribute0.index = 0;
            this.vertexBuffers[newVertexBuffer.name] = newVertexBuffer;
            CanvasToy.engine.gl.bindAttribLocation(this.webGlProgram, 0, this.attribute0.name);
            return newVertexBuffer;
        };
        Program.prototype.addAttribute = function (newVertexBuffer) {
            newVertexBuffer.index = CanvasToy.engine.gl.getAttribLocation(this.webGlProgram, newVertexBuffer.name);
            this.vertexBuffers[newVertexBuffer.name] = newVertexBuffer;
            return newVertexBuffer;
        };
        Program.prototype.addUniform = function (name, onUpdateUniform) {
            CanvasToy.engine.gl.useProgram(this.webGlProgram);
            this.uniforms[name] = CanvasToy.engine.getUniformLocation(this, name);
            this.uniformUpdaters[name] = onUpdateUniform;
        };
        return Program;
    }());
    CanvasToy.Program = Program;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Mesh = (function (_super) {
        __extends(Mesh, _super);
        function Mesh(geometry, material) {
            var _this = this;
            _super.call(this);
            this.drawMode = CanvasToy.engine.gl.STATIC_DRAW;
            this.normalMatrix = CanvasToy.mat4.create();
            this.material = material;
            this.geometry = geometry;
            this.registerUpdate(function (event) {
                _this.normalMatrix = CanvasToy.mat4.invert(CanvasToy.mat4.create(), _this.modelViewMatrix);
            });
        }
        return Mesh;
    }(CanvasToy.Node));
    CanvasToy.Mesh = Mesh;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Scene = (function () {
        function Scene() {
            var _this = this;
            this.objects = [];
            this.lights = [];
            this.ambientLight = CanvasToy.vec3.fromValues(0, 0, 0);
            this.openLight = true;
            this.enableShadowMap = false;
            this.clearColor = [0, 0, 0, 0];
            window.setInterval(function () { return _this.update(1000 / 60); }, 1000 / 60);
        }
        Scene.prototype.update = function (dt) {
            for (var _i = 0, _a = this.objects; _i < _a.length; _i++) {
                var object = _a[_i];
                object.update(dt);
            }
        };
        Scene.prototype.addObject = function (object) {
            this.objects.push(object);
            object.scene = this;
        };
        Scene.prototype.addLight = function (light) {
            this.lights.push(light);
            light.scene = this;
        };
        return Scene;
    }());
    CanvasToy.Scene = Scene;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    (function (ShaderType) {
        ShaderType[ShaderType["VertexShader"] = 0] = "VertexShader";
        ShaderType[ShaderType["FragmentShader"] = 1] = "FragmentShader";
    })(CanvasToy.ShaderType || (CanvasToy.ShaderType = {}));
    var ShaderType = CanvasToy.ShaderType;
    function initWebwebglContext(canvas) {
        var gl = null;
        try {
            gl = canvas.getContext('experimental-webgl');
        }
        catch (e) {
            gl = canvas.getContext('webgl');
        }
        if (!gl) {
            alert("can't init webgl, current browser may not support it.");
        }
        return gl;
    }
    CanvasToy.initWebwebglContext = initWebwebglContext;
    function getDomScriptText(script) {
        if (!script) {
            return null;
        }
        var theSource = "";
        var currentChild = script.firstChild;
        while (currentChild) {
            if (currentChild.nodeType == 3) {
                theSource += currentChild.textContent;
            }
            currentChild = currentChild.nextSibling;
        }
        var shader;
    }
    CanvasToy.getDomScriptText = getDomScriptText;
    function createSeparatedShader(gl, source, type) {
        var shader;
        var typeInfo;
        if (type == ShaderType.FragmentShader) {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
            typeInfo = "fragment shader";
        }
        else if (type == ShaderType.VertexShader) {
            shader = gl.createShader(gl.VERTEX_SHADER);
            typeInfo = "vertex shader";
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("error: " + typeInfo + "\n" + gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }
    function linkShader(gl, vertexShader, fragmentShader) {
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program.\n" + gl.getProgramInfoLog(shaderProgram));
        }
        return shaderProgram;
    }
    ;
    function createEntileShader(gl, vertexShaderSource, fragmentShaderSource) {
        var vertShader = createSeparatedShader(gl, vertexShaderSource, ShaderType.VertexShader);
        var fragShader = createSeparatedShader(gl, fragmentShaderSource, ShaderType.FragmentShader);
        return linkShader(gl, vertShader, fragShader);
    }
    CanvasToy.createEntileShader = createEntileShader;
    function setProgram(camera, fog, material, object) {
    }
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Camera = (function (_super) {
        __extends(Camera, _super);
        function Camera() {
            _super.call(this);
            this.projectionMatrix = CanvasToy.mat4.create();
            console.log(this.projectionMatrix);
            console.log("init camera");
        }
        return Camera;
    }(CanvasToy.Object3d));
    CanvasToy.Camera = Camera;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var OrthoCamera = (function (_super) {
        __extends(OrthoCamera, _super);
        function OrthoCamera(options) {
            _super.call(this);
            CanvasToy.mat4.ortho(this.projectionMatrix, -1.0, 1.0, -1.0, 1.0, 0.1, 100);
        }
        return OrthoCamera;
    }(CanvasToy.Camera));
    CanvasToy.OrthoCamera = OrthoCamera;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var PerspectiveCamera = (function (_super) {
        __extends(PerspectiveCamera, _super);
        function PerspectiveCamera(options) {
            _super.call(this);
            this.projectionMatrix = CanvasToy.mat4.perspective(this.projectionMatrix, 45, 640 / 480, 0.1, 100);
        }
        return PerspectiveCamera;
    }(CanvasToy.Camera));
    CanvasToy.PerspectiveCamera = PerspectiveCamera;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var CubeGeometry = (function (_super) {
        __extends(CubeGeometry, _super);
        function CubeGeometry() {
            _super.call(this);
            this.positions = [
                -1.0, -1.0, 1.0,
                1.0, -1.0, 1.0,
                1.0, 1.0, 1.0,
                -1.0, 1.0, 1.0,
                -1.0, -1.0, -1.0,
                -1.0, 1.0, -1.0,
                1.0, 1.0, -1.0,
                1.0, -1.0, -1.0,
                -1.0, 1.0, -1.0,
                -1.0, 1.0, 1.0,
                1.0, 1.0, 1.0,
                1.0, 1.0, -1.0,
                -1.0, -1.0, -1.0,
                1.0, -1.0, -1.0,
                1.0, -1.0, 1.0,
                -1.0, -1.0, 1.0,
                1.0, -1.0, -1.0,
                1.0, 1.0, -1.0,
                1.0, 1.0, 1.0,
                1.0, -1.0, 1.0,
                -1.0, -1.0, -1.0,
                -1.0, -1.0, 1.0,
                -1.0, 1.0, 1.0,
                -1.0, 1.0, -1.0
            ];
            this.indices = [
                0, 1, 2, 0, 2, 3,
                4, 5, 6, 4, 6, 7,
                8, 9, 10, 8, 10, 11,
                12, 13, 14, 12, 14, 15,
                16, 17, 18, 16, 18, 19,
                20, 21, 22, 20, 22, 23
            ];
        }
        return CubeGeometry;
    }(CanvasToy.Geometry));
    CanvasToy.CubeGeometry = CubeGeometry;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var RectGeomotry = (function (_super) {
        __extends(RectGeomotry, _super);
        function RectGeomotry() {
            _super.call(this);
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
            this.indices = [
                0, 1, 2,
                2, 1, 3
            ];
        }
        return RectGeomotry;
    }(CanvasToy.Geometry));
    CanvasToy.RectGeomotry = RectGeomotry;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var Light = (function (_super) {
        __extends(Light, _super);
        function Light() {
            _super.call(this);
            this.diffuse = CanvasToy.vec3.fromValues(1.0, 1.0, 1.0);
            this.specular = CanvasToy.vec3.fromValues(1.0, 1.0, 1.0);
            this.idensity = 1.0;
        }
        return Light;
    }(CanvasToy.Object3d));
    CanvasToy.Light = Light;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var PointLight = (function (_super) {
        __extends(PointLight, _super);
        function PointLight() {
            _super.call(this);
        }
        return PointLight;
    }(CanvasToy.Light));
    CanvasToy.PointLight = PointLight;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var ModelLoader = (function () {
        function ModelLoader() {
        }
        ModelLoader.fetch = function (url, onload) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    if (onload) {
                        onload(request.responseText);
                    }
                }
            };
            request.open('GET', url);
            request.send();
        };
        ModelLoader.loadObj = function (url, onload) {
            var numberRegular = new RegExp('^(-?\d+)(\.\d+)?$');
            var positionRegular = new RegExp('v.+');
            var uvRegular = new RegExp('vt.+');
            ModelLoader.fetch(url, function (content) {
                var geometry = new CanvasToy.Geometry();
                var lines;
                var positions;
                var uvs;
                var normals;
                lines = content.split('\n');
                for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                    var line = lines_1[_i];
                    if (line.match(positionRegular)) {
                        positions.push(line);
                    }
                    if (line.match(uvRegular)) {
                        uvs.push(line);
                    }
                }
                if (uvs.length > 0 && positions.length != uvs.length) {
                    console.error('obj file format error!');
                    return null;
                }
            });
        };
        return ModelLoader;
    }());
    CanvasToy.ModelLoader = ModelLoader;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var BRDFPerVertMaterial = (function (_super) {
        __extends(BRDFPerVertMaterial, _super);
        function BRDFPerVertMaterial(paramter) {
            _super.call(this);
            this.vertexShaderSource = CanvasToy.brdf_perfrag_vert;
            this.fragShaderSource = CanvasToy.brdf_perfrag_frag;
            if (paramter.texture != undefined && paramter.color != undefined) {
                console.warn("passed both color and texture to Material, color would be ignored");
            }
            else if (paramter.texture != undefined) {
                this.map = paramter.texture;
                this.addAttribute('aTextureCoord', this.map);
            }
            else if (paramter.color != undefined) {
                this.color = paramter.color;
                this.addUniform('uColor', this.color);
            }
        }
        return BRDFPerVertMaterial;
    }(CanvasToy.Material));
    CanvasToy.BRDFPerVertMaterial = BRDFPerVertMaterial;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var BRDFPerFragMaterial = (function (_super) {
        __extends(BRDFPerFragMaterial, _super);
        function BRDFPerFragMaterial(paramter) {
            _super.call(this);
            this.vertexShaderSource = CanvasToy.brdf_perfrag_vert;
            this.fragShaderSource = CanvasToy.brdf_perfrag_frag;
            if (paramter.texture != undefined) {
                this.map = paramter.texture;
                this.addAttribute('aTextureCoord', this.map);
            }
            if (paramter.color != undefined) {
                this.color = paramter.color;
                this.addUniform('uColor', this.color);
            }
        }
        return BRDFPerFragMaterial;
    }(CanvasToy.Material));
    CanvasToy.BRDFPerFragMaterial = BRDFPerFragMaterial;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    function setCanvas(canvas) {
        CanvasToy.engine = new Renderer(canvas);
    }
    CanvasToy.setCanvas = setCanvas;
    var Renderer = (function () {
        function Renderer(canvas) {
            this.preloadRes = [];
            this.vertPrecision = "highp";
            this.fragPrecision = "mediump";
            this.canvasDom = canvas || document.createElement('canvas');
            this.gl = CanvasToy.initWebwebglContext(canvas);
            this.initMatrix();
            this.gl.clearDepth(1.0);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
        }
        Renderer.prototype.makeProgram = function (scene, mesh, camera) {
            var prefixVertex = [
                'precision ' + this.vertPrecision + ' float;',
                mesh.material.map ? '#define USE_TEXTURE ' : '',
                mesh.material.color ? '#define USE_COLOR ' : '',
                scene.openLight ? '#define OPEN_LIGHT\n#define LIGHT_NUM '
                    + scene.lights.length : ''
            ].join("\n") + '\n';
            var prefixFragment = [
                'precision ' + this.fragPrecision + ' float;',
                mesh.material.map ? '#define USE_TEXTURE ' : '',
                mesh.material.color ? '#define USE_COLOR ' : '',
                scene.openLight ? '#define OPEN_LIGHT \n#define LIGHT_NUM '
                    + scene.lights.length : ''
            ].join("\n") + '\n';
            if (CanvasToy.debug) {
            }
            mesh.program = new CanvasToy.Program();
            mesh.program.webGlProgram = CanvasToy.createEntileShader(this.gl, prefixVertex + mesh.material.vertexShaderSource, prefixFragment + mesh.material.fragShaderSource);
            this.gl.useProgram(mesh.program.webGlProgram);
            mesh.program.addUniform("modelViewMatrix", function () {
                CanvasToy.engine.gl.uniformMatrix4fv(mesh.program.uniforms["modelViewMatrix"], false, new Float32Array(mesh.modelViewMatrix));
            });
            mesh.program.addUniform("projectionMatrix", function () {
                CanvasToy.engine.gl.uniformMatrix4fv(mesh.program.uniforms["projectionMatrix"], false, new Float32Array(camera.projectionMatrix));
            });
            mesh.program.indexBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.program.indexBuffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.geometry.indices), mesh.program.drawMode);
            mesh.program.setAttribute0(new CanvasToy.VertexBuffer("position", 3, this.gl.FLOAT)).data = mesh.geometry.positions;
            if (mesh.material.color != undefined) {
                mesh.program.addUniform("color", function () {
                    CanvasToy.engine.gl.uniform4f(mesh.program.uniforms["color"], mesh.material.color[0], mesh.material.color[1], mesh.material.color[2], mesh.material.color[3]);
                });
            }
            if (mesh.material.map != undefined) {
                mesh.program.addAttribute(new CanvasToy.VertexBuffer("aTextureCoord", 2, this.gl.FLOAT))
                    .data = mesh.geometry.uvs;
            }
            if (scene.openLight) {
                console.log("open light");
                this.setUplights(scene, mesh, camera);
            }
            this.copyToVertexBuffer(mesh.program);
        };
        Renderer.prototype.setUplights = function (scene, mesh, camera) {
            var _this = this;
            mesh.program.addUniform("normalMatrix", function () {
                CanvasToy.engine.gl.uniformMatrix4fv(mesh.program.uniforms["normalMatrix"], false, new Float32Array(mesh.normalMatrix));
            });
            mesh.program.addUniform("ambient", function () {
                CanvasToy.engine.gl.uniform3f(mesh.program.uniforms["ambient"], scene.ambientLight[0], scene.ambientLight[1], scene.ambientLight[2]);
            });
            mesh.program.addUniform("eyePosition", function () {
                CanvasToy.engine.gl.uniform3f(mesh.program.uniforms["eyePosition"], camera.position[0], camera.position[1], camera.position[2]);
            });
            mesh.program.addAttribute(new CanvasToy.VertexBuffer("aNormal", 3, this.gl.FLOAT))
                .data = mesh.geometry.normals;
            var index = 0;
            var _loop_1 = function(light) {
                diffuse = "lights[" + index + "].diffuse";
                specular = "lights[" + index + "].specular";
                idensity = "lights[" + index + "].idensity";
                position = "lights[" + index + "].position";
                mesh.program.addUniform(diffuse, function () {
                    _this.gl.uniform3f(mesh.program.uniforms[diffuse], light.diffuse[0], light.diffuse[1], light.diffuse[2]);
                });
                mesh.program.addUniform(specular, function () {
                    _this.gl.uniform3f(mesh.program.uniforms[specular], light.specular[0], light.specular[1], light.specular[2]);
                });
                mesh.program.addUniform(position, function () {
                    _this.gl.uniform3f(mesh.program.uniforms[position], light.position[0], light.position[1], light.position[2]);
                });
                mesh.program.addUniform(idensity, function () {
                    _this.gl.uniform1f(mesh.program.uniforms[idensity], light.idensity);
                });
            };
            var diffuse, specular, idensity, position;
            for (var _i = 0, _a = scene.lights; _i < _a.length; _i++) {
                var light = _a[_i];
                _loop_1(light);
            }
        };
        Renderer.prototype.startRender = function (scene, camera, duration) {
            var _this = this;
            this.gl.clearColor(scene.clearColor[0], scene.clearColor[1], scene.clearColor[2], scene.clearColor[3]);
            for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                var object = _a[_i];
                if (object instanceof CanvasToy.Mesh) {
                    var mesh = object;
                    this.makeProgram(scene, mesh, camera);
                }
            }
            setInterval(function () { return _this.renderImmediately(scene, camera); }, duration);
        };
        Renderer.prototype.getUniformLocation = function (program, name) {
            if (this.gl == undefined || this.gl == null) {
                console.error("WebGLRenderingContext has not been initialize!");
                return null;
            }
            var result = this.gl.getUniformLocation(program.webGlProgram, name);
            if (result == null) {
                console.error("uniform " + name + " not found!");
                return null;
            }
            return result;
        };
        Renderer.prototype.getAttribLocation = function (program, name) {
            if (this.gl == undefined || this.gl == null) {
                console.error("WebGLRenderingContext has not been initialize!");
                return null;
            }
            var result = this.gl.getAttribLocation(program.webGlProgram, name);
            if (result == null) {
                console.error("attribute " + name + " not found!");
                return null;
            }
            return result;
        };
        Renderer.prototype.copyToVertexBuffer = function (program) {
            var gl = CanvasToy.engine.gl;
            for (var name_2 in program.vertexBuffers) {
                gl.enableVertexAttribArray(program.vertexBuffers[name_2].index);
                gl.bindBuffer(gl.ARRAY_BUFFER, program.vertexBuffers[name_2].buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(program.vertexBuffers[name_2].data), CanvasToy.engine.gl.STATIC_DRAW);
            }
        };
        ;
        Renderer.prototype.renderObject = function (camera, object) {
            var gl = CanvasToy.engine.gl;
            if (object instanceof CanvasToy.Mesh) {
                var mesh = object;
                this.gl.useProgram(mesh.program.webGlProgram);
                for (var updaters in mesh.program.uniformUpdaters) {
                    mesh.program.uniformUpdaters[updaters]();
                }
                for (var name_3 in mesh.program.vertexBuffers) {
                    gl.bindBuffer(CanvasToy.engine.gl.ARRAY_BUFFER, mesh.program.vertexBuffers[name_3].buffer);
                    CanvasToy.engine.gl.vertexAttribPointer(mesh.program.vertexBuffers[name_3].index, mesh.program.vertexBuffers[name_3].size, mesh.program.vertexBuffers[name_3].type, false, 0, 0);
                }
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.program.indexBuffer);
                gl.drawElements(gl.TRIANGLES, mesh.geometry.indices.length, gl.UNSIGNED_SHORT, 0);
            }
        };
        Renderer.prototype.renderImmediately = function (scene, camera) {
            if (this.preloadRes.length > 0) {
                return;
            }
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            for (var _i = 0, _a = scene.objects; _i < _a.length; _i++) {
                var renderObject = _a[_i];
                if (scene.openLight) {
                    for (var _b = 0, _c = scene.objects; _b < _c.length; _b++) {
                        var light = _c[_b];
                        renderObject;
                    }
                }
                this.renderObject(camera, renderObject);
            }
        };
        Renderer.prototype.initMatrix = function () {
            CanvasToy.glMatrix.setMatrixArrayType(Float32Array);
        };
        return Renderer;
    }());
    CanvasToy.Renderer = Renderer;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    var VertexBuffer = (function () {
        function VertexBuffer(name, size, type, data, stride) {
            this.buffer = null;
            this.name = name;
            this.size = size;
            this.type = type;
            this.data = data ? data : [];
            this.stride = stride ? stride : 0;
            this.buffer = CanvasToy.engine.gl.createBuffer();
        }
        return VertexBuffer;
    }());
    CanvasToy.VertexBuffer = VertexBuffer;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    CanvasToy.vertexShaderTemplate = {
        "basic": [
            "common"
        ]
    };
    CanvasToy.fragmentShaderTemplate = {
        "basic": [
            "common"
        ]
    };
    function makeVertShader(src) {
    }
    CanvasToy.makeVertShader = makeVertShader;
    function makeFragShader(src) {
    }
    CanvasToy.makeFragShader = makeFragShader;
})(CanvasToy || (CanvasToy = {}));
var CanvasToy;
(function (CanvasToy) {
    CanvasToy.basic_frag = "#version 100\n\n#ifdef USE_COLOR\nvarying vec4 vColor;\n#endif\n\n#ifdef USE_TEXTURE\nvarying vec2 vTextureCoord;\nuniform sampler2D uTextureSampler;\nvec4 textureColor;\n#endif\n\n#ifdef OPEN_LIGHT\nvarying vec3 vNormal;\n#endif\n\nvoid main() {\n#ifdef USE_COLOR\n    gl_FragColor = vColor;\n#endif\n\n#ifdef USE_TEXTURE\n    gl_FragColor = texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n#endif\n\n}\n";
    CanvasToy.basic_vert = "#version 100\n\nattribute vec3 position;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform vec4 cameraPosition;\n\n#ifdef USE_COLOR\nattribute vec4 aColor;\nvarying vec4 vColor;\n#endif\n\n#ifdef USE_TEXTURE\nattribute vec2 aTextureCoord;\nvarying vec2 vTextureCoord;\n#endif\n\n#ifdef OPEN_LIGHT\nattribute vec3 aNormal;\nvarying vec3 vNormal;\n#endif\n\nvoid main (){\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n\n#ifdef USE_COLOR\n    vColor = aColor;\n#endif\n\n#ifdef USE_TEXTURE\n    vTextureCoord = aTextureCoord;\n#endif\n\n}\n";
    CanvasToy.brdf_perfrag_frag = "#ifdef USE_COLOR // color declaration\nuniform vec4 color;\n#endif // color declaration\n\n#ifdef USE_TEXTURE // texture declaration\nvarying vec2 vTextureCoord;\nuniform sampler2D uTextureSampler;\nvec4 textureColor;\n#endif // texture declaration\n\n#ifdef OPEN_LIGHT // light declaration\nstruct Light {\n    vec3 specular;\n    vec3 diffuse;\n    float idensity;\n    vec3 position;\n    bool directional;\n};\nuniform vec3 ambient;\nuniform vec3 eyePosition;\nvarying vec3 vPosition;\nvec3 totalLighting;\nuniform Light lights[LIGHT_NUM];\nvarying vec3 vNormal;\n#endif // light declaration\n\nvoid main() {\n\n#ifdef USE_TEXTURE\n    textureColor = texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n#endif\n#ifdef OPEN_LIGHT\ntotalLighting = ambient;\n    for (int index = 0; index < LIGHT_NUM; index++) {\n        vec3 lightDir = normalize(vPosition - lights[index].position);\n        float lambortian = max(dot(normalize(vNormal), lightDir), 0.0);\n        vec3 reflectDir = reflect(lightDir, vNormal);\n        vec3 viewDir = normalize(eyePosition-vPosition);\n        float specularAngle = max(dot(reflectDir, viewDir), 0.0);\n        float specular = pow(specularAngle, lights[index].idensity);\n        vec3 specularColor = lights[index].specular * specular;\n        vec3 diffuseColor = lambortian * lights[index].diffuse;\n        totalLighting = totalLighting + (diffuseColor + specularColor);\n    }\n#ifdef USE_TEXTURE\n    totalLighting = totalLighting * textureColor.xyz;\n#endif\n#ifdef USE_COLOR\n    totalLighting = totalLighting * color.xyz;\n#endif\n    gl_FragColor = vec4(totalLighting, 1.0);\n#endif\n}\n";
    CanvasToy.brdf_perfrag_vert = "attribute vec3 position;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\n\n#ifdef USE_TEXTURE\nattribute vec2 aTextureCoord;\nvarying vec2 vTextureCoord;\n#endif\n\n#ifdef OPEN_LIGHT\nuniform mat4 normalMatrix;\nattribute vec3 aNormal;\nvarying vec3 vPosition;\nvarying vec3 vNormal;\n#endif\n\nvoid main (){\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    vNormal = (normalMatrix * vec4(aNormal, 1.0)).xyz;\n    vPosition = gl_Position.xyz;\n#endif\n\n#ifdef USE_TEXTURE\n    vTextureCoord = aTextureCoord;\n#endif\n}\n";
})(CanvasToy || (CanvasToy = {}));
