import { ScType } from './scg_types';
import { SCgRender } from './scg_render';
import { SCgObject, SCgNode, SCgEdge, SCgLink } from './scg_object';

type UpdateCallback = () => void;

let idCounter: number = 0;

export class SCgScene {
  private _nodes: SCgNode[] = [];
  private _edges: SCgEdge[] = [];
  private _links: SCgLink[] = [];

  private _requestUpdate: number = 0;
  private _requestUpdateCallback: UpdateCallback = null;

  constructor() {
  }

  public onDestroy() {
  }

  private nextID() {
    return idCounter++;
  }

  public createNode(type: ScType, text: string): SCgNode {
    const newNode = new SCgNode(this.nextID(), text, type, this);
    this._nodes.push(newNode);
    return newNode;
  }

  public createEdge(type: ScType, src: SCgObject, trg: SCgObject, text?: string): SCgEdge {
    const newEdge = new SCgEdge(this.nextID(), text, type, src, trg, this);
    this._edges.push(newEdge);
    return newEdge;
  }

  public createLink(type = ScType.LinkConst, text?: string): SCgLink {
    const newLink = new SCgLink(this.nextID(), text, type, this);
    this._links.push(newLink);
    return newLink;
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

  public linkChanged(): void {
    if (this._requestUpdateCallback)
      this._requestUpdateCallback();
    this._requestUpdate--;
  }

  set updateCallback(callback: UpdateCallback) {
    this._requestUpdateCallback = callback;
  }
};