import { TouchBarGroup as NativeTouchBarGroup } from 'electron';
import { Maybe } from '../utils';
import { ComponentProps, NativeTouchBarComponent } from './types';
declare class TouchBarGroup implements NativeTouchBarComponent {
    id: string;
    private didChildrenChange;
    private instance;
    private children;
    constructor();
    update(): boolean;
    appendChild(child: NativeTouchBarComponent): void;
    insertBefore(newChild: NativeTouchBarComponent, beforeChild: NativeTouchBarComponent): void;
    removeChild(child: NativeTouchBarComponent): void;
    updateInstance(): boolean;
    createInstance(): Maybe<NativeTouchBarGroup>;
}
export default TouchBarGroup;
export interface TouchBarGroupProps extends ComponentProps {
    children?: NativeTouchBarComponent[];
}
