
import { useEffect } from "react";
import { Badge, Button, Alert } from "react-bootstrap";
import { useConference } from "../contexts/conference/ConferenceProvider";
import { useAuth } from "../contexts/auth/AuthProvider";
import { ConferenceStatus } from "../types";
import { formatDate } from "../utils/date";

const ConferenceList = () => {
  const {
    conferences,
    isLoading,
    error,
    loadConferences,
    deleteConference,
    updateConferenceStatus,
  } = useConference();
  const { user } = useAuth();


  useEffect(() => {

    const status: ConferenceStatus =
      user?.role === "event_coordinator" ? "pending" : "approved";

    loadConferences({
      status,
      limit: 20,
      order_by: "starts_at",
      order: "asc",
    });
  }, [loadConferences, user]);

  const handleApprove = async (id: string) => {
    try {
      await updateConferenceStatus(id, { status: "approved" });
    } catch (error) {
      console.error("Failed to approve conference:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateConferenceStatus(id, { status: "rejected" });
    } catch (error) {
      console.error("Failed to reject conference:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this conference?")) {
      try {
        await deleteConference(id);
      } catch (error) {
        console.error("Failed to delete conference:", error);
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading conferences...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Conference List</h2>

      {conferences.length === 0 ? (
        <p>No conferences available</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {conferences.map((conference) => (
            <div
              key={conference.id}
              className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{conference.title}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    conference.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : conference.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                  {conference.status}
                </span>
              </div>

              <p className="text-gray-600 my-2">{conference.description}</p>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Speaker:</span>{" "}
                  {conference.speaker_name} ({conference.speaker_title})
                </p>
                <p>
                  <span className="font-medium">Audience:</span>{" "}
                  {conference.target_audience}
                </p>
                <p>
                  <span className="font-medium">Seats:</span>{" "}
                  {conference.seats_taken}/{conference.seats}
                </p>
                <p>
                  <span className="font-medium">Time:</span>{" "}
                  {formatDate(conference.starts_at)} -{" "}
                  {formatDate(conference.ends_at)}
                </p>
                <p>
                  <span className="font-medium">Host:</span>{" "}
                  {conference.host.name}
                </p>
              </div>

              <div className="mt-4 flex space-x-2">
                {user?.role === "event_coordinator" &&
                  conference.status === "pending" && (
                    <>
                      <Button
                        onClick={() => handleApprove(conference.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(conference.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">
                        Reject
                      </Button>
                    </>
                  )}
                {(user?.role === "admin" ||
                  user?.role === "event_coordinator" ||
                  user?.id === conference.host.id) && (
                  <Button
                    onClick={() => handleDelete(conference.id)}
                    className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600">
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConferenceList;
