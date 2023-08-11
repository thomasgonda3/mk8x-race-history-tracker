import Container from "react-bootstrap/Container";

const Footer = () => {
  return (
    <div
      style={{ width: "100%", position: "absolute", bottom: 0 }}
      className="bg-secondary"
    >
      <Container
        style={{ height: "3.5rem" }}
        className="d-flex align-items-center text-white"
      >
        <div>© 2023 - Tracker</div>
      </Container>
    </div>
  );
};

export default Footer;
