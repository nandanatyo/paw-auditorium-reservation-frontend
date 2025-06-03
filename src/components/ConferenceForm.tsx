import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useConference } from "../contexts/conference/ConferenceProvider";
import { CreateConferenceRequest, ApiError } from "../types";

const ConferenceForm = () => {
  const { createConference, isLoading, error } = useConference();
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<CreateConferenceRequest>({
    title: "",
    description: "",
    speaker_name: "",
    speaker_title: "",
    target_audience: "",
    prerequisites: null,
    seats: 10,
    starts_at: "",
    ends_at: "",
  });

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

    try {
      const data = {
        ...formData,
        starts_at: new Date(formData.starts_at).toISOString(),
        ends_at: new Date(formData.ends_at).toISOString(),
      };

      await createConference(data);

      setSuccess(true);

      setFormData({
        title: "",
        description: "",
        speaker_name: "",
        speaker_title: "",
        target_audience: "",
        prerequisites: null,
        seats: 10,
        starts_at: "",
        ends_at: "",
      });

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to create conference:", err);
    }
  };

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="mb-4">Create New Conference</h2>

      {success && (
        <Alert variant="success">
          Conference proposal created successfully!
        </Alert>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Conference title"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed description of the conference"
            required
          />
        </Form.Group>

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

        <Form.Group className="mb-3">
          <Form.Label>Target Audience</Form.Label>
          <Form.Control
            type="text"
            name="target_audience"
            value={formData.target_audience}
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

        <Form.Group className="mb-3">
          <Form.Label>Available Seats</Form.Label>
          <Form.Control
            type="number"
            name="seats"
            value={formData.seats}
            onChange={handleChange}
            min="1"
            required
          />
        </Form.Group>

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

        <div className="d-flex justify-content-end mt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Conference"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ConferenceForm;
