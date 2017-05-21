import * as d3 from 'd3';

import { D3Selection } from './types';
import { SCgAlphabet } from './alphabet';

export class SCgRender
{
    private container: any;
    private alphabet: SCgAlphabet;
    private render: D3Selection;

    constructor(containerID: string)
    {
        this.container = document.getElementById(containerID)

        this.render = d3.select('#' + containerID)
            .append('svg:svg')
            .attr("pointer-events", "all")
            .attr("width", "100%")
            .attr("height", "100%")
            .style("background-color", "#fff")
            .style("cursor", "default")
            .style("-webkit-user-select", "none")
            .style("-moz-user-select", "none")
            .style("-ms-user-select", "none")
            .style("-o-user-select", "none")
            .style("user-select", "none")
            .on('mousemove', this.onMouseDown.bind(this))
            .on('mouseup', this.onMouseUp.bind(this))
            .on('mousemove', this.onMouseMove.bind(this))
            .on('dblclick', this.onMouseDoubleClick.bind(this));
        
        this.alphabet = new SCgAlphabet(this.render, containerID);
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
};