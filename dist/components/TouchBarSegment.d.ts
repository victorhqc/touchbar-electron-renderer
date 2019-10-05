import { SegmentedControlSegment, NativeImage } from 'electron';
import TouchBarText from './TouchBarText';
import { ComponentProps, InternalTouchBarComponent } from './types';
import { WithIndex } from '../utils';
export default class TouchBarSegment implements InternalTouchBarComponent {
    id: string;
    private props;
    private instance;
    private children;
    constructor({ children, ...props }: TouchBarSegmentProps);
    update({ newProps }: {
        newProps: TouchBarSegmentProps;
    }): boolean;
    appendChild(label: TouchBarText): void;
    insertBefore(label: TouchBarText): void;
    replaceText(label: TouchBarText): void;
    removeChild(): void;
    private getNativeArgs;
    private updateInstance;
    createInstance(): SegmentedControlSegmentIndex;
}
export interface TouchBarSegmentProps extends ComponentProps {
    children?: TouchBarText;
    disabled?: boolean;
    icon?: NativeImage;
}
interface SegmentedControlSegmentIndex extends SegmentedControlSegment, WithIndex {
}
export {};
