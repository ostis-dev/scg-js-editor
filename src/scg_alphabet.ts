import { D3Selection } from './scg_types';
import { ScType } from './scg_types';
import { SCgEdge } from './scg_object';
import { Vector2 } from './scg_math';

export class SCgAlphabet {
  // unique id of render instance (used to prevent problems with equal svg definitions)
  private _id: string;
  private _svgRender: D3Selection;

  constructor(svgRender: D3Selection, id: string) {
    this._svgRender = svgRender;
    this._id = id;
    this.createDefs();
  }

  private DefName(name: string): string {
    return this._id + '-' + name;
  }

  private DefRef(name: string): string {
    return '#' + this.DefName(name);
  }

  public getTypeName(type: ScType): string {
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

    return result;
  }

  public getDefByType(type: ScType): string {
    return this.DefRef(this.getTypeName(type));
  }

  private createDefs() {
    let defs = this._svgRender.append('svg:defs');

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
    defs.append('svg:circle').attr('id', _Name('scg.node.const.outer')).attr('cx', '0').attr('cy', '0').attr('r', '9');
    defs.append('svg:rect').attr('id', _Name('scg.node.var.outer')).attr('x', '-9').attr('y', '-9').attr('width', '18').attr('height', '18');

    //  ----- define constant nodes -----      
    var g = defs.append('svg:g').attr('id', _Name('scg.node'));
    g.append('svg:circle').attr('cx', '0').attr('cy', '0').attr('r', '3');

    g = defs.append('svg:g').attr('id', _Name('scg.node.const'));
    g.append('svg:use').attr('xlink:href', _Ref('scg.node.const.outer'));

    g = defs.append('svg:g').attr('id', _Name('scg.node.const.tuple'));
    g.append('svg:use').attr('xlink:href', _Ref('scg.node.const.outer'));
    g.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3');

    g = defs.append('svg:g').attr('id', _Name('scg.node.const.struct'));
    g.append('svg:use').attr('xlink:href', _Ref('scg.node.const.outer'));
    g.append('svg:circle').attr('cx', '0').attr('cy', '0').attr('r', '3').attr('stroke', 'none').attr('fill', '#000');

    g = defs.append('svg:g').attr('id', _Name('scg.node.const.role'));
    g.append('svg:use').attr('xlink:href', _Ref('scg.node.const.outer'));
    g.append('svg:line').attr('x1', '0').attr('x2', '0').attr('y1', '-10').attr('y2', '10').attr('stroke-width', '3');
    g.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3');

    g = defs.append('svg:g').attr('id', _Name('scg.node.const.norole'));
    g.append('svg:use').attr('xlink:href', _Ref('scg.node.const.outer'));
    g.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3').attr('transform', 'rotate(45, 0, 0)');
    g.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3').attr('transform', 'rotate(-45, 0, 0)');

    g = defs.append('svg:g').attr('id', _Name('scg.node.const.class'));
    g.append('svg:use').attr('xlink:href', _Ref('scg.node.const.outer'));
    g.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3').attr('transform', 'rotate(45, 0, 0)');
    g.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3').attr('transform', 'rotate(-45, 0, 0)');
    g.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3');

    g = defs.append('svg:g').attr('id', _Name('scg.node.const.abstract'));
    g.append('svg:use').attr('xlink:href', _Ref('scg.node.const.outer'));
    var g2 = g.append('svg:g').attr('stroke-width', '1');
    g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '-6').attr('y2', '-6');
    g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '-3').attr('y2', '-3');
    g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0');
    g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '3').attr('y2', '3');
    g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '6').attr('y2', '6');

    g = defs.append('svg:g').attr('id', _Name('scg.node.const.material'));
    g.append('svg:use').attr('xlink:href', _Ref('scg.node.const.outer'));
    var g2 = g.append('svg:g').attr('stroke-width', '1').attr('transform', 'rotate(-45, 0, 0)');
    g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '-6').attr('y2', '-6');
    g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '-3').attr('y2', '-3');
    g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0');
    g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '3').attr('y2', '3');
    g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '6').attr('y2', '6');

    //  ----- define variable nodes -----
    g = defs.append('svg:g').attr('id', _Name('scg.node.var'));
    g.append('svg:use').attr('xlink:href', _Ref('scg.node.var.outer'));

    g = defs.append('svg:g').attr('id', _Name('scg.node.var.tuple'));
    g.append('svg:use').attr('xlink:href', _Ref('scg.node.var.outer'));
    g.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3');

    g = defs.append('svg:g').attr('id', _Name('scg.node.var.struct'));
    g.append('svg:use').attr('xlink:href', _Ref('scg.node.var.outer'));
    g.append('svg:circle').attr('cx', '0').attr('cy', '0').attr('r', '3').attr('stroke', 'none').attr('fill', '#000');

    g = defs.append('svg:g').attr('id', _Name('scg.node.var.role'));
    g.append('svg:use').attr('xlink:href', _Ref('scg.node.var.outer'));
    g.append('svg:line').attr('x1', '0').attr('x2', '0').attr('y1', '-10').attr('y2', '10').attr('stroke-width', '3');
    g.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3');

    g = defs.append('svg:g').attr('id', _Name('scg.node.var.norole'));
    g.append('svg:use').attr('xlink:href', _Ref('scg.node.var.outer'));
    g.append('svg:line').attr('x1', '-11').attr('x2', '11').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3').attr('transform', 'rotate(45, 0, 0)');
    g.append('svg:line').attr('x1', '-11').attr('x2', '11').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3').attr('transform', 'rotate(-45, 0, 0)');

    g = defs.append('svg:g').attr('id', _Name('scg.node.var.class'));
    g.append('svg:use').attr('xlink:href', _Ref('scg.node.var.outer'));
    g.append('svg:line').attr('x1', '-11').attr('x2', '11').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3').attr('transform', 'rotate(45, 0, 0)');
    g.append('svg:line').attr('x1', '-11').attr('x2', '11').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3').attr('transform', 'rotate(-45, 0, 0)');
    g.append('svg:line').attr('x1', '-9').attr('x2', '9').attr('y1', '0').attr('y2', '0').attr('stroke-width', '3');

    g = defs.append('svg:g').attr('id', _Name('scg.node.var.abstract'));
    g.append('svg:use').attr('xlink:href', _Ref('scg.node.var.outer'));
    var g2 = g.append('svg:g').attr('stroke-width', '1');
    g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '-6').attr('y2', '-6');
    g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '-3').attr('y2', '-3');
    g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '0').attr('y2', '0');
    g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '3').attr('y2', '3');
    g2.append('svg:line').attr('x1', '-10').attr('x2', '10').attr('y1', '6').attr('y2', '6');

    g = defs.append('svg:g').attr('id', _Name('scg.node.var.material'));
    g.append('svg:use').attr('xlink:href', _Ref('scg.node.var.outer'));
    var g2 = g.append('svg:g').attr('stroke-width', '1').attr('transform', 'rotate(-45, 0, 0)');
    g2.append('svg:line').attr('x1', '-5').attr('x2', '5').attr('y1', '-6').attr('y2', '-6');
    g2.append('svg:line').attr('x1', '-8').attr('x2', '8').attr('y1', '-3').attr('y2', '-3');
    g2.append('svg:line').attr('x1', '-11').attr('x2', '11').attr('y1', '0').attr('y2', '0');
    g2.append('svg:line').attr('x1', '-8').attr('x2', '8').attr('y1', '3').attr('y2', '3');
    g2.append('svg:line').attr('x1', '-5').attr('x2', '5').attr('y1', '6').attr('y2', '6');

    g = defs.append('svg:g').attr('id', _Name('scg.link'));
    g.append('svg:rect').attr('fill', '#aaa').attr('stroke-width', '6');

    // define filters

  }

  public updateEdge(edge: SCgEdge, svg: D3Selection) {
    // first of all we need to determine if edge has an end marker
    const hasArrow = edge.type.hasDirection();
    const points: Vector2[] = edge.points;
    const pointsNum: number = points.length;

    // now calculate target and source positions
    var srcPos = points[0].clone();
    var trgPos = points[pointsNum - 1].clone();

    // if we have an arrow, then need to fix end position
    if (hasArrow) {
      const posPrev = points[pointsNum - 2].clone();
      const dv: Vector2 = trgPos.sub(posPrev);
      const len: number = dv.len();
      dv.normalize();
      trgPos = posPrev.add(dv.mulScalar(len - 10));
    }

    // make position path
    let path = 'M' + srcPos.x + ',' + srcPos.y;
    for (let i = 1; i < pointsNum - 1; ++i) {
      path += 'L' + points[i].x + ',' + points[i].y;
    }
    path += 'L' + trgPos.x + ',' + trgPos.y;

    let edgeType: ScType = edge.type;
    const typeValue = edgeType.value;
    if (svg['sc_type'] != typeValue) {
      svg.attr('sc_type', typeValue);

      // remove old
      svg.selectAll('path').remove();
      svg.style('stroke', edgeType.isFuz() ? '#f00' : '#000');

      svg.append('svg:path')
        .attr('d', path)
        .style('stroke', 'none')
        .style('stroke-width', '10px')
        .style('fill', 'none')

      // if it accessory, then append main line
      if (edge.type.isAccess()) {

        let p = svg.append('svg:path')
          .style('fill', 'none')
          .style('stroke-width', '2px')
          .style("marker-end", 'url(' + this.DefRef('end-arrow-access') + ')')
          .attr('d', path);

        if (edgeType.isTemp()) {
          if (edgeType.isVar()) {
            p.style('stroke-dasharray', '2, 2, 2, 2, 2, 2, 2, 14');
          } else if (edgeType.isConst()) {
            p.style('stroke-dasharray', '2, 2');
          }
        } else if (edgeType.hasConstancy()) {
          if (edgeType.isVar()) {
            p.style('stroke-dasharray', '14, 14');
          }
        } else {
          svg.append('svg:path')
            .style('stroke-width', '4px')
            .style('stroke-dasharray', '4, 4')
            .attr('d', path);
        }

        if (edgeType.isNeg()) {
          svg.append('svg:path')
            .style('stroke-dasharray', '0, 20, 2, 6')
            .style('stroke-width', '10px')
            .attr('d', path);
        }
      } else {

        let p = svg.append('svg:path')
          .style('stroke-width', '8px')
          .attr('d', path);

        if (edgeType.hasDirection()) {
          p.style("marker-end", 'url(' + this.DefRef('end-arrow-common') + ')');
        }

        svg.append('svg:path')
          .style('stroke-width', '5px')
          .style('stroke', '#fff')
          .style('fill', 'none')
          .attr('d', path)

        if (edgeType.hasConstancy()) {
          if (edgeType.isVar()) {
            svg.append('svg:path')
              .style('stroke-width', '5px')
              .style('fill', 'none')
              .style('stroke-dasharray', '14, 14')
              .attr('d', path);
          }
        } else {
          svg.append('svg:path')
            .style('stroke-width', '2px')
            .style('fill', 'none')
            .style('stroke-dasharray', '14, 14')
            .attr('d', path);
        }

      }

    } else {
      // update existing
      svg.selectAll('path')
        .attr('d', path);
    }
  }
};