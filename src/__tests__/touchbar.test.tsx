import React from 'react';
import { TouchBar as NativeTouchBar, BrowserWindow } from 'electron';
// import renderer from 'react-test-renderer';
import { ReactTouchBar, TouchBar } from '../index';

import TouchBarText from '../components/TouchBarText';
import TouchBarScrubItem from '../components/TouchBarScrubItem';
import TouchBarScrubber from '../components/TouchBarScrubber';

const mainWindow = new BrowserWindow();

function render(Element: any, props: any) {
  return ReactTouchBar.render(
    <Element {...props} />,
    new TouchBar(mainWindow, NativeTouchBar),
    () => {},
  );
}

describe('TouchBar', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render a touchbar text', () => {
    const spy = jest.spyOn(TouchBarText.prototype, 'createInstance');

    const Test = () => {
      return <>Hello World</>;
    };

    render(Test, {});
    expect(spy).toHaveBeenCalled();
  });

  it('Should render a scrubber', () => {
    const createInstance = jest.spyOn(
      TouchBarScrubItem.prototype,
      'createInstance',
    );
    const appendChild = jest.spyOn(TouchBarScrubber.prototype, 'appendChild');

    const Test = () => {
      return (
        <>
          <touchbar-scrubber>
            <touchbar-scrub-item>😀</touchbar-scrub-item>
            <touchbar-scrub-item>😁</touchbar-scrub-item>
            <touchbar-scrub-item>😎</touchbar-scrub-item>
          </touchbar-scrubber>
        </>
      );
    };

    render(Test, {});
    expect(createInstance).toHaveBeenCalledTimes(3);
    expect(appendChild).toHaveBeenCalledTimes(3);
  });
});
