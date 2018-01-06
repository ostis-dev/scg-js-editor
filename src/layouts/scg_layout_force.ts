import { SCgLayoutInterface } from '../scg_layout';
import { SCgScene } from '../scg_scene';

import * as d3 from 'd3';
import { SCgNode, SCgEdge, SCgObject, SCgLink, SCgPointObject } from '../scg_object';
import { Vector2 } from '../scg_math';

enum SCgLayoutItem {
  Node = 0,
  Link,
  Edge,
  DotPoint    // point where edge connected to another one
}

interface SCgLayoutNode {
  x: number;
  y: number;
  fx?: number;
  fy?: number;
  ref: SCgNode | SCgLink | SCgEdge;
  type: SCgLayoutItem;
};

interface SCgLayoutEdge {
  source: number; // index of source node
  target: number; // index of target node
  ref: SCgEdge;
  type: SCgLayoutItem;
}

export class SCgLayoutForce implements SCgLayoutInterface {
  _scene: SCgScene = null;
  _nodes: SCgLayoutNode[] = [];
  _edges: SCgLayoutEdge[] = [];

  constructor(scene: SCgScene) {
    this._scene = scene;
  }

  private prepare() : void {
    // create nodes
    const object_ids = {};
    const nodes = this._nodes;
    this._scene.nodes.forEach(function(value: SCgNode) {
      object_ids[value.id] = nodes.length;

      nodes.push({
        x: value.pos.x,
        y: value.pos.y,
        ref: value,
        type: SCgLayoutItem.Node
      });
    });

    this._scene.links.forEach(function(value: SCgLink) {
      object_ids[value.id] = nodes.length;

      nodes.push({
        x: value.pos.x,
        y: value.pos.y,
        ref: value,
        type: SCgLayoutItem.Link
      })
    });

    const edges = this._edges;
    this._scene.edges.forEach(function(value: SCgEdge) {
      value.makeSimple();

      function addDotPoint(edge: SCgEdge) {
        const mid: Vector2 = edge.midPoint();
        nodes.push({
          x: mid.x,
          y: mid.y,
          fx: mid.x,
          fy: mid.y,
          ref: edge,
          type: SCgLayoutItem.DotPoint
        });

        return nodes.length - 1;
      }
      let src = null;
      if (value.src.type.isEdge()) {
        src = addDotPoint(value.src as SCgEdge);
        value.srcRelPos = 0.5;
      }
      let trg = null;
      if (value.trg.type.isEdge()) {
        trg = addDotPoint(value.trg as SCgEdge);
        value.trgRelPos = 0.5;
      }

      edges.push({
        source: src,
        target: trg,
        ref: value,
        type: SCgLayoutItem.Edge
      });
    });

    // configure edge ends
    this._edges.forEach(function(e: SCgLayoutEdge) {
      if (e.source == null) {
        e.source = object_ids[e.ref.src.id];
      }

      if (e.target == null) {
        e.target = object_ids[e.ref.trg.id];
      }
    });
  }

  start() : void {
    this.prepare();
    const viewSize: Vector2 = this._scene.render.viewSize;
    viewSize.divScalar(2.0);

    function dynamicDistance(e: SCgLayoutEdge) : number {
      let baseDist = 100;

      function update(obj: SCgObject) {
        if (obj.type.isLink()) {
          const link: SCgLink = obj as SCgLink;
          baseDist += Math.max(link.bounds.size.x, link.bounds.size.y);
        } else if (obj.type.isEdge()) {
          baseDist -= 20;
        }
      }
      update(e.ref.src);
      update(e.ref.trg);

      return baseDist;
    }

    function dynamicStrength(o: SCgLayoutNode) : number {
      let baseStrength: number = -300;
      if (o.ref.type.isLink()) {
        baseStrength -= 50;
      }
      baseStrength = -Math.max(o.ref.adjacentCount * 1, 100);

      return baseStrength;
    }

    const force = d3.forceSimulation(this._nodes)
      .force('charge', d3.forceManyBody().strength(dynamicStrength))
      .force('link', d3.forceLink(this._edges).distance(dynamicDistance))
      .force('center', d3.forceCenter(viewSize.x, viewSize.y))
      .on('tick', this.onTick.bind(this))
      .restart()
  }

  stop() : void {

  }

  private onTick() : void {
    // update nodes
    this._nodes.forEach(function (node: SCgLayoutNode) {
      switch (node.type) {
        case SCgLayoutItem.Node:
        case SCgLayoutItem.Link:
          const obj: SCgPointObject = node.ref as SCgPointObject;
          obj.pos = new Vector2(node.x, node.y);
          break;

        case SCgLayoutItem.DotPoint:
          const midPoint: Vector2 = (node.ref as SCgEdge).midPoint();
          node.fx = midPoint.x;
          node.fy = midPoint.y;
          node.x = midPoint.x;
          node.y = midPoint.y;
          break;
      }
    });

    this._scene.viewUpdate();
  }
}