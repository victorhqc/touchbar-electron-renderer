/* eslint @typescript-eslint/no-namespace: 0 */
import { NativeImage } from 'electron'
import { Ref } from 'react';

export interface TouchBarElement<T> {
  children?: T;
}

// TODO: Make types compatible with internal implementation & exposed props.
declare global {
  namespace JSX {
    export interface TouchBarRendererElement<T, C> extends TouchBarElement<C> {
      key?: string;
      ref?: Ref<T>;
    }

    export interface TouchBarButtonElement<T>
      extends TouchBarRendererElement<T, string> {
      onClick?: () => void;
      icon?: NativeImage | null;
      iconPosition?: 'left' | 'right' | 'overlay';
      backgroundColor?: string;
    }

    export interface TouchBarColorPicker<T>
      extends TouchBarRendererElement<T, ColorElement[]> {
      selected?: string;
      onChange?: (color: string) => void;
    }

    export interface TouchBarPopover<T, C>
      extends TouchBarRendererElement<T, C> {
      label?: string;
      icon?: NativeImage | null;
      hideCloseButton?: boolean;
    }

    export type ScrubberStyle = 'background' | 'outline';
    export type ScrubberMode = 'fixed' | 'free';

    export interface TouchBarScrubber<T>
      extends TouchBarRendererElement<
        T,
        TouchBarScrubItem<any> | TouchBarScrubItem<any>[]
      > {
      onSelect?: (index: number) => void;
      onHighlight?: (index: number) => void;
      debounceTime?: number;
      selectedStyle?: ScrubberStyle;
      overlayStyle?: ScrubberStyle;
      showArrowButtons?: boolean;
      mode?: ScrubberMode;
      continuous?: boolean;
    }

    export interface TouchBarScrubItem<T>
      extends TouchBarRendererElement<T, string> {
      icon?: NativeImage | null;
    }

    export interface TouchBarSegment<T>
      extends TouchBarRendererElement<T, string> {
      disabled?: boolean;
      icon?: NativeImage | null;
    }

    export type SegmentedControlStyle =
      | 'automatic'
      | 'rounded'
      | 'textured-rounded'
      | 'round-rect'
      | 'textured-square'
      | 'capsule'
      | 'small-square'
      | 'separated';

    export type SegmentedControlMode = 'single' | 'multiple' | 'buttons';

    export interface TouchBarSegmentedControl<T>
      extends TouchBarRendererElement<T, SegmentElement> {
      onChange?: (selectedIndex: number, isSelected: boolean) => void;
      selected?: number;
      segmentStyle?: SegmentedControlStyle;
      mode?: SegmentedControlMode;
    }

    export interface TouchBarSlider<T>
      extends TouchBarRendererElement<T, string> {
      debounceTime?: number;
      onChange?: (newValue: number) => void;
      value?: number;
      minValue?: number;
      maxValue?: number;
    }

    export interface TouchBarSpacer<T>
      extends TouchBarRendererElement<T, never> {
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

    type GroupValidElements = (
      | TextElement
      | ButtonElement
      | ColorPickerElement
      | LabelElement
      | SegmentedControlElement
      | SliderElement
      | SpacerElement
      | ScrubberElement
      | PopoverElement
    )[];

    type PopoverValidElements = (
      | TextElement
      | ButtonElement
      | ColorPickerElement
      | LabelElement
      | SegmentedControlElement
      | SliderElement
      | SpacerElement
      | ScrubberElement
    )[];

    type GroupElement = TouchBarRendererElement<any, GroupValidElements>;
    type PopoverElement = TouchBarPopover<any, PopoverValidElements>;

    export interface IntrinsicElements {
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
