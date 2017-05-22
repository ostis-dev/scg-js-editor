import { SCgLoader } from './scg_loader';
import { SCgScene } from './scg_scene';
import { SCgObject, SCgNode, SCgEdge } from './scg_object';
import { ScType } from './scg_types';
import { Vector2 } from './scg_math';

export class SCgLoaderGWF extends SCgLoader {

    static readonly typeConv = {
        'node/-/not_define': ScType.Node,
        'node/const/general_node': ScType.NodeConst,
        'node/const/general': ScType.NodeConst,
        'node/var/general_node': ScType.NodeVar,
        'node/const/var': ScType.NodeVar,
        'node/const/relation': ScType.NodeConstNoRole,
        'node/var/relation': ScType.NodeVarNoRole,
        'node/const/attribute': ScType.NodeConstRole,
        'node/var/attribute': ScType.NodeVarRole,
        'node/const/nopredmet': ScType.NodeConstStruct,
        'node/var/nopredmet': ScType.NodeVarStruct,
        'node/const/predmet': ScType.NodeConstAbstract,
        'node/var/predmet': ScType.NodeVarAbstract,
        'node/const/group': ScType.NodeConstClass,
        'node/var/group': ScType.NodeVarClass,
        'node/const/asymmetry': ScType.NodeConstTuple,
        'node/const/symmetry': ScType.NodeConstTuple,
        'node/const/tuple': ScType.NodeConstTuple,
        'node/var/asymmetry': ScType.NodeVarTuple,
        'node/var/symmetry': ScType.NodeVarTuple,
        'node/var/tuple': ScType.NodeVarTuple,
        'node/const/material': ScType.NodeConstMaterial,
        'node/var/material': ScType.NodeVarMaterial,

        'arc/-/-': ScType.EdgeAccess,
        'pair/orient': ScType.EdgeDCommon,
        'pair/noorient': ScType.EdgeUCommon,
        'pair/const/synonym': ScType.EdgeUCommonConst,
        'pair/const/noorient': ScType.EdgeUCommonConst,
        'pair/var/synonym': ScType.EdgeUCommonVar,
        'pair/var/noorient': ScType.EdgeUCommonVar,
        'pair/const/orient': ScType.EdgeDCommonConst,
        'pair/var/orient': ScType.EdgeDCommonVar,
        'arc/const/fuz': ScType.EdgeAccessConstFuzPerm,
        'arc/var/fuz': ScType.EdgeAccessVarFuzPerm,
        'arc/const/fuz/temp': ScType.EdgeAccessConstFuzTemp,
        'arc/var/fuz/temp': ScType.EdgeAccessVarFuzTemp,
        'arc/const/neg': ScType.EdgeAccessConstNegPerm,
        'arc/var/neg': ScType.EdgeAccessVarNegPerm,
        'arc/const/neg/temp': ScType.EdgeAccessConstNegTemp,
        'arc/var/neg/temp': ScType.EdgeAccessVarNegTemp,
        'arc/const/pos': ScType.EdgeAccessConstPosPerm,
        'arc/var/pos': ScType.EdgeAccessVarPosPerm,
        'arc/const/pos/temp': ScType.EdgeAccessConstPosTemp,
        'arc/var/pos/temp': ScType.EdgeAccessVarPosTemp
    };

    private resolveNodeType(typeName: string) : ScType {
        const res = SCgLoaderGWF.typeConv[typeName];
        if (res)
            return res;
        return ScType.Node;
    }

    private resolveEdgeType(typeName: string) : ScType {
        const res = SCgLoaderGWF.typeConv[typeName];
        if (res)
            return res;
        return ScType.EdgeUCommon;
    }

    public load(data: string) : SCgScene {
        let scene: SCgScene = new SCgScene();

        const parser: DOMParser = new DOMParser();
        const gwf:Document = parser.parseFromString(data, "text/xml");
        const section: Element = gwf.getElementsByTagName('staticSector')[0];
        
        let parsedElements: {[id: string]: SCgObject} = {};

        // get all nodes and parse them
        const xmlNodes = section.getElementsByTagName('node');
        for (let i = 0; i < xmlNodes.length; ++i) {
            const xmlNodeItem = xmlNodes[i];
            
            const xmlID: string = xmlNodeItem.attributes['id'].value;
            if (parsedElements[xmlID])
                throw "Element with ID " + xmlID + " already parsed";
            
            const nodeType = this.resolveNodeType(xmlNodeItem.attributes['type'].value);

            const xmlIdtf = xmlNodeItem.attributes['idtf'].value;

            const x = parseInt(xmlNodeItem.attributes['x'].value);
            const y = parseInt(xmlNodeItem.attributes['y'].value);

            // create node
            let node: SCgNode = scene.createNode(nodeType, xmlIdtf);
            node.pos = new Vector2(x, y);

            parsedElements[xmlID] = node;
        }

        // collect edges for parsing
        let edgeQueue: Element[] = [];
        const xmlEdges = section.getElementsByTagName('arc');
        for (let i = 0; i < xmlEdges.length; ++i)
            edgeQueue.push(xmlEdges[i]);
        const xmlPairs = section.getElementsByTagName('pair');
        for (let i = 0; i < xmlPairs.length; ++i)
            edgeQueue.push(xmlPairs[i]);

        // now parse edges while all of them wouldn't be parsed
        let anyParsed: boolean = false;
        do
        {
            anyParsed = false;
            let queueCopy: Element[] = [];
            while (edgeQueue.length > 0) {
                const el: Element = edgeQueue.pop();

                const id_b: string = el.attributes['id_b'].value;
                const id_e: string = el.attributes['id_e'].value;

                const src: SCgObject = parsedElements[id_b];
                const trg: SCgObject = parsedElements[id_e];
                if (!src || !trg) {
                    queueCopy.push(el);
                    continue;
                }

                // parse and create edge
               const xmlID: string = el.attributes['id'].value;
               const xmlIdtf: string = el.attributes['idtf'].value;
               const edgeType: ScType = this.resolveEdgeType(el.attributes['type'].value);

               let edge: SCgEdge = scene.createEdge(edgeType, src, trg, xmlIdtf);
               parsedElements[xmlID] = edge;

               // parse edge source/target relative positions
               edge.srcRelPos = parseFloat(el.attributes['dotBBalance'].value);
               edge.trgRelPos = parseFloat(el.attributes['dotEBalance'].value);

               anyParsed = true;
            }

            edgeQueue = queueCopy;

        } while (anyParsed && edgeQueue.length > 0);

        if (edgeQueue.length > 0) {
            console.log(parsedElements);
            console.log(edgeQueue);
            throw "Unable to load " + edgeQueue.length + " edges";
        }

        return scene;
    }
}