import { useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  Modal,
  InputGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth/AuthProvider";
import { authService } from "../services/auth.service";
import { RegisterRequest, ApiError } from "../types";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { register, requestRegisterOTP } = useAuth();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email" && isEmailVerified) {
      setIsEmailVerified(false);
    }

    if (name === "email" && errors.email) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!isEmailVerified) newErrors.email = "Email verification is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEmail = () => {
    if (!formData.email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Email is invalid" }));
      return false;
    }
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.email;
      return newErrors;
    });
    return true;
  };

  const handleSendVerification = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!validateEmail()) return;

    try {
      setIsVerifying(true);

      await requestRegisterOTP(formData.email);
      setShowOtpModal(true);
      setOtpError("");
    } catch (error) {
      console.error("Failed to request OTP:", error);
      const apiError = error as ApiError;

      if (apiError.data?.error_code === "EMAIL_ALREADY_REGISTERED") {
        setErrors((prev) => ({
          ...prev,
          email: "Email already registered. Please login or use another email.",
        }));
      } else {
        setOtpError(
          apiError.data?.message || "Failed to send verification code"
        );
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value.length === 1 && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<any>) => {
    const target = e.target as HTMLInputElement;

    if (e.key === "Backspace" && index > 0 && !target.value) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setOtpError("Please enter all 6 digits");
      return;
    }

    setIsVerifying(true);

    try {
      await authService.checkRegisterOTP({
        email: formData.email,
        otp: otpValue,
      });

      setIsEmailVerified(true);
      setShowOtpModal(false);
      setOtpError("");
    } catch (error) {
      console.error("Failed to verify OTP:", error);
      const apiError = error as ApiError;
      setOtpError(apiError.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const registerData: RegisterRequest = {
        email: formData.email,
        otp: otp.join(""),
        name: formData.name,
        password: formData.password,
      };

      await register(registerData);
      navigate("/profile");
    } catch (error) {
      console.error("Registration failed:", error);
      const apiError = error as ApiError;

      if (apiError.data?.error_code === "EMAIL_ALREADY_REGISTERED") {
        setErrors((prev) => ({
          ...prev,
          email: "Email already registered. Please login or use another email.",
        }));
        setSubmitError("Registration failed: Email already in use");
      } else {
        setSubmitError(
          apiError.data?.message || "Registration failed. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h4" className="text-center">
              Create an Account
            </Card.Header>
            <Card.Body>
              {submitError && <Alert variant="danger">{submitError}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        isInvalid={!!errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          isInvalid={!!errors.email}
                          isValid={isEmailVerified}
                        />
                        <Button
                          variant={
                            isEmailVerified ? "success" : "outline-secondary"
                          }
                          onClick={handleSendVerification}
                          disabled={isVerifying || isEmailVerified}>
                          {isVerifying
                            ? "Sending..."
                            : isEmailVerified
                            ? "Verified"
                            : "Verify"}
                        </Button>
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </InputGroup>
                      {isEmailVerified && (
                        <Form.Text className="text-success">
                          Email verified successfully!
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        isInvalid={!!errors.confirmPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Bio (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself"
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting || !isEmailVerified}>
                    {isSubmitting ? "Registering..." : "Register"}
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-3">
                Already have an account? <Link to="/login">Login here</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* OTP Verification Modal */}
      <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Email Verification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center mb-4">
            Please enter the 6-digit verification code sent to
            <strong> {formData.email}</strong>
          </p>

          <div className="d-flex justify-content-center mb-3">
            {otp.map((digit, index) => (
              <Form.Control
                key={index}
                ref={(el) => {
                  otpInputRefs.current[index] = el;
                }}
                className="mx-1 text-center"
                style={{ width: "45px" }}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                maxLength={1}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {otpError && (
            <Alert variant="danger" className="text-center py-2">
              {otpError}
            </Alert>
          )}

          <div className="text-center mt-3">
            <Button
              variant="link"
              disabled={isVerifying}
              onClick={handleSendVerification}>
              Resend Code
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOtpModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleVerifyOtp}
            disabled={isVerifying || otp.join("").length !== 6}>
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Register;
