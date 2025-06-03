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
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth/AuthProvider";
import { useConference } from "../contexts/conference/ConferenceProvider";
import { CreateConferenceRequest, ApiError } from "../types";

const CreateProposal = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { createConference, isLoading: isCreating } = useConference();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CreateConferenceRequest>({
    title: "",
    description: "",
    speaker_name: "",
    speaker_title: "",
    target_audience: "",
    prerequisites: null,
    seats: 30,
    starts_at: "",
    ends_at: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (user && user.name) {
      setFormData((prev) => ({
        ...prev,
        speaker_name: user.name || "",
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "seats") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleChangePrerequisites = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      prerequisites: value || null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (
      !formData.title ||
      !formData.description ||
      !formData.speaker_name ||
      !formData.speaker_title ||
      !formData.target_audience ||
      !formData.starts_at ||
      !formData.ends_at
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      const data = {
        ...formData,
        starts_at: new Date(formData.starts_at).toISOString(),
        ends_at: new Date(formData.ends_at).toISOString(),
      };

      await createConference(data);

      navigate("/my-proposals");
    } catch (err) {
      console.error("Failed to create proposal:", err);
      const apiError = err as ApiError;
      setError(
        apiError.data?.message || "Failed to create proposal. Please try again."
      );
    }
  };

  if (isLoading) {
    return (
      <Container className="py-4">
        <div className="text-center">Loading...</div>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h4">Create Session Proposal</Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Session Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
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
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide a detailed description of your session"
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
                        value={formData.speaker_name}
                        onChange={handleChange}
                        placeholder="Speaker's full name"
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
                        value={formData.speaker_title}
                        onChange={handleChange}
                        placeholder="Speaker's position/role"
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
                    value={formData.target_audience}
                    onChange={handleChange}
                    placeholder="Who should attend this session?"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Prerequisites (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="prerequisites"
                    value={formData.prerequisites || ""}
                    onChange={handleChangePrerequisites}
                    placeholder="What should attendees already know before attending your session?"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date and Time</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="starts_at"
                        value={formData.starts_at}
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
                        value={formData.ends_at}
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
                    value={formData.seats}
                    onChange={handleChange}
                    min="5"
                    max="100"
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button variant="secondary" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={isCreating}>
                    {isCreating ? "Submitting..." : "Submit Proposal"}
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

export default CreateProposal;
