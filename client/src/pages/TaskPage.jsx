import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useTaskStore from "../store/taskStore";
import Swal from "sweetalert2";

const STATUS = { pending: { label: "PENDING", cls: "pixel-badge-yellow" }, "in-progress": { label: "IN PROG", cls: "pixel-badge-red" }, completed: { label: "DONE ✓", cls: "pixel-badge-green" } };
const PRIORITY = { low: { label: "LOW", cls: "pixel-badge-gray" }, medium: { label: "MED", cls: "pixel-badge-yellow" }, high: { label: "HIGH", cls: "pixel-badge-red" } };
const empty = { title: "", description: "", status: "pending", priority: "medium", dueDate: "" };

const TaskPage = () => {
  const { tasks, loading, fetchTasks, createTask, updateTask, deleteTask } = useTaskStore();
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchTasks(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openCreate = () => { setForm(empty); setEditId(null); setModalOpen(true); };
  const openEdit = (t) => { setForm({ title: t.title, description: t.description, status: t.status, priority: t.priority, dueDate: t.dueDate?.slice(0, 10) }); setEditId(t._id); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      editId ? await updateTask(editId, form) : await createTask(form);
      setModalOpen(false);
      Swal.fire({ icon: "success", title: editId ? "TASK UPDATED!" : "TASK ADDED! 🍄", timer: 1200, showConfirmButton: false, background: "#fff" });
    } catch (_) {}
  };

  const handleDelete = async (id) => {
    const r = await Swal.fire({ title: "DELETE THIS TASK?", icon: "warning", showCancelButton: true, confirmButtonText: "DELETE", cancelButtonText: "CANCEL", background: "#fff", color: "#000" });
    if (r.isConfirmed) await deleteTask(id);
  };

  const done = tasks.filter(t => t.status === "completed").length;

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 16px 100px" }}>
      <style>{`
        .task-card-active:hover {
          transform: translateY(-4px);
          box-shadow: 8px 8px 0 var(--mario-black);
        }
      `}</style>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div className="pixel-font" style={{ display: "inline-block", background: "var(--mario-red)", border: "6px solid var(--mario-black)", boxShadow: "6px 6px 0 var(--mario-black)", padding: "12px 20px", marginBottom: "12px" }}>
            <span style={{ color: "var(--mario-yellow)", fontSize: "18px", textShadow: "2px 2px 0 var(--mario-black)" }}>📋 MY TASKS</span>
          </div>
          <p className="pixel-font" style={{ color: "white", fontSize: "12px", textShadow: "2px 2px 0 var(--mario-black)" }}>
            ★ {done}/{tasks.length} COMPLETED
          </p>
        </div>
        <button className="pixel-btn pixel-btn-yellow" onClick={openCreate} style={{ fontSize: "12px", padding: "12px 20px" }}>
          + NEW TASK
        </button>
      </div>

      {/* Loading */}
      {loading && <p style={{ textAlign: "center", color: "white", fontSize: "16px", fontWeight: "bold" }} className="pixel-loading pixel-font">LOADING...</p>}

      {/* Task list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {tasks.map((task) => (
          <div 
            key={task._id} 
            className="pixel-box task-card-active" 
            style={{ padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", cursor: "pointer", transition: "transform 0.1s, box-shadow 0.1s" }}
            onClick={() => navigate(`/tasks/${task._id}`)}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span className="pixel-font" style={{ fontSize: "14px", color: "var(--mario-dark)" }}>{task.title}</span>
                <span className={`pixel-badge ${STATUS[task.status]?.cls}`}>{STATUS[task.status]?.label}</span>
                <span className={`pixel-badge ${PRIORITY[task.priority]?.cls}`}>{PRIORITY[task.priority]?.label}</span>
              </div>
              <p style={{ fontSize: "16px", color: "#333", lineHeight: "1.6", fontWeight: "700", marginBottom: "8px" }}>{task.description}</p>
              {task.dueDate && <p className="pixel-font" style={{ fontSize: "10px", color: "#666" }}>DUE: {new Date(task.dueDate).toLocaleDateString("th-TH")}</p>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button 
                className="pixel-btn pixel-btn-yellow" 
                style={{ fontSize: "10px", padding: "8px 12px" }} 
                onClick={(e) => { e.stopPropagation(); openEdit(task); }}
              >
                ✏ EDIT
              </button>
              <button 
                className="pixel-btn pixel-btn-danger" 
                style={{ fontSize: "10px", padding: "8px 12px" }} 
                onClick={(e) => { e.stopPropagation(); handleDelete(task._id); }}
              >
                ✕ DEL
              </button>
            </div>
          </div>
        ))}
        {!loading && tasks.length === 0 && (
          <div className="pixel-box" style={{ padding: "60px", textAlign: "center" }}>
            <div className="pixel-font" style={{ fontSize: "48px", color: "var(--mario-dark)", marginBottom: "16px" }}>?</div>
            <p className="pixel-font" style={{ fontSize: "16px", color: "#555" }}>NO TASKS YET!</p>
            <p style={{ fontSize: "15px", color: "#888", fontWeight: "bold", marginTop: "12px" }}>CLICK + NEW TASK TO START</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="pixel-modal-wrap" onClick={(e) => e.stopPropagation()}>
          <div className="pixel-modal">
            <div className="pixel-modal-title">{editId ? "✏ EDIT TASK" : "★ NEW TASK"}</div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="pixel-label">TASK NAME</label>
                <input name="title" placeholder="Enter task name..." className="pixel-input bg-white text-black" value={form.title} onChange={handleChange} required />
              </div>
              <div>
                <label className="pixel-label">DESCRIPTION</label>
                <textarea name="description" placeholder="Describe the task..." className="pixel-input bg-white text-black" value={form.description} onChange={handleChange} required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label className="pixel-label">STATUS</label>
                  <select name="status" className="pixel-input bg-white text-black" value={form.status} onChange={handleChange}>
                    <option value="pending">PENDING</option>
                    <option value="in-progress">IN PROGRESS</option>
                    <option value="completed">COMPLETED</option>
                  </select>
                </div>
                <div>
                  <label className="pixel-label">PRIORITY</label>
                  <select name="priority" className="pixel-input bg-white text-black" value={form.priority} onChange={handleChange}>
                    <option value="low">LOW</option>
                    <option value="medium">MEDIUM</option>
                    <option value="high">HIGH</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="pixel-label">DUE DATE</label>
                <input name="dueDate" type="date" className="pixel-input bg-white text-black" style={{fontFamily: "Nunito"}} value={form.dueDate} onChange={handleChange} required />
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
                <button type="button" className="pixel-btn pixel-btn-gray" onClick={() => setModalOpen(false)}>CANCEL</button>
                <button type="submit" className="pixel-btn pixel-btn-primary" disabled={loading}>
                  {loading ? <span className="pixel-loading">...</span> : "SAVE ★"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskPage;
