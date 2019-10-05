import { BrowserWindow, TouchBar as NativeTouchBar } from 'electron';
import { TouchBarType, Maybe } from '../utils';
import { NativeTouchBarComponent } from './types';
declare class TouchBar {
    id: string;
    private children;
    private didChildrenChange;
    private electronWindow;
    private instance;
    constructor(electronWindow: BrowserWindow, NativeTouchBar: TouchBarType);
    appendChild(child: NativeTouchBarComponent): void;
    insertBefore(newChild: NativeTouchBarComponent, beforeChild: NativeTouchBarComponent): void;
    removeChild(child: NativeTouchBarComponent): void;
    createInitialInstance(): Maybe<NativeTouchBar>;
    updateInstance(): Maybe<NativeTouchBar>;
    createInstance(): Maybe<NativeTouchBar>;
    refreshTree(isReRenderNeeded: boolean): Maybe<NativeTouchBar>;
    update(): boolean;
}
export default TouchBar;
