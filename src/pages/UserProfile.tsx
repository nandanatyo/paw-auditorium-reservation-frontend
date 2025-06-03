import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { userService } from "../services/user.service";
import { registrationService } from "../services/registration.service";
import { UserMinimal, Conference, ApiError } from "../types";

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserMinimal | null>(null);
  const [sessions, setSessions] = useState<Conference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchUserData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const userData = await userService.getUserById(id);
        setUser(userData);

        const registrationsResponse =
          await registrationService.getRegisteredConferences(id, {
            limit: 10,
            include_past: true,
          });
        setSessions(registrationsResponse.conferences);
      } catch (err) {
        console.error("Failed to load user profile:", err);
        const apiError = err as ApiError;
        setError(
          apiError.data?.message ||
            "Failed to load user profile. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (isLoading) {
    return <div className="text-center py-4">Loading profile...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!user) {
    return <Alert variant="warning">User not found</Alert>;
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name || "User"
                )}&background=random&size=128`}
                alt={user.name || "User"}
                className="rounded-circle mb-3"
                style={{ width: "150px", height: "150px" }}
              />
              <Card.Title>{user.name || "User"}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {user.role &&
                  user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Card.Subtitle>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>Profile Information</Card.Header>
            <Card.Body>
              <h5>About</h5>
              <p>{user.bio || "No bio provided."}</p>

              <h5 className="mt-4">Sessions</h5>
              {sessions.length > 0 ? (
                <ul className="list-group">
                  {sessions.map((session) => (
                    <li key={session.id} className="list-group-item">
                      {session.title}
                      <span className="badge bg-primary float-end">
                        {new Date(session.starts_at).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No sessions found.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
