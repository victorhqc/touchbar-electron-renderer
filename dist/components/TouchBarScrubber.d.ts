import { TouchBarScrubber as NativeTouchBarScrubber } from 'electron';
import { Maybe, WithIndex } from '../utils';
import TouchBarScrubItem from './TouchBarScrubItem';
import { ComponentProps, NativeTouchBarComponent } from './types';
declare class TouchBarScrubber implements NativeTouchBarComponent {
    id: string;
    private props;
    private didChildrenChange;
    private instance;
    private builtChildrenInstances;
    private children;
    constructor(props: TouchBarScrubberProps);
    update({ newProps }: {
        newProps: TouchBarScrubberProps;
    }): boolean;
    appendChild(child: TouchBarScrubItem): void;
    insertBefore(newChild: TouchBarScrubItem, beforeChild: TouchBarScrubItem): void;
    removeChild(child: TouchBarScrubItem): void;
    private getNativeArgs;
    private updateInstance;
    createInstance(): Maybe<NativeTouchBarScrubberIndex>;
}
export default TouchBarScrubber;
export interface TouchBarScrubberProps extends ComponentProps {
    children?: TouchBarScrubItem[];
    onSelect?: (index: number) => void;
    onHighlight?: (index: number) => void;
    debounceTime?: number;
    selectedStyle?: Style;
    overlayStyle?: Style;
    showArrowButtons?: boolean;
    mode?: Mode;
    continuous?: boolean;
}
export declare enum Style {
    Background = "background",
    Outline = "outline"
}
export declare enum Mode {
    Fixed = "fixed",
    Free = "free"
}
interface NativeTouchBarScrubberIndex extends NativeTouchBarScrubber, WithIndex {
}
