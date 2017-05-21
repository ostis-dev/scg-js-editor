
export class Vector2 {
    public x: number;
    public y: number;

    constructor(_x = 0, _y = 0) {
        this.x = _x;
        this.y = _y;
    }

    public clone() : Vector2 {
        return new Vector2(this.x, this.y);
    }

    public add(other: Vector2) : Vector2 {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    
    public sub(other: Vector2) : Vector2 {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }
    
    public mul(other: Vector2) : Vector2 {
        this.x *= other.x;
        this.y *= other.y;
        return this;
    }
    
    public div(other: Vector2) : Vector2 {
        this.x /= other.x;
        this.y /= other.y;
        return this;
    }
    
    public mulScalar(v: number) : Vector2 {
        this.x *= v;
        this.y *= v;
        return this;
    }
    
    public divScalar(v: number) : Vector2 {
        this.x /= v;
        this.y /= v;
        return this;
    }
    
    public len() : number {
        return Math.sqrt(this.lenSquared());
    }
    
    public lenSquared() : number {
        return this.x * this.x + this.y * this.y;
    }
    
    public dist(other: Vector2) : number {
        return Math.sqrt(this.distSquared(other));
    }
    
    public distSquared(other: Vector2) {
        const x = this.x - other.x;
        const y = this.y - other.y;
        return x * x + y * y;
    }
    
    public normalize() : Vector2 {
        return this.divScalar(this.len());
    }
    
    public dot(other: Vector2) : number {
        return this.x * other.x + this.y * other.y;
    }
};