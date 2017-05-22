
import { Vector2 } from './scg_math';
import { ScType } from './scg_types';

export abstract class SCgObject {
    private _needUpdate: boolean;
    private _needViewUpdate: boolean;
    private _id: number;
    private _text: string;
    private _type: ScType;

    // list of adjacent objects (for example in/out edges)
    private adjacentList: SCgObject[];

    constructor(id: number, text: string, type: ScType) {
        this._needUpdate = true;
        this._needViewUpdate = true;
        this._id = id;
        this._text = text;
        this._type = type;
    }

    // calls by adjacent objects, in this method internal state should be updated
    protected requestUpdate() {
        this._needUpdate = true;
    }

    protected requestViewUpdate() {
        this._needViewUpdate = true;
    }

    public isNeedViewUpdate() : boolean {
        return this._needViewUpdate;
    }

    public viewUpdated() {
        this._needViewUpdate = false;
    }

    abstract center() : Vector2;
    abstract calcConnectionPoint(relPos: number, fromPos: Vector2) : Vector2;
    abstract updateImpl() : void;

    // updates object
    public update() {
        if (!this._needUpdate) return; // do nothing

        this.updateImpl();
        this._needUpdate = false;
        this._needViewUpdate = true;
    }

    get id(): number {
        return this._id;
    }

    get type() : ScType {
        return this._type;
    }

    get text() : string {
        return this._text;
    }

    set text(newText: string) {
        this._text = newText;
        this.requestViewUpdate();
    }
};

abstract class SCgPointObject extends SCgObject {
    private _pos: Vector2;
    private _scale: number;

    constructor(id: number, text: string, type: ScType) {
        super(id, text, type);

        this._pos = new Vector2(0, 0);
        this._scale = 1.0;
    }

    get pos() : Vector2 {
        return this._pos;
    }

    set pos(newPos: Vector2) {
        this._pos = newPos;
        this.requestUpdate();
    }

    get scale() : number {
        return this._scale;
    }

    set scale(newScale: number) {
        this._scale = newScale;
        this.requestUpdate();
    }
};

export class SCgNode extends SCgPointObject {

    constructor(id: number, text: string, type: ScType) {
        if (!type.isNode())
            throw "You should use node types there";

        super(id, text, type);
    }

    calcConnectionPoint(relPos: number, fromPos: Vector2) : Vector2 {
        const dv: Vector2 = this.pos.clone();
        dv.sub(fromPos);
        const l = dv.len();
        dv.normalize();
        dv.mulScalar(l - 10);

        return fromPos.clone().add(dv);
    }

    updateImpl() : void {

    }

    center() : Vector2 {
        return this.pos;
    }
};

abstract class SCgLineObject extends SCgObject {
    private _points: Vector2[];

    constructor(id: number, text: string, type: ScType) {
        super(id, text, type);

        this._points = [];
    }

    get points() : Vector2[] {
        return this._points;
    }
};

export class SCgEdge extends SCgLineObject {
    private _src: SCgObject;
    private _trg: SCgObject;
    /* Relative pos - is a position on target/or source object.
     * For example: 5.7 - means that it should be 0.7 position at 5 segment
     */
    private _srcRelPos: number;
    private _trgRelPos: number;

    constructor(id: number, text: string, type: ScType, src: SCgObject, trg: SCgObject) {
        if (!type.isEdge())
            throw "You should use edge types there";
        
        super(id, text, type);

        this._src = src;
        this._trg = trg;
        this._srcRelPos = 0.0;
        this._trgRelPos = 0.0;

        this.points.push(this._src.center().clone());
        this.points.push(this._trg.center().clone());
    }

    get src() : SCgObject {
        return this._src;
    }

    get trg() : SCgObject {
        return this._trg;
    }

    calcConnectionPoint(relPos: number, fromPos: Vector2) : Vector2 {
        return this.points[0].clone();
    }

    updateImpl() : void {
        const points: Vector2[] = this.points;

        points[0] = this._src.calcConnectionPoint(this._srcRelPos, points[1]);
        points[points.length - 1] = this._trg.calcConnectionPoint(this._trgRelPos, points[points.length - 2]);
    }

    center() : Vector2 {
        return this.points[0];
    }
};