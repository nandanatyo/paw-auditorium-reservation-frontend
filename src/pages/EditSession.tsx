import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useConference } from "../contexts/conference/ConferenceProvider";
import { Conference, UpdateConferenceRequest, ApiError } from "../types";
import { useAuth } from "../contexts/auth/AuthProvider";

const EditSession = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getConference, updateConference, isLoading, error } = useConference();

  const [conference, setConference] = useState<Conference | null>(null);
  const [formData, setFormData] = useState<UpdateConferenceRequest>({});
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchConference = async () => {
      try {
        const conferenceData = await getConference(id);

        if (user?.id !== conferenceData.host.id) {
          setFormError("You don't have permission to edit this session");
          return;
        }

        setConference(conferenceData);

        setFormData({
          title: conferenceData.title,
          description: conferenceData.description,
          speaker_name: conferenceData.speaker_name,
          speaker_title: conferenceData.speaker_title,
          target_audience: conferenceData.target_audience,
          prerequisites: conferenceData.prerequisites,
          seats: conferenceData.seats,
          starts_at: new Date(conferenceData.starts_at)
            .toISOString()
            .slice(0, 16),
          ends_at: new Date(conferenceData.ends_at).toISOString().slice(0, 16),
        });
      } catch (err) {
        console.error("Failed to load conference:", err);
        const apiError = err as ApiError;
        setFormError(
          apiError.data?.message || "Failed to load session details"
        );
      }
    };

    fetchConference();
  }, [id, getConference, user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "seats" ? parseInt(value) || 0 : value,
    }));
  };

  const handleChangePrerequisites = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      prerequisites: value || null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !conference) return;

    setIsSubmitting(true);
    setFormError("");

    try {
      if (conference.status === "approved") {
        const allowedUpdates: Partial<UpdateConferenceRequest> = {};

        if (formData.description !== conference.description)
          allowedUpdates.description = formData.description;

        if (formData.prerequisites !== conference.prerequisites)
          allowedUpdates.prerequisites = formData.prerequisites;

        await updateConference(id, allowedUpdates);
      } else {
        const updates: UpdateConferenceRequest = {};

        if (formData.title !== conference.title) updates.title = formData.title;
        if (formData.description !== conference.description)
          updates.description = formData.description;
        if (formData.speaker_name !== conference.speaker_name)
          updates.speaker_name = formData.speaker_name;
        if (formData.speaker_title !== conference.speaker_title)
          updates.speaker_title = formData.speaker_title;
        if (formData.target_audience !== conference.target_audience)
          updates.target_audience = formData.target_audience;
        if (formData.prerequisites !== conference.prerequisites)
          updates.prerequisites = formData.prerequisites;
        if (formData.seats !== conference.seats) updates.seats = formData.seats;


        const newStartsAt = new Date(
          formData.starts_at as string
        ).toISOString();
        const newEndsAt = new Date(formData.ends_at as string).toISOString();

        if (newStartsAt !== conference.starts_at)
          updates.starts_at = newStartsAt;
        if (newEndsAt !== conference.ends_at) updates.ends_at = newEndsAt;

        await updateConference(id, updates);
      }

      setSuccess(true);


      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to update session:", err);
      const apiError = err as ApiError;
      setFormError(
        apiError.data?.message || "Failed to update session. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading session details...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (formError === "You don't have permission to edit this session") {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          {formError}. <Link to="/my-sessions">Return to My Sessions</Link>
        </Alert>
      </Container>
    );
  }

  if (!conference && !isLoading) {
    return <Alert variant="warning">Session not found</Alert>;
  }

  const isApproved = conference?.status === "approved";

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h4">
              Edit Session
              {isApproved && (
                <span className="ms-2 badge bg-success">Approved</span>
              )}
            </Card.Header>
            <Card.Body>
              {formError && <Alert variant="danger">{formError}</Alert>}
              {success && (
                <Alert variant="success">Session updated successfully!</Alert>
              )}
              {isApproved && (
                <Alert variant="info">
                  This session has been approved. Some fields cannot be
                  modified.
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Session Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title || ""}
                    onChange={handleChange}
                    disabled={isApproved}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Speaker Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="speaker_name"
                        value={formData.speaker_name || ""}
                        onChange={handleChange}
                        disabled={isApproved}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Speaker Title</Form.Label>
                      <Form.Control
                        type="text"
                        name="speaker_title"
                        value={formData.speaker_title || ""}
                        onChange={handleChange}
                        disabled={isApproved}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Target Audience</Form.Label>
                  <Form.Control
                    type="text"
                    name="target_audience"
                    value={formData.target_audience || ""}
                    onChange={handleChange}
                    disabled={isApproved}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Prerequisites (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="prerequisites"
                    value={formData.prerequisites || ""}
                    onChange={handleChangePrerequisites}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date and Time</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="starts_at"
                        value={formData.starts_at as string}
                        onChange={handleChange}
                        disabled={isApproved}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>End Date and Time</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="ends_at"
                        value={formData.ends_at as string}
                        onChange={handleChange}
                        disabled={isApproved}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Available Seats</Form.Label>
                  <Form.Control
                    type="number"
                    name="seats"
                    value={formData.seats || 0}
                    onChange={handleChange}
                    disabled={isApproved}
                    min="1"
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/my-sessions")}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditSession;
