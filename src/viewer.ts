
import { SCgRender } from './render';
import * as d3 from 'd3';

export class SCgViewer
{
    private container:any;

    private width: number;
    private height: number;

    private render: SCgRender;

    constructor(id) {

        this.container = document.getElementById(id);

        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;

        this.render = new SCgRender(id);
    }
};