import { TouchBarPopover as NativeTouchBarPopover, NativeImage } from 'electron';
import { Maybe, WithIndex } from '../utils';
import { ComponentProps, NativeTouchBarComponent } from './types';
declare class TouchBarPopover implements NativeTouchBarComponent {
    id: string;
    private props;
    private didChildrenChange;
    private instance;
    private builtChildrenInstances;
    private children;
    constructor(props: TouchBarPopoverProps);
    update({ newProps }: {
        newProps: TouchBarPopoverProps;
    }): boolean;
    appendChild(child: NativeTouchBarComponent): void;
    insertBefore(newChild: NativeTouchBarComponent, beforeChild: NativeTouchBarComponent): void;
    removeChild(child: NativeTouchBarComponent): void;
    private getNativeArgs;
    private getItems;
    updateInstance(): boolean;
    createInstance(): Maybe<NativeTouchBarPopoverIndex>;
}
export default TouchBarPopover;
export interface TouchBarPopoverProps extends ComponentProps {
    label?: string;
    icon?: NativeImage;
    hideCloseButton?: boolean;
    children?: NativeTouchBarComponent[];
}
interface NativeTouchBarPopoverIndex extends NativeTouchBarPopover, WithIndex {
}
