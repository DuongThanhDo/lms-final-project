import React from 'react'
import { Container } from 'react-bootstrap';
import Header from '../components/layouts/Header';

const OnlyHeader = ({ children }) => {
    return (
      <div>
        <Header />
        <Container style={{minHeight: 600}}>{children}</Container>
      </div>
    );
  };

export default OnlyHeader
