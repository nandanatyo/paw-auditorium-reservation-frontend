import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Alert,
  Nav,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/auth/AuthProvider";
import { useRegistration } from "../contexts/registration/RegistrationProvider";
import { Conference, ApiError } from "../types";
import { formatDate } from "../utils/date";

const MySessions = () => {
  const { user } = useAuth();
  const { getRegisteredConferences, isLoading } = useRegistration();
  const [sessions, setSessions] = useState<Conference[]>([]);
  const [pastSessions, setPastSessions] = useState<Conference[]>([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [error, setError] = useState("");
  const [dataFetched, setDataFetched] = useState(false);

  const fetchRegisteredSessions = useCallback(async () => {
    if (!user || !user.id || dataFetched) return;

    try {
      // Get all sessions including past ones
      const response = await getRegisteredConferences(user.id, {
        limit: 20,
        include_past: true, // Include past sessions
      });

      if (response && response.conferences) {
        const now = new Date();

        // Split into upcoming and past sessions
        const upcoming = response.conferences.filter(
          (conf) => new Date(conf.ends_at) > now
        );

        const past = response.conferences.filter(
          (conf) => new Date(conf.ends_at) <= now
        );

        setSessions(upcoming);
        setPastSessions(past);
      } else {
        console.error("Unexpected response format:", response);
        setSessions([]);
        setPastSessions([]);
      }

      setDataFetched(true);
    } catch (err) {
      console.error("Failed to load registered sessions:", err);
      const apiError = err as ApiError;
      setError(
        apiError.data?.message ||
          "Failed to load your sessions. Please try again."
      );
      setSessions([]);
      setPastSessions([]);
      setDataFetched(true);
    }
  }, [user, getRegisteredConferences, dataFetched]);

  useEffect(() => {
    fetchRegisteredSessions();
  }, [fetchRegisteredSessions]);

  if (isLoading && !dataFetched) {
    return <div className="text-center py-4">Loading your sessions...</div>;
  }

  if (!user) {
    return (
      <Container className="py-4">
        <Card>
          <Card.Body className="text-center">
            <p>Please log in to view your sessions.</p>
            <Link to="/login">
              <Button variant="primary">Login</Button>
            </Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const displaySessions = activeTab === "upcoming" ? sessions : pastSessions;

  return (
    <Container className="py-4">
      <h1 className="mb-4">My Sessions</h1>

      <Nav
        variant="tabs"
        className="mb-4"
        activeKey={activeTab}
        onSelect={(k) => k && setActiveTab(k)}>
        <Nav.Item>
          <Nav.Link eventKey="upcoming">
            Upcoming Sessions ({sessions.length})
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="past">
            Past Sessions ({pastSessions.length})
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {displaySessions.length === 0 ? (
        <Card>
          <Card.Body className="text-center">
            <p>
              {activeTab === "upcoming"
                ? "You're not registered for any upcoming sessions."
                : "You haven't attended any past sessions."}
            </p>
            <Link to="/sessions">
              <Button variant="primary">Browse Sessions</Button>
            </Link>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {displaySessions.map((session) => (
            <Col md={6} className="mb-4" key={session.id}>
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <Badge bg="primary">{session.title.split(" ")[0]}</Badge>
                  <Badge
                    bg={activeTab === "upcoming" ? "success" : "secondary"}>
                    {activeTab === "upcoming" ? "Upcoming" : "Past"}
                  </Badge>
                </Card.Header>
                <Card.Body>
                  <Card.Title>{session.title}</Card.Title>
                  <div className="mb-3">
                    <div>
                      <strong>Date:</strong> {formatDate(session.starts_at)}
                    </div>
                    <div>
                      <strong>Time:</strong>{" "}
                      {new Date(session.starts_at).toLocaleTimeString()} -{" "}
                      {new Date(session.ends_at).toLocaleTimeString()}
                    </div>
                    <div>
                      <strong>Speaker:</strong> {session.speaker_name} (
                      {session.speaker_title})
                    </div>
                    <div>
                      <strong>Attendees:</strong> {session.seats_taken || 0}/
                      {session.seats}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <Link to={`/sessions/${session.id}`}>
                      <Button variant="primary">
                        {activeTab === "past"
                          ? "View Details & Feedback"
                          : "View Details"}
                      </Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MySessions;
