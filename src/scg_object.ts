
import { Vector2, Rect } from './scg_math';
import { ScType } from './scg_types';
import { SCgContentProvider } from './scg_content_provider';
import { SCgScene } from './scg_scene';

export abstract class SCgObject {
    private _needUpdate: boolean = true;
    private _needViewUpdate: boolean = true;
    private _id: number = 0;
    private _text: string = "";
    private _type: ScType = ScType.Unknown;
    private _scene: SCgScene = null;

    // list of adjacent objects (for example in/out edges)
    private _adjacentList: SCgObject[] = [];

    constructor(id: number, text: string, type: ScType, scene: SCgScene) {
        this._needUpdate = true;
        this._needViewUpdate = true;
        this._id = id;
        this._text = text;
        this._type = type;
        this._scene = scene;
    }

    // calls by adjacent objects, in this method internal state should be updated
    public requestUpdate() {
        this._needUpdate = true;
        this._adjacentList.forEach((obj: SCgObject) => {
            obj.requestUpdate();
        });
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

    get scene() : SCgScene {
        return this._scene;
    }

    public addAdjacent(obj: SCgObject) : void{
        if (this._adjacentList.indexOf(obj) <= -1)
            return;
        this._adjacentList.push(obj);
    }

    public removeAdjacent(obj: SCgObject) {
        const idx = this._adjacentList.indexOf(obj);
        if (idx > -1)
            this._adjacentList.splice(idx, 1);
    }
};

abstract class SCgPointObject extends SCgObject {
    private _pos: Vector2;
    private _scale: number;

    constructor(id: number, text: string, type: ScType, scene: SCgScene) {
        super(id, text, type, scene);

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

    constructor(id: number, text: string, type: ScType, scene: SCgScene) {
        super(id, text, type, scene);

        if (!type.isNode())
            throw "You should use node types there";
    }

    calcConnectionPoint(relPos: number, fromPos: Vector2) : Vector2 {
        const dv: Vector2 = this.pos.clone();
        dv.sub(fromPos);
        const l = dv.len();
        dv.normalize();
        dv.mulScalar(l - 15);

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

    constructor(id: number, text: string, type: ScType, scene: SCgScene) {
        super(id, text, type, scene);

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

    constructor(id: number, text: string, type: ScType, src: SCgObject, trg: SCgObject, scene: SCgScene) {
        super(id, text, type, scene);

        if (!type.isEdge())
            throw "You should use edge types there";

        this._src = src;
        this._src.addAdjacent(this);
        this._trg = trg;
        this._trg.addAdjacent(this);

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

    get srcRelPos() : number {
        return this._srcRelPos;
    }

    set srcRelPos(newPos: number) {
        this._srcRelPos = newPos;
        this.requestUpdate();
    }

    get trgRelPos() : number {
        return this._trgRelPos;
    }

    set trgRelPos(newPos: number) {
        this._trgRelPos = newPos;
        this.requestUpdate();
    }

    calcConnectionPoint(relPos: number, fromPos: Vector2) : Vector2 {
        // calculate relative pos
        const idx: number = Math.floor(relPos);
        const offset: number = relPos - idx;
        let pos: Vector2 = this.points[0].clone();

        if (idx < this.points.length) {
            let dv: Vector2 = this.points[idx + 1].clone().sub(this.points[idx]);
            const l: number = dv.len() * offset;
            dv.normalize();
            pos = this.points[idx].clone().add(dv.mulScalar(l));
        }

        const dv: Vector2 = pos.clone();
        dv.sub(fromPos);
        const dist = dv.len();
        dv.normalize();
        dv.mulScalar(dist - (this.type.isAccess() ? 3 : 5));

        return fromPos.clone().add(dv);
    }

    updateImpl() : void {
        this._src.update();
        this._trg.update();

        const points: Vector2[] = this.points;

        points[0] = this._src.calcConnectionPoint(this._srcRelPos, points[1]);
        points[points.length - 1] = this._trg.calcConnectionPoint(this._trgRelPos, points[points.length - 2]);
        points[0] = this._src.calcConnectionPoint(this._srcRelPos, points[1]); // find better solution
    }

    center() : Vector2 {
        return this.points[0];
    }
};

export class SCgLink extends SCgPointObject {
    
    private _bounds: Rect = new Rect(new Vector2(0, 0), new Vector2(30, 30));
    private _content: SCgContentProvider = null;
    private _container: any = null;
    private _containerWrap: any = null;

    constructor(id: number, text: string, type: ScType, scene: SCgScene) {
        super(id, text, type, scene);

        if (!type.isLink())
            throw "You should use link types there";
    }

    calcConnectionPoint(relPos: number, fromPos: Vector2) : Vector2 {
        const dv: Vector2 = this.pos.clone();
        dv.sub(fromPos);
        const l = dv.len();
        dv.normalize();
        dv.mulScalar(l - 15);

        return fromPos.clone().add(dv);
    }

    updateImpl() : void {
        // update bounds
        if (this._content) {
            this._bounds.size = this._content.getContentSize();
        }
        this._bounds.moveCenter(this.pos);
    }

    center() : Vector2 {
        return this.pos;
    }

    get bounds() : Rect {
        this.update();
        return this._bounds;
    }

    setContent(content: SCgContentProvider) : void {
        this._content = content;
        this._content.link = this;
        this._content.onChanged = function() {
            this.requestUpdate();
            this.scene.linkChanged();
        }.bind(this);
        this.requestUpdate();
    }

    // calls from render (do not call manualy)
    public setContainer(container: any) : void {
        this._container = container;
        if (this._containerWrap)
            this._containerWrap.remove();
        this._containerWrap = document.createElement('content');
        this._container.appendChild(this._containerWrap);
        if (this._content)
            this._content.setContainer(this._containerWrap);
        this.requestViewUpdate();
    }
};