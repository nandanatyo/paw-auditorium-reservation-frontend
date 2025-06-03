import { useState, useEffect, useCallback } from "react";
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

const EditProposal = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getConference, updateConference, isLoading, error } = useConference();

  const [conference, setConference] = useState<Conference | null>(null);
  const [formData, setFormData] = useState<UpdateConferenceRequest>({});
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (!id) {
      setLocalLoading(false);
      return;
    }

    const fetchConference = async () => {
      try {
        setLocalLoading(true);
        const conferenceData = await getConference(id);

        if (isMounted) {
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
            ends_at: new Date(conferenceData.ends_at)
              .toISOString()
              .slice(0, 16),
          });

          setLocalLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load conference:", err);
          const apiError = err as ApiError;
          setFormError(
            apiError.data?.message || "Failed to load conference details"
          );
          setLocalLoading(false);
        }
      }
    };

    fetchConference();

    return () => {
      isMounted = false;
    };
  }, [id]);

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

      const newStartsAt = new Date(formData.starts_at as string).toISOString();
      const newEndsAt = new Date(formData.ends_at as string).toISOString();

      if (newStartsAt !== conference.starts_at) updates.starts_at = newStartsAt;
      if (newEndsAt !== conference.ends_at) updates.ends_at = newEndsAt;

      await updateConference(id, updates);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to update conference:", err);
      const apiError = err as ApiError;
      setFormError(
        apiError.data?.message || "Failed to update proposal. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (localLoading) {
    return <div className="text-center py-4">Loading proposal details...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!conference && !localLoading) {
    return <Alert variant="warning">Proposal not found</Alert>;
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h4">Edit Proposal</Card.Header>
            <Card.Body>
              {formError && <Alert variant="danger">{formError}</Alert>}
              {success && (
                <Alert variant="success">Proposal updated successfully!</Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Session Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title || ""}
                    onChange={handleChange}
                    placeholder="Enter a descriptive title for your session"
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
                    placeholder="Provide a detailed description of your session"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Speaker Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="speaker_name"
                    value={formData.speaker_name || ""}
                    onChange={handleChange}
                    placeholder="Speaker's full name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Speaker Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="speaker_title"
                    value={formData.speaker_title || ""}
                    onChange={handleChange}
                    placeholder="Speaker's position/role"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Target Audience</Form.Label>
                  <Form.Control
                    type="text"
                    name="target_audience"
                    value={formData.target_audience || ""}
                    onChange={handleChange}
                    placeholder="Who should attend?"
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
                    placeholder="Required knowledge/skills"
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
                    min="1"
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/my-proposals/${id}`)}>
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

export default EditProposal;
