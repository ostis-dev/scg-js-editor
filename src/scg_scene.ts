import { ScType } from './scg_types';
import { SCgRender } from './scg_render';
import { SCgObject, SCgNode, SCgEdge, SCgLink } from './scg_object';
import { SCgStruct } from './scg_struct';
import { ScAddr } from '@ostis/sc-core';

type UpdateCallback = () => void;

let idCounter: number = 0;

export class SCgScene {
  private _nodes: SCgNode[] = [];
  private _edges: SCgEdge[] = [];
  private _links: SCgLink[] = [];
  private _render: SCgRender = null;
  private _objectsByAddr: Map<number, SCgObject> = new Map<number, SCgObject>();

  private _requestUpdate: number = 0;
  private _requestUpdateCallback: UpdateCallback = null;

  constructor() {
  }

  public onDestroy() {
  }

  private nextID() {
    return idCounter++;
  }

  public createNode(type: ScType, text: string, addr?: ScAddr): SCgNode {
    const newNode = new SCgNode(this.nextID(), text, type, this, addr);
    this._nodes.push(newNode);

    if (addr)
      this._objectsByAddr.set(addr.value, newNode);

    return newNode;
  }

  public createEdge(type: ScType, src: SCgObject, trg: SCgObject, text?: string, addr?: ScAddr): SCgEdge {
    const newEdge = new SCgEdge(this.nextID(), text, type, src, trg, this, addr);
    this._edges.push(newEdge);

    if (addr)
      this._objectsByAddr.set(addr.value, newEdge);

    return newEdge;
  }

  public createLink(type = ScType.LinkConst, text?: string, addr?: ScAddr): SCgLink {
    const newLink = new SCgLink(this.nextID(), text, type, this, addr);
    this._links.push(newLink);

    if (addr)
      this._objectsByAddr.set(addr.value, newLink);
      
    return newLink;
  }

  get render(): SCgRender {
    return this._render;
  }

  set render(r: SCgRender) {
    this._render = r;
  }

  get nodes(): SCgNode[] {
    return this._nodes;
  }

  get edges(): SCgEdge[] {
    return this._edges;
  }

  get links(): SCgLink[] {
    return this._links;
  }

  public objectByAddr(addr: ScAddr) : SCgObject {
    return this._objectsByAddr.get(addr.value);
  }

  public viewUpdate(): void {
    if (this._requestUpdateCallback)
      this._requestUpdateCallback();
    this._requestUpdate--;
  }

  set updateCallback(callback: UpdateCallback) {
    this._requestUpdateCallback = callback;
  }
};