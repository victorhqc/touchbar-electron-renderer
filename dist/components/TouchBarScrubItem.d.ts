import { ScrubberItem, NativeImage } from 'electron';
import TouchBarText from './TouchBarText';
import { ComponentProps, InternalTouchBarComponent } from './types';
import { WithIndex } from '../utils';
declare class TouchBarScrubItem implements InternalTouchBarComponent {
    id: string;
    private props;
    private instance;
    private children;
    constructor({ children, ...props }: TouchBarScrubItemProps);
    appendChild(child: TouchBarText): void;
    insertBefore(child: TouchBarText): void;
    removeChild(): void;
    update({ newProps }: {
        newProps: TouchBarScrubItemProps;
    }): boolean;
    private getNativeArgs;
    private updateInstance;
    createInstance(): ScrubberItemIndex;
}
export default TouchBarScrubItem;
export interface TouchBarScrubItemProps extends ComponentProps {
    children?: TouchBarText;
    icon?: NativeImage;
}
interface ScrubberItemIndex extends ScrubberItem, WithIndex {
}
