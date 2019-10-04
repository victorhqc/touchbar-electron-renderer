import { TouchBarSlider as NativeTouchBarSlider } from 'electron';
import { Maybe, WithIndex } from '../utils';
import TouchBarText from './TouchBarText';
import { ComponentProps, NativeTouchBarComponent } from './types';
declare class TouchBarSlider implements NativeTouchBarComponent {
    id: string;
    private props;
    private instance;
    private children;
    constructor({ children, ...props }: TouchBarSliderProps);
    update({ newProps }: {
        newProps: TouchBarSliderProps;
    }): boolean;
    appendChild(child: TouchBarText): void;
    insertBefore(child: TouchBarText): void;
    removeChild(): void;
    private getNativeArgs;
    private updateInstance;
    createInstance(): Maybe<NativeTouchBarSliderIndex>;
}
export default TouchBarSlider;
export interface TouchBarSliderProps extends ComponentProps {
    children?: TouchBarText;
    debounceTime?: number;
    onChange?: (newValue: number) => void;
    value?: number;
    minValue?: number;
    maxValue?: number;
}
interface NativeTouchBarSliderIndex extends NativeTouchBarSlider, WithIndex {
}
