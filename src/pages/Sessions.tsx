import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useConference } from "../contexts/conference/ConferenceProvider";
import { Conference } from "../types";
import { formatDate } from "../utils/date";

const Sessions = () => {
  const { conferences, isLoading, error, loadConferences } = useConference();
  const [filteredSessions, setFilteredSessions] = useState<Conference[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategory] = useState("");

  useEffect(() => {
    loadConferences({
      status: "approved",
      limit: 20,
      order_by: "starts_at",
      order: "asc",
      include_past: false,
    });
  }, [loadConferences]);

  const categories = Array.from(
    new Set(conferences.map((conference) => conference.title.split(" ")[0]))
  );

  useEffect(() => {
    const filtered = conferences.filter((conference) => {
      const matchesSearch =
        conference.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conference.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        conference.speaker_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCategory =
        !categoryFilter ||
        conference.title.toLowerCase().includes(categoryFilter.toLowerCase());

      return matchesSearch && matchesCategory;
    });

    setFilteredSessions(filtered);
  }, [searchTerm, categoryFilter, conferences]);

  return (
    <Container>
      <h1 className="mb-4">Conference Sessions</h1>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Select
              value={categoryFilter}
              onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {isLoading ? (
        <div className="text-center py-4">Loading sessions...</div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : filteredSessions.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <Card.Title>No Sessions Found</Card.Title>
            <Card.Text>
              Try adjusting your search criteria or check back later for new
              sessions.
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {filteredSessions.map((conference) => (
            <Col md={6} lg={4} className="mb-4" key={conference.id}>
              <Card className="h-100">
                <Card.Header>
                  <Badge bg="primary" className="me-2">
                    {conference.title.split(" ")[0]}{" "}
                    {/* Using first word as category for demo */}
                  </Badge>
                  {(conference.seats_taken || 0) >= conference.seats && (
                    <Badge bg="danger">Full</Badge>
                  )}
                </Card.Header>
                <Card.Body>
                  <Card.Title>{conference.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    by {conference.speaker_name}
                  </Card.Subtitle>
                  <Card.Text>
                    {conference.description.substring(0, 100)}
                    {conference.description.length > 100 ? "..." : ""}
                  </Card.Text>
                  <div className="mb-3">
                    <small className="text-muted">
                      <div>
                        <strong>Date:</strong>{" "}
                        {formatDate(conference.starts_at)}
                      </div>
                      <div>
                        <strong>Time:</strong>{" "}
                        {new Date(conference.starts_at).toLocaleTimeString()} -{" "}
                        {new Date(conference.ends_at).toLocaleTimeString()}
                      </div>
                      <div>
                        <strong>Speaker:</strong> {conference.speaker_title}
                      </div>
                      <div>
                        <strong>Attendees:</strong>{" "}
                        {conference.seats_taken || 0}/{conference.seats}
                      </div>
                    </small>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <Link to={`/sessions/${conference.id}`}>
                    <Button variant="outline-primary" className="w-100">
                      View Details
                    </Button>
                  </Link>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Sessions;
