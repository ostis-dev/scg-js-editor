import * as d3 from 'd3';

import { D3Selection } from './scg_types';
import { SCgAlphabet } from './scg_alphabet';
import { SCgScene } from './scg_scene';
import { SCgObject, SCgEdge, SCgNode } from './scg_object';

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

export class SCgRender
{
    private container: any;
    private alphabet: SCgAlphabet;
    
    /* Hierarchy of containers
     * render
     * |- renderContainer
     *  |- renderNodesContainer
     *  |- renderEdgesContainer
     */
    private render: D3Selection;
    private renderContainer: D3Selection;
    private renderNodesContainer: D3Selection;
    private renderEdgesContainer: D3Selection;
    
    private scene: SCgScene;

    constructor(containerID: string, scene: SCgScene)
    {
        this.container = document.getElementById(containerID)
        this.scene = scene;
        //this.scene.setUpdateCallback(this.update.bind(this));

        this.render = d3.select('#' + containerID)
            .append('svg:svg')
            .attr("pointer-events", "all")
            .attr("width", "100%")
            .attr("height", "100%")
            .on('mousemove', this.onMouseDown.bind(this))
            .on('mouseup', this.onMouseUp.bind(this))
            .on('mousemove', this.onMouseMove.bind(this))
            .on('dblclick', this.onMouseDoubleClick.bind(this));
        applyContainerStyle(this.render);
        
        this.renderContainer = this.render.append('svg:g');
        applyContainerStyle(this.renderContainer);

        this.alphabet = new SCgAlphabet(this.render, containerID);

        this.renderNodesContainer = this.renderContainer.append('svg:g').attr('type', 'nodes').selectAll('g');
        this.renderEdgesContainer = this.renderContainer.append('svg:g').attr('type', 'edges').selectAll('path');
    }

    private onMouseMove() {
        const pos = d3.mouse(this.container);
    }

    private onMouseDown() {
        const pos = d3.mouse(this.container);
    }

    private onMouseUp() {
        const pos = d3.mouse(this.container);
    }

    private onMouseDoubleClick() {
        const pos = d3.mouse(this.container);
    }

    public update() {
        this.updateNodes();
        this.updateEdges();
    }

    private updateNodes() {
        // add nodes that haven't visual
        const self = this;
        this.renderNodesContainer = this.renderNodesContainer
            .data(this.scene.nodes, function(d) { return d.id; })
            .enter();

        let g = this.renderNodesContainer.append('svg:g')
                .attr("transform", function(d) {
                    return 'translate(' + d.pos.x + ', ' + d.pos.y + ')';
                })
                .style('fill', function(d) { return d.type.hasConstancy() ? '#eee' : '#000'; } )
                .style('stroke', '#000')
                .style('stroke-width', '5px');
            
        g.append('svg:use')
            .attr('xlink:href', function(d) {
                return self.alphabet.getDefByType(d.type);
            });

        const text = g.append('svg:text')
            .attr('x', function(d) { return 15; })
            .attr('y', function(d) { return 15; })
            .text(function(d) { return d.text; });
        applyTextStyle(text);

        this.renderNodesContainer.exit().remove();

        this.renderNodesContainer.each(function(d) {
             console.log(d);
        });
    }

    private updateEdges() {
        this.renderEdgesContainer = this.renderEdgesContainer.data(this.scene.edges, function(d) { return d.id; });
        
        // add edges that haven't visual
        let g = this.renderEdgesContainer.enter().append('svg:g')
            .attr('pointer-events', 'visibleStroke')
            .style('fill', 'none')
            .style('stroke-linejoin', 'round')
        

        const self = this;
        g.each(function(d) {
            d.update();
            if (!d.isNeedViewUpdate())
                return; // do nothing
            const d3_edge = d3.select(this);
            self.alphabet.updateEdge(d, d3_edge);
            d.viewUpdated();
        })

        this.renderEdgesContainer.exit().remove();
    }
};