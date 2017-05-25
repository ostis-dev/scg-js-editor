
import { SCgLink } from './scg_object';
import { Vector2 } from './scg_math';

type ChangedCallback = () => void;

export abstract class SCgContentProvider {
    protected _container: any = null;
    protected _link: SCgLink = null;
    protected _changedCallback: ChangedCallback = null;

    get link() : SCgLink {
        return this._link;
    }

    set link(link: SCgLink) { 
        this._link = link;
    }

    get container() : any {
        return this._container;
    }

    get onChanged() : ChangedCallback {
        return this._changedCallback;
    }

    set onChanged(callback: ChangedCallback) {
        this._changedCallback = callback;
    }

    abstract getContentSize() : Vector2;
    abstract setBase64Data(data: string, mime?: string);
    abstract setContainer(container: any) : void;
}

export abstract class SCgContentCommonProvider extends SCgContentProvider {

    protected _container: any = null;
    protected _containerWrap: any = null;
    private _tag: string = 'span';
    protected _size: Vector2 = new Vector2(0, 0);

    constructor(_tag: string) {
        super();
        this._tag = _tag;
    }

    getContentSize() : Vector2 {
        return this._size;
    }

    setBase64Data(data: string, mime?: string) {
        
        let self: SCgContentCommonProvider = this;
        this._container = document.createElement(this._tag);
        
        function updateSize() {
            self._container.style.position = 'absolute'; 
            self._container.style.display = 'block'; 
            self._container.style.visibility = 'visible'; 
            document.body.appendChild(self._container); 
         
            const width: number = parseInt(document.defaultView.getComputedStyle(self._container, "").getPropertyValue("width").replace('px', ''));
            const height: number = parseInt(document.defaultView.getComputedStyle(self._container, "").getPropertyValue("height").replace('px', ''));

            self._container.style.position = 'static';
            self._container.style.display = 'block';

            self._container.remove();
            self._container.style.visibility = 'visible';

            self._size.x = width + 1;
            self._size.y = height + 1;

            if (self._changedCallback)
                self._changedCallback();
        }

        this._container.addEventListener('load', (function() { 
            self._container.removeEventListener('load', this);
            updateSize();
        }));

        this.setDataImpl(this._container, data, mime);
        updateSize();
    }

    setContainer(container: any) : void {
        this._containerWrap = container;
        this._containerWrap.appendChild(this._container);
    }

    setDataImpl(container: any, data: string, mime?: string) {
        this._container.innerHTML = data;
    }
}

export class SCgContentImageProvider extends SCgContentCommonProvider {

    constructor() {
        super('img');
    }

    setDataImpl(container: any, data: string, mime?: string) {
        this._container.setAttribute('src', `data:${mime};base64,${data}`);
    }
}

export class SCgContentHtmlProvider extends SCgContentCommonProvider {

    constructor() {
        super('span');
    }
}
