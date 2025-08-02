import { use, useEffect, useState } from "react";
import API from "../api/API";
import "./developerDashboard.css";

const DeveloperDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [commentTexts, setCommentTexts] = useState({});

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const res = await API.get("/tickets/my-tickets");
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error("Fetch tickets error:", err);
      setError("Failed to load tickets");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTickets = tickets.filter((ticket) =>
    statusFilter === "all" ? true : ticket.status === statusFilter
  );

  const updateStatus = async (ticketId, newStatus) => {
    try {
      
      const res = await API.patch(`/tickets/${ticketId}/status`, {
        status: newStatus,
      });
      
      // Update with the full response in case backend modifies anything
      console.log(res.data.ticket);
      setTickets(prev => prev.map(ticket => 
        ticket._id === ticketId ? res.data.ticket : ticket
      ));
      setSuccess("status updated successfully");
      
    } catch (err) {
      setError("Failed to update status");
      // Revert the optimistic update if the API call fails
      
    }
  };

  const addComment = async (ticketId) => {
    const message = commentTexts[ticketId]?.trim();
    if (!message) return;

    try {
      const res = await API.post(`/tickets/${ticketId}/comment`, { message });
      const updated = res.data.ticket;

      setTickets((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );
      setCommentTexts((prev) => ({ ...prev, [ticketId]: "" }));
    } catch (err) {
      console.error("Add comment error:", err);
      setError("Failed to add comment");
    }
  };

  const handleCommentChange = (ticketId, value) => {
    setCommentTexts((prev) => ({ ...prev, [ticketId]: value }));
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "High": return "bg-danger";
      case "Medium": return "bg-warning text-dark";
      default: return "bg-secondary";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "done": return "bg-success";
      case "in-progress": return "bg-primary";
      default: return "bg-info";
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
      setSuccess(null);
    } , 3000);
    return () => clearTimeout(timer);
  } ,[error, success]);

  return (
    <div className="developer-dashboard">
       {error && <div className="error-message m-2"><i class="fa-solid fa-circle-exclamation "></i>  {error}</div>}
         {success && <div className="success-message m-2"><i className="fa-solid fa-circle-check"></i>   {success}</div>}
      <div className="container py-4">
        <div className="developer-header mb-3">
          <h2 className="pt-2 pb-2">🧑‍💻Developer Dashboard</h2>
        </div>
        

        <div className="mb-3 ">
          <select
           className="dark-select form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Tickets👇</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        {isLoading ? (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="alert alert-info">
            {statusFilter === "all"
              ? "You don't have any assigned tickets"
              : `No tickets with status "${statusFilter}"`}
          </div>
        ) : (
          filteredTickets
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map((ticket) => (
              <div key={ticket._id} className="dark-card  card mb-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5>{ticket.title}</h5>
                    <small className="text-muted">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <div className="d-flex gap-2 mb-2">
                    <span className={`badge ${getStatusBadgeClass(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    <span className={`badge ${getPriorityBadgeClass(ticket.priority)}`}>
                      {ticket.priority} Priority
                    </span>
                  </div>

                  

                  <div className="mb-3">
                    {ticket.status !== "In Progress" && ticket.status !== "Done" && (
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => updateStatus(ticket._id, "In Progress")}
                      >
                        Start Progress
                      </button>
                    )}
                    {ticket.status !== "Done" && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => updateStatus(ticket._id, "Done")}
                        disabled={ticket.status !== "In Progress"}
                      >
                        Mark Done
                      </button>
                    )}
                  </div>
                   <h6>Project : {ticket.project.name}</h6>
                
                  <h6>Updates</h6>
                  <ul className="dark-list-group mb-3">
                    {ticket.comments?.length > 0 ? (
                      ticket.comments
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                        .map((comment, idx) => (
                          <li key={idx} className=" dark-list-item list-group-item">
                            <strong>{comment.author?.name || "User"}</strong>:{" "}
                            {comment.message}
                            <div className="text-muted small">
                               {new Date(comment.timestamp).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                 })}
                            </div>
                          </li>
                        ))
                    ) : (
                      <li className="list-group-item">No updates yet</li>
                    )}
                  </ul>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      addComment(ticket._id);
                    }}
                  >
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add an update..."
                        value={commentTexts[ticket._id] || ""}
                        onChange={(e) =>
                          handleCommentChange(ticket._id, e.target.value)
                        }
                      />
                      <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={!commentTexts[ticket._id]?.trim()}
                      >
                        <i className="fa-solid fa-paper-plane"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default DeveloperDashboard;