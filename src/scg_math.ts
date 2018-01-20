
export class Vector2 {
  private _x: number;
  private _y: number;

  constructor(_x: number, _y: number) {
    this._x = _x;
    this._y = _y;
  }

  public clone(): Vector2 {
    return new Vector2(this._x, this._y);
  }

  get x(): number {
    return this._x;
  }

  set x(_x: number) {
    this._x = _x;
  }

  get y(): number {
    return this._y;
  }

  set y(_y: number) {
    this._y = _y;
  }

  public add(other: Vector2): Vector2 {
    this._x += other._x;
    this._y += other._y;
    return this;
  }

  public addScalar(v: number): Vector2 {
    this._x += v;
    this._y += v;
    return this;
  }

  public sub(other: Vector2): Vector2 {
    this._x -= other._x;
    this._y -= other._y;
    return this;
  }

  public subScalar(v: number): Vector2 {
    this._x -= v;
    this._y -= v;
    return this;
  }

  public mul(other: Vector2): Vector2 {
    this._x *= other._x;
    this._y *= other._y;
    return this;
  }

  public div(other: Vector2): Vector2 {
    this._x /= other._x;
    this._y /= other._y;
    return this;
  }

  public mulScalar(v: number): Vector2 {
    this._x *= v;
    this._y *= v;
    return this;
  }

  public divScalar(v: number): Vector2 {
    this._x /= v;
    this._y /= v;
    return this;
  }

  public len(): number {
    return Math.sqrt(this.lenSquared());
  }

  public lenSquared(): number {
    return this._x * this._x + this._y * this._y;
  }

  public dist(other: Vector2): number {
    return Math.sqrt(this.distSquared(other));
  }

  public distSquared(other: Vector2) {
    const _x = this._x - other._x;
    const _y = this._y - other._y;
    return _x * _x + _y * _y;
  }

  public normalize(): Vector2 {
    return this.divScalar(this.len());
  }

  public dot(other: Vector2): number {
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

  get leftTop(): Vector2 {
    return this._origin.clone();
  }

  get rightTop(): Vector2 {
    return new Vector2(this._origin.x + this._size.x, this._origin.y);
  }

  get rightBottom(): Vector2 {
    return new Vector2(this._origin.x + this._size.x, this._origin.y + this._size.y);
  }

  get leftBottom(): Vector2 {
    return new Vector2(this._origin.x, this._origin.y + this._size.y);
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

  public clone(): Rect {
    return new Rect(this.origin, this.size);
  }

  public adjust(dv: number): Rect {
    this._origin.subScalar(dv);
    this._size.addScalar(2 * dv);
    return this;
  }

  public center(): Vector2 {
    return this._origin.clone().add(this._size).divScalar(2.0);
  }

  public translate(offset: Vector2): Rect {
    this._origin.add(offset);
    return this;
  }

  public moveCenter(pos: Vector2): Rect {
    this._origin = pos.clone().sub(this._size.clone().divScalar(2.0));
    return this;
  }
}

export class Line {
  private _src: Vector2 = null;
  private _trg: Vector2 = null;

  constructor(_src: Vector2, _trg: Vector2) {
    this._src = _src;
    this._trg = _trg;
  }

  public intersect(other: Line): Vector2 {
    const x1 = this._src.x; const y1 = this._src.y;
    const x2 = this._trg.x; const y2 = this._trg.y;
    const x3 = other._src.x; const y3 = other._src.y;
    const x4 = other._trg.x; const y4 = other._trg.y;

    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (denom == 0) {
      return null;
    }
    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
    return new Vector2(x1 + ua * (x2 - x1), y1 + ua * (y2 - y1));
  }
}

export class LineSegment {
  private _src: Vector2 = null
  private _trg: Vector2 = null;

  /**
   * Represents a line segment
   * @constructor
   * @param _src - source point
   * @param _trg - target point
   */
  constructor(_src: Vector2, _trg: Vector2) {
    this._src = _src;
    this._trg = _trg;
  }

  /**
   * Find intersection between this line segment and other one
   * @param other - line segment to find intersection
   * @returns If intersection found, then returns intersection point; otherwise returns null
   */
  public intersect(other: LineSegment): Vector2 {
    const preRes: Vector2 = new Line(this._src, this._trg).intersect(new Line(other._src, other._trg));

    if (preRes) {
      if (this._src.x > this._trg.x) {
        if (this._src.x < preRes.x || this._trg.x > preRes.x)
          return null;
      } else {
        if (this._src.x > preRes.x || this._trg.x < preRes.x)
          return null;
      }

      if (this._src.y > this._trg.y) {
        if (this._src.y < preRes.y || this._trg.y > preRes.y)
          return null;
      } else {
        if (this._src.y > preRes.y || this._trg.y < preRes.y)
          return null;
      }

      return preRes;
    }

    return null;
  }
}