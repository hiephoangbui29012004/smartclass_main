import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const NotFound = () => (
  <Container className="not-found">
    <img
      src="https://www.pngitem.com/pimgs/m/561-5616833_image-not-found-png-not-found-404-png.png"
      alt="not-found"
    />
    <Link to="/">Go Home</Link>
  </Container>
);

export default NotFound;
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
