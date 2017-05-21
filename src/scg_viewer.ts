
import { SCgRender } from './scg_render';
import { SCgScene } from './scg_scene';
import { ScType } from './scg_types';
import { Vector2 } from './scg_math';

import * as d3 from 'd3';

export class SCgViewer
{
    private container:any;

    private width: number;
    private height: number;

    private render: SCgRender;
    private scene: SCgScene;

    constructor(id) {
        this.container = document.getElementById(id);

        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;

        this.scene = new SCgScene();
        this.render = new SCgRender(id, this.scene);
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
            let node = this.scene.createNode(testNodes[i], "node_" + i);
            node.pos(new Vector2(100 + i * 50, 100));
        }

        this.render.update();
    }
};