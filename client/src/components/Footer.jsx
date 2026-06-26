import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <div id='footer'>
    <footer className="bg-dark text-center  py-4"   style={{
    background: "linear-gradient(90deg, #000000, #441b01bb, #050300)"
  }}>
      <Container >
        <Row>
          <Col md={4}>
            <h6 style={{color: "white"}}>Rreth nesh</h6>
            <p>Ne jemi nje kompani lider ne tregun e ushqimeve dhe food-delivery. Misioni jone eshte t'u ofrojme klienteve tane nje sherbim korrekt dhe cilesor.</p>
          </Col>
          <Col md={4}>
            <h6 style={{color: "white"}}>Na kontaktoni</h6>
            <p>Email: contact@foodish.com</p>
            <p>Phone: +355 *** *** ***</p>
            <p>Adresa: Rr.*** Tirane, Shqiperi</p>
          </Col>
          <Col md={4}>
            <h6 style={{color: "white"}}>Na ndiqni</h6>
            <p >
              <a href="#" style={{color: "orange"}} >Facebook</a><br />
              <a href="#" style={{color: "orange"}} >Twitter</a><br />
              <a href="#" style={{color: "orange"}} >Instagram</a>
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center mt-4">
            <p>© {new Date().getFullYear()} FooDish. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
    </div>
  );
};

export default Footer;
