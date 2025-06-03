import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Alert,
} from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/auth/AuthProvider";
import { useConference } from "../contexts/conference/ConferenceProvider";
import { Conference, ApiError } from "../types";
import { formatDate } from "../utils/date";

const ProposalDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getConference, deleteConference } = useConference();

  const [proposal, setProposal] = useState<Conference | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataFetched, setDataFetched] = useState(false);

  const fetchProposal = useCallback(async () => {
    if (!id || dataFetched) return;

    setIsLoading(true);
    setError("");

    try {
      const conferenceData = await getConference(id);
      setProposal(conferenceData);
      setDataFetched(true);
    } catch (err) {
      console.error("Failed to load proposal:", err);
      const apiError = err as ApiError;
      setError(
        apiError.data?.message ||
          "Failed to load proposal details. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [id, getConference, dataFetched]);

  useEffect(() => {
    fetchProposal();
  }, [fetchProposal]);

  const handleDelete = async () => {
    if (!id) return;

    setIsLoading(true);
    setDeleteError("");

    try {
      await deleteConference(id);
      navigate("/my-proposals");
    } catch (err) {
      console.error("Failed to delete proposal:", err);
      const apiError = err as ApiError;
      setDeleteError(
        apiError.data?.message || "Failed to delete proposal. Please try again."
      );
      setIsLoading(false);
    }
  };

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

  if (isLoading && !dataFetched) {
    return <div className="text-center py-4">Loading proposal details...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!proposal && dataFetched) {
    return <Alert variant="warning">Proposal not found</Alert>;
  }


  if (!proposal) {
    return null;
  }

  return (
    <Container className="py-4">
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-0">{proposal.title}</h4>
                <div className="mt-2">
                  <Badge bg="primary" className="me-2">
                    {proposal.title.split(" ")[0]}
                  </Badge>
                  {getStatusBadge(proposal.status)}
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              {deleteError && <Alert variant="danger">{deleteError}</Alert>}

              <div className="mb-4">
                <h5>Description</h5>
                <p>{proposal.description}</p>
              </div>

              <div className="mb-4">
                <h5>Speaker Details</h5>
                <p>
                  <strong>Name:</strong> {proposal.speaker_name}
                </p>
                <p>
                  <strong>Title:</strong> {proposal.speaker_title}
                </p>
              </div>

              <div className="mb-4">
                <h5>Target Audience</h5>
                <p>{proposal.target_audience}</p>
              </div>

              {proposal.prerequisites && (
                <div className="mb-4">
                  <h5>Prerequisites</h5>
                  <p>{proposal.prerequisites}</p>
                </div>
              )}

              <Row className="mb-4">
                <Col md={6}>
                  <h5>Capacity</h5>
                  <p>{proposal.seats} seats</p>
                </Col>
                <Col md={6}>
                  <h5>Schedule</h5>
                  <p>
                    <strong>Starts:</strong> {formatDate(proposal.starts_at)}
                  </p>
                  <p>
                    <strong>Ends:</strong> {formatDate(proposal.ends_at)}
                  </p>
                </Col>
              </Row>

              <div className="mb-4">
                <h5>Submission Date</h5>
                <p>{formatDate(proposal.created_at)}</p>
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="d-flex justify-content-between">
                <Button
                  variant="secondary"
                  onClick={() => navigate("/my-proposals")}>
                  Back to My Proposals
                </Button>
                <div>
                  {proposal.status === "pending" && (
                    <>
                      <Link to={`/edit-proposal/${proposal.id}`}>
                        <Button variant="primary" className="me-2">
                          Edit
                        </Button>
                      </Link>
                      {!showDeleteConfirm ? (
                        <Button
                          variant="danger"
                          onClick={() => setShowDeleteConfirm(true)}>
                          Delete
                        </Button>
                      ) : (
                        <Button
                          variant="danger"
                          onClick={handleDelete}
                          disabled={isLoading}>
                          {isLoading ? "Deleting..." : "Confirm Delete"}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Card.Footer>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Status</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-3">
                {getStatusBadge(proposal.status)}
              </div>

              {proposal.status === "pending" && (
                <Alert variant="info">
                  Your proposal is currently under review. We will notify you
                  once a decision has been made.
                </Alert>
              )}

              {proposal.status === "approved" && (
                <Alert variant="success">
                  Congratulations! Your proposal has been approved. You can now
                  prepare for your session.
                </Alert>
              )}

              {proposal.status === "rejected" && (
                <Alert variant="danger">
                  Unfortunately, your proposal has been rejected. Please check
                  the feedback for more information.
                </Alert>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Next Steps</h5>
            </Card.Header>
            <Card.Body>
              {proposal.status === "pending" && (
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    Wait for the review process to complete
                  </li>
                  <li className="list-group-item">
                    You can edit your proposal while it's pending
                  </li>
                  <li className="list-group-item">
                    Check back for updates on your proposal status
                  </li>
                </ul>
              )}

              {proposal.status === "approved" && (
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    Prepare your session materials
                  </li>
                  <li className="list-group-item">
                    Check your session details and schedule
                  </li>
                  <li className="list-group-item">
                    Reach out to the coordinator if you have questions
                  </li>
                </ul>
              )}

              {proposal.status === "rejected" && (
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    Review the feedback provided
                  </li>
                  <li className="list-group-item">
                    Consider submitting a revised proposal
                  </li>
                  <li className="list-group-item">
                    Contact the coordinator for more information
                  </li>
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProposalDetails;
