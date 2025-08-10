import React from 'react';

export class WebGLErrorBoundary extends React.Component<any, { e?: any }> {
  state = {} as { e?: any };
  componentDidCatch(e: any) {
    this.setState({ e });
    console.error('[WebGL]', e);
  }
  render() {
    return this.state.e ? null : this.props.children;
  }
}
