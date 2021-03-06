import { vec3 } from "gl-matrix";

import { DataType } from "../DataTypeEnum";
import { uniform } from "../Decorators";

import { Light } from "./Light";

export abstract class DampingLight extends Light {

    @uniform(DataType.vec3)
    public get position() {
        return this._position;
    }

    protected _radius: number = 10;

    protected _squareAttenuation: number = 0.01;

    protected _linearAttenuation: number = 0.01;

    protected _constantAttenuation: number = 0.01;

    @uniform(DataType.float, "squareAtten")
    public get squareAttenuation() {
        return this._squareAttenuation;
    }
    @uniform(DataType.float, "linearAtten")
    public get linearAttenuation() {
        return this._squareAttenuation;
    }

    @uniform(DataType.float, "constantAtten")
    public get constantAttenuation() {
        return this._constantAttenuation;
    }

    @uniform(DataType.float)
    public get radius() {
        return this._radius;
    }

    public setSquareAtten(atten: number) {
        this._squareAttenuation = atten;
        return this;
    }

    public setLinearAtten(atten: number) {
        this._linearAttenuation = atten;
        return this;
    }

    public setConstAtten(atten: number) {
        this._constantAttenuation = atten;
        return this;
    }

    public abstract setRadius(radius: number);
}
