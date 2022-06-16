import styled from "styled-components";

type ContainerProps = {
  showBackground: boolean;
}

export const Container = styled.div<ContainerProps>`
  background-color: ${props => props.showBackground ? '#1550FF' : '#E2E3E2'};
  height: 100px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

type ImgProps = {
  opacity?: number;
}

export const Icon = styled.img<ImgProps>`
  width: 50px;
  height: 50px;
  opacity: ${props => props.opacity ?? 1};
`;