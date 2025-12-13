import axios from "axios";

const FRIEND_BACKEND_URL = "http://127.0.0.1:8000";

export async function sendToFriendBackend(workerJson) {
  const payload = {
    worker_json: workerJson,
    jury_rubric: {
      criteria: [
        { name: "Innovation", weight: 25 },
        { name: "Technical Implementation", weight: 25 },
        { name: "AI Utilization", weight: 25 },
        { name: "Impact & Expandability", weight: 15 },
        { name: "Presentation", weight: 10 }
      ]
    }
  };

  const response = await axios.post(
    `${FRIEND_BACKEND_URL}/generate-report`,
    payload,
    { headers: { "Content-Type": "application/json" } }
  );

  return response.data;
}
