import React, { useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components/macro';
import { select, arc } from 'd3';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;

  position: relative;

  z-index: 5;
`;

const Label = styled.span`
  margin-top: 35px;

  font-family: Barlow Condensed, sans-serif;
  font-size: 28px;
  font-weight: 500;
  color: ${props => props.theme.colors.txtPrimary};
`;

export default function ProgressCircle({
  percent,
  message = '',
}: {
  percent: number;
  message?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const startTime = useMemo(() => new Date().getTime(), []);
  const estimatedMinutes = useMemo(() => {
    const now = new Date().getTime();
    const elapsed = now - startTime;
    const speed = percent / elapsed;
    const remaining = 100 - percent;
    if (remaining === 0) return null;
    const time = remaining / speed;
    return Math.round(time / 60000) || null;
  }, [percent, startTime]);

  useEffect(() => {
    const svg = select(svgRef.current);

    const generatedArc = arc()
      .innerRadius(56)
      .outerRadius(59)
      .startAngle(0)
      .endAngle((2 * Math.PI * percent) / 100)
      .cornerRadius(4);

    svg
      .append('path')
      // @ts-ignore
      .attr('d', generatedArc())
      .style('transform', 'translate(60px, 60px)')
      .style('fill', '#85c5f9');
  }, [percent]);

  return (
    <Wrapper>
      <svg width="120" height="120" ref={svgRef}>
        <circle cx="60" cy="60" r="57" stroke="#222f3d" strokeWidth="4" fill="none" />
      </svg>

      <Label>
        {message}{' '}
        {estimatedMinutes && (
          <>
            {Math.max(estimatedMinutes, 1)} minute{estimatedMinutes === 1 ? '' : 's'} left
          </>
        )}
      </Label>
    </Wrapper>
  );
}
