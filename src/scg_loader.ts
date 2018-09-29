import { SCgScene } from './scg_scene';

export abstract class SCgLoader {

  abstract load(data: string): SCgScene;
}


