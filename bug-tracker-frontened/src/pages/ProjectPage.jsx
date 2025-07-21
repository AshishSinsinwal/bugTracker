import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/API";
import "./projectPage.css";

const ProjectPage = () => {
  const { user } = useAuth();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [ticketForm, setTicketForm] = useState({
    title: "",
    description: "",
    priority: "Low",
  });

  const fetchDevelopers = async () => {
    try {
      const res = await API.get('/users/developers');
      setDevelopers(res.data.users || []);
    } catch (err) {
      console.error("Failed to fetch developers:", err);
      setError("Failed to fetch developers");
    }
  };

  const fetchProjectData = async () => {
    try {
      setIsLoading(true);
      const res = await API.get(`/projects/${projectId}`);
      setProject(res.data.project);
      setTickets(res.data.project?.tickets || []);
    } catch (err) {
      console.error("Failed to load project:", err);
      setError("Failed to load project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setTicketForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/tickets/create/${projectId}`, ticketForm);
      setTickets((prev) => [...prev, res.data.ticket]);
      setSuccess("New ticket created")
      setTicketForm({ title: "", description: "", priority: "Low" });
    } catch (err) {
      console.error("Failed to create ticket:", err);
      setError("Failed to create ticket");
    }
  };

  const filteredTickets = tickets.filter((ticket) =>
    statusFilter === "all" ? true : ticket.status === statusFilter
  );

  const assignDeveloper = async (ticketId , developerId) => {
    try {
      const res = await API.patch(`/tickets/${ticketId}/assign`, { developerId });
      const updatedTicket = res.data.ticket;
      setTickets((prev) =>
        prev.map((t) => (t._id === updatedTicket._id ? updatedTicket : t))
      );
    } catch (err) {
      setError("Assignment failed");
      console.error("Assignment failed:", err);
    }
  };

  const addComment = async (ticketId, message) => {
    try {
      const res = await API.post(`/tickets/${ticketId}/comment`, { message });
      const updatedTicket = res.data.ticket;
      setTickets((prev) =>
        prev.map((t) => (t._id === updatedTicket._id ? updatedTicket : t))
      );
    } catch (err) {
      console.error("Failed to add comment:", err);
      setError("Failed to add comment");
    }
  };

  const deleteTicket = async (ticketId) => {
    try {
      await API.delete(`/tickets/${ticketId}`);
      setTickets(prev => prev.filter(ticket => ticket._id !== ticketId));
      setSuccess("Ticket deleted");
      if (expandedTicket === ticketId) setExpandedTicket(null);
    } catch (err) {
      console.error("Failed to delete ticket:", err);
      setError("Failed to delete ticket");
    }
  };


  useEffect(() => {
    fetchProjectData();
    fetchDevelopers();
  }, [projectId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
      setSuccess(null);
    } , 3000);
    return () => clearTimeout(timer);
  } ,[error, success]);

  const toggleTicketExpand = (ticketId) => {
    setExpandedTicket(expandedTicket === ticketId ? null : ticketId);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "priority-high";
      case "Medium": return "priority-medium";
      default: return "priority-low";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "done": return "status-done";
      case "in-progress": return "status-in-progress";
      default: return "status-todo";
    }
  };

  return (
    <div className="project-page .dark-theme">
      {error && <div className="error-message"><i className="fa-solid fa-circle-exclamation"></i> {error}</div>}
      {success && <div className="success-message"><i className="fa-solid fa-circle-check"></i> {success}</div>}

      {isLoading ? (
        <div className="loading">Loading project...</div>
      ) : project ? (
        <div>
          <div className="project-header">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
          </div>

          {user.role === "admin" && (
            <div className="create-ticket-form">
              <h4>Create New Ticket</h4>
              <form onSubmit={handleTicketSubmit}>
                <div className="form-group">
                    <label htmlFor="ticketTitle" className="form-label">Title</label>
                  <input 
                  className="form-control"
                    type="text" 
                    name="title" 
                    id="ticketTitle"
                    value={ticketForm.title} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ticketDescription" className="form-label">Description</label>
                  <textarea 
                    className="form-control"
                    name="description" 
                    id="ticketDescription"
                    value={ticketForm.description} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="mb-3 form-group">
                  <label htmlFor="ticketPriority" className="form-label">Priority</label>
                  <select 
                  className="dark-select form-control"
                    name="priority" 
                    value={ticketForm.priority} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-outline-success">Create Ticket</button>
              </form>
            </div>
          )}

          <div className="ticket-filter mb-3 ">
            <label className="form-label" >Filter by status: &nbsp;</label>
            <select 
            className="dark-select form-control"
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Tickets 👇</option>
              <option value="To Do">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
           
          </div>

          {filteredTickets.length === 0 ? (
            <div className="no-tickets">No tickets found</div>
          ) : (
            <div className="tickets-list">
              {filteredTickets
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((ticket) => (
                  <div 
                    key={ticket._id} 
                    className={`ticket-card ${expandedTicket === ticket._id ? 'expanded' : ''}`}
                  >
                    <div 
                      className="ticket-summary" 
                      onClick={() => toggleTicketExpand(ticket._id)}
                    >
                      <div className="ticket-title">{ticket.title}</div>
                      <div className="tickStatPrio">
                          <div className={`ticket-status ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </div>
                          <div className={`ticket-priority ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </div>
                        </div>
                      </div>

                    {expandedTicket === ticket._id && (
                      <div className="ticket-details">
                        <div className="ticket-meta">
                          <div>Assigned to: {ticket.assignedTo?.name || "Unassigned"}</div>
                          <div>
                            Created: {new Date(ticket.createdAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>

                        <div className="ticket-description">
                          <p>{ticket.description}</p>
                        </div>

                        {user.role === "admin" && (
                          <div className="ticket-actions">
                            <select  
                            
                              onChange={(e) => assignDeveloper(ticket._id ,e.target.value)}
                              defaultValue=""
                            >
                              <option value="" disabled>Assign Developer👇</option>
                              {developers.map((dev) => (
                                <option key={dev._id} value={dev._id}>
                                  {dev.name} ({dev.email})
                                </option>
                              ))}
                            </select>
                           
                            <button 
                              className="delete-button"
                              onClick={() => deleteTicket(ticket._id)}
                            >
                               <i className="fa-solid fa-trash"></i>&nbsp;
                               Ticket
                             
                            </button>
                          </div>
                        )}

                        <div className="ticket-comments">
                          <h5>Updates:</h5>
                          {ticket.comments?.length > 0 ? (
                            <ul className="comments-list">
                              {ticket.comments
                                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                .map((comment, idx) => {
                                  const name = comment.author?.name || "User";
                                  const role = comment.author?.role || "user";
                                  const badge = {
                                    admin: "🛡️ Admin",
                                    developer: "🛠️ Developer",
                                    user: "👤 User"
                                  }[role] || "👤";

                                  return (
                                    <li key={idx} className="comment-item">
                                      <div className="comment-meta">
                                        <span className="comment-author">
                                          {badge} {name}
                                        </span>
                                        <span className="comment-time">
                                          {new Date(comment.timestamp).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </span>
                                      </div>
                                      <div className="comment-text">{comment.message}</div>
                                    </li>
                                  );
                                })}
                            </ul>
                          ) : (
                            <div className="no-comments">No updates yet</div>
                          )}

                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              addComment(ticket._id, e.target.commentText.value);
                              e.target.reset();
                            }}
                            className="comment-form"
                          >
                            <input
                              type="text"
                              name="commentText"
                              placeholder="Add an update"
                              required
                              className="form-control"
                            />
                            <button type="submit" className="btn btn-outline-primary">Post</button>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      ) : (
        <div className="no-project">No project found</div>
      )}
    </div>
  );
};

export default ProjectPage;
