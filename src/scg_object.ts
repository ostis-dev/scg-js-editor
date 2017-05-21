
import { Vector2 } from './scg_math';
import { ScType } from './scg_types';

export class SCgObject {
    private needViewUpdate: boolean;
    private id: number;
    private text: string;
    private type: ScType;

    constructor(id: number, text: string, type: ScType) {
        this.needViewUpdate = false;
        this.id = id;
        this.text = text;
        this.type = type;
    }

    protected forceViewUpdate() {
        this.needViewUpdate = true;
    }

    public getID() : number {
        return this.id;
    }

    public getType() : ScType {
        return this.type;
    }
};

class SCgPointObject extends SCgObject {
    private _position: Vector2;
    private _scale: number;

    constructor(id: number, text: string, type: ScType) {
        super(id, text, type);

        this._position = new Vector2();
        this._scale = 1.0;
    }

    public pos(newPos?: Vector2) : Vector2 {
        if (newPos) {
            this._position = newPos;
            this.forceViewUpdate();
        }

        return this._position;
    }

    public scale(newScale?: number) : number {
        if (newScale) {
            this._scale = newScale;
            this.forceViewUpdate();
        }
        
        return this._scale;
    }
};

export class SCgNode extends SCgPointObject {

    constructor(id: number, text: string, type: ScType) {
        if (!type.isNode())
            throw "You should use node types there";

        super(id, text, type);
    }
};