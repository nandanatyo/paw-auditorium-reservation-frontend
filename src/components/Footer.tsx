import { Container, Row, Col } from "react-bootstrap"

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={4}>
            <h5>Conference Hub</h5>
            <p>Your platform for conference management and session registration.</p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-light">
                  Home
                </a>
              </li>
              <li>
                <a href="/sessions" className="text-light">
                  Sessions
                </a>
              </li>
              <li>
                <a href="/register" className="text-light">
                  Register
                </a>
              </li>
              <li>
                <a href="/login" className="text-light">
                  Login
                </a>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact Us</h5>
            <address>
              <p>Email: info@conferencehub.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </Col>
        </Row>
        <Row>
          <Col className="text-center mt-3">
            <p>&copy; {new Date().getFullYear()} Conference Hub. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer

