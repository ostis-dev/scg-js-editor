import { SCgScene } from './scg_scene';
import { ScType, ScAddr } from './scg_types';
import { SCgObject } from './scg_object';

export interface SCgObjectInfo {
  addr: ScAddr,
  type: ScType,
  src?: ScAddr,
  trg?: ScAddr,
  alias?: string,
  content?: string,
};

export class SCgStruct {

  private _scene: SCgScene = null;
  private _queue: SCgObjectInfo[] = [];

  constructor() {
  }

  public set scene(_scene: SCgScene) {
    this._scene = _scene;
  }

  public AddObject(obj: SCgObjectInfo): void {
    this._queue.push(obj);
  }

  public Update() {
    // construct everything that is possible
    let queue = this._queue;
    queue.reverse();
    
    this._queue = [];
    let added = false;
    do {
      added = false;
      const queue2 = [];

      while (queue.length > 0) {
        const obj = queue.pop();
        // try to find objects
        const scgObj: SCgObject = this._scene.objectByAddr(obj.addr);
        if (scgObj) {
          continue;
        }

        if (obj.type.isNode()) {
          this._scene.createNode(obj.type, obj.alias, obj.addr);
          added = true;
        } else if (obj.type.isLink()) {
          this._scene.createLink(obj.type, obj.alias, obj.addr);
          added = true;
          // TODO: set content
        } else if (obj.type.isEdge()) {
          // get source and target elements
          const src: SCgObject = this._scene.objectByAddr(obj.src);
          const trg: SCgObject = this._scene.objectByAddr(obj.trg);

          if (src && trg) {
            this._scene.createEdge(obj.type, src, trg, obj.alias, obj.addr);
            added = true;
          } else {
            queue2.push(obj);
          }
        }
      }

      queue = queue2;
    } while (added);
  }
}