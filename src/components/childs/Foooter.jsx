import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="mt-auto py-3 bg-dark">
            <Container fluid>
                <Row>
                    <Col sm={12} md={6}>
                        <p className="text-white">Copyright &copy; {new Date().getFullYear()} {process.env.REACT_APP_NAME}</p>
                    </Col>
                    <Col sm={12} md={6} className="text-md-end">
                        <p className="text-white">Made with <i className="bi bi-heart-fill text-danger"></i> by <a href="/" className="text-white text-decoration-none">Winner Arianto</a></p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;
