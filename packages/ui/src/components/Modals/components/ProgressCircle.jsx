import React, { useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import { select, arc } from 'd3';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

const Label = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.txtPrimary};
`;

export default function ProgressCircle({ percent }) {
  const svgRef = useRef();

  useEffect(() => {
    const svg = select(svgRef.current);

    const generatedArc = arc()
      .innerRadius(46)
      .outerRadius(49)
      .startAngle(0)
      .endAngle((2 * Math.PI * percent) / 100)
      .cornerRadius(4);

    svg
      .append('path')
      .attr('d', generatedArc())
      .style('transform', 'translate(50px, 50px)')
      .style('fill', '#fff');
  }, [percent]);

  return (
    <Wrapper>
      <svg width="100" height="100" ref={svgRef}>
        <circle cx="50" cy="50" r="47" stroke="#302e3d" strokeWidth="3" fill="none" />
      </svg>

      <Label>Bridging assets… 7 minutes left</Label>
    </Wrapper>
  );
}
