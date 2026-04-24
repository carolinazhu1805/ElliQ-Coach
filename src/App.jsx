import { useState, useEffect, useRef, useCallback } from "react";
import muteIcon from "./assets/mute-icon.png";
import volumeIcon from "./assets/volume-icon.png";
import gearIcon from "./assets/gear.png";

const PUZZLES = {
  easy: {
    puzzle: [
      [5,0,4,6,7,8,9,0,2],
      [6,7,2,1,9,5,0,4,8],
      [1,0,0,3,0,2,5,6,7],
      [8,5,9,7,0,1,0,2,3],
      [4,2,6,8,0,3,7,9,1],
      [7,1,3,9,2,4,8,5,6],
      [9,6,1,5,3,7,2,8,4],
      [2,0,7,0,1,9,6,0,5],
      [0,0,5,2,8,6,1,7,9],
    ],
    solution: [
      [5,3,4,6,7,8,9,1,2],
      [6,7,2,1,9,5,3,4,8],
      [1,9,8,3,4,2,5,6,7],
      [8,5,9,7,6,1,4,2,3],
      [4,2,6,8,5,3,7,9,1],
      [7,1,3,9,2,4,8,5,6],
      [9,6,1,5,3,7,2,8,4],
      [2,8,7,4,1,9,6,3,5],
      [3,4,5,2,8,6,1,7,9],
    ],
  },
  medium: {
    puzzle: [
      [0,0,0,2,6,0,7,0,1],
      [6,8,0,0,7,0,0,9,0],
      [1,9,0,0,0,4,5,0,0],
      [8,2,0,1,0,0,0,4,0],
      [0,0,4,6,0,2,9,0,0],
      [0,5,0,0,0,3,0,2,8],
      [0,0,9,3,0,0,0,7,4],
      [0,4,0,0,5,0,0,3,6],
      [7,0,3,0,1,8,0,0,0],
    ],
    solution: [
      [4,3,5,2,6,9,7,8,1],
      [6,8,2,5,7,1,4,9,3],
      [1,9,7,8,3,4,5,6,2],
      [8,2,6,1,9,5,3,4,7],
      [3,7,4,6,8,2,9,1,5],
      [9,5,1,7,4,3,6,2,8],
      [5,1,9,3,2,6,8,7,4],
      [2,4,8,9,5,7,1,3,6],
      [7,6,3,4,1,8,2,5,9],
    ],
  },
  hard: {
    puzzle: [
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,3,0,8,5],
      [0,0,1,0,2,0,0,0,0],
      [0,0,0,5,0,7,0,0,0],
      [0,0,4,0,0,0,1,0,0],
      [0,9,0,0,0,0,0,0,0],
      [5,0,0,0,0,0,0,7,3],
      [0,0,2,0,1,0,0,0,0],
      [0,0,0,0,4,0,0,0,9],
    ],
    solution: [
      [9,8,7,6,5,4,3,2,1],
      [2,4,6,1,7,3,9,8,5],
      [3,5,1,9,2,8,7,4,6],
      [1,2,8,5,3,7,6,9,4],
      [6,3,4,8,9,2,1,5,7],
      [7,9,5,4,6,1,8,3,2],
      [5,1,9,2,8,6,4,7,3],
      [4,7,2,3,1,9,5,6,8],
      [8,6,3,7,4,5,2,1,9],
    ],
  },
};

// SETTINGS UI OPTIONS 
// "A" → side drawer 
// "B" → centred UI option
const SETTINGS_UI = "A"; //change to "B" for centred settings screen 
const NAVY = "#2B4590";
const NAVY_DARK = "#1A2D6B";
const NAVY_LIGHT = "#D0D8F0";
const API_KEY = "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";

const MOODS = {
  warm:    { bg:"#FDF6EE", surface:"#fff", border:"#E8D5B7", text:"#3D2B1F", muted:"#9B7B5B", highlight:"#F5ECD8", coach:"#FEF3E2" },
  cool:    { bg:"#EEF4FD", surface:"#fff", border:"#B7CCE8", text:"#1A2B3D", muted:"#5B7A9B", highlight:"#DCE9F8", coach:"#E2EEFE" },
  neutral: { bg:"#F2F2F2", surface:"#fff", border:"#C8C8C8", text:"#1A1A1A", muted:"#6B6B6B", highlight:"#E8E8E8", coach:"#EAEAEA" },
};

const DEMO_ENTRIES = [
  { name:"Margaret", time:423, difficulty:"easy", date:"30 Mar 2026" },
  { name:"Margaret", time:891, difficulty:"medium", date:"29 Mar 2026" },
  { name:"Margaret", time:312, difficulty:"easy", date:"28 Mar 2026" },
  { name:"Robert", time:756, difficulty:"medium", date:"30 Mar 2026" },
  { name:"Robert", time:445, difficulty:"easy", date:"29 Mar 2026" },
  { name:"Susan", time:534, difficulty:"easy", date:"31 Mar 2026" },
];

