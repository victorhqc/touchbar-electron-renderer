import { TouchBarSpacer as NativeTouchBarSpacer } from 'electron';
import { Maybe, WithIndex } from '../utils';
import { ComponentProps, NativeTouchBarComponent } from './types';
declare class TouchBarSpacer implements NativeTouchBarComponent {
    id: string;
    private props;
    private instance;
    constructor(props: TouchBarSpacerProps);
    update({ newProps }: {
        newProps: TouchBarSpacerProps;
    }): boolean;
    appendChild(): void;
    insertBefore(): void;
    removeChild(): void;
    private getNativeArgs;
    updateInstance(): boolean;
    createInstance(): Maybe<NativeTouchBarSpacerIndex>;
}
export default TouchBarSpacer;
export interface TouchBarSpacerProps extends ComponentProps {
    small?: boolean;
    large?: boolean;
    flexible?: boolean;
}
interface NativeTouchBarSpacerIndex extends NativeTouchBarSpacer, WithIndex {
}
