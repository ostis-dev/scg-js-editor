import { ScType } from './scg_types';
import { SCgObject, SCgNode, SCgEdge } from './scg_object';

type UpdateCallback = () => void;

export class SCgScene {
    private _nodes: SCgNode[];
    private _edges: SCgEdge[];

    private _idCounter: number;

    private _requestUpdate: UpdateCallback;

    constructor() {
        this._nodes = [];
        this._edges = [];
        this._idCounter = 1;
        this._requestUpdate = null;
    }

    private nextID() {
        return this._idCounter++;
    }

    public createNode(type: ScType, text: string) : SCgNode {
        const newNode = new SCgNode(this.nextID(), text, type);
        this._nodes.push(newNode);
        return newNode;
    }

    public createEdge(type: ScType, src: SCgObject, trg: SCgObject, text?: string) : SCgEdge {
        const newEdge = new SCgEdge(this.nextID(), text, type, src, trg);
        this._edges.push(newEdge);
        return newEdge;
    }

    get nodes() : SCgNode[] {
        return this._nodes;
    }

    get edges() : SCgEdge[] {
        return this._edges;
    }

    public setUpdateCallback(callback: UpdateCallback) {
        this._requestUpdate = callback;
    }
};