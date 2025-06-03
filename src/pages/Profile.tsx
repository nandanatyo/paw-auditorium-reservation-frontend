import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth/AuthProvider";
import { useEffect, useState } from "react";
import { useRegistration } from "../contexts/registration/RegistrationProvider";

const Profile = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { getRegisteredConferences, isLoading: isLoadingRegistrations } =
    useRegistration();
  const [attendedCount, setAttendedCount] = useState(0);
  const [proposalCount, setProposalCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);

  useEffect(() => {
    if (user) {
      setAttendedCount(5);
      setProposalCount(2);
      setFeedbackCount(3);
    }
  }, [user]);

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (!user) {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Body className="text-center">
                <p>Please log in to view your profile.</p>
                <Link to="/login">
                  <Button variant="primary">Login</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              <div className="mb-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name || "User"
                  )}&background=random&size=128`}
                  alt={user.name || "User"}
                  className="rounded-circle img-fluid"
                  style={{ width: "150px", height: "150px" }}
                />
              </div>
              <Card.Title>{user.name || "User"}</Card.Title>
              {user.role && (
                <Card.Subtitle className="mb-2 text-muted">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Card.Subtitle>
              )}
              <Link to="/edit-profile">
                <Button variant="outline-primary">Edit Profile</Button>
              </Link>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>Quick Links</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item action as={Link} to="/my-proposals">
                My Proposals
              </ListGroup.Item>
              <ListGroup.Item action as={Link} to="/my-sessions">
                My Sessions
              </ListGroup.Item>
              <ListGroup.Item action as={Link} to="/create-proposal">
                Create New Proposal
              </ListGroup.Item>
              {user.role === "event_coordinator" && (
                <ListGroup.Item action as={Link} to="/coordinator">
                  Coordinator Dashboard
                </ListGroup.Item>
              )}
              {user.role === "admin" && (
                <ListGroup.Item action as={Link} to="/admin">
                  Admin Dashboard
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>Profile Information</Card.Header>
            <Card.Body>
              <Row>
                <Col sm={3}>
                  <strong>Full Name:</strong>
                </Col>
                <Col sm={9}>{user.name || "N/A"}</Col>
              </Row>
              <hr />
              <Row>
                <Col sm={3}>
                  <strong>Email:</strong>
                </Col>
                <Col sm={9}>{user.email || "N/A"}</Col>
              </Row>
              <hr />
              <Row>
                <Col sm={3}>
                  <strong>Role:</strong>
                </Col>
                <Col sm={9}>
                  {user.role
                    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                    : "N/A"}
                </Col>
              </Row>
              {user.bio && (
                <>
                  <hr />
                  <Row>
                    <Col sm={3}>
                      <strong>Bio:</strong>
                    </Col>
                    <Col sm={9}>{user.bio}</Col>
                  </Row>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
