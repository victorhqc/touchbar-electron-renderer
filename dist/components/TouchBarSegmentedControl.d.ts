import { TouchBarSegmentedControl as NativeTouchBarSegmentedControl } from 'electron';
import { Maybe, WithIndex } from '../utils';
import TouchBarSegment from './TouchBarSegment';
import { ComponentProps, NativeTouchBarComponent } from './types';
export default class TouchBarSegmentedControl implements NativeTouchBarComponent {
    id: string;
    private props;
    private instance;
    private didChildrenChange;
    private builtChildrenInstances;
    private children;
    constructor({ children, ...props }: TouchBarSegmentedControlProps);
    update({ newProps }: {
        newProps: TouchBarSegmentedControlProps;
    }): boolean;
    appendChild(child: TouchBarSegment): void;
    insertBefore(newChild: TouchBarSegment, beforeChild: TouchBarSegment): void;
    removeChild(child: TouchBarSegment): void;
    private getSegments;
    private getNativeArgs;
    private updateInstance;
    createInstance(): Maybe<NativeTouchBarSegmentedControlIndex>;
}
export interface TouchBarSegmentedControlProps extends ComponentProps {
    children?: TouchBarSegment[];
    onChange?: (selectedIndex: number, isSelected: boolean) => void;
    selected?: number;
    segmentStyle?: 'automatic' | 'rounded' | 'textured-rounded' | 'round-rect' | 'textured-square' | 'capsule' | 'small-square' | 'separated';
    mode?: 'single' | 'multiple' | 'buttons';
}
interface NativeTouchBarSegmentedControlIndex extends NativeTouchBarSegmentedControl, WithIndex {
}
export {};
