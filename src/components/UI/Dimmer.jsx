import styled from "styled-components";

export const Dimmer = styled.div`
  width: 100%;
  height: 100%;

  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background-color: rgba(0, 0, 0, 0.7);

  z-index: 10;
`;
