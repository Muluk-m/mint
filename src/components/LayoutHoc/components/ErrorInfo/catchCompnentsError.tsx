import React, { Component } from 'react';

interface Options {
  info: any;
  errMessage: string;
  level: 'error' | 'warn';
}

function getErrorKey() {
  return 'COMPONENT_RENDER_ERROR';
}

export default (options: Options) => {
  return function catchComponentError(WrapperComponent: any): any {
    class CatchComponentError extends Component<any, { hasError: boolean }> {
      constructor(props: any) {
        super(props);
        this.state = { hasError: false };
      }

      static getDerivedStateFromError() {
        return { hasError: true };
      }

      componentDidCatch(error: any, info: any) {
        if (window.errorMonitor) {
          const browserInfo = navigator.userAgent.toLowerCase();
          const level = /(chrome)|(safari)/.test(browserInfo) ? options.level : 'warn';
          const message = `${options.errMessage}\nReact componentDidCatch: ${error.message}\n${error.stack}`;
          const errorKey = getErrorKey();

          window.errorMonitor(errorKey, message, level);

          if (window.hotdog) {
            window.hotdog.addError(`COMPONENT_RENDER_ERROR:${message}`);
          }
        }
        console.error(error);
        console.info(info);
      }

      render() {
        if (this.state.hasError) {
          return options.info;
        }
        return <WrapperComponent {...this.props} />;
      }
    }
    return CatchComponentError;
  };
};
