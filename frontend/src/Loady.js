import React from 'react';

function WithLoader(WrappedComponent) {
  return function WithLoaderComponent({ isLoading, ...props }) {
    if (!isLoading) return (<WrappedComponent {...props} />);
    return (<p>Loading...</p>);
  }
}

export default WithLoader;
