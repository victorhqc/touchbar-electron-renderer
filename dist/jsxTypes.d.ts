import { NativeImage } from 'electron';
import { Ref } from 'react';
export interface TouchBarElement<T> {
    children?: T;
}
declare global {
    namespace JSX {
        interface TouchBarRendererElement<T, C> extends TouchBarElement<C> {
            key?: string | null | number;
            ref?: Ref<T>;
        }
        interface TouchBarButtonElement<T> extends TouchBarRendererElement<T, string> {
            onClick?: () => void;
            icon?: NativeImage | null;
            iconPosition?: 'left' | 'right' | 'overlay';
            backgroundColor?: string;
        }
        interface TouchBarColorPicker<T> extends TouchBarRendererElement<T, ColorElement[]> {
            selected?: string;
            onChange?: (color: string) => void;
        }
        interface TouchBarPopover<T, C> extends TouchBarRendererElement<T, C> {
            label?: string;
            icon?: NativeImage | null;
            hideCloseButton?: boolean;
        }
        type ScrubberStyle = 'background' | 'outline';
        type ScrubberMode = 'fixed' | 'free';
        interface TouchBarScrubber<T> extends TouchBarRendererElement<T, TouchBarScrubItem<any> | TouchBarScrubItem<any>[]> {
            onSelect?: (index: number) => void;
            onHighlight?: (index: number) => void;
            debounceTime?: number;
            selectedStyle?: ScrubberStyle;
            overlayStyle?: ScrubberStyle;
            showArrowButtons?: boolean;
            mode?: ScrubberMode;
            continuous?: boolean;
        }
        interface TouchBarScrubItem<T> extends TouchBarRendererElement<T, string> {
            icon?: NativeImage | null;
        }
        interface TouchBarSegment<T> extends TouchBarRendererElement<T, string> {
            disabled?: boolean;
            icon?: NativeImage | null;
        }
        type SegmentedControlStyle = 'automatic' | 'rounded' | 'textured-rounded' | 'round-rect' | 'textured-square' | 'capsule' | 'small-square' | 'separated';
        type SegmentedControlMode = 'single' | 'multiple' | 'buttons';
        interface TouchBarSegmentedControl<T> extends TouchBarRendererElement<T, SegmentElement> {
            onChange?: (selectedIndex: number, isSelected: boolean) => void;
            selected?: number;
            segmentStyle?: SegmentedControlStyle;
            mode?: SegmentedControlMode;
        }
        interface TouchBarSlider<T> extends TouchBarRendererElement<T, string> {
            debounceTime?: number;
            onChange?: (newValue: number) => void;
            value?: number;
            minValue?: number;
            maxValue?: number;
        }
        interface TouchBarSpacer<T> extends TouchBarRendererElement<T, never> {
            small?: boolean;
            large?: boolean;
            flexible?: boolean;
        }
        type TextElement = TouchBarRendererElement<any, string>;
        type ButtonElement = TouchBarButtonElement<any>;
        type LabelElement = TouchBarRendererElement<any, string>;
        type ColorElement = TextElement;
        type ColorPickerElement = TouchBarColorPicker<any>;
        type ScrubItemElement = TouchBarScrubItem<any>;
        type ScrubberElement = TouchBarScrubber<any>;
        type SegmentElement = TouchBarSegment<any>;
        type SegmentedControlElement = TouchBarSegmentedControl<any>;
        type SliderElement = TouchBarSlider<any>;
        type SpacerElement = TouchBarSpacer<any>;
        type GroupValidElements = (TextElement | ButtonElement | ColorPickerElement | LabelElement | SegmentedControlElement | SliderElement | SpacerElement | ScrubberElement | PopoverElement)[];
        type PopoverValidElements = (TextElement | ButtonElement | ColorPickerElement | LabelElement | SegmentedControlElement | SliderElement | SpacerElement | ScrubberElement)[];
        type GroupElement = TouchBarRendererElement<any, GroupValidElements>;
        type PopoverElement = TouchBarPopover<any, PopoverValidElements>;
        interface IntrinsicElements {
            'touchbar-button': ButtonElement;
            'touchbar-color': ColorElement;
            'touchbar-color-picker': ColorPickerElement;
            'touchbar-group': GroupElement;
            'touchbar-label': LabelElement;
            'touchbar-popover': PopoverElement;
            'touchbar-scrubber': ScrubberElement;
            'touchbar-scrub-item': ScrubItemElement;
            'touchbar-segment': SegmentElement;
            'touchbar-segmented-control': SegmentedControlElement;
            'touchbar-slider': SliderElement;
            'touchbar-spacer': SpacerElement;
        }
    }
}
