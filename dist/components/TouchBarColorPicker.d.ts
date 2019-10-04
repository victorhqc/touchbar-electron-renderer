import { TouchBarColorPicker as NativeTouchBarColorPicker } from 'electron';
import { Maybe, WithIndex } from '../utils';
import TouchBarColor from './TouchBarColor';
import { ComponentProps, NativeTouchBarComponent } from './types';
declare class TouchBarColorPicker implements NativeTouchBarComponent {
    id: string;
    private props;
    private instance;
    private children;
    constructor({ children, ...props }: TouchBarColorPickerProps);
    appendChild(child: TouchBarColor): void;
    insertBefore(newChild: TouchBarColor, beforeChild: TouchBarColor): void;
    removeChild(child: TouchBarColor): void;
    update({ newProps }: {
        newProps: TouchBarColorPickerProps;
    }): boolean;
    private getNativeArgs;
    private updateInstance;
    createInstance(): Maybe<NativeTouchBarColorPickerWithIndex>;
}
export default TouchBarColorPicker;
interface TouchBarColorPickerProps extends ComponentProps {
    selected?: string;
    children?: TouchBarColor[];
    onChange?: (color: string) => void;
}
interface NativeTouchBarColorPickerWithIndex extends NativeTouchBarColorPicker, WithIndex {
}