const formatTime = (s) => {
  const m = Math.floor(s/60);
  const sec = s%60;
  return `${m}:${sec.toString().padStart(2,"0")}`;
};

const getDifficultyColour = (d) => {
  if (d==="easy") return "#2E7D6E";
  if (d==="medium") return "#854F0B";
  return "#A32D2D";
};

export default function App() {
  const [screen, setScreen] = useState("profile");
  const [profiles, setProfiles] = useState([{ name:"Player 1", id:1 }]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [newProfileName, setNewProfileName] = useState("");
  const [personality, setPersonality] = useState("friendly");
  const [difficulty, setDifficulty] = useState("medium");
  const [colorMood, setColorMood] = useState("warm");
  const [coachMode, setCoachMode] = useState(true);
  const [board, setBoard] = useState(() => PUZZLES.medium.puzzle.map(r=>[...r]));
  const [selected, setSelected] = useState(null);
  const [errors, setErrors] = useState(new Set());
  const [coachMessages, setCoachMessages] = useState([]);
  const [coachInput, setCoachInput] = useState("");
  const [coachLoading, setCoachLoading] = useState(false);
  const [muted, setMuted] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [prevDifficulty, setPrevDifficulty] = useState("medium");
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [completionTime, setCompletionTime] = useState(null);
  const [leaderboard, setLeaderboard] = useState(DEMO_ENTRIES);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const chatRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const m = MOODS[colorMood];

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [coachMessages]);

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => setTimer(t => t+1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  const speak = useCallback((text) => {
    if (muted || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.92; utt.pitch = 1.05; utt.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes("Samantha") || v.name.includes("Karen") || v.name.includes("Daniel") || v.lang==="en-GB");
    if (preferred) utt.voice = preferred;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  }, [muted]);

  useEffect(() => { window.speechSynthesis?.getVoices(); }, []);

  useEffect(() => {
    if (screen==="game" && coachMode) {
      const greeting = personality==="friendly"
        ? `Hello${activeProfile ? ` ${activeProfile.name}` : ""}! I'm ElliQ, your Sudoku coach. I'm here to guide you, you may ask me anything. Shall we begin?`
        : `Hello. I am ElliQ, your Sudoku coach. I will assist you when needed.`;
      setTimeout(() => { addCoachMessage("assistant", greeting); speak(greeting); setTimerActive(true); }, 700);
    }
  }, [screen]);

  const addCoachMessage = (role, content) => setCoachMessages(prev => [...prev, { role, content }]);
  const isGiven = (r, c) => PUZZLES[difficulty].puzzle[r][c] !== 0;

  const checkCompletion = (newBoard) => {
    const sol = PUZZLES[difficulty].solution;
    for (let r=0; r<9; r++)
      for (let c=0; c<9; c++)
        if (newBoard[r][c] !== sol[r][c]) return false;
    return true;
  };

  const handleCompletion = (time) => {
    setTimerActive(false);
    setCompletionTime(time);
    const today = new Date().toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
    const entry = { name: activeProfile?.name || "Player 1", time, difficulty, date: today };
    setLeaderboard(prev => [...prev, entry]);
    const msg = personality==="friendly"
      ? `You did it${activeProfile ? `, ${activeProfile.name}` : ""}! What an achievement — you completed the puzzle in ${formatTime(time)}. You should be really proud!`
      : `Puzzle complete. Time: ${formatTime(time)}.`;
    addCoachMessage("assistant", msg);
    speak(msg);
    setTimeout(() => setScreen("completion"), 1500);
  };

  const handleNumber = (num) => {
    if (!selected) return;
    const [r, c] = selected;
    if (isGiven(r, c)) return;
    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = num;
    setBoard(newBoard);
    const newErrors = new Set(errors);
    const key = `${r}-${c}`;
    if (PUZZLES[difficulty].solution[r][c] !== num) {
      newErrors.add(key);
      if (coachMode) {
        const msg = personality==="friendly"
          ? `Not quite. Think about which numbers are already in row ${r+1} and column ${c+1}.`
          : `Incorrect. Check row ${r+1} and column ${c+1}.`;
        setTimeout(() => { addCoachMessage("assistant", msg); speak(msg); }, 300);
      }
    } else {
      newErrors.delete(key);
      if (coachMode) {
        const msg = personality==="friendly" ? "Correct! Well done." : "Correct.";
        setTimeout(() => { addCoachMessage("assistant", msg); speak(msg); }, 300);
      }
      if (checkCompletion(newBoard)) handleCompletion(timer);
    }
    setErrors(newErrors);
  };

  const callCoach = async (userMessage, displayMessage = null) => {
    if (displayMessage !== null) addCoachMessage("user", displayMessage);
    setCoachLoading(true);
    const systemPrompt = personality==="friendly"
      ? `You are ElliQ, a warm encouraging Sudoku coach helping an older adult. Be patient, kind, help through the use of guidance, not direct answers, unless explicitly requested. Keep responses to 2-3 sentences. No mark down`
      : `You are ElliQ, a calm neutral Sudoku coach helping an older adult. Be concise, do not give direct answers, guide to the solution, unless explicitly requested, 1-2 sentences. No markdown.`;
    const messages = [
      ...coachMessages.filter(msg => msg.role!=="system").map(msg => ({ role:msg.role, content:msg.content })),
      { role:"user", content: userMessage },
    ];
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method:"POST",
        headers: { "Content-Type":"application/json", "Authorization":`Bearer ${API_KEY}` },
        body: JSON.stringify({ model:"llama-3.1-8b-instant", max_tokens:200, messages:[{ role:"system", content:systemPrompt }, ...messages] }),
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || (personality==="friendly" ? "I'm here to help!" : "Please continue.");
      addCoachMessage("assistant", reply);
      speak(reply);
    } catch {
      const err = personality==="friendly" ? "Sorry, try again!" : "Connection error.";
      addCoachMessage("assistant", err); speak(err);
    }
    setCoachLoading(false);
  };

  const buildCellContext = () => {
    if (!selected) return "";
    const [r,c] = selected;
    const rowNums = board[r].filter(v=>v!==0).join(", ");
    const colNums = board.map(row=>row[c]).filter(v=>v!==0).join(", ");
    const boxR = Math.floor(r/3)*3, boxC = Math.floor(c/3)*3;
    const boxNums = board.slice(boxR,boxR+3).flatMap(row=>row.slice(boxC,boxC+3)).filter(v=>v!==0).join(", ");
    return ` Selected row ${r+1}, col ${c+1}. Row has: ${rowNums||"nothing"}. Column has: ${colNums||"nothing"}. Box has: ${boxNums||"nothing"}.`;
  };

  const handleCoachSend = async () => {
    if (!coachInput.trim() || coachLoading) return;
    const msg = coachInput.trim(); setCoachInput("");
    await callCoach(`User asks: "${msg}".${buildCellContext()}`, msg);
  };

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { addCoachMessage("assistant","Voice not supported — try typing."); return; }
    if (recognitionRef.current) recognitionRef.current.stop();
    const r = new SR(); r.continuous=false; r.interimResults=false; r.lang="en-GB";
    r.onstart=()=>setListening(true); r.onend=()=>setListening(false); r.onerror=()=>setListening(false);
    r.onresult=(e)=>{ const t=e.results[0][0].transcript; setCoachInput(""); callCoach(`User said: "${t}".${buildCellContext()}`, t); };
    recognitionRef.current=r; r.start();
  };

  const demoFill = () => {
    const sol = PUZZLES[difficulty].solution;
    const nb = sol.map(row=>[...row]);
    nb[8][0]=0; nb[8][1]=0;
    setBoard(nb); setErrors(new Set()); setSelected([8,0]);
  };

  const getCellBg = (r,ci) => {
    const isSel=selected&&selected[0]===r&&selected[1]===ci;
    const isSameNum=selected&&board[selected[0]][selected[1]]!==0&&board[r][ci]===board[selected[0]][selected[1]];
    const isSameRow=selected&&selected[0]===r;
    const isSameCol=selected&&selected[1]===ci;
    const isSameBox=selected&&Math.floor(selected[0]/3)===Math.floor(r/3)&&Math.floor(selected[1]/3)===Math.floor(ci/3);
    if (isSel) return "#E8A435";
    if (isSameNum&&board[r][ci]!==0) return NAVY_LIGHT;
    if (isSameRow||isSameCol||isSameBox) return m.highlight;
    return m.surface;
  };

  const startNewGame = (diff) => {
    setBoard(PUZZLES[diff].puzzle.map(r=>[...r]));
    setSelected(null); setErrors(new Set()); setCoachMessages([]);
    setTimer(0); setTimerActive(false); setCompletionTime(null);
    setPrevDifficulty(diff); setDifficulty(diff); setScreen("game");
  };

  const myEntries = leaderboard.filter(e => e.name===(activeProfile?.name||"Player 1")).sort((a,b)=>a.time-b.time);
  const friendEntries = leaderboard.filter(e => e.name!==(activeProfile?.name||"Player 1")).sort((a,b)=>a.time-b.time);
  const personalBest = myEntries.length>0 ? myEntries[0].time : null;

  // PROFILE SCREEN
  if (screen==="profile") {
    return (
      <div style={{ minHeight:"100vh", background:m.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px", fontFamily:"'Georgia', serif" }}>
        <div style={{ width:"100%", maxWidth:"400px", background:m.surface, borderRadius:"20px", padding:"32px 28px", boxShadow:"0 4px 32px rgba(0,0,0,0.08)", border:`1px solid ${m.border}` }}>
          <div style={{ textAlign:"center", marginBottom:"28px" }}>
            <div style={{ width:"60px", height:"60px", borderRadius:"50%", background:NAVY, margin:"0 auto 14px", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:"rgba(255,255,255,0.9)" }}/>
            </div>
            <h1 style={{ fontSize:"22px", fontWeight:"700", color:m.text, margin:"0 0 4px" }}>Who's playing?</h1>
            <p style={{ fontSize:"14px", color:m.muted, margin:0 }}>Select your profile or add a new one</p>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"20px" }}>
            {profiles.map(p => (
              <button key={p.id} onClick={() => { setActiveProfile(p); setScreen("onboarding"); }} style={{
                padding:"14px 18px", borderRadius:"12px", border:`1.5px solid ${m.border}`,
                background:m.bg, cursor:"pointer", textAlign:"left", fontFamily:"'Georgia', serif",
                display:"flex", alignItems:"center", gap:"12px", transition:"all 0.15s",
              }}>
                <div style={{ width:"36px", height:"36px", borderRadius:"50%", background:NAVY, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"14px", fontWeight:"700", flexShrink:0 }}>
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize:"15px", fontWeight:"600", color:m.text }}>{p.name}</span>
              </button>
            ))}
          </div>

          <div style={{ borderTop:`1px solid ${m.border}`, paddingTop:"16px" }}>
            <p style={{ fontSize:"12px", color:m.muted, marginBottom:"10px" }}>Add new player</p>
            <div style={{ display:"flex", gap:"8px" }}>
              <input value={newProfileName} onChange={e=>setNewProfileName(e.target.value)}
                onKeyDown={e=>{ if(e.key==="Enter"&&newProfileName.trim()){ setProfiles(prev=>[...prev,{name:newProfileName.trim(),id:Date.now()}]); setNewProfileName(""); }}}
                placeholder="Enter name..." style={{ flex:1, padding:"9px 12px", borderRadius:"10px", border:`1px solid ${m.border}`, fontSize:"14px", fontFamily:"'Georgia', serif", background:m.bg, color:m.text, outline:"none" }}/>
              <button onClick={()=>{ if(newProfileName.trim()){ setProfiles(prev=>[...prev,{name:newProfileName.trim(),id:Date.now()}]); setNewProfileName(""); }}} style={{
                padding:"9px 16px", borderRadius:"10px", background:NAVY, color:"#fff", border:"none", cursor:"pointer", fontSize:"14px", fontFamily:"'Georgia', serif", fontWeight:"600",
              }}>Add</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ONBOARDING SCREEN
  if (screen==="onboarding") {
    return (
      <div style={{ minHeight:"100vh", background:m.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px", fontFamily:"'Georgia', serif" }}>
        <div style={{ width:"100%", maxWidth:"400px", background:m.surface, borderRadius:"20px", padding:"32px 28px", boxShadow:"0 4px 32px rgba(0,0,0,0.08)", border:`1px solid ${m.border}` }}>
          <div style={{ textAlign:"center", marginBottom:"28px" }}>
            <div style={{ width:"60px", height:"60px", borderRadius:"50%", background:NAVY, margin:"0 auto 14px", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:"rgba(255,255,255,0.9)" }}/>
            </div>
            <h1 style={{ fontSize:"22px", fontWeight:"700", color:m.text, margin:"0 0 4px" }}>
              {activeProfile ? `Hello, ${activeProfile.name}!` : "ElliQ Sudoku"}
            </h1>
            <p style={{ fontSize:"14px", color:m.muted, margin:0 }}>Set up your coaching experience</p>
          </div>

          {[
            { label:"Coach personality", setter:setPersonality, val:personality, options:[{val:"friendly",label:"Friendly & encouraging"},{val:"neutral",label:"Neutral & focused"}] },
            { label:"Difficulty", setter:setDifficulty, val:difficulty, options:[{val:"easy",label:"Easy"},{val:"medium",label:"Medium"},{val:"hard",label:"Hard"}] },
            { label:"Colour mood", setter:setColorMood, val:colorMood, options:[{val:"warm",label:"Warm"},{val:"cool",label:"Cool"},{val:"neutral",label:"Neutral"}] },
          ].map(({ label, setter, val, options }) => (
            <div key={label} style={{ marginBottom:"18px" }}>
              <label style={{ fontSize:"13px", fontWeight:"600", color:m.text, display:"block", marginBottom:"8px" }}>{label}</label>
              <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                {options.map(({ val:ov, label:ol }) => (
                  <button key={ov} onClick={() => setter(ov)} style={{
                    padding:"8px 14px", borderRadius:"20px", fontSize:"13px", cursor:"pointer",
                    background:val===ov?NAVY:m.bg, color:val===ov?"#fff":m.text,
                    border:`1.5px solid ${val===ov?NAVY:m.border}`,
                    fontFamily:"'Georgia', serif", fontWeight:val===ov?"600":"400", transition:"all 0.15s",
                  }}>{ol}</button>
                ))}
              </div>
            </div>
          ))}

          <div style={{ display:"flex", gap:"8px", marginTop:"8px" }}>
            <button onClick={() => setScreen("profile")} style={{ padding:"14px", borderRadius:"12px", fontSize:"14px", background:m.bg, color:m.text, border:`1px solid ${m.border}`, cursor:"pointer", fontFamily:"'Georgia', serif" }}>‹</button>
            <button onClick={() => { startNewGame(difficulty); }} style={{
              flex:1, padding:"14px", borderRadius:"12px", fontSize:"16px", fontWeight:"700",
              background:NAVY, color:"#fff", border:"none", cursor:"pointer", fontFamily:"'Georgia', serif",
            }}>Start puzzle →</button>
          </div>
        </div>
      </div>
    );
  }



  // SETTINGS SCREEN (Option B)
  if (screen==="settings") {
    return (
      <div style={{ minHeight:"100vh", background:m.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px", fontFamily:"'Georgia', serif" }}>
        <div style={{ width:"100%", maxWidth:"400px", background:m.surface, borderRadius:"20px", padding:"32px 28px", boxShadow:"0 4px 32px rgba(0,0,0,0.08)", border:`1px solid ${m.border}` }}>
          <div style={{ textAlign:"center", marginBottom:"28px" }}>
            <h1 style={{ fontSize:"22px", fontWeight:"700", color:m.text, margin:"0 0 4px" }}>Settings</h1>
            <p style={{ fontSize:"14px", color:m.muted, margin:0 }}>Changing difficulty will restart the puzzle</p>
          </div>
          {[
            { label:"Coach personality", setter:setPersonality, val:personality, options:[{val:"friendly",label:"Friendly & encouraging"},{val:"neutral",label:"Neutral & focused"}] },
            { label:"Difficulty", setter:setDifficulty, val:difficulty, options:[{val:"easy",label:"Easy"},{val:"medium",label:"Medium"},{val:"hard",label:"Hard"}] },
            { label:"Colour mood", setter:setColorMood, val:colorMood, options:[{val:"warm",label:"Warm"},{val:"cool",label:"Cool"},{val:"neutral",label:"Neutral"}] },
          ].map(({ label, setter, val, options }) => (
            <div key={label} style={{ marginBottom:"18px" }}>
              <label style={{ fontSize:"13px", fontWeight:"600", color:m.text, display:"block", marginBottom:"8px" }}>{label}</label>
              <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                {options.map(({ val:ov, label:ol }) => (
                  <button key={ov} onClick={() => setter(ov)} style={{
                    padding:"8px 14px", borderRadius:"20px", fontSize:"13px", cursor:"pointer",
                    background:val===ov?NAVY:m.bg, color:val===ov?"#fff":m.text,
                    border:`1.5px solid ${val===ov?NAVY:m.border}`,
                    fontFamily:"'Georgia', serif", fontWeight:val===ov?"600":"400", transition:"all 0.15s",
                  }}>{ol}</button>
                ))}
              </div>
            </div>
          ))}
          <div style={{ display:"flex", gap:"8px", marginTop:"8px" }}>
            {difficulty !== prevDifficulty ? (
              <button onClick={() => { startNewGame(difficulty); }} style={{
                flex:1, padding:"14px", borderRadius:"12px", fontSize:"16px", fontWeight:"700",
                background:NAVY, color:"#fff", border:"none", cursor:"pointer", fontFamily:"'Georgia', serif",
              }}>Start new puzzle →</button>
            ) : (
              <button onClick={() => setScreen("game")} style={{
                flex:1, padding:"14px", borderRadius:"12px", fontSize:"16px", fontWeight:"700",
                background:NAVY, color:"#fff", border:"none", cursor:"pointer", fontFamily:"'Georgia', serif",
              }}>Resume puzzle →</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // COMPLETION SCREEN
  if (screen==="completion") {
    return (
      <div style={{ minHeight:"100vh", background:m.bg, fontFamily:"'Georgia', serif", padding:"16px" }}>
        <div style={{ maxWidth:"420px", margin:"0 auto" }}>

          {/* Completion card */}
          <div style={{ background:m.surface, borderRadius:"20px", padding:"28px", marginBottom:"16px", boxShadow:"0 4px 24px rgba(0,0,0,0.08)", border:`1px solid ${m.border}`, textAlign:"center" }}>
            <div style={{ fontSize:"40px", marginBottom:"12px" }}></div>
            <h2 style={{ fontSize:"20px", fontWeight:"700", color:m.text, margin:"0 0 6px" }}>Puzzle complete!</h2>
            <p style={{ fontSize:"14px", color:m.muted, margin:"0 0 20px" }}>{activeProfile?.name || "Player 1"}</p>

            <div style={{ display:"flex", gap:"12px", justifyContent:"center", marginBottom:"20px" }}>
              <div style={{ background:NAVY_LIGHT, borderRadius:"12px", padding:"14px 20px", textAlign:"center" }}>
                <div style={{ fontSize:"24px", fontWeight:"700", color:NAVY_DARK }}>{formatTime(completionTime)}</div>
                <div style={{ fontSize:"11px", color:m.muted, marginTop:"2px" }}>Your time</div>
              </div>
              {personalBest !== null && (
                <div style={{ background:m.highlight, borderRadius:"12px", padding:"14px 20px", textAlign:"center" }}>
                  <div style={{ fontSize:"24px", fontWeight:"700", color:m.text }}>{formatTime(personalBest)}</div>
                  <div style={{ fontSize:"11px", color:m.muted, marginTop:"2px" }}>Personal best</div>
                </div>
              )}
            </div>

            {/* Success message */}
            <div
              style={{
                marginBottom: "20px",
                fontSize: "16px",
                fontWeight: "600",
                color: m.text,
                lineHeight: "1.6",
                textAlign: "center"
              }}
            >
              Congratulations! You have completed the puzzle
            </div>

            <div style={{ display:"flex", gap:"8px" }}>
              <button onClick={() => startNewGame(difficulty)} style={{
                flex:1, padding:"12px", borderRadius:"10px", background:NAVY, color:"#fff",
                border:"none", cursor:"pointer", fontSize:"14px", fontWeight:"600", fontFamily:"'Georgia', serif",
              }}>Play again</button>
              <button onClick={() => setScreen("profile")} style={{
                flex:1, padding:"12px", borderRadius:"10px", background:m.bg, color:m.text,
                border:`1px solid ${m.border}`, cursor:"pointer", fontSize:"14px", fontFamily:"'Georgia', serif",
              }}>Switch player</button>
            </div>
          </div>

          {/* Leaderboard */}
          <div style={{ background:m.surface, borderRadius:"20px", padding:"24px", boxShadow:"0 4px 24px rgba(0,0,0,0.08)", border:`1px solid ${m.border}` }}>
            <h3 style={{ fontSize:"17px", fontWeight:"700", color:m.text, margin:"0 0 16px" }}>Leaderboard</h3>

            {/* My scores */}
            <div style={{ marginBottom:"20px" }}>
              <p style={{ fontSize:"12px", fontWeight:"600", color:NAVY, marginBottom:"8px", textTransform:"uppercase", letterSpacing:"0.5px" }}>Your scores</p>
              {myEntries.length===0 ? (
                <p style={{ fontSize:"13px", color:m.muted, fontStyle:"italic" }}>No scores yet</p>
              ) : myEntries.map((e,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 12px", borderRadius:"10px", background: i===0?NAVY_LIGHT:m.bg, marginBottom:"6px", border:`1px solid ${m.border}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                    <span style={{ fontSize:"13px", fontWeight:"700", color:i===0?NAVY_DARK:m.muted, width:"20px" }}>#{i+1}</span>
                    <div>
                      <div style={{ fontSize:"13px", fontWeight:"600", color:m.text }}>{formatTime(e.time)}</div>
                      <div style={{ fontSize:"11px", color:m.muted }}>{e.date}</div>
                    </div>
                  </div>
                  <span style={{ fontSize:"11px", fontWeight:"600", color:"#fff", background:getDifficultyColour(e.difficulty), padding:"3px 8px", borderRadius:"10px" }}>{e.difficulty}</span>
                </div>
              ))}
            </div>

            {/* Friends */}
            <div style={{ marginBottom:"20px" }}>
              <p style={{ fontSize:"12px", fontWeight:"600", color:NAVY, marginBottom:"8px", textTransform:"uppercase", letterSpacing:"0.5px" }}>Friends</p>
              {friendEntries.length===0 ? (
                <p style={{ fontSize:"13px", color:m.muted, fontStyle:"italic" }}>No friends added yet</p>
              ) : friendEntries.map((e,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 12px", borderRadius:"10px", background:m.bg, marginBottom:"6px", border:`1px solid ${m.border}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                    <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:NAVY, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"12px", fontWeight:"700", flexShrink:0 }}>
                      {e.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize:"13px", fontWeight:"600", color:m.text }}>{e.name}</div>
                      <div style={{ fontSize:"11px", color:m.muted }}>{formatTime(e.time)} · {e.date}</div>
                    </div>
                  </div>
                  <span style={{ fontSize:"11px", fontWeight:"600", color:"#fff", background:getDifficultyColour(e.difficulty), padding:"3px 8px", borderRadius:"10px" }}>{e.difficulty}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    );
  }

  // GAME SCREEN
  return (
    <div style={{ minHeight:"100vh", background:m.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:"8px", fontFamily:"'Georgia', serif" }}>
      <div style={{ width:"100%", maxWidth:"420px", display:"flex", flexDirection:"column", borderRadius:"16px", overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.10)", position:"relative" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 14px", background:m.surface, borderBottom:`1px solid ${m.border}`, position:"relative" }}>
          <button onClick={() => setScreen("onboarding")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"22px", color:m.muted, padding:"2px 6px", lineHeight:1 }}>‹</button>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:"17px", fontWeight:"700", color:m.text }}>Sudoku</div>
              <div style={{ fontSize:"11px", color:m.muted }}>{formatTime(timer)}</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
              <span style={{ fontSize:"11px", color:m.muted, fontWeight:"500" }}>Coach</span>
              <div onClick={() => setCoachMode(p=>!p)} style={{ width:"34px", height:"19px", borderRadius:"10px", cursor:"pointer", background:coachMode?NAVY:m.border, position:"relative", transition:"background 0.2s" }}>
                <div style={{ position:"absolute", top:"2px", left:coachMode?"17px":"2px", width:"15px", height:"15px", borderRadius:"50%", background:"#fff", transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }}/>
              </div>
            </div>
          </div>
          <button onClick={() => { setPrevDifficulty(difficulty); SETTINGS_UI === "B" ? setScreen("settings") : setSettingsOpen(p => !p); }} style={{ background:"none", border:`1px solid ${m.border}`, borderRadius:"8px", width:"32px", height:"32px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px" }}><img src={gearIcon} alt="Settings" style={{ width:"20px", height:"20px" }} /></button>
        </div>

        {/* Demo button for easy */}
        {difficulty==="easy" && (
          <div style={{ background:m.highlight, padding:"6px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:"11px", color:m.muted, fontStyle:"italic" }}>Demo mode available</span>
            <button onClick={demoFill} style={{ padding:"4px 10px", borderRadius:"8px", background:NAVY, color:"#fff", border:"none", cursor:"pointer", fontSize:"11px", fontFamily:"'Georgia', serif", fontWeight:"600" }}>Fill for demo</button>
          </div>
        )}

        {/* Grid */}
        <div style={{ background:m.surface, padding:"12px 12px 6px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(9,1fr)", border:`2px solid ${m.text}`, borderRadius:"3px", overflow:"hidden" }}>
            {board.map((row,r) => row.map((val,ci) => {
              const given=isGiven(r,ci);
              const isErr=errors.has(`${r}-${ci}`);
              return (
                <div key={`${r}-${ci}`} onClick={() => { if(!timerActive&&!completionTime) setTimerActive(true); setSelected([r,ci]); }} style={{
                  width:"100%", aspectRatio:"1", display:"flex", alignItems:"center", justifyContent:"center",
                  background:getCellBg(r,ci), cursor:given?"default":"pointer",
                  borderRight:ci===8?"none":(ci+1)%3===0?`2px solid ${m.text}`:`1px solid ${m.border}`,
                  borderBottom:r===8?"none":(r+1)%3===0?`2px solid ${m.text}`:`1px solid ${m.border}`,
                  borderLeft:"none", borderTop:"none", boxSizing:"border-box",
                  fontSize:"clamp(12px,2.4vw,19px)", fontWeight:given?"700":"500",
                  color:selected&&selected[0]===r&&selected[1]===ci?"#fff":isErr?"#CC2020":given?m.text:NAVY_DARK,
                  fontFamily:"'Georgia', serif", transition:"background 0.12s",
                }}>{val!==0?val:""}</div>
              );
            }))}

        {/* Settings overlay */}
        {settingsOpen && SETTINGS_UI === "A" && (
          <div style={{ position:"absolute", inset:0, zIndex:100, display:"flex", justifyContent:"flex-end" }}>
            <div onClick={() => setSettingsOpen(false)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.3)" }}/>
            <div style={{
              position:"relative", width:"220px", height:"100%", background:m.surface,
              boxShadow:"-4px 0 24px rgba(0,0,0,0.15)", overflowY:"auto",
              padding:"16px 14px", zIndex:101, fontFamily:"'Georgia', serif",
              animation:"slideIn 0.2s ease-out",
            }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px" }}>
                <h2 style={{ fontSize:"15px", fontWeight:"700", color:m.text, margin:0 }}>Settings</h2>
                <button onClick={() => setSettingsOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"20px", color:m.muted, padding:"2px" }}>✕</button>
              </div>
              <p style={{ fontSize:"12px", color:m.muted, marginBottom:"16px", fontStyle:"italic" }}>
                Changing difficulty will restart the puzzle
              </p>
              {[
                { label:"Coach personality", setter:setPersonality, val:personality, options:[{val:"friendly",label:"Friendly"},{val:"neutral",label:"Neutral"}] },
                { label:"Difficulty", setter:setDifficulty, val:difficulty, options:[{val:"easy",label:"Easy"},{val:"medium",label:"Medium"},{val:"hard",label:"Hard"}] },
                { label:"Colour mood", setter:setColorMood, val:colorMood, options:[{val:"warm",label:"Warm"},{val:"cool",label:"Cool"},{val:"neutral",label:"Neutral"}] },
              ].map(({ label, setter, val, options }) => (
                <div key={label} style={{ marginBottom:"20px" }}>
                  <label style={{ fontSize:"12px", fontWeight:"600", color:m.text, display:"block", marginBottom:"8px" }}>{label}</label>
                  <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                    {options.map(({ val:ov, label:ol }) => (
                      <button key={ov} onClick={() => setter(ov)} style={{
                        padding:"7px 12px", borderRadius:"16px", fontSize:"12px", cursor:"pointer",
                        background:val===ov?NAVY:m.bg, color:val===ov?"#fff":m.text,
                        border:`1.5px solid ${val===ov?NAVY:m.border}`,
                        fontFamily:"'Georgia', serif", fontWeight:val===ov?"600":"400",
                        transition:"all 0.15s",
                      }}>{ol}</button>
                    ))}
                  </div>
                </div>
              ))}
              {difficulty !== prevDifficulty && (
                <button onClick={() => { startNewGame(difficulty); setSettingsOpen(false); }} style={{
                  width:"100%", padding:"12px", borderRadius:"10px", fontSize:"14px", fontWeight:"700",
                  background:NAVY, color:"#fff", border:"none", cursor:"pointer",
                  fontFamily:"'Georgia', serif", marginTop:"8px",
                }}>
                  Start new puzzle →
                </button>
              )}
            </div>
          </div>
        )}

          </div>
          
        </div>

        {/* Number pad */}
        <div style={{ background:m.surface, padding:"6px 12px 4px" }}>
          <div style={{ display:"flex", gap:"4px", alignItems:"center" }}>
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <button key={n} onClick={() => handleNumber(n)} style={{
                flex:1, aspectRatio:"1", borderRadius:"8px", border:`1px solid ${m.border}`,
                background:m.bg, fontSize:"clamp(14px,2.4vw,20px)", fontWeight:"700",
                color:m.text, cursor:"pointer", fontFamily:"'Georgia', serif",
              }}>{n}</button>
            ))}
            <button onClick={() => { setMuted(p => { if(!p) window.speechSynthesis?.cancel(); return !p; }); }} style={{
              width:"36px", height:"36px", borderRadius:"8px", border:"none",
              background:muted?m.border:NAVY, color:"#fff", cursor:"pointer", fontSize:"14px",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}><img src={muted?muteIcon:volumeIcon} alt={muted?"mute":"volume"} style={{width:"20px",height:"20px"}} /></button>
          </div>
        </div>


        {/* Coach area */}
        {coachMode ? (
          <div style={{ background:m.coach, borderTop:`1px solid ${m.border}` }}>
            {speaking && (
              <div style={{ padding:"4px 14px 0", display:"flex", alignItems:"center", gap:"6px" }}>
                <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:NAVY }}/>
                <span style={{ fontSize:"11px", color:NAVY, fontWeight:"500" }}>ElliQ is speaking...</span>
              </div>
            )}
            <div ref={chatRef} style={{ maxHeight:"130px", overflowY:"auto", padding:"8px 12px 4px", display:"flex", flexDirection:"column", gap:"5px" }}>
              {coachMessages.length===0 && (
                <p style={{ fontSize:"12px", color:m.muted, margin:0, fontStyle:"italic", textAlign:"center" }}>
                  {personality==="friendly"?"Your coach is ready, select a cell to begin!":"Select a cell to begin."}
                </p>
              )}
              {coachMessages.map((msg,i) => (
                <div key={i} style={{
                  alignSelf:msg.role==="user"?"flex-end":"flex-start",
                  background:msg.role==="user"?NAVY:m.surface, color:msg.role==="user"?"#fff":m.text,
                  padding:"7px 11px", borderRadius:msg.role==="user"?"14px 14px 3px 14px":"14px 14px 14px 3px",
                  fontSize:"12px", maxWidth:"88%", lineHeight:"1.55", boxShadow:"0 1px 3px rgba(0,0,0,0.06)",
                }}>{msg.content}</div>
              ))}
              {coachLoading && (
                <div style={{ alignSelf:"flex-start", background:m.surface, padding:"7px 11px", borderRadius:"14px 14px 14px 3px", fontSize:"12px", color:m.muted }}>ElliQ is thinking...</div>
              )}
            </div>
            <div style={{ display:"flex", gap:"6px", padding:"5px 10px 10px", alignItems:"center" }}>
              <button onClick={startListening} disabled={coachLoading} style={{
                width:"34px", height:"34px", borderRadius:"50%", border:"none",
                background:listening?"#CC2020":NAVY, color:"#fff", cursor:"pointer", fontSize:"15px",
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"background 0.2s",
              }}>{listening?"⏹":"🎤"}</button>
              <input value={coachInput} onChange={e=>setCoachInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handleCoachSend()}
                placeholder={personality==="friendly"?"Ask ElliQ anything...":"Ask for guidance..."}
                style={{ flex:1, padding:"8px 12px", borderRadius:"18px", border:`1px solid ${m.border}`, fontSize:"12px", fontFamily:"'Georgia', serif", background:m.surface, color:m.text, outline:"none" }}/>
              <button onClick={handleCoachSend} disabled={coachLoading||!coachInput.trim()} style={{
                padding:"8px 13px", borderRadius:"18px", border:"none",
                background:coachInput.trim()&&!coachLoading?NAVY:m.border,
                color:"#fff", fontSize:"12px", cursor:"pointer", fontFamily:"'Georgia', serif", fontWeight:"600", flexShrink:0,
              }}>Send</button>
            </div>
          </div>
        ) : (
          <div style={{ background:m.surface, borderTop:`1px solid ${m.border}`, padding:"10px 14px", textAlign:"center", borderRadius:"0 0 16px 16px" }}>
            <p style={{ fontSize:"12px", color:m.muted, margin:0 }}>Coach mode off — toggle on for AI guidance</p>
          </div>
        )}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}