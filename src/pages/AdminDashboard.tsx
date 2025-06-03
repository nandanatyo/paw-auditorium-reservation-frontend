"use client";

import type React from "react";
import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Alert,
  Button,
} from "react-bootstrap";
import { userService } from "../services/user.service";
import { CreateUserRequest } from "../types";

const AdminDashboard = () => {
  const [newCoordinator, setNewCoordinator] = useState<CreateUserRequest>({
    name: "",
    email: "",
    password: "",
    role: "event_coordinator",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddCoordinator = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await userService.createUser(newCoordinator);

      setNewCoordinator({
        name: "",
        email: "",
        password: "",
        role: "event_coordinator",
      });

      setSuccessMessage("Coordinator added successfully!");
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error("Error adding coordinator:", err);

      setErrorMessage(
        err.message || "Failed to add coordinator. Please try again."
      );
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Admin Dashboard</h1>

      {}
      {showSuccess && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setShowSuccess(false)}>
          {successMessage}
        </Alert>
      )}

      {showError && (
        <Alert variant="danger" dismissible onClose={() => setShowError(false)}>
          {errorMessage}
        </Alert>
      )}

      <Card>
        <Card.Header>
          <h5 className="mb-0">Add New Coordinator</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleAddCoordinator}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newCoordinator.name}
                    onChange={(e) =>
                      setNewCoordinator({
                        ...newCoordinator,
                        name: e.target.value,
                      })
                    }
                    required
                    minLength={3}
                    maxLength={100}
                  />
                  <Form.Text className="text-muted">
                    Name must be between 3 and 100 characters.
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={newCoordinator.email}
                    onChange={(e) =>
                      setNewCoordinator({
                        ...newCoordinator,
                        email: e.target.value,
                      })
                    }
                    required
                    maxLength={320}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={newCoordinator.password}
                onChange={(e) =>
                  setNewCoordinator({
                    ...newCoordinator,
                    password: e.target.value,
                  })
                }
                required
                minLength={8}
                maxLength={72}
              />
              <Form.Text className="text-muted">
                Password must be at least 8 characters.
              </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit">
              Add Coordinator
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
