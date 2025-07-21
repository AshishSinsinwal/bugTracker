import { useEffect, useState } from "react";
import API from "../api/API";
import { Link } from "react-router-dom";
import "./adminDashboard.css";

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projectLoading, setProjectLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setProjectLoading(true);
      const res = await API.get("/projects/my-projects");
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load projects");
    } finally {
      setProjectLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Auto-dismiss messages after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 3000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [error, success]); // Runs whenever error or success changes

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/projects/create", formData);
      setProjects((prev) => [...prev, res.data.project]);
      setFormData({ name: "", description: "" });
      setShowModal(false);
      setError("");
      setSuccess("Project created successfully");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Could not create project");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteProj = async (projectId) => {
  try {
    await API.delete(`/projects/${projectId}`);
    setProjects((prev) => prev.filter(project => project._id !== projectId)); // Fixed filter condition
    setError(null); // Clear any previous errors
    setSuccess("Project Deleted Successfully")
  } catch(err) {
    setError(err.response?.data?.message || "Could not delete the project");
  }
}
  return (
    <div className="admin-dashboard dark-theme">
      {error && (
          <div className="error-message m-3">
            {error}
          </div>
        )}
        {success && (
          <div className="success-message m-3">
            {success}
          </div>
        )}

      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Admin Dashboard</h1>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          ><i className="fa-solid fa-folder-open"></i> Project
          </button>
        </div>


{/* Create Project Modal */}
{showModal && (
  <div className="modal show mt-5" style={{ display: 'block' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Create New Project</h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setShowModal(false)}
          ></button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleCreateProject} className="new-project-form">
            <div className="mb-3">
              <label htmlFor="projectName" className="form-label">Project Name</label>
              <input
                type="text"
                className="form-control"
                id="projectName"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="projectDescription" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="projectDescription"
                name="description"
                rows="4"
                required
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Creating...
                  </>
                ) : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
)}

        {/* Projects List */}
        <h2 className="mb-3">All Projects</h2>
        
        {projectLoading ? (
          <div className="d-flex justify-content-center my-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="card">
            <div className="card-body">
              <p className="card-text text-muted">
                No projects created yet. Start by creating a new project.
              </p>
            </div>
          </div>
        ) : (
          <div className="list-group">
            {projects.map((project) => (
              <div key={project._id} className="list-group-item projLayout">
                <div>
                  <div className="d-flex w-100 justify-content-between">
                    <Link 
                      to={`/projects/${project._id}`} 
                      className="text-decoration-none"
                    >
                      <h5 className="mb-1">{project.name}</h5>
                    </Link>
                  </div>

                    <p className="mb-1">{project.description}</p>
                    <p className="mb-1">{new Date(project.createdAt).toLocaleString('en-US' , {
                       year: 'numeric',month: 'long',day: 'numeric',   hour: 'numeric',    minute: 'numeric',
                    })}</p>
                  </div>
                <div onClick={() => handleDeleteProj(project._id)}>
                  <i className="fa-solid fa-trash"></i>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;