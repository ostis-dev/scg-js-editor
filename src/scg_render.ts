import * as d3 from 'd3';

import { D3Selection } from './scg_types';
import { SCgAlphabet } from './scg_alphabet';
import { SCgScene } from './scg_scene';
import { SCgObject, SCgEdge, SCgNode, SCgLink } from './scg_object';
import { Vector2, Rect } from './scg_math';

function applyContainerStyle(container: D3Selection) {
  container.style("background-color", "#fff")
    .style("cursor", "default")
    .style("-webkit-user-select", "none")
    .style("-moz-user-select", "none")
    .style("-ms-user-select", "none")
    .style("-o-user-select", "none")
    .style("user-select", "none")
}

function applyTextStyle(text: D3Selection) {
  text
    .style('fill', '#4B7CD3')
    .style('font-family', "Arial")
    .style('font-style', 'italic')
    .style('font-weight', 'bold')
    .style('font-size', '14px')
    .style('pointer-events', 'none')
    .style('stroke', 'none')
}

enum SizeMode {
  Normal,
  FitToContent
};

export class SCgRender {
  private _container: any;
  private _alphabet: SCgAlphabet;

  /* Hierarchy of containers
   * render
   * |- renderContainer
   *  |- renderNodesContainer
   *  |- renderEdgesContainer
   */
  private _render: D3Selection;
  private _renderContainer: D3Selection;
  private _renderNodesContainer: D3Selection;
  private _renderEdgesContainer: D3Selection;
  private _renderLinksContainer: D3Selection;

  private _sizeMode: SizeMode = SizeMode.Normal;

  private _scene: SCgScene;

  constructor(containerID: string, scene: SCgScene) {
    this._container = document.getElementById(containerID)
    //this.scene.setUpdateCallback(this.update.bind(this));

    this._render = d3.select('#' + containerID)
      .append('svg:svg')
      .attr("pointer-events", "all")
      .attr("width", "100%")
      .attr("height", "100%")
      .on('mousemove', this.onMouseDown.bind(this))
      .on('mouseup', this.onMouseUp.bind(this))
      .on('mousemove', this.onMouseMove.bind(this))
      .on('dblclick', this.onMouseDoubleClick.bind(this));
    applyContainerStyle(this._render);

    this._renderContainer = this._render.append('svg:g');
    applyContainerStyle(this._renderContainer);

    this._alphabet = new SCgAlphabet(this._render, containerID);

    this.scene = scene;
  }

  get alphabet(): SCgAlphabet {
    return this._alphabet;
  }

  get scene(): SCgScene {
    return this._scene;
  }

  set scene(newScene: SCgScene) {
    if (this._scene)
      this._scene.onDestroy();

    this._scene = newScene;
    this._scene.updateCallback = this.update.bind(this);
    this.clear();
    this.update();
  }

  private getContentBounds(): Rect {
    const bbox = this._renderContainer.node().getBBox();
    return new Rect(new Vector2(bbox.x, bbox.y), new Vector2(bbox.width, bbox.height));
  }

  public get viewSize(): Vector2 {
    const rc = this._render.node().getBoundingClientRect();
    return new Vector2(rc.width, rc.height);
  }

  fitSizeToContent() {
    this._sizeMode = SizeMode.FitToContent;
    this.update();
  }

  private onMouseMove() {
    const pos = d3.mouse(this._container);
  }

  private onMouseDown() {
    const pos = d3.mouse(this._container);
  }

  private onMouseUp() {
    const pos = d3.mouse(this._container);
  }

  private onMouseDoubleClick() {
    const pos = d3.mouse(this._container);
  }

  public update() {
    this.updateNodes();
    this.updateLinks();
    this.updateEdges();

    if (this._sizeMode === SizeMode.FitToContent) {
      const cr: Rect = this.getContentBounds().adjust(10);

      this._container.style.width = cr.size.x + 'px';
      this._container.style.height = cr.size.y + 'px';

      this._renderContainer.attr('transform', `translate(${-cr.origin.x}, ${-cr.origin.y})`);
    }
  }

  public clear() {
    this._renderContainer.selectAll('g').remove();
    this._renderEdgesContainer = this._renderContainer.append('svg:g').attr('type', 'edges').selectAll('path');
    this._renderNodesContainer = this._renderContainer.append('svg:g').attr('type', 'nodes').selectAll('g');
    this._renderLinksContainer = this._renderContainer.append('svg:g').attr('type', 'links').selectAll('g');
  }

  private updateNodes() {
    // add nodes that haven't visual
    const self = this;
    this._renderNodesContainer = this._renderNodesContainer
      .data(this._scene.nodes, d => d.id);

    this._renderNodesContainer.exit().remove();

    const nodesEnter = this._renderNodesContainer.enter().append('svg:g')
      .style('fill', function (d) { return d.type.hasConstancy() ? '#eee' : '#000'; })
      .style('stroke', '#000')
      .style('stroke-width', '5px');

    nodesEnter.append('svg:use')
      .attr('xlink:href', function (d) {
        return self._alphabet.getDefByType(d.type);
      });

    const text = nodesEnter.append('svg:text')
      .attr('x', 15)
      .attr('y', 15)
      .text(function (d) { return d.text; });
    applyTextStyle(text);

    this._renderNodesContainer = this._renderNodesContainer.merge(nodesEnter)
      .attr("transform", function (d) {
        return 'translate(' + d.pos.x + ', ' + d.pos.y + ')';
      })
      .each(d => d.viewUpdated());
  }

  private updateEdges() {
    this._renderEdgesContainer = this._renderEdgesContainer
      .data(this._scene.edges, function (d) { return d.id; });

    this._renderEdgesContainer.exit().remove();

    // add edges that haven't visual
    const edgesEnter  = this._renderEdgesContainer.enter().append('svg:g')
      .attr('pointer-events', 'visibleStroke')
      .style('fill', 'none')
      .style('stroke-linejoin', 'round')

    const self = this;
    this._renderEdgesContainer = this._renderEdgesContainer.merge(edgesEnter)
      .each(function (d) {
        d.update();
        if (!d.isNeedViewUpdate())
          return; // do nothing
        const d3_edge = d3.select(this);
        self._alphabet.updateEdge(d, d3_edge);
        d.viewUpdated();
      });
  }

  private updateLinks() {
    // add links that haven't visual
    const self = this;
    this._renderLinksContainer = this._renderLinksContainer
      .data(this._scene.links, function (d) { return d.id; });

    this._renderLinksContainer.exit().remove();

    const linksEnter  = this._renderLinksContainer.enter().append('svg:g')
      .style('fill', '#eee')
      .style('stroke', '#000')
      .style('stroke-width', '3px');

    linksEnter
      .append('svg:rect');

    linksEnter
      .append('svg:foreignObject')
      .attr('transform', `translate(4.5, 4.5)`)
      .each(function (d: SCgLink) {
        d.setContainer(this);
      });

    const text = linksEnter.append('svg:text')
      .attr('x', function (d) { return 15; })
      .attr('y', function (d) { return 15; })
      .text(function (d) { return d.text; });
    applyTextStyle(text);

    this._renderLinksContainer = this._renderLinksContainer.merge(linksEnter)
      .each(function (d: SCgLink) {
        d.update();
        if (!d.isNeedViewUpdate())
          return; // do nothing

        const d3_link = d3.select(this);
        const bounds: Rect = d.bounds.clone().adjust(4);

        d3_link.attr("transform", `translate(${bounds.origin.x}, ${bounds.origin.y})`);

        d3_link.select('rect')
          .attr('width', `${bounds.size.x}px`)
          .attr('height', `${bounds.size.y}px`);

        d3_link.select('foreignObject')
          .attr('width', function (l: SCgLink) { return l.bounds.size.x; })
          .attr('height', function (l: SCgLink) { return l.bounds.size.y; })
          .each(function (d: SCgLink) {
            d.setContainer(this);
          });

        d.viewUpdated();
      });
  }
};