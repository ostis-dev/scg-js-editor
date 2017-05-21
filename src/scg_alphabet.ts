import { D3Selection } from './scg_types';
import { ScType } from './scg_types';

export class SCgAlphabet
{
    // unique id of render instance (used to prevent problems with equal svg definitions)
    private id: string;
    private svgRender: D3Selection;

    constructor(svgRender: D3Selection, id: string) {
        this.svgRender = svgRender;
        this.id = id;
        this.createDefs();
    }

    private DefName(name: string) : string {
        return this.id + '-' + name;
    }

    private DefRef(name: string) : string {
        return '#' + this.DefName(name);
    }

    public getDefByType(type: ScType) : string {
        let result = 'scg';
        if (type.isNode()) result += '.node';

        if (type.isConst()) {
            result += '.const';
        } else if (type.isVar()) {
            result += '.var';
        }

        if (type.isClass()) result += '.class';
        if (type.isAbstract()) result += '.abstract';
        if (type.isMaterial()) result += '.material';
        if (type.isNoRole()) result += '.norole';
        if (type.isRole()) result += '.role';
        if (type.isStruct()) result += '.struct';
        if (type.isTuple()) result += '.tuple';

        return this.DefRef(result);
    }

    private createDefs() {
        let defs = this.svgRender.append('svg:defs');

        function appendText(svgDef: D3Selection) {
            svgDef.append('svg:text')
                .attr('x', '17')
                .attr('y', '21')
                .style('fill', '#00a')
                .style('font-family', 'Arial')
                .style('font-style', 'italic')
                .style('font-weight', 'bold')
                .style('font-size', '14px')
                .style('pointer-events', 'none')
                .style('stroke', 'none');
        }

        const _Name = this.DefName.bind(this);
        const _Ref = this.DefRef.bind(this);

        // edge markers
        defs.append('svg:marker')
            .attr('id', _Name('end-arrow-access')).attr('viewBox', '0 -5 10 10').attr('refX', 0)
            .attr('markerWidth', 5).attr('markerHeight', 10).attr('orient', 'auto')
          .append('svg:path')
            .attr('d', 'M0,-4L10,0L0,4').attr('fill', '#000');
            
        defs.append('svg:marker')
            .attr('id', _Name('end-arrow-common')).attr('viewBox', '0 -5 10 10').attr('refX', 0)
            .attr('markerWidth', 1.5).attr('markerHeight', 6).attr('orient', 'auto')
          .append('svg:path')
            .attr('d', 'M0,-4L10,0L0,4').attr('fill', '#000');
            
        // nodes
        defs.append('svg:circle').attr('id', _Name('scg.node.const.outer')).attr('cx', '0').attr('cy', '0').attr('r', '10');
        defs.append('svg:rect').attr('id', _Name('scg.node.var.outer')).attr('x', '-10').attr('y', '-10').attr('width', '20').attr('height', '20');
            
        defs.append('svg:clip-path')
            .attr('id', _Name('scg.node.const.clip'))
            .append('svg:use')
                .attr('xlink:href', _Ref('scg.node.const.clip'));
        
        defs.append('svg:clip-path')
            .attr('id', _Name('scg.node.var.clip'))
            .append('svg:use')
                .attr('xlink:href', _Ref('scg.node.var.clip'));
                
                
        //  ----- define constant nodes -----      
        var g = defs.append('svg:g').attr('id', _Name('scg.node'));
        g.append('svg:circle').attr('cx', '0').attr('cy', '0').attr('r', '5');
        g.append('svg:text').attr('x', '7').attr('y', '15').attr('class', 'SCgText');
        
        g = defs.append('svg:g').attr('id', _Name('scg.node.const'));
        g.append('svg:use').attr('xlink:href', _Ref('scg.node.const.outer'));
        appendText(g);
        
        g = defs.append('svg:g').attr('id', _Name('scg.node.const.tuple'));
        g.append('svg:use').attr('xlink:href', _Ref('scg.node.const.outer'));
        g.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3');
        appendText(g);
        
        g = defs.append('svg:g').attr('id', _Name('scg.node.const.struct'));
        g.append('svg:use').attr('xlink:href', _Ref('scg.node.const.outer'));
        g.append('svg:circle').attr('cx', '0').attr('cy', '0').attr('r', '3').attr('stroke', 'none').attr('fill', '#000');
        appendText(g);
        
        g = defs.append('svg:g').attr('id', _Name('scg.node.const.role'));
        g.append('svg:use').attr('xlink:href', _Ref('scg.node.const.outer'));
        g.append('svg:line').attr('x1', '0').attr('x2', '0').attr('y1', '-10').attr('y2', '10').attr('stroke-width', '3');
        g.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3');
        appendText(g);
        
        g = defs.append('svg:g').attr('id', _Name('scg.node.const.norole'));
        g.append('svg:use').attr('xlink:href', _Ref('scg.node.const.outer'));
        g.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3').attr('transform', 'rotate(45, 0, 0)');
        g.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3').attr('transform', 'rotate(-45, 0, 0)');
        appendText(g);
        
        g = defs.append('svg:g').attr('id', _Name('scg.node.const.class'));
        g.append('svg:use').attr('xlink:href', _Ref('scg.node.const.outer'));
        g.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3').attr('transform', 'rotate(45, 0, 0)');
        g.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3').attr('transform', 'rotate(-45, 0, 0)');
        g.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3');
        appendText(g);
        
        g = defs.append('svg:g').attr('id', _Name('scg.node.const.abstract'));
        g.append('svg:use').attr('xlink:href', _Ref('scg.node.const.outer'));
        var g2 = g.append('svg:g').attr('stroke-width', '1');
        g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '-6').attr('y2', '-6');
        g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '-3').attr('y2', '-3');
        g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0');
        g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '3').attr('y2', '3');
        g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '6').attr('y2', '6');
        appendText(g);
        
        g = defs.append('svg:g').attr('id', _Name('scg.node.const.material'));
        g.append('svg:use').attr('xlink:href', _Ref('scg.node.const.outer'));
        var g2 = g.append('svg:g').attr('stroke-width', '1').attr('transform', 'rotate(-45, 0, 0)');
        g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '-6').attr('y2', '-6');
        g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '-3').attr('y2', '-3');
        g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0');
        g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '3').attr('y2', '3');
        g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '6').attr('y2', '6');
        appendText(g);
        
        
        //  ----- define variable nodes -----
        g = defs.append('svg:g').attr('id', _Name('scg.node.var'));
        g.append('svg:use').attr('xlink:href', _Ref('scg.node.var.outer'));
        appendText(g);
        
        g = defs.append('svg:g').attr('id', _Name('scg.node.var.tuple'));
        g.append('svg:use').attr('xlink:href', _Ref('scg.node.var.outer'));
        g.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3');
        appendText(g);
        
        g = defs.append('svg:g').attr('id', _Name('scg.node.var.struct'));
        g.append('svg:use').attr('xlink:href', _Ref('scg.node.var.outer'));
        g.append('svg:circle').attr('cx', '0').attr('cy', '0').attr('r', '3').attr('stroke', 'none').attr('fill', '#000');
        appendText(g);
        
        g = defs.append('svg:g').attr('id', _Name('scg.node.var.role'));
        g.append('svg:use').attr('xlink:href', _Ref('scg.node.var.outer'));
        g.append('svg:line').attr('x1', '0').attr('x2', '0').attr('y1', '-10').attr('y2', '10').attr('stroke-width', '3');
        g.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3');
        appendText(g);
        
        g = defs.append('svg:g').attr('id', _Name('scg.node.var.norole'));
        g.append('svg:use').attr('xlink:href', _Ref('scg.node.var.outer'));
        g.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3').attr('transform', 'rotate(45, 0, 0)');
        g.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3').attr('transform', 'rotate(-45, 0, 0)');
        appendText(g);
        
        g = defs.append('svg:g').attr('id', _Name('scg.node.var.class'));
        g.append('svg:use').attr('xlink:href', _Ref('scg.node.var.outer'));
        g.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3').attr('transform', 'rotate(45, 0, 0)');
        g.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3').attr('transform', 'rotate(-45, 0, 0)');
        g.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3');
        appendText(g);
        
        g = defs.append('svg:g').attr('id', _Name('scg.node.var.abstract'));
        g.append('svg:use').attr('xlink:href', _Ref('scg.node.var.outer'));
        var g2 = g.append('svg:g').attr('stroke-width', '1');
        g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '-6').attr('y2', '-6');
        g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '-3').attr('y2', '-3');
        g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0');
        g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '3').attr('y2', '3');
        g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '6').attr('y2', '6');
        appendText(g);

        g = defs.append('svg:g').attr('id', _Name('scg.node.var.material'));
        g.append('svg:use').attr('xlink:href', _Ref('scg.node.var.outer'));
        var g2 = g.append('svg:g').attr('stroke-width', '1').attr('transform', 'rotate(-45, 0, 0)');
        g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '-6').attr('y2', '-6');
        g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '-3').attr('y2', '-3');
        g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0');
        g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '3').attr('y2', '3');
        g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '6').attr('y2', '6');
        appendText(g);
      
        g = defs.append('svg:g').attr('id', _Name('scg.link'));
        g.append('svg:rect').attr('fill', '#aaa').attr('stroke-width', '6');
    }
};