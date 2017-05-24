
export class Vector2 {
    private _x: number;
    private _y: number;

    constructor(_x: number, _y: number) {
        this._x = _x;
        this._y = _y;
    }

    public clone() : Vector2 {
        return new Vector2(this._x, this._y);
    }

    get x(): number {
        return this._x;
    }

    set x(_x: number) { 
        this._x = _x;
    }

    get y() : number {
        return this._y;
    }

    set y(_y: number) {
        this._y = _y;
    }

    public add(other: Vector2) : Vector2 {
        this._x += other._x;
        this._y += other._y;
        return this;
    }

    public addScalar(v: number) : Vector2 {
        this._x += v;
        this._y += v;
        return this;
    }
    
    public sub(other: Vector2) : Vector2 {
        this._x -= other._x;
        this._y -= other._y;
        return this;
    }

    public subScalar(v: number) : Vector2 {
        this._x -= v;
        this._y -= v;
        return this;
    }
    
    public mul(other: Vector2) : Vector2 {
        this._x *= other._x;
        this._y *= other._y;
        return this;
    }
    
    public div(other: Vector2) : Vector2 {
        this._x /= other._x;
        this._y /= other._y;
        return this;
    }
    
    public mulScalar(v: number) : Vector2 {
        this._x *= v;
        this._y *= v;
        return this;
    }
    
    public divScalar(v: number) : Vector2 {
        this._x /= v;
        this._y /= v;
        return this;
    }
    
    public len() : number {
        return Math.sqrt(this.lenSquared());
    }
    
    public lenSquared() : number {
        return this._x * this._x + this._y * this._y;
    }
    
    public dist(other: Vector2) : number {
        return Math.sqrt(this.distSquared(other));
    }
    
    public distSquared(other: Vector2) {
        const _x = this._x - other._x;
        const _y = this._y - other._y;
        return _x * _x + _y * _y;
    }
    
    public normalize() : Vector2 {
        return this.divScalar(this.len());
    }
    
    public dot(other: Vector2) : number {
        return this._x * other._x + this._y * other._y;
    }
};

export class Rect {
    private _origin: Vector2;
    private _size: Vector2;

    constructor(_origin: Vector2, _size: Vector2) {
        this._origin = _origin.clone();
        this._size = _size.clone();
    }

    get origin(): Vector2 {
        return this._origin;
    }

    set origin(_origin: Vector2) {
        this._origin = _origin;
    }

    get size(): Vector2 {
        return this._size;
    }

    set size(_size: Vector2) {
        this._size = _size;
    }

    public clone() : Rect {
        return new Rect(this.origin, this.size);
    }

    public adjust(dv: number) : Rect {
        this._origin.subScalar(dv);
        this._size.addScalar(2 * dv);
        return this;
    }

    public center() : Vector2 {
        return this._origin.clone().add(this._size).divScalar(2.0);
    }

    public translate(offset: Vector2) : Rect {
        this._origin.add(offset);
        return this;
    }

    public moveCenter(pos: Vector2) : Rect {
        this._origin = pos.clone().sub(this._size.clone().divScalar(2.0));
        return this;
    }
}