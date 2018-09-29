
import { SCgRender } from './scg_render';
import { SCgScene } from './scg_scene';
import { ScType } from './scg_types';
import { Vector2 } from './scg_math';
import { SCgLoaderGWF } from './scg_loader_gwf';

import * as d3 from 'd3';
import { SCgLayoutForce } from './layouts/scg_layout_force';
import { SCgStruct } from './scg_struct';

export class SCgViewer {
  private _container: any;

  private _width: number;
  private _height: number;

  private _render: SCgRender;
  private _scene: SCgScene;

  constructor(id) {
    this._container = document.getElementById(id);

    this._width = this._container.clientWidth;
    this._height = this._container.clientHeight;

    this._scene = new SCgScene();
    this._render = new SCgRender(id, this._scene);
    this._scene.render = this._render;
  }

  loadFromData(data: string, format = 'gwf') {
    if (format === 'gwf') {
      const loader = new SCgLoaderGWF();
      this._scene = loader.load(data);
      this._render.scene = this._scene;
      this._scene.render = this._render;
    } else {
      throw "Unsupported format " + format;
    }
  }

  getStruct() : SCgStruct {
    return this._scene.struct;
  }

  fitSizeToContent() {
    this._render.fitSizeToContent();
  }

  layout() : void {
    const layout: SCgLayoutForce = new SCgLayoutForce(this._scene);
    layout.start();
  }

  public _testShowAlphabet() {
    /// test
    let testNodes = [
      ScType.Node,
      ScType.NodeConst,
      ScType.NodeConstAbstract,
      ScType.NodeConstClass,
      ScType.NodeConstMaterial,
      ScType.NodeConstNoRole,
      ScType.NodeConstRole,
      ScType.NodeConstStruct,
      ScType.NodeConstTuple,
      ScType.NodeVar,
      ScType.NodeVarAbstract,
      ScType.NodeVarClass,
      ScType.NodeVarMaterial,
      ScType.NodeVarNoRole,
      ScType.NodeVarRole,
      ScType.NodeVarStruct,
      ScType.NodeVarTuple
    ];
    for (let i = 0; i < testNodes.length; ++i) {
      let node = this._scene.createNode(testNodes[i], this._render.alphabet.getTypeName(testNodes[i]));
      node.pos = new Vector2(25, 25 + i * 40);
    }

    // edges
    let testEdges = [
      ScType.EdgeAccess,
      ScType.EdgeDCommon,
      ScType.EdgeDCommonConst,
      ScType.EdgeDCommonVar,
      ScType.EdgeUCommon,
      ScType.EdgeUCommonConst,
      ScType.EdgeUCommonVar,
      ScType.EdgeAccessConstPosPerm,
      ScType.EdgeAccessConstPosTemp,
      ScType.EdgeAccessConstNegPerm,
      ScType.EdgeAccessConstNegTemp,
      ScType.EdgeAccessConstFuzPerm,
      ScType.EdgeAccessConstFuzTemp,
      ScType.EdgeAccessVarPosPerm,
      ScType.EdgeAccessVarPosTemp,
      ScType.EdgeAccessVarNegPerm,
      ScType.EdgeAccessVarNegTemp,
      ScType.EdgeAccessVarFuzPerm,
      ScType.EdgeAccessVarFuzTemp
    ];
    for (let i = 0; i < testEdges.length; ++i) {
      let src = this._scene.createNode(ScType.Node, "");
      let trg = this._scene.createNode(ScType.Node, "");

      src.pos = new Vector2(325, 25 + i * 35);
      trg.pos = new Vector2(525, 25 + i * 35);

      let edge = this._scene.createEdge(testEdges[i], src, trg);
    }

    this._render.update();
  }
};