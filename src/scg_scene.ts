import { ScType } from './scg_types';
import { SCgObject, SCgNode } from './scg_object';

type UpdateCallback = () => void;

export class SCgScene {
    private nodes: SCgNode[];
    private idCounter: number;

    private requestUpdate: UpdateCallback;

    constructor() {
        this.nodes = [];
        this.idCounter = 1;
        this.requestUpdate = null;
    }

    private nextID() {
        return this.idCounter++;
    }

    public createNode(type: ScType, text: string) : SCgNode {
        const newNode = new SCgNode(this.nextID(), text, type);
        this.nodes.push(newNode);
        return newNode;
    }

    public getNodes() : SCgNode[] {
        return this.nodes;
    }

    public setUpdateCallback(callback: UpdateCallback) {
        this.requestUpdate = callback;
    }
};