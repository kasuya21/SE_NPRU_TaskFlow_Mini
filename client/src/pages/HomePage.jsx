import { useEffect } from "react";
import { Link } from "react-router";
import useAuthStore from "../store/authStore";
import useTaskStore from "../store/taskStore";

const FEATURES = [
  {
    world: "WORLD 1-1",
    icon: "📜",
    title: "TASK LOG",
    desc: "Create new tasks,\nset deadlines, and\nprioritize your work to\nsave the Princess!",
    btnColor: "pixel-btn-primary",
  },
  {
    world: "WORLD 1-2",
    icon: "🍄",
    title: "LEVEL UP",
    desc: "Track your progress from\nPending to Completed.\nGain EXP with every\nfinished task.",
    btnColor: "pixel-btn-green",
  },
  {
    world: "WORLD 1-3",
    icon: "🏰",
    title: "SECURE CASTLE",
    desc: "Your data is protected\nby high-level JWT magic.\nOnly YOU can see\nyour quests.",
    btnColor: "pixel-btn-yellow",
  },
];

const HomePage = () => {
  const { user } = useAuthStore();
  const { tasks, fetchTasks } = useTaskStore();

  // Fetch tasks on home page mount if logged in to show stats
  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  // Calculate Pizza Chart
  const pending = tasks.filter(t => t.status === "pending").length;
  const inProgress = tasks.filter(t => t.status === "in-progress").length;
  const completed = tasks.filter(t => t.status === "completed").length;
  const total = tasks.length;
  
  // Degrees for conic gradient
  const pDeg = total ? (pending / total) * 360 : 0;
  const iDeg = total ? (inProgress / total) * 360 : 0;
  const cDeg = total ? (completed / total) * 360 : 0;

  const gradientString = total === 0 
    ? "conic-gradient(#555 0deg 360deg)" 
    : `conic-gradient(var(--mario-yellow) 0deg ${pDeg}deg, var(--mario-red) ${pDeg}deg ${pDeg + iDeg}deg, var(--mario-green) ${pDeg + iDeg}deg 360deg)`;

  return (
    <div style={{ minHeight: "100vh", padding: "40px 24px 120px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .mario-title {
          font-size: clamp(24px, 5vw, 42px);
          color: var(--mario-yellow);
          text-shadow: 4px 4px 0 var(--mario-black), -2px -2px 0 var(--mario-red), 2px -2px 0 var(--mario-red), -2px 2px 0 var(--mario-red), 2px 2px 0 var(--mario-red);
          letter-spacing: 2px;
          margin: 0;
          padding: 30px;
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .stage-card {
          background: var(--mario-white);
          border: 6px solid var(--mario-black);
          box-shadow: 8px 8px 0 var(--mario-black);
          padding: 30px 24px;
          text-align: center;
          position: relative;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .stage-card:hover {
          transform: translateY(-8px);
          box-shadow: 12px 12px 0 var(--mario-black);
        }
        .pipe-top {
          background: var(--mario-green);
          border: 4px solid var(--mario-black);
          height: 24px;
          width: 80px;
          margin: 0 auto;
          box-shadow: inset -6px 0 0 rgba(0,0,0,0.2), inset 6px 0 0 rgba(255,255,255,0.3);
        }
        .pipe-bottom {
          background: var(--mario-green);
          border: 4px solid var(--mario-black);
          border-top: none;
          height: 40px;
          width: 64px;
          margin: 0 auto;
          box-shadow: inset -6px 0 0 rgba(0,0,0,0.2), inset 6px 0 0 rgba(255,255,255,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        .pizza-chart {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          border: 8px solid var(--mario-black);
          box-shadow: 8px 8px 0 var(--mario-black), inset 6px 6px 0 rgba(255,255,255,0.3);
          position: relative;
        }
      `}</style>

      {/* Top HUD (Score Bar) */}
      <div className="pixel-font" style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: "800px", color: "white", fontSize: "14px", textShadow: "2px 2px 0 var(--mario-black)", marginBottom: "40px" }}>
        <div style={{ textAlign: "center" }}>
          <p>PLAYER {user ? "1" : "0"}</p>
          <p>{user ? (completed * 100).toString().padStart(6, '0') : "000000"}</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p><span className="coin-spin">🪙</span> × {completed.toString().padStart(2, '0')}</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p>WORLD</p>
          <p>1-1</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p>TIME</p>
          <p>400</p>
        </div>
      </div>

      {/* Main Hero Banner */}
      <div style={{ textAlign: "center", marginBottom: "60px", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "-15px", zIndex: 2, position: "relative" }}>
          <div className="pixel-qblock">?</div>
          <div className="pixel-qblock" style={{ background: "var(--mario-brown)", borderColor: "var(--mario-black)" }}></div>
          <div className="pixel-qblock">?</div>
        </div>
        <div className="pixel-font mario-title" style={{ background: "var(--mario-red)", border: "8px solid var(--mario-black)", display: "inline-block", position: "relative", zIndex: 1 }}>
          TASKFLOW<br/><span style={{ fontSize: "0.8em", color: "white" }}>MINI</span>
        </div>
        {!user && (
          <p style={{ fontWeight: 800, fontSize: "18px", color: "white", marginTop: "32px", textShadow: "2px 2px 0 var(--mario-black)", background: "rgba(0,0,0,0.3)", display: "inline-block", padding: "10px 20px", borderRadius: "10px" }}>
            Organize your tasks. Defeat procrastination. Save the Princess! 🏰
          </p>
        )}
      </div>

      {/* Call to Action Actions */}
      <div style={{ marginBottom: "80px" }}>
        {user ? (
          <Link to="/tasks" className="pixel-btn pixel-btn-primary pixel-font" style={{ fontSize: "16px", padding: "20px 40px", animation: "blink 1.5s ease-in-out infinite" }}>
            ▶ PRESS START
          </Link>
        ) : (
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/login" className="pixel-btn pixel-btn-primary pixel-font" style={{ fontSize: "14px", padding: "16px 32px" }}>
              ▶ LOGIN
            </Link>
            <Link to="/register" className="pixel-btn pixel-btn-yellow pixel-font" style={{ fontSize: "14px", padding: "16px 32px" }}>
              ★ NEW PLAYER
            </Link>
          </div>
        )}
      </div>

      {/* Content Section: Dashboard Map vs Select Stage */}
      <div style={{ width: "100%", maxWidth: "1000px" }}>
        
        {user ? (
          // USER DASHBOARD (PIZZA CHART)
          <div>
            <h2 className="pixel-font" style={{ textAlign: "center", color: "white", textShadow: "3px 3px 0 var(--mario-black)", fontSize: "20px", marginBottom: "40px" }}>
              ── TASK SUMMARY ──
            </h2>
            
            <div className="stage-card" style={{ maxWidth: "600px", margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "40px" }}>
              {/* Pizza Chart Graphic */}
              <div className="pizza-chart" style={{ background: gradientString }}>
                {total === 0 && <span className="pixel-font" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "10px", color: "white" }}>EMPTY</span>}
              </div>
              
              {/* Legend Data */}
              <div style={{ textAlign: "left" }}>
                <p className="pixel-font" style={{ fontSize: "12px", marginBottom: "16px", color: "var(--mario-dark)" }}>TOTAL TASKS: {total}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <div style={{ width: "16px", height: "16px", background: "var(--mario-green)", border: "2px solid var(--mario-black)" }}></div>
                  <span className="pixel-font" style={{ fontSize: "10px", color: "#333" }}>COMPLETED: {completed}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <div style={{ width: "16px", height: "16px", background: "var(--mario-red)", border: "2px solid var(--mario-black)" }}></div>
                  <span className="pixel-font" style={{ fontSize: "10px", color: "#333" }}>IN PROGRESS: {inProgress}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "16px", height: "16px", background: "var(--mario-yellow)", border: "2px solid var(--mario-black)" }}></div>
                  <span className="pixel-font" style={{ fontSize: "10px", color: "#333" }}>PENDING: {pending}</span>
                </div>
              </div>
            </div>
          </div>

        ) : (
          // GUEST FEATURE CARDS
          <div>
            <h2 className="pixel-font" style={{ textAlign: "center", color: "white", textShadow: "3px 3px 0 var(--mario-black)", fontSize: "20px", marginBottom: "40px" }}>
              ── SELECT STAGE ──
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "30px" }}>
              {FEATURES.map((stage, idx) => (
                <div key={idx} className="stage-card">
                  <div className="pixel-font" style={{ position: "absolute", top: "-15px", left: "50%", transform: "translateX(-50%)", background: "var(--mario-black)", color: "white", padding: "6px 12px", fontSize: "10px" }}>
                    {stage.world}
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <div className="pipe-top"></div>
                    <div className="pipe-bottom">{stage.icon}</div>
                  </div>
                  <h3 className="pixel-font" style={{ fontSize: "14px", color: "var(--mario-red)", marginBottom: "16px", lineHeight: "1.4" }}>{stage.title}</h3>
                  <p style={{ fontSize: "15px", fontWeight: "700", color: "#444", whiteSpace: "pre-line", lineHeight: "1.6", height: "100px" }}>{stage.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default HomePage;
