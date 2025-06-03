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
import { UpdateUserProfileRequest, ApiError } from "../types";
import { userService } from "../services/user.service";

const EditProfile = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user && !isLoading) {
      navigate("/login");
    }
  }, [user, navigate, isLoading]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const updateData: UpdateUserProfileRequest = {};

      if (formData.name !== user?.name) {
        updateData.name = formData.name;
      }

      if (formData.bio !== user?.bio) {
        updateData.bio = formData.bio;
      }

      if (Object.keys(updateData).length > 0) {
        await userService.updateProfile(updateData);

        await refreshUser();
        setSuccess(true);
      } else {
        setSuccess(true);
      }

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Profile update error:", err);
      const apiError = err as ApiError;
      setError(
        apiError.data?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h4">Edit Profile</Card.Header>
            <Card.Body>
              {success && (
                <Alert variant="success">Profile updated successfully!</Alert>
              )}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    readOnly
                  />
                  <Form.Text className="text-muted">
                    Email cannot be changed
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself"
                  />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/profile")}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
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

export default EditProfile;
