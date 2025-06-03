import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth/AuthProvider";
import { Conference, ApiError, ConferenceStatus } from "../types";
import { formatDate } from "../utils/date";
import { conferenceService } from "../services/conference.service";

const MyProposals = () => {
  const { user, isLoading: isLoadingUser } = useAuth();
  const [myProposals, setMyProposals] = useState<Conference[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataFetched, setDataFetched] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProposals = async () => {
      if (!user || !user.id || dataFetched) return;

      setIsLoading(true);
      setError("");

      try {

        const pendingResult = await conferenceService.getConferences({
          host_id: user.id,
          limit: 20,
          status: "pending" as ConferenceStatus,
          order_by: "created_at",
          order: "desc",
        });

        const approvedResult = await conferenceService.getConferences({
          host_id: user.id,
          limit: 20,
          status: "approved" as ConferenceStatus,
          order_by: "created_at",
          order: "desc",
        });

        const rejectedResult = await conferenceService.getConferences({
          host_id: user.id,
          limit: 20,
          status: "rejected" as ConferenceStatus,
          order_by: "created_at",
          order: "desc",
        });


        const allProposals = [
          ...pendingResult.conferences,
          ...approvedResult.conferences,
          ...rejectedResult.conferences,
        ];


        allProposals.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setMyProposals(allProposals);
        setDataFetched(true);
      } catch (err) {
        console.error("Failed to load proposals:", err);
        const apiError = err as ApiError;
        setError(
          apiError.data?.message ||
            "Failed to load your proposals. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposals();
  }, [user, dataFetched]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge bg="warning">Pending Review</Badge>;
      case "approved":
        return <Badge bg="success">Approved</Badge>;
      case "rejected":
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  if (isLoadingUser || (isLoading && !dataFetched)) {
    return (
      <Container className="py-4">
        <div className="text-center">Loading proposals...</div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="py-4">
        <Card>
          <Card.Body className="text-center">
            <p>Please log in to view your proposals.</p>
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

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Proposals</h1>
        <Link to="/create-proposal">
          <Button variant="primary">Create New Proposal</Button>
        </Link>
      </div>

      {myProposals.length === 0 ? (
        <Card>
          <Card.Body className="text-center">
            <p>You haven't submitted any proposals yet.</p>
            <Link to="/create-proposal">
              <Button variant="primary">Create Your First Proposal</Button>
            </Link>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {myProposals.map((proposal) => (
            <Col md={6} lg={4} className="mb-4" key={proposal.id}>
              <Card className="h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <Badge bg="primary">{proposal.title.split(" ")[0]}</Badge>
                  {getStatusBadge(proposal.status)}
                </Card.Header>
                <Card.Body>
                  <Card.Title>{proposal.title}</Card.Title>
                  <Card.Text>
                    {proposal.description.length > 100
                      ? `${proposal.description.substring(0, 100)}...`
                      : proposal.description}
                  </Card.Text>
                  <div className="text-muted mb-3">
                    <small>
                      Submitted on: {formatDate(proposal.created_at)}
                    </small>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <Link to={`/my-proposals/${proposal.id}`}>
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

export default MyProposals;
