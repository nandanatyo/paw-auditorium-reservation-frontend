"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Table,
  Badge,
  Button,
  Tabs,
  Tab,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { conferenceService } from "../services/conference.service";
import { feedbackService } from "../services/feedback.service";
import { Conference, ConferenceStatus } from "../types/conference.types";
import { Feedback } from "../types/feedback.types";

const CoordinatorDashboard = () => {
  const [key, setKey] = useState("proposals");
  const [isLoading, setIsLoading] = useState({
    conferences: true,
    activeSessions: true,
    feedback: true,
  });
  const [pendingProposals, setPendingProposals] = useState<Conference[]>([]);
  const [activeSessions, setActiveSessions] = useState<Conference[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingProposals = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, conferences: true }));

        const response = await conferenceService.getConferences({
          limit: 20,
          status: "pending",
          order_by: "created_at",
          order: "desc",
        });

        setPendingProposals(response.conferences);
        setError(null);
      } catch (err) {
        console.error("Error fetching pending proposals:", err);
        setError("Failed to load proposals. Please try again later.");
      } finally {
        setIsLoading((prev) => ({ ...prev, conferences: false }));
      }
    };

    if (key === "proposals") {
      fetchPendingProposals();
    }
  }, [key]);

  useEffect(() => {
    const fetchActiveSessions = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, activeSessions: true }));

        const response = await conferenceService.getConferences({
          limit: 20,
          status: "approved",
          order_by: "starts_at",
          order: "asc",
          include_past: false,
        });

        setActiveSessions(response.conferences);
        setError(null);
      } catch (err) {
        console.error("Error fetching active sessions:", err);
        setError("Failed to load active sessions. Please try again later.");
      } finally {
        setIsLoading((prev) => ({ ...prev, activeSessions: false }));
      }
    };

    if (key === "sessions") {
      fetchActiveSessions();
    }
  }, [key]);

  useEffect(() => {
    const fetchAllFeedbacks = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, feedback: true }));
        setFeedbacks([]);

        const conferencesResp = await conferenceService.getConferences({
          limit: 20,
          status: "approved",
          order_by: "starts_at",
          order: "desc",
          include_past: true,
        });

        let allFeedbacks: Feedback[] = [];

        if (conferencesResp.conferences.length > 0) {
          for (const conference of conferencesResp.conferences) {
            try {
              const feedbackResp = await feedbackService.getConferenceFeedbacks(
                conference.id,
                { limit: 20 }
              );

              const feedbacksWithConference = feedbackResp.feedbacks.map(
                (feedback) => ({
                  ...feedback,
                  conference_title: conference.title,
                })
              );

              allFeedbacks = [...allFeedbacks, ...feedbacksWithConference];
            } catch (error) {
              console.error(
                `Error fetching feedback for conference ${conference.id}:`,
                error
              );
            }
          }
        }

        setFeedbacks(allFeedbacks);
        setError(null);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
        setError("Failed to load feedbacks. Please try again later.");
      } finally {
        setIsLoading((prev) => ({ ...prev, feedback: false }));
      }
    };

    if (key === "feedback") {
      fetchAllFeedbacks();
    }
  }, [key]);

  const handleApproveProposal = async (id: string) => {
    try {
      await conferenceService.updateConferenceStatus(id, {
        status: "approved",
      });

      setPendingProposals((proposals) =>
        proposals.filter((proposal) => proposal.id !== id)
      );
    } catch (err: any) {
      console.error("Error approving proposal:", err);

      if (err.response?.data?.error_code === "TIME_WINDOW_CONFLICT") {
        const conflictDetails = err.response.data.detail?.conferences || [];
        const conflictMessage = `
          Terjadi konflik jadwal. Konferensi ini bertabrakan dengan:
          ${conflictDetails
            .map(
              (conf: any) =>
                `- ${conf.title} (${new Date(
                  conf.starts_at
                ).toLocaleString()} - ${new Date(
                  conf.ends_at
                ).toLocaleString()})`
            )
            .join("\n")}

          Silakan edit waktu konferensi terlebih dahulu sebelum menyetujui.
        `;
        setError(conflictMessage);
      } else {
        setError("Failed to approve proposal. Please try again.");
      }
    }
  };

  const handleRejectProposal = async (id: string) => {
    try {
      await conferenceService.updateConferenceStatus(id, {
        status: "rejected",
      });

      setPendingProposals((proposals) =>
        proposals.filter((proposal) => proposal.id !== id)
      );
    } catch (err) {
      console.error("Error rejecting proposal:", err);
      setError("Failed to reject proposal. Please try again.");
    }
  };

  const handleRemoveSession = async (id: string) => {
    try {
      await conferenceService.deleteConference(id);

      setActiveSessions((sessions) =>
        sessions.filter((session) => session.id !== id)
      );
    } catch (err) {
      console.error("Error removing session:", err);
      setError("Failed to remove session. Please try again.");
    }
  };

  const handleRemoveFeedback = async (id: string) => {
    try {
      await feedbackService.deleteFeedback(id);

      setFeedbacks((feedbacks) =>
        feedbacks.filter((feedback) => feedback.id !== id)
      );
    } catch (err) {
      console.error("Error removing feedback:", err);
      setError("Failed to remove feedback. Please try again.");
    }
  };

  const getStatusBadge = (status: ConferenceStatus) => {
    switch (status) {
      case "pending":
        return <Badge bg="warning">Pending</Badge>;
      case "approved":
        return <Badge bg="success">Approved</Badge>;
      case "rejected":
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString();
  };

  const formatTime = (startIso: string, endIso: string) => {
    const start = new Date(startIso);
    const end = new Date(endIso);
    return `${start.toLocaleTimeString()} - ${end.toLocaleTimeString()}`;
  };

  const renderLoading = () => (
    <div className="text-center py-4">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );

  const renderError = () =>
    error && (
      <Alert variant="danger" className="mt-3">
        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{error}</pre>
        <div className="mt-2">
          <Button
            className="ms-2"
            variant="outline-danger"
            size="sm"
            onClick={() => setError(null)}>
            Dismiss
          </Button>
        </div>
      </Alert>
    );

  return (
    <Container className="py-4">
      <h1 className="mb-4">Coordinator Dashboard</h1>

      {renderError()}

      <Tabs
        id="coordinator-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k || "proposals")}
        className="mb-4">
        <Tab eventKey="proposals" title="Session Proposals">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Session Proposals</h5>
            </Card.Header>
            <Card.Body>
              {isLoading.conferences ? (
                renderLoading()
              ) : pendingProposals.length === 0 ? (
                <Alert variant="info">No pending proposals to review.</Alert>
              ) : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Speaker</th>
                      <th>Target Audience</th>
                      <th>Submitted</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingProposals.map((proposal) => (
                      <tr key={proposal.id}>
                        <td>{proposal.title}</td>
                        <td>{proposal.speaker_name}</td>
                        <td>{proposal.target_audience}</td>
                        <td>{formatDate(proposal.created_at)}</td>
                        <td>{getStatusBadge(proposal.status)}</td>
                        <td>
                          {proposal.status === "pending" && (
                            <div className="d-flex gap-2">
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() =>
                                  handleApproveProposal(proposal.id)
                                }>
                                Approve
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() =>
                                  handleRejectProposal(proposal.id)
                                }>
                                Reject
                              </Button>
                              <Link to={`/sessions/${proposal.id}`}>
                                <Button variant="outline-primary" size="sm">
                                  Details
                                </Button>
                              </Link>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="sessions" title="Active Sessions">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Active Sessions</h5>
            </Card.Header>
            <Card.Body>
              {isLoading.activeSessions ? (
                renderLoading()
              ) : activeSessions.length === 0 ? (
                <Alert variant="info">No active sessions found.</Alert>
              ) : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Speaker</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Host</th>
                      <th>Attendees</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeSessions.map((session) => (
                      <tr key={session.id}>
                        <td>{session.title}</td>
                        <td>{session.speaker_name}</td>
                        <td>{formatDate(session.starts_at)}</td>
                        <td>
                          {formatTime(session.starts_at, session.ends_at)}
                        </td>
                        <td>{session.host.name}</td>
                        <td>
                          {session.seats_taken ?? 0}/{session.seats}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Link to={`/sessions/${session.id}`}>
                              <Button variant="primary" size="sm">
                                View
                              </Button>
                            </Link>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleRemoveSession(session.id)}>
                              Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="feedback" title="User Feedback">
          <Card>
            <Card.Header>
              <h5 className="mb-0">User Feedback</h5>
            </Card.Header>
            <Card.Body>
              {isLoading.feedback ? (
                renderLoading()
              ) : feedbacks.length === 0 ? (
                <Alert variant="info">No feedback found.</Alert>
              ) : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Session</th>
                      <th>User</th>
                      <th>Comment</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbacks.map((item) => (
                      <tr key={item.id}>
                        <td>{item.conference_title}</td>
                        <td>{item.user.name}</td>
                        <td>{item.comment}</td>
                        <td>{formatDate(item.created_at)}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleRemoveFeedback(item.id)}>
                              Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default CoordinatorDashboard;
