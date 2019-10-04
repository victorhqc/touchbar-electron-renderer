import { TouchBarLabel as NativeTouchBarLabel } from 'electron';
import { Maybe, WithIndex } from '../utils';
import { ComponentProps, NativeTouchBarComponent } from './types';
import TouchBarText from './TouchBarText';
declare class TouchBarLabel implements NativeTouchBarComponent {
    id: string;
    private props;
    private instance;
    private children;
    constructor({ children, ...props }: TouchBarLabelProps);
    appendChild(text: TouchBarText): void;
    insertBefore(text: TouchBarText): void;
    removeChild(): void;
    update({ newProps }: {
        newProps: TouchBarLabelProps;
    }): boolean;
    private getNativeArgs;
    private updateInstance;
    createInstance(): Maybe<NativeTouchBarLabelIndex>;
}
export default TouchBarLabel;
export interface TouchBarLabelProps extends ComponentProps {
    children?: TouchBarText;
    color?: string;
}
interface NativeTouchBarLabelIndex extends NativeTouchBarLabel, WithIndex {
}
