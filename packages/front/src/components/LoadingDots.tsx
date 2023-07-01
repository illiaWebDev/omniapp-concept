import React from 'react';


const style = { width: 30, fill: '#fff' };
export function _() {
  return (
    <svg
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      x='0px'
      y='0px'
      viewBox='0 0 100 50'
      enableBackground='new 0 0 100 50'
      style={ style }
    >
      <circle stroke='none' cx='20' cy='10' r='8'>
        <animate attributeName='cy' dur='1s' values='10;35;10' repeatCount='indefinite' begin='0.1' />
      </circle>
      <circle stroke='none' cx='50' cy='10' r='8'>
        <animate attributeName='cy' dur='1s' values='10;35;10' repeatCount='indefinite' begin='0.2' />
      </circle>
      <circle stroke='none' cx='80' cy='10' r='8'>
        <animate attributeName='cy' dur='1s' values='10;35;10' repeatCount='indefinite' begin='0.3' />
      </circle>
    </svg>
  );
}
export const JSX = <_ />;
