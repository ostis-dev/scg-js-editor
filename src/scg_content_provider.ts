
import { Vector2 } from './scg_math';

export abstract class SCgContentProvider {
    protected _container: any = null;

    get container() : any {
        return this._container;
    }

    abstract getContentSize() : Vector2;
    abstract setBase64Data(data: string, mime?: string) : void;
    abstract setContainer(container: any) : void;
}

export class SCgContentImageProvider extends SCgContentProvider {

    protected _imageContainer: any = null;
    protected _size: Vector2 = new Vector2(0, 0);

    getContentSize() : Vector2 {
        return this._size;
    }

    setBase64Data(data: string, mime?: string) : void {
        
        this._imageContainer = document.createElement('img');
        this._imageContainer.setAttribute('src', `data:${mime};base64,${data}`);
        this._imageContainer.style.position = 'absolute';
        this._imageContainer.style.display = 'block';
        this._imageContainer.style.visibility = 'hidden';
        document.body.appendChild(this._imageContainer);
        
        const width: number = parseInt(document.defaultView.getComputedStyle(this._imageContainer, "").getPropertyValue("width").replace('px', ''));
        const height: number = parseInt(document.defaultView.getComputedStyle(this._imageContainer, "").getPropertyValue("height").replace('px', ''));
        this._imageContainer.remove();
        this._imageContainer.style.visibility = 'visible';

        this._size.x = width;
        this._size.y = height;
    }

    setContainer(container: any) : void {
        this._container = container;
        this._container.appendChild(this._imageContainer);
    }
}

export class SCgContentHtmlProvider extends SCgContentProvider {

    protected _htmlContainer: any = null;
    protected _size: Vector2 = new Vector2(0, 0);

    getContentSize() : Vector2 {
        return this._size;
    }

    setBase64Data(data: string, mime?: string) : void {
        
        this._htmlContainer = document.createElement('span');
        this._htmlContainer.innerHTML = data.replace('\n', '<br/>');
        this._htmlContainer.style.position = 'absolute';
        this._htmlContainer.style.display = 'block';
        this._htmlContainer.style.visibility = 'visible';
        document.body.appendChild(this._htmlContainer);
        
        const width: number = parseInt(document.defaultView.getComputedStyle(this._htmlContainer, "").getPropertyValue("width").replace('px', ''));
        const height: number = parseInt(document.defaultView.getComputedStyle(this._htmlContainer, "").getPropertyValue("height").replace('px', ''));
        //this._htmlContainer.remove();
        this._htmlContainer.style.visibility = 'visible';

        this._size.x = width + 1;
        this._size.y = height;

        console.log(width, height, data);
    }

    setContainer(container: any) : void {
        this._container = container;
        this._container.appendChild(this._htmlContainer);
    }
}
