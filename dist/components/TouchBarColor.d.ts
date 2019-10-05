import TouchBarText from './TouchBarText';
import { ComponentProps, InternalTouchBarComponent } from './types';
declare class TouchBarColor implements InternalTouchBarComponent {
    id: string;
    private children;
    constructor({ children }: TouchBarColorProps);
    appendChild(text: TouchBarText): void;
    insertBefore(text: TouchBarText): void;
    update({ newProps }: {
        newProps: TouchBarColorProps;
    }): boolean;
    removeChild(): void;
    createInstance(): string | null;
}
export default TouchBarColor;
export interface TouchBarColorProps extends ComponentProps {
    children?: TouchBarText;
}
