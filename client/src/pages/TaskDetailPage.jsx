import { useParams, Link } from "react-router";
import useTaskStore from "../store/taskStore";

const STATUS = { pending: { label: "PENDING", cls: "pixel-badge-yellow" }, "in-progress": { label: "IN PROG", cls: "pixel-badge-red" }, completed: { label: "DONE ✓", cls: "pixel-badge-green" } };
const PRIORITY = { low: { label: "LOW", cls: "pixel-badge-gray" }, medium: { label: "MED", cls: "pixel-badge-yellow" }, high: { label: "HIGH", cls: "pixel-badge-red" } };

const TaskDetailPage = () => {
  const { id } = useParams();
  const { tasks } = useTaskStore();
  const task = tasks.find(t => t._id === id);

  if (!task) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 text-center border-[4px] border-[var(--mario-black)] shadow-[6px_6px_0_var(--mario-black)]">
          <h2 className="pixel-font text-xl text-[var(--mario-red)] mb-6">TASK NOT FOUND!</h2>
          <Link to="/tasks" className="pixel-btn pixel-btn-gray pixel-font text-[10px] px-6 py-3 border-[3px] border-[var(--mario-black)]">
            ← BACK TO TASKS
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 pb-32">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/tasks" className="btn bg-white hover:bg-gray-100 text-[var(--mario-black)] border-[3px] border-[var(--mario-black)] shadow-[4px_4px_0_var(--mario-black)] rounded-none pixel-font text-[10px]">
          ← BACK
        </Link>
        <div className="pixel-font bg-[var(--mario-dark)] text-[var(--mario-yellow)] px-6 py-3 border-[4px] border-[var(--mario-black)] shadow-[4px_4px_0_var(--mario-black)] text-sm md:text-md">
          TASK DETAILS
        </div>
      </div>
      
      {/* Main Content Card - Clean and Readable */}
      <div className="bg-white shadow-[8px_8px_0_var(--mario-black)] border-[5px] border-[var(--mario-black)] p-6 md:p-12 mb-8 relative">
        
        {/* Badges Header */}
        <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b-[3px] border-dashed border-gray-300">
          <span className={`pixel-badge ${STATUS[task.status]?.cls} text-[11px] px-4 py-2`}>{STATUS[task.status]?.label}</span>
          <span className={`pixel-badge ${PRIORITY[task.priority]?.cls} text-[11px] px-4 py-2`}>{PRIORITY[task.priority]?.label}</span>
          
          <div className="ml-auto text-sm text-gray-500 font-bold tracking-widest hidden sm:block">
            ID: {task._id.slice(-6).toUpperCase()}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-[Nunito] font-extrabold text-[#111] mb-6 leading-tight drop-shadow-sm">
          {task.title}
        </h1>
        
        {/* Description Box */}
        <div className="bg-[#f9f9f9] border-l-[8px] border-[var(--mario-yellow)] p-6 md:p-8 mb-10 shadow-sm">
          <h3 className="pixel-font text-[10px] text-gray-400 mb-4 tracking-widest">DESCRIPTION</h3>
          <p className="text-[#333] text-lg md:text-xl font-[Nunito] font-medium leading-relaxed whitespace-pre-line">
            {task.description}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#f3f3f3] p-6 border-2 border-gray-200">
          <div>
            <span className="block pixel-font text-[9px] text-gray-400 mb-2">DUE DATE</span>
            <span className="text-xl font-[Nunito] font-bold text-[var(--mario-red)]">
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString("th-TH", { year: 'numeric', month: 'long', day: 'numeric' }) : "No Due Date"}
            </span>
          </div>
          <div>
            <span className="block pixel-font text-[9px] text-gray-400 mb-2">CREATED ON</span>
            <span className="text-lg font-[Nunito] font-bold text-gray-600">
              {new Date(task.createdAt).toLocaleDateString("th-TH", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
