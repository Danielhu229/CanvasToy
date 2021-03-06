import { IAsyncResource } from "../IAsyncResource";

export class Texture implements IAsyncResource {
    protected _glTexture: WebGLTexture;

    protected _asyncFinished: Promise<Texture>;
    protected _image: HTMLImageElement;

    private _target: number;
    private _format: number;
    private _wrapS: number;
    private _wrapT: number;
    private _magFilter: number;
    private _minFilter: number;
    private _type: number;

    constructor(gl: WebGLRenderingContext, url?: string) {
        if (!!url) {
            this._image = new Image();
            const image = this._image;
            this.setAsyncFinished(
                new Promise((resolve, reject) => {
                    image.onload = () => resolve(this);
                    image.onerror = () => reject(this);
                    this._image.src = url;
                }),
            );
        }
        this.setTarget(gl.TEXTURE_2D)
            .setFormat(gl.RGB)
            .setWrapS(gl.CLAMP_TO_EDGE)
            .setWrapT(gl.CLAMP_TO_EDGE)
            .setMagFilter(gl.NEAREST)
            .setMinFilter(gl.NEAREST)
            .setType(gl.UNSIGNED_BYTE);
        this._glTexture = gl.createTexture();
    }

    public get glTexture() {
        return this._glTexture;
    }

    public get image() {
        return this._image;
    }

    public get target() {
        return this._target;
    }

    public get format() {
        return this._format;
    }

    public get wrapS() {
        return this._wrapS;
    }

    public get wrapT() {
        return this._wrapT;
    }

    public get magFilter() {
        return this._magFilter;
    }

    public get minFilter() {
        return this._minFilter;
    }

    public get type() {
        return this._type;
    }

    public setTarget(_target: number) {
        this._target = _target;
        return this;
    }

    public setFormat(_format: number) {
        this._format = _format;
        return this;
    }

    public setWrapS(_wrapS: number) {
        this._wrapS = _wrapS;
        return this;
    }

    public setWrapT(_wrapT: number) {
        this._wrapT = _wrapT;
        return this;
    }

    public setMagFilter(_magFilter: number) {
        this._magFilter = _magFilter;
        return this;
    }

    public setMinFilter(_minFilter: number) {
        this._minFilter = _minFilter;
        return this;
    }

    public setType(_type: number) {
        this._type = _type;
        return this;
    }

    public setAsyncFinished(promise: Promise<Texture>) {
        this._asyncFinished = promise;
        return this;
    }

    public asyncFinished() {
        return this._asyncFinished;
    }

    public apply(gl: WebGLRenderingContext) {
        gl.bindTexture(this.target, this.glTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texParameteri(this.target, gl.TEXTURE_WRAP_S, this.wrapS);
        gl.texParameteri(this.target, gl.TEXTURE_WRAP_T, this.wrapT);
        gl.texParameteri(this.target, gl.TEXTURE_MAG_FILTER, this.magFilter);
        gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, this.minFilter);
        return this;
    }

    public applyForRendering(
        gl: WebGLRenderingContext,
        width: number,
        height: number,
    ) {
        gl.bindTexture(this.target, this.glTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texParameteri(this.target, gl.TEXTURE_WRAP_S, this.wrapS);
        gl.texParameteri(this.target, gl.TEXTURE_WRAP_T, this.wrapT);
        gl.texParameteri(this.target, gl.TEXTURE_MAG_FILTER, this.magFilter);
        gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, this.minFilter);
        gl.texImage2D(
            this.target,
            0,
            this.format,
            width,
            height,
            0,
            this.format,
            this.type,
            null,
        );
        return this;
    }
}
