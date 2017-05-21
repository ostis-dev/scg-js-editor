import * as d3 from 'd3';

import { D3Selection } from './scg_types';
import { SCgAlphabet } from './scg_alphabet';
import { SCgScene } from './scg_scene';

function appendContainerStyle(container: D3Selection) {
    container.style("background-color", "#fff")
            .style("cursor", "default")
            .style("-webkit-user-select", "none")
            .style("-moz-user-select", "none")
            .style("-ms-user-select", "none")
            .style("-o-user-select", "none")
            .style("user-select", "none")
}

export class SCgRender
{
    private container: any;
    private alphabet: SCgAlphabet;
    
    /* Hierarchy of containers
     * render
     * |- renderContainer
     *  |- renderNodesContainer
     */
    private render: D3Selection;
    private renderContainer: D3Selection;
    private renderNodesContainer: D3Selection;
    
    private scene: SCgScene;

    constructor(containerID: string, scene: SCgScene)
    {
        this.container = document.getElementById(containerID)
        this.scene = scene;
        //this.scene.setUpdateCallback(this.update.bind(this));
        console.log('test')

        this.render = d3.select('#' + containerID)
            .append('svg:svg')
            .attr("pointer-events", "all")
            .attr("width", "100%")
            .attr("height", "100%")
            .on('mousemove', this.onMouseDown.bind(this))
            .on('mouseup', this.onMouseUp.bind(this))
            .on('mousemove', this.onMouseMove.bind(this))
            .on('dblclick', this.onMouseDoubleClick.bind(this));
        appendContainerStyle(this.render);
        
        this.renderContainer = this.render.append('svg:g');
        appendContainerStyle(this.renderContainer);

        this.alphabet = new SCgAlphabet(this.render, containerID);

        this.renderNodesContainer = this.renderContainer.append('svg:g').selectAll('g');
        console.log(this.renderNodesContainer);
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
    }

    private updateNodes() {
        // add nodes that haven't visual
        this.renderNodesContainer = this.renderNodesContainer.data(this.scene.getNodes(), function(d) { return d.getID(); });
        const self = this;
        var g = this.renderNodesContainer.enter().append('svg:g')
            .attr("transform", function(d) {
                return 'translate(' + d.pos().x + ', ' + d.pos().y + ')';
            })
            .style('fill', function(d) { return d.getType().hasConstancy() ? '#eee' : '#000'; } )
            .style('stroke', '#000')
            .style('stroke-width', '5px');
            
        g.append('svg:use')
            .attr('xlink:href', function(d) {
                return self.alphabet.getDefByType(d.getType());
            });

        
        // eventsWrap(g);
        // appendNodeVisual(g);
        //  g.append('svg:text')
        //     .attr('class', 'SCgText')
        //     .attr('x', function(d) { return d.scale.x / 1.3; })
        //     .attr('y', function(d) { return d.scale.y / 1.3; })
        //     .text(function(d) { return d.text; });
            
        // this.d3_nodes.exit().remove();
    }
};