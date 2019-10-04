import { NativeImage, TouchBarButton as NativeTouchBarButton, TouchBarButtonConstructorOptions } from 'electron';
import { Maybe, WithIndex } from '../utils';
import { ComponentProps, NativeTouchBarComponent } from './types';
import TouchBarText from './TouchBarText';
export declare class TouchBarButton implements NativeTouchBarComponent {
    id: string;
    private props;
    private instance;
    private children;
    constructor({ children, ...props }: TouchBarButtonProps);
    appendChild(child: TouchBarText): void;
    insertBefore(child: TouchBarText): void;
    removeChild(): void;
    update({ newProps }: {
        newProps: TouchBarButtonProps;
    }): boolean;
    getNativeArgs(): TouchBarButtonConstructorOptions;
    private updateInstance;
    createInstance(): Maybe<NativeTouchBarButtonWithIndex>;
}
export interface TouchBarButtonProps extends ComponentProps {
    onClick?: () => void;
    icon?: NativeImage;
    iconPosition?: 'left' | 'right' | 'overlay';
    backgroundColor?: string;
    children?: TouchBarText;
}
interface NativeTouchBarButtonWithIndex extends NativeTouchBarButton, WithIndex {
}
export {};
