
import { useEffect, useState } from "react";

import {
  getMyRequests,
  cancelFoodRequest
} from "../services/ngoService";

import RequestStatusBadge from "../components/RequestStatusBadge";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRequests() {
    try {
      setLoading(true);
      setError("");

      const data = await getMyRequests();
      setRequests(data);

    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(requestId) {
    try {
      await cancelFoodRequest(requestId);
      await loadRequests();

    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  if (loading) return <p>Loading requests...</p>;

  return (
    <section>
      <h1>My Food Requests</h1>

      {error && <p className="error-message">{error}</p>}

      {requests.length === 0 ? (
        <p>You haven't requested any food yet.</p>
      ) : (
        <div className="requests-list">

          {requests.map((request) => (
            <article className="request-card" key={request.id}>

              <h3>
                {request.donation?.food_name || "Food Donation"}
              </h3>

              <p>
                Category: {request.donation?.category}
              </p>

              <p>
                Requested on:{" "}
                {new Date(request.created_at).toLocaleDateString("en-IN")}
              </p>

              <RequestStatusBadge status={request.status} />

              {request.message && (
                <p>Message: {request.message}</p>
              )}

              {request.status === "pending" && (
                <button
                  onClick={() => handleCancel(request.id)}
                >
                  Cancel Request
                </button>
              )}

            </article>
          ))}

        </div>
      )}
    </section>
  );
}

export default MyRequests;
