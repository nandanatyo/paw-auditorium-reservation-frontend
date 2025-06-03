import { Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Conference } from "../types/conference.types";
import { conferenceService } from "../services/conference.service";

const Home = () => {
  const [upcomingConferences, setUpcomingConferences] = useState<Conference[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingConferences = async () => {
      try {
        setLoading(true);
        const response = await conferenceService.getConferences({
          limit: 3,
          status: "approved",
          starts_after: new Date().toISOString(),
          order_by: "starts_at",
          order: "asc",
          include_past: false,
        });
        setUpcomingConferences(response.conferences);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch upcoming conferences:", err);
        setError(
          "Failed to load upcoming conferences. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingConferences();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const startDate = new Date(dateString);
    return startDate.toLocaleDateString("en-US", options);
  };

  const formatTimeRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const sameDay = start.toDateString() === end.toDateString();

    if (sameDay) {
      const dateFormatted = formatDate(startDate);
      const startTime = start.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      const endTime = end.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      return `${dateFormatted} (${startTime} - ${endTime})`;
    } else {
      const startFormatted = formatDate(startDate);
      const endDay = end.getDate();
      return `${startFormatted.replace(
        start.getDate().toString(),
        start.getDate() + "-" + endDay
      )}`;
    }
  };

  return (
    <>
      <Row className="mb-5">
        <Col>
          <div className="home-hero text-center">
            <h1>Welcome to Conference Hub</h1>
            <p className="lead">
              Discover, register, and participate in exciting conference
              sessions. Share your knowledge by proposing your own sessions.
            </p>
            <Link to="/sessions">
              <Button variant="light" size="lg">
                Browse Sessions
              </Button>
            </Link>
          </div>
        </Col>
      </Row>

      {/* Action Cards Section */}
      <Row className="mb-5">
        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="mb-3">Discover Sessions</Card.Title>
              <Card.Text className="flex-grow-1">
                Browse through a wide range of conference sessions on various
                topics. Explore interesting presentations and workshops.
              </Card.Text>
              <div className="mt-auto">
                <Link to="/sessions">
                  <Button variant="outline-primary">View Sessions</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="mb-3">Propose a Session</Card.Title>
              <Card.Text className="flex-grow-1">
                Share your expertise by proposing a unique session for the
                conference. Contribute your knowledge and insights to the
                community.
              </Card.Text>
              <div className="mt-auto">
                <Link to="/create-proposal">
                  <Button variant="outline-primary">Create Proposal</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <h2 className="text-center mb-4">Upcoming Conferences</h2>

          {loading && <p className="text-center">Loading conferences...</p>}

          {error && <p className="text-center text-danger">{error}</p>}

          {!loading && !error && upcomingConferences.length === 0 && (
            <p className="text-center">No upcoming conferences found.</p>
          )}

          {!loading &&
            !error &&
            upcomingConferences.map((conference) => (
              <Card key={conference.id} className="mb-4">
                <Card.Body>
                  <Card.Title>{conference.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {formatTimeRange(conference.starts_at, conference.ends_at)}
                  </Card.Subtitle>
                  <Card.Text>
                    {conference.description.length > 150
                      ? `${conference.description.substring(0, 150)}...`
                      : conference.description}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">
                        Speaker: {conference.speaker_name},{" "}
                        {conference.speaker_title}
                      </small>
                    </div>
                    <Link to={`/sessions/${conference.id}`}>
                      <Button variant="primary">Learn More</Button>
                    </Link>
                  </div>
                </Card.Body>
                <Card.Footer className="text-muted">
                  Available seats:{" "}
                  {conference.seats - (conference.seats_taken || 0)} of{" "}
                  {conference.seats}
                </Card.Footer>
              </Card>
            ))}
        </Col>
      </Row>
    </>
  );
};

export default Home;
