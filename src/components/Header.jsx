import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const Header = () => {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">MK8DX Race History Tracker</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/instructions">Instructions</Nav.Link>
          <Nav.Link href="/scan">Video Scan</Nav.Link>
          <Nav.Link href="/stats">Stats</Nav.Link>
          <Nav.Link href="https://discord.gg/BEa3kyaxYU">Discord</Nav.Link>
          <Nav.Link href="/blog">Dev Blog</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
