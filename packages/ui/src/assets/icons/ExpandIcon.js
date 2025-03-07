import React from 'react';

export function ExpandIcon({ onClick, fillColor }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      margin-left="auto"
      margin-right="auto"
      display="block"
      viewBox="0 0 469 469"
      onClick={onClick}
    >
      <g id="ExpandIcon" cursor="pointer" pointerEvents="all">
        <path
          fill={fillColor}
          d="M455.5,0h-442C6,0,0,6,0,13.5v211.9c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5V27h415v415H242.4c-7.5,0-13.5,6-13.5,13.5
			s6,13.5,13.5,13.5h213.1c7.5,0,13.5-6,13.5-13.5v-442C469,6,463,0,455.5,0z"
        />
        <path
          fill={fillColor}
          d="M175.6,279.9H13.5c-7.5,0-13.5,6-13.5,13.5v162.1C0,463,6,469,13.5,469h162.1c7.5,0,13.5-6,13.5-13.5V293.4
			C189.1,286,183,279.9,175.6,279.9z M162.1,442H27V306.9h135.1V442z"
        />
        <path
          fill={fillColor}
          d="M360.4,127.7v71.5c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5V95.1c0-7.5-6-13.5-13.5-13.5H269.8c-7.5,0-13.5,6-13.5,13.5
			s6,13.5,13.5,13.5h71.5L212.5,237.4c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4L360.4,127.7z"
        />
        <rect x="0" y="0" width="100%" height="100%" fill="none" />
      </g>
    </svg>
  );
}
