import { useState, useRef, useEffect } from "react";
import QuickTest from "./QuickTest";
import Oracle from "./Oracle";
import Comprehensive from "./Comprehensive";
import NewWindow from "./NewWindow";

const QUESTIONS = [
  {
    id: 1,
    title: "빛났던 순간",
    prompt: "스스로가 뿌듯하거나 자랑스러웠던 순간이 있으신가요? 크고 대단한 일이 아니어도 좋아요. 그때 어떤 기분이었는지, 기억나시는 대로 써주세요.",
    placeholder: "예: 별것 아닌 것 같지만, 그때 나는 정말...",
    bg: "#a8c8e0", textColor: "#05182a", accentColor: "#1a4d6e", borderColor: "#6a95b8",
    deco: "circle", skippable: false
  },
  {
    id: 2,
    title: "내 사람들",
    prompt: "나에게 중요한 사람, 편한 사람, 그리고 거슬리는 사람 — 다 써보세요. 왜 그런지 이유도 함께요.",
    placeholder: "예: 나에게 중요한 사람은 ___인데, 왜냐하면...",
    bg: "#c8bfdf", textColor: "#1a0f35", accentColor: "#5c4a8a", borderColor: "#9b89c4",
    deco: "shards", skippable: false
  },
  {
    id: 3,
    title: "억울했던 순간",
    prompt: "누군가에게 오해받거나 억울했던 적 있나요? 그때 하고 싶었던 말이 있었는데 하지 못했다면 여기서 해보세요.",
    placeholder: "예: 그때 정말 ___하고 싶었는데...",
    bg: "#e8c8b8", textColor: "#2a0e00", accentColor: "#a0522d", borderColor: "#c47a5a",
    deco: "grid", skippable: false
  },
  {
    id: 4,
    title: "자꾸 떠오르는 것",
    prompt: "오래된 일인데도 자꾸 머릿속에 맴도는 장면이 있나요? 왜 떠오르는지 생각해 보신 적 있으세요? 패스하셔도 전혀 상관없어요.",
    placeholder: "예: 몇 년이 지났는데도 자꾸 그 때가...",
    bg: "#e8d48a", textColor: "#1e1400", accentColor: "#8b6914", borderColor: "#c9a84c",
    deco: "spiral", skippable: true
  },
  {
    id: 5,
    title: "반복되는 그 말, 그 상황",
    prompt: "살면서 '또 이러네' 싶었던 순간이 있으셨나요? 비슷한 상황, 비슷한 감정이 반복된다는 느낌이요. 어떤 상황이었는지, 그때 어떤 마음이었는지 써주세요.",
    placeholder: "예: 이상하게 항상 ___한 상황에서...",
    bg: "#b8d4b0", textColor: "#0d200e", accentColor: "#2d6b32", borderColor: "#7a9e6e",
    deco: "star", skippable: false
  },
  {
    id: 6,
    title: "부러웠던 순간",
    prompt: "누군가가, 아니면 어떤 순간이 부러우셨던 적이 있으신가요? 어떤 부분이 부러우셨는지, 기억나시는 대로 써주세요.",
    placeholder: "예: ___ 이 부러웠는데, 돌아보면 내가 원하는 건...",
    bg: "#f0b8c4", textColor: "#2a0a10", accentColor: "#9b2335", borderColor: "#c47a8a",
    deco: "mirror", skippable: false
  },
  {
    id: 7,
    title: "나는 누구인가요",
    prompt: "자기 자신에 대해 편하게 이야기해 주세요. 어떤 사람인지, 어떤 일을 하는지, 중요하게 생각하는 게 뭔지 생각대로 쓰시면 돼요.",
    placeholder: "예: 기본적으로 ___한 사람인 것 같아요. 왜냐하면...",
    bg: "#e8d5c0", textColor: "#2a1200", accentColor: "#8b4513", borderColor: "#c4956a",
    deco: "rays", skippable: false
  }
];

const QUESTIONS2 = [
  {
    id: 1,
    title: "친구의 결정",
    prompt: "친한 사람이 당신이 보기엔 분명 좋지 않은 선택을 하려 해요. 그 순간 당신 안에서 무슨 일이 일어나나요? 말하고 싶어지나요, 아니면 조용해지나요?",
    placeholder: "떠오르는 대로 써주세요...",
    bg: "#1a2535", textColor: "#c8d8e8", accentColor: "#4a8ab4", borderColor: "#2a4a6a",
    deco: "circle", skippable: false
  },
  {
    id: 2,
    title: "반박 앞에서",
    prompt: "당신이 확신하던 생각을 누군가 조목조목 반박했어요. 그 자리에서 몸과 마음에 어떤 일이 일어났나요? 그리고 혼자가 됐을 때, 그 반박을 어떻게 대했나요?",
    placeholder: "생각, 감정, 몸의 반응, 이후 행동까지...",
    bg: "#1e1e2e", textColor: "#c8c8e8", accentColor: "#6a5acd", borderColor: "#3a3a6a",
    deco: "shards", skippable: false
  },
  {
    id: 3,
    title: "막힌 문제",
    prompt: "며칠째 붙잡고 있는데도 풀리지 않는 문제가 있어요. 일이든, 관계든, 결정이든. 그럴 때 당신은 어디로 가나요?",
    placeholder: "그때 당신의 상태도 함께 적어주세요...",
    bg: "#1a2520", textColor: "#c8e0c8", accentColor: "#3a8a5a", borderColor: "#2a5a3a",
    deco: "grid", skippable: false
  },
  {
    id: 4,
    title: "설명할 수 없는 신호",
    prompt: "이유는 모르겠는데 몸이 먼저 아는 순간들이 있어요. 특정 사람을 보면 어깨에 힘이 들어간다거나, 어떤 장소에 가면 이유 없이 피곤해진다거나. 당신은 그런 신호를 어떻게 대해왔나요?",
    placeholder: "떠오르는 방식대로 적어주세요...",
    bg: "#251a20", textColor: "#e0c8d0", accentColor: "#8a3a5a", borderColor: "#5a2a3a",
    deco: "spiral", skippable: true
  },
  {
    id: 5,
    title: "예상 밖의 결과",
    prompt: "열심히 준비했는데 결과가 완전히 달랐어요. 그 순간 제일 먼저 떠오른 건 뭐였나요?",
    placeholder: "예: 나 자신, 운이나 타이밍, 특정한 누군가...",
    bg: "#201a25", textColor: "#d8c8e8", accentColor: "#7a4a9a", borderColor: "#4a2a6a",
    deco: "star", skippable: false
  },
  {
    id: 6,
    title: "복잡한 걸 이해하는 방식",
    prompt: "복잡한 걸 받아들여야 할 때 당신만의 방식이 있어요. 어떻게 하나요? 그리고 그 방법이 안 통할 때는요?",
    placeholder: "당신만의 방식을 적어주세요...",
    bg: "#1a2030", textColor: "#c8d0e8", accentColor: "#3a5a9a", borderColor: "#2a3a6a",
    deco: "mirror", skippable: false
  },
  {
    id: 7,
    title: "지금 필요한 것",
    prompt: "거창한 목표나 미래 얘기가 아니라요. 지금 이 순간, 오늘, 당신에게 필요한 게 있다면 뭘까요?",
    placeholder: "딱 하나만 꼽지 않아도 괜찮아요...",
    bg: "#202020", textColor: "#e0e0e0", accentColor: "#8a8a8a", borderColor: "#4a4a4a",
    deco: "rays", skippable: false
  }
];

const MIRROR_PRINCIPLES = `
당신의 역할은 사용자를 진단하거나 규정하는 분석가가 아닙니다.
당신의 역할은 사용자가 자신의 반복 패턴과 선택 구조를 스스로 발견하도록 돕는 거울입니다.

반드시 지켜야 할 원칙:
1. 사람을 정의하지 말고 반복되는 움직임을 관찰하라.
2. 결론보다 흔적을 먼저 보여라.
3. 해석은 가설로만 제시하라.
4. 장점과 비용을 함께 보여라.
5. 사람보다 구조를 설명하라.
6. 사용자의 표현을 우선하라.
7. 놀라운 통찰을 만들려 하지 마라.
8. 여백을 남겨라.
9. 볼드(**텍스트**) 절대 사용 금지.
10. 소제목(###) 절대 사용 금지.
11. 전문 용어 사용 금지.
12. 존댓말로 쓸 것. 따뜻하되 거리를 유지할 것.
13. 각 섹션 최대 4-5문장. 짧고 깊게.
14. 전체가 하나의 흐름처럼 읽혀야 한다.
`;

const systemPrompt = `${MIRROR_PRINCIPLES}

사용자가 제공한 7가지 답변을 분석합니다.

출력 구조:
## 여기까지 오셨네요
## 당신이 자주 느끼는 감정
## 사람 사이에서 반복되는 것
## 말하지 못한 말
## 감정의 결
## 이제 질문은 당신에게

한국어로 작성하세요.`;

const systemPrompt2 = `${MIRROR_PRINCIPLES}

사용자가 제공한 7가지 답변을 분석하여 사고 방식과 패턴을 파악합니다.

출력 구조:
## 두 번째 질문들까지
## 생각하는 방식
## 갈등을 해결하는 방식
## 몸이 먼저 아는 것
## 지금 당신에게 필요한 것
## 이제 질문은 당신에게

한국어로 작성하세요.`;

const Decoration = ({ type, color }) => {
  const s = { position: "absolute", pointerEvents: "none" };
  if (type === "circle") return (
    <svg style={{...s, top: "-60px", right: "-60px", opacity: 0.18}} width="280" height="280" viewBox="0 0 280 280">
      <circle cx="140" cy="140" r="130" fill="none" stroke={color} strokeWidth="2"/>
      <circle cx="140" cy="140" r="90" fill="none" stroke={color} strokeWidth="1"/>
      <circle cx="140" cy="140" r="50" fill={color} opacity="0.15"/>
    </svg>
  );
  if (type === "mirror") return (
    <svg style={{...s, top: "20px", right: "-40px", opacity: 0.2}} width="200" height="300" viewBox="0 0 200 300">
      <ellipse cx="100" cy="120" rx="70" ry="100" fill="none" stroke={color} strokeWidth="2"/>
      <rect x="85" y="220" width="30" height="60" fill="none" stroke={color} strokeWidth="2"/>
      <line x1="60" y1="280" x2="140" y2="280" stroke={color} strokeWidth="2"/>
    </svg>
  );
  if (type === "spiral") return (
    <svg style={{...s, bottom: "-40px", right: "-40px", opacity: 0.2}} width="260" height="260" viewBox="0 0 260 260">
      <path d="M130,130 m-5,0 a5,5 0 1,1 10,0 a15,15 0 1,1 -30,0 a30,30 0 1,1 60,0 a50,50 0 1,1 -100,0 a75,75 0 1,1 150,0" fill="none" stroke={color} strokeWidth="2"/>
    </svg>
  );
  if (type === "grid") return (
    <svg style={{...s, top: "0", right: "-20px", opacity: 0.15}} width="220" height="220" viewBox="0 0 220 220">
      {[0,1,2,3,4].map(r => [0,1,2,3,4].map(c => (
        <rect key={`${r}-${c}`} x={c*44+2} y={r*44+2} width="40" height="40" fill="none" stroke={color} strokeWidth="1.5"/>
      )))}
    </svg>
  );
  if (type === "star") return (
    <svg style={{...s, top: "-30px", right: "-30px", opacity: 0.2}} width="240" height="240" viewBox="0 0 240 240">
      {[0,1,2,3,4,5,6,7].map(i => {
        const a = (i * Math.PI * 2) / 8;
        const x1 = 120 + Math.cos(a) * 20; const y1 = 120 + Math.sin(a) * 20;
        const x2 = 120 + Math.cos(a) * 100; const y2 = 120 + Math.sin(a) * 100;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5"/>;
      })}
      <circle cx="120" cy="120" r="18" fill={color} opacity="0.3"/>
      <circle cx="120" cy="120" r="8" fill={color} opacity="0.5"/>
    </svg>
  );
  if (type === "shards") return (
    <svg style={{...s, top: "-20px", right: "-20px", opacity: 0.18}} width="240" height="240" viewBox="0 0 240 240">
      <polygon points="120,20 180,80 150,140" fill="none" stroke={color} strokeWidth="1.5"/>
      <polygon points="60,60 140,50 100,130" fill="none" stroke={color} strokeWidth="1.5"/>
      <polygon points="100,100 200,90 160,180" fill="none" stroke={color} strokeWidth="1.5"/>
      <polygon points="40,120 120,110 80,200" fill="none" stroke={color} strokeWidth="1.5"/>
      <polygon points="140,140 220,130 190,210" fill="none" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
  if (type === "rays") return (
    <svg style={{...s, top: "-30px", right: "-30px", opacity: 0.18}} width="260" height="260" viewBox="0 0 260 260">
      {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => {
        const a = (i * Math.PI * 2) / 12;
        const x1 = 130 + Math.cos(a) * 30; const y1 = 130 + Math.sin(a) * 30;
        const x2 = 130 + Math.cos(a) * 110; const y2 = 130 + Math.sin(a) * 110;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1"/>;
      })}
      <circle cx="130" cy="130" r="28" fill={color} opacity="0.2"/>
      <circle cx="130" cy="130" r="14" fill={color} opacity="0.35"/>
    </svg>
  );
  return null;
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300&display=swap');`;

function FeedbackWidget({ dark = false }) {
  const [selected, setSelected] = useState(null);
  const textColor = dark ? "rgba(240,237,232,0.45)" : "rgba(38,50,44,0.45)";
  const borderColor = dark ? "rgba(240,237,232,0.15)" : "rgba(38,50,44,0.15)";
  const dividerColor = dark ? "rgba(240,237,232,0.08)" : "rgba(38,50,44,0.08)";
  return (
    <div style={{marginTop:"2.5rem",paddingTop:"2rem",borderTop:`1px solid ${dividerColor}`,textAlign:"center"}}>
      <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",fontWeight:300,color:textColor,marginBottom:"1rem"}}>읽으면서 가장 크게 울린 부분이 있다면?</p>
      {!selected && (
        <div style={{display:"flex",gap:"0.75rem",justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={() => setSelected("yes")} style={{background:"none",border:`1px solid ${borderColor}`,fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",color:textColor,padding:"0.4rem 1rem",cursor:"pointer"}}>👍 맞아요</button>
          <button onClick={() => setSelected("no")} style={{background:"none",border:`1px solid ${borderColor}`,fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",color:textColor,padding:"0.4rem 1rem",cursor:"pointer"}}>👎 아닌 것 같아요</button>
          <button onClick={() => setSelected("unsure")} style={{background:"none",border:`1px solid ${borderColor}`,fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",color:textColor,padding:"0.4rem 1rem",cursor:"pointer"}}>🤔 잘 모르겠어요</button>
        </div>
      )}
      {selected === "yes" && <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",fontWeight:300,color:textColor}}>감사해요.</p>}
      {selected === "unsure" && <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",fontWeight:300,color:textColor}}>그 모르겠다는 느낌도 중요한 정보예요.</p>}
      {selected === "no" && (
        <div>
          <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.85rem",fontWeight:300,color:textColor,lineHeight:1.9,marginBottom:"0.75rem"}}>맞지 않는 부분이 있으신가요?<br/>당신이 느낀 것을 말씀해주세요.</p>
          <a href="https://forms.gle/1MK9PRZmTBpFsEPN8" target="_blank" rel="noopener noreferrer" style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",color:textColor,textDecoration:"underline",textUnderlineOffset:"3px"}}>피드백 남기기 →</a>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [stage, setStage] = useState(1);
  const [step, setStep] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [analysis2, setAnalysis2] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [showQuickTest, setShowQuickTest] = useState(false);
  const [showOracle, setShowOracle] = useState(false);
  const [oracleInitialPhase, setOracleInitialPhase] = useState("intro");
  const [showComprehensive, setShowComprehensive] = useState(false);
  const [showNewWindow, setShowNewWindow] = useState(false);
  const [visibleSections, setVisibleSections] = useState([]);
  const textareaRef = useRef(null);
  const resultRef = useRef(null);

  const questions = stage === 1 ? QUESTIONS : QUESTIONS2;

  useEffect(() => {
    const savedResult2 = localStorage.getItem("mindmirror_result2");
    const savedResult1 = localStorage.getItem("mindmirror_result1");
    if (savedResult2 && window.confirm("이전 2단계 분석 결과가 있어요. 다시 볼까요?")) {
      setAnalysis2(savedResult2);
      if (savedResult1) setAnalysis(savedResult1);
      setStage(2); setStep("result2"); return;
    } else if (savedResult1 && !savedResult2 && window.confirm("이전 1단계 분석 결과가 있어요. 다시 볼까요?")) {
      setAnalysis(savedResult1); setStep("result"); return;
    }
    const saved = localStorage.getItem("mindmirror_answers");
    const savedStage = localStorage.getItem("mindmirror_stage");
    const savedQ = localStorage.getItem("mindmirror_currentQ");
    if (saved) {
      const parsedAnswers = JSON.parse(saved);
      const hasAnswers = Object.keys(parsedAnswers).length > 0;
      if (hasAnswers && window.confirm("이전에 작성하던 내용이 있어요. 이어서 하시겠어요?")) {
        setAnswers(parsedAnswers);
        setStage(savedStage ? parseInt(savedStage) : 1);
        setCurrentQ(savedQ ? parseInt(savedQ) : 0);
        setStep("questions");
      } else {
        localStorage.removeItem("mindmirror_answers");
        localStorage.removeItem("mindmirror_stage");
        localStorage.removeItem("mindmirror_currentQ");
      }
    }
  }, []);

  useEffect(() => {
    if (step === "questions") {
      localStorage.setItem("mindmirror_answers", JSON.stringify(answers));
      localStorage.setItem("mindmirror_stage", stage.toString());
      localStorage.setItem("mindmirror_currentQ", currentQ.toString());
    }
    if ((step === "result" && analysis) || (step === "result2" && analysis2)) {
      localStorage.removeItem("mindmirror_answers");
      localStorage.removeItem("mindmirror_stage");
      localStorage.removeItem("mindmirror_currentQ");
    }
  }, [answers, step, currentQ, stage]);

  useEffect(() => {
    if (step === "questions" && textareaRef.current) textareaRef.current.focus();
  }, [step, currentQ, stage]);

  useEffect(() => { setCharCount(currentAnswer.length); }, [currentAnswer]);

  // 결과 섹션 순차 fadeIn
  useEffect(() => {
    if (step !== "result" && step !== "result2") return;
    setVisibleSections([]);
    const keys1 = ["여기까지 오셨네요","당신이 자주 느끼는 감정","사람 사이에서 반복되는 것","말하지 못한 말","감정의 결","이제 질문은 당신에게"];
    const keys2 = ["두 번째 질문들까지","생각하는 방식","갈등을 해결하는 방식","몸이 먼저 아는 것","지금 당신에게 필요한 것","이제 질문은 당신에게"];
    const keys = step === "result" ? keys1 : keys2;
    keys.forEach((s, i) => {
      setTimeout(() => setVisibleSections(prev => [...prev, s]), i * 1400);
    });
  }, [step]);

  const handleNext = () => {
    const newAnswers = { ...answers, [currentQ]: currentAnswer };
    setAnswers(newAnswers);
    setCurrentAnswer("");
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep("analyzing");
      if (stage === 1) analyze(newAnswers);
      else analyze2(newAnswers);
    }
  };

  const handleSkip = () => {
    const newAnswers = { ...answers, [currentQ]: "" };
    setAnswers(newAnswers);
    setCurrentAnswer("");
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep("analyzing");
      if (stage === 1) analyze(newAnswers);
      else analyze2(newAnswers);
    }
  };

  const handleBack = () => {
    if (currentQ > 0) {
      const prevAnswer = answers[currentQ - 1] || "";
      setCurrentAnswer(prevAnswer);
      setCurrentQ(currentQ - 1);
    }
  };

  const analyze = async (allAnswers) => {
    const userContent = QUESTIONS.map((q, i) =>
      `[${q.title}]\n${allAnswers[i] || "(미입력 — 침묵 데이터로 처리)"}`
    ).join("\n\n");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-5", max_tokens: 4000, system: systemPrompt, messages: [{ role: "user", content: userContent }] })
      });
      const data = await response.json();
      const text = data.content ? data.content.map(b => typeof b.text === 'string' ? b.text : "").join("") : "분석 실패";
      const result = text || "분석 실패";
      setAnalysis(result);
      localStorage.setItem("mindmirror_result1", result);
      setStep("result");
    } catch (e) { setAnalysis(JSON.stringify(e)); setStep("result"); }
  };

  const analyze2 = async (allAnswers) => {
    const userContent = QUESTIONS2.map((q, i) =>
      `[${q.title}]\n${allAnswers[i] || "(미입력 — 침묵 데이터로 처리)"}`
    ).join("\n\n");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-5", max_tokens: 4000, system: systemPrompt2, messages: [{ role: "user", content: userContent }] })
      });
      const data = await response.json();
      const text = data.content ? data.content.map(b => typeof b.text === 'string' ? b.text : "").join("") : "분석 실패";
      const result2 = text || "분석 실패";
      setAnalysis2(result2);
      localStorage.setItem("mindmirror_result2", result2);
      setStep("result2");
    } catch (e) { setAnalysis2(JSON.stringify(e)); setStep("result2"); }
  };

  const startStage2 = () => {
    setStage(2); setStep("intro2"); setCurrentQ(0);
    setAnswers({}); setCurrentAnswer(""); setCharCount(0);
  };

  const copyResult = () => {
    const text = step === "result" ? analysis : analysis2;
    navigator.clipboard.writeText(text).then(() => { alert("복사되었습니다."); });
  };

  const downloadResult = () => {
    const text = step === "result" ? analysis : analysis2;
    const title = step === "result" ? "마음거울_1단계_분석결과" : "마음거울_2단계_분석결과";
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${title}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const restart = () => {
    setStage(1); setStep("intro"); setCurrentQ(0); setAnswers({});
    setCurrentAnswer(""); setAnalysis(""); setAnalysis2(""); setCharCount(0);
    localStorage.removeItem("mindmirror_result1");
    localStorage.removeItem("mindmirror_result2");
  };

  function parseSection(text, key, allKeys) {
    if (!text) return "";
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const idx = allKeys.indexOf(key);
    const rest = allKeys.slice(idx + 1).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const pattern = rest.length > 0
      ? new RegExp(`##\\s*${escaped}([\\s\\S]*?)(?:##\\s*(?:${rest.join("|")})|$)`)
      : new RegExp(`##\\s*${escaped}([\\s\\S]*?)$`);
    const match = text.match(pattern);
    return match ? match[1].trim() : "";
  }

  if (showQuickTest) return <QuickTest onBack={() => setShowQuickTest(false)} />;
  if (showComprehensive) return (
    <Comprehensive onBack={() => { setShowComprehensive(false); setOracleInitialPhase("final"); setShowOracle(true); }} />
  );
  if (showNewWindow) return <NewWindow onBack={() => setShowNewWindow(false)} onComprehensive={() => { setShowNewWindow(false); setShowComprehensive(true); }} />;
  if (showOracle) return (
    <Oracle initialPhase={oracleInitialPhase} onBack={() => { setShowOracle(false); setOracleInitialPhase("intro"); }} onComprehensive={() => { setShowOracle(false); setOracleInitialPhase("intro"); setShowComprehensive(true); }} />
  );

  const progress = (currentQ / questions.length) * 100;
  const q = questions[currentQ];
  const canProceed = currentAnswer.trim().length > 0;

  // 결과 섹션 키
  const resultKeys1 = ["여기까지 오셨네요","당신이 자주 느끼는 감정","사람 사이에서 반복되는 것","말하지 못한 말","감정의 결","이제 질문은 당신에게"];
  const resultKeys2 = ["두 번째 질문들까지","생각하는 방식","갈등을 해결하는 방식","몸이 먼저 아는 것","지금 당신에게 필요한 것","이제 질문은 당신에게"];

  // ── 메인 랜딩 ───────────────────────────────────────────────────
  if (step === "intro") {
    return (
      <div style={{background:"#1F3A32",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"3rem 1.5rem"}}>
        <style>{FONTS + `
          @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          .fade5 { opacity:0; animation:fadeUp 0.6s ease forwards 2.9s; }
          .fade7 { opacity:0; animation:fadeUp 0.6s ease forwards 4.5s; }
          .fade8 { opacity:0; animation:fadeUp 0.6s ease forwards 5.1s; }
          .intro-card-hover { transition:all 0.3s; cursor:pointer; }
          .intro-card-hover:hover { transform:translateY(-2px); }
        `}</style>
        <div style={{width:"100%",maxWidth:520}}>
          <div style={{marginBottom:"3rem",paddingBottom:"2rem",borderBottom:"1px solid rgba(247,242,232,0.1)"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",fontStyle:"italic",color:"rgba(247,242,232,0.4)",marginBottom:"0.4rem"}}>마음거울</div>
            <h1 style={{fontFamily:"'Source Serif 4',serif",fontSize:"clamp(1.8rem,5vw,2.4rem)",fontWeight:400,color:"rgba(247,242,232,0.9)",lineHeight:1.2,marginBottom:"0.75rem"}}>나를 만나는 다섯 가지 방식</h1>
          </div>

          <div className="fade5" style={{marginBottom:"2.5rem"}}>
            <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.95rem",fontWeight:300,color:"rgba(247,242,232,0.65)",lineHeight:1.9,marginBottom:"0.75rem"}}>나는 나를 잘 안다고 생각했다.<br/>왜 나는 매번 여기서 막히는 걸까?<br/>내가 한 말인데 내가 왜 그랬는지 모르겠다.<br/>나에 대해 설명하려다 말문이 막혔다.</p>
            <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.95rem",fontWeight:300,color:"rgba(247,242,232,0.65)",lineHeight:1.9,marginBottom:"0.75rem"}}>모르는 게 당연해요.<br/>대부분의 자기 이해는 남이 해준 말과 벌어진 사건으로 만들어졌으니까요.</p>
            <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.95rem",fontWeight:300,color:"rgba(247,242,232,0.65)",lineHeight:1.9,marginBottom:"0.75rem"}}>당신이 쓴 말이 가장 정직한 자기소개가 되어야 해요.</p>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:"0.95rem",fontStyle:"italic",color:"rgba(247,242,232,0.4)",lineHeight:1.9}}>답하다 보면 내가 왜 그 사람 앞에서만 작아지는지,<br/>왜 늘 그 순간에 후회하는지 보이기 시작해요.</p>
          </div>

          <div className="fade7" style={{position:"relative",paddingLeft:"3rem"}}>
            <div style={{position:"absolute",left:14,top:20,bottom:20,width:1,background:"rgba(247,242,232,0.12)"}}/>

            {/* 01 */}
            <div className="intro-card-hover" style={{position:"relative",marginBottom:"0.75rem"}}>
              <div style={{position:"absolute",left:"-3rem",top:"1rem",width:28,height:28,borderRadius:"50%",background:"#8C6640",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.65rem",color:"#F7F2E8"}}>01</span>
              </div>
              <div onClick={() => setShowQuickTest(true)} style={{background:"#EEE0CB",padding:"1.4rem 1.8rem",borderLeft:"4px solid #8C6640",borderRadius:"0 4px 4px 0",position:"relative",overflow:"hidden",minHeight:140}}>
                <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.58rem",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(58,36,16,0.5)",marginBottom:"0.35rem"}}>설치한 적 없는데 실행되고 있는 것.</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.15rem",color:"#3A2410",marginBottom:"0.4rem"}}>내 마음의 기본값</div>
                <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.78rem",fontWeight:300,color:"rgba(58,36,16,0.7)",lineHeight:1.75}}>누가 가르쳐준 적 없는데 늘 그렇게 해온 것들이 있어요.<br/>여기서 시작해요 →</p>
              </div>
            </div>

            <div style={{textAlign:"center",margin:"-0.1rem 0 0.1rem",color:"rgba(247,242,232,0.2)",fontSize:"0.8rem"}}>↓</div>

            {/* 02 */}
            <div className="intro-card-hover" style={{position:"relative",marginBottom:"0.75rem"}}>
              <div style={{position:"absolute",left:"-3rem",top:"1rem",width:28,height:28,borderRadius:"50%",background:"#8C7A6A",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.65rem",color:"#F7F2E8"}}>02</span>
              </div>
              <div onClick={() => setStep("mindmirror-intro")} style={{background:"#E6DDD0",padding:"1.4rem 1.8rem",borderLeft:"4px solid #8C7A6A",borderRadius:"0 4px 4px 0",position:"relative",overflow:"hidden",minHeight:140}}>
                <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.58rem",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(58,46,36,0.5)",marginBottom:"0.35rem"}}>켜지자마자 뜨는 것.</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.15rem",color:"#3A2E24",marginBottom:"0.4rem"}}>내 마음의 초기화면</div>
                <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.78rem",fontWeight:300,color:"rgba(58,46,36,0.65)",lineHeight:1.75}}>일이 생겼을 때, 내 마음에 먼저 뜨는 것을 봅니다.<br/>01을 했다면 여기로 →</p>
              </div>
            </div>

            <div style={{textAlign:"center",margin:"-0.1rem 0 0.1rem",color:"rgba(247,242,232,0.2)",fontSize:"0.8rem"}}>↓</div>

            {/* 03 */}
            <div className="intro-card-hover" style={{position:"relative",marginBottom:"0.75rem"}}>
              <div style={{position:"absolute",left:"-3rem",top:"1rem",width:28,height:28,borderRadius:"50%",background:"#4A7A52",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.65rem",color:"#F7F2E8"}}>03</span>
              </div>
              <div onClick={() => { setStage(2); setStep("intro2"); }} style={{background:"#C2D4C0",padding:"1.4rem 1.8rem",borderLeft:"4px solid #4A7A52",borderRadius:"0 4px 4px 0",position:"relative",overflow:"hidden",minHeight:140}}>
                <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.58rem",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(30,46,30,0.5)",marginBottom:"0.35rem"}}>생각하기도 전에 이미 움직이고 있는 것들.</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.15rem",color:"#1E2E1E",marginBottom:"0.4rem"}}>내 마음의 운영체계</div>
                <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.78rem",fontWeight:300,color:"rgba(30,46,30,0.65)",lineHeight:1.75}}>내 첫 반응 아래에 작동하고 있는 해석과 판단의 방식을 알아봐요.<br/>02를 했다면 여기로 →</p>
              </div>
            </div>

            <div style={{textAlign:"center",margin:"-0.1rem 0 0.1rem",color:"rgba(247,242,232,0.2)",fontSize:"0.8rem"}}>↓</div>

            {/* 04 */}
            <div className="intro-card-hover" style={{position:"relative",marginBottom:"0.75rem"}}>
              <div style={{position:"absolute",left:"-3rem",top:"1rem",width:28,height:28,borderRadius:"50%",background:"#2E6A5E",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.65rem",color:"#F7F2E8"}}>04</span>
              </div>
              <div onClick={() => { setOracleInitialPhase("intro"); setShowOracle(true); }} style={{background:"#A8C0B8",padding:"1.4rem 1.8rem",borderLeft:"4px solid #2E6A5E",borderRadius:"0 4px 4px 0",position:"relative",overflow:"hidden",minHeight:140}}>
                <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.58rem",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(26,46,40,0.55)",marginBottom:"0.35rem"}}>지워지지 않고 계속 불러오는 것.</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.15rem",color:"#1A2E28",marginBottom:"0.4rem"}}>내 마음의 메모리</div>
                <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.78rem",fontWeight:300,color:"rgba(26,46,40,0.7)",lineHeight:1.75}}>우리가 반응하는 방식은 어느 날 갑자기 생긴 게 아니에요.<br/>03을 했다면 여기로 →</p>
              </div>
            </div>

            <div style={{textAlign:"center",margin:"-0.1rem 0 0.1rem",color:"rgba(247,242,232,0.2)",fontSize:"0.8rem"}}>↓</div>

            {/* 05 */}
            <div className="intro-card-hover" style={{position:"relative",marginBottom:"0.75rem"}}>
              <div style={{position:"absolute",left:"-3rem",top:"1rem",width:28,height:28,borderRadius:"50%",background:"#3A5278",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.65rem",color:"#F7F2E8"}}>05</span>
              </div>
              <div onClick={() => setShowNewWindow(true)} style={{background:"#B0BED0",padding:"1.4rem 1.8rem",borderLeft:"4px solid #3A5278",borderRadius:"0 4px 4px 0",position:"relative",overflow:"hidden",minHeight:140}}>
                <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.58rem",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(26,34,52,0.5)",marginBottom:"0.35rem"}}>지금까지 보던 창 옆에 작은 창 하나를 더 열어봐요.</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.15rem",color:"#1A2234",marginBottom:"0.4rem"}}>내 마음의 새창열기</div>
                <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.78rem",fontWeight:300,color:"rgba(26,34,52,0.65)",lineHeight:1.75}}>같은 기억도 다른 창으로 보면 조금 다르게 보여요.<br/>여기가 마지막 문이에요 →</p>
              </div>
            </div>
          </div>

          <div className="fade8" style={{padding:"2.5rem 0 0"}}>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:"0.85rem",fontStyle:"italic",color:"#C9A84C",letterSpacing:"0.05em",lineHeight:1.8}}>모든 결과는 마지막 "내 마음의 전체화면"에 다시 모입니다.</p>
          </div>
        </div>
      </div>
    );
  }

  // ── 02 초기화면 인트로 ─────────────────────────────────────────
  if (step === "mindmirror-intro") {
    return (
      <div style={{minHeight:"100vh",background:"#E6DDD0",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem",position:"relative",overflow:"hidden"}}>
        <style>{FONTS}</style>
        <div style={{width:"100%",maxWidth:640,position:"relative",zIndex:1}}>
          <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.6rem",letterSpacing:"0.3em",textTransform:"uppercase",color:"#8C7A6A",marginBottom:"1.5rem"}}>내 마음의 초기화면</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.8rem,4vw,2.6rem)",fontWeight:400,lineHeight:1.2,color:"#3A2E24",marginBottom:"2rem"}}>마음에 먼저 뜨는 것</h1>
          <div style={{marginBottom:"1.5rem"}}>
            <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(58,46,36,0.75)",lineHeight:1.9,marginBottom:"0.75rem"}}>일이 생겼을 때 — 분석하기 전에, 말하기 전에, 행동하기 전에<br/>마음에 먼저 뜨는 것이 있어요.</p>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:"0.95rem",fontStyle:"italic",color:"#8C7A6A",lineHeight:1.9,marginBottom:"0.75rem"}}>걱정이 먼저 오는 사람,<br/>누군가 얼굴이 먼저 떠오르는 사람,<br/>해결책이 먼저 보이는 사람.<br/>그 첫 반응이 당신의 초기화면이에요.</p>
            <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(58,46,36,0.65)",lineHeight:1.9}}>잘 정리된 문장이 아니어도 괜찮아요.<br/>지금 떠오르는 말을 그대로 적어주세요.</p>
          </div>
          <div style={{background:"rgba(140,122,106,0.1)",borderLeft:"3px solid #8C7A6A",padding:"1.1rem 1.25rem",marginBottom:"2rem"}}>
            <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.68rem",letterSpacing:"0.2em",textTransform:"uppercase",color:"#8C7A6A",marginBottom:"0.6rem"}}>시작 전에</div>
            {["틀린 답은 없어요. 생각나는 대로, 편한 만큼만 쓰시면 돼요.","많이 쓸수록 더 풍부한 분석을 받을 수 있어요.","패스하고 싶은 질문은 건너뛰셔도 괜찮아요.","입력하신 내용은 앱에 저장되지 않아요."].map((t,i) => (
              <div key={i} style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.82rem",fontWeight:300,color:"rgba(58,46,36,0.7)",lineHeight:1.85,display:"flex",alignItems:"flex-start",gap:"0.5rem",marginBottom:"0.2rem"}}>
                <span style={{opacity:0.5}}>—</span>{t}
              </div>
            ))}
          </div>
          <div style={{width:"48px",height:"1px",background:"#8C7A6A",margin:"2rem 0"}}/>
          <div style={{marginBottom:"2.5rem"}}>
            {QUESTIONS.map((q,i) => (
              <div key={q.id} style={{display:"flex",alignItems:"center",gap:"1rem",padding:"0.4rem 0",borderBottom:"1px solid rgba(140,122,106,0.2)"}}>
                <span style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.7rem",color:"#8C7A6A",opacity:0.8,minWidth:"1.5rem"}}>{i+1}</span>
                <span style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.85rem",fontWeight:300,color:"#3A2E24"}}>{q.title}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
            <button onClick={() => setStep("questions")} style={{background:"#8C7A6A",border:"none",color:"#F7F2E8",fontFamily:"'Source Serif 4',serif",fontSize:"0.82rem",letterSpacing:"0.18em",textTransform:"uppercase",padding:"1.1rem 2.8rem",cursor:"pointer"}}>초기화면 적어보기</button>
            <button onClick={() => setStep("intro")} style={{background:"transparent",border:"1px solid rgba(140,122,106,0.4)",color:"rgba(58,46,36,0.6)",fontFamily:"'Source Serif 4',serif",fontSize:"0.78rem",letterSpacing:"0.15em",textTransform:"uppercase",padding:"1.1rem 1.8rem",cursor:"pointer"}}>← 마음거울로</button>
          </div>
        </div>
      </div>
    );
  }

  // ── 03 운영체계 인트로 ─────────────────────────────────────────
  if (step === "intro2") {
    return (
      <div style={{minHeight:"100vh",background:"#C2D4C0",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem",position:"relative",overflow:"hidden"}}>
        <style>{FONTS}</style>
        <div style={{width:"100%",maxWidth:640,position:"relative",zIndex:1}}>
          <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.6rem",letterSpacing:"0.3em",textTransform:"uppercase",color:"#4A7A52",marginBottom:"1.5rem"}}>내 마음의 운영체계</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.8rem,4vw,2.6rem)",fontWeight:400,lineHeight:1.2,color:"#1E2E1E",marginBottom:"2rem"}}>반복이 만든 마음의 결</h1>
          <div style={{marginBottom:"1.5rem"}}>
            <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(30,46,30,0.75)",lineHeight:1.9,marginBottom:"0.75rem"}}>내 마음의 초기화면에서는 일이 생겼을 때<br/>내 마음에 자동으로 뜨는 반응을 적어봤습니다.</p>
            <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(30,46,30,0.75)",lineHeight:1.9,marginBottom:"0.75rem"}}>이제 그 답들 사이에 반복해서 나타나는 흐름을 살펴봅니다.</p>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:"0.95rem",fontStyle:"italic",color:"#4A7A52",lineHeight:1.9,marginBottom:"0.75rem"}}>내가 비슷한 상황에서 비슷한 방식으로 생각하고 선택해온 것.<br/>그 반복이 만들어온 구조를 살펴보는 단계입니다.</p>
            <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(30,46,30,0.65)",lineHeight:1.9}}>이 구조는 나를 고정하는 이름이 아닙니다.<br/>지금까지 살아오며 생긴 마음의 결이고,<br/>이제는 내가 알아차리고 다시 선택할 수 있는 지점을 확인하는 과정입니다.</p>
          </div>
          <div style={{background:"rgba(74,122,82,0.1)",borderLeft:"3px solid #4A7A52",padding:"1.1rem 1.25rem",marginBottom:"2rem"}}>
            <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.68rem",letterSpacing:"0.2em",textTransform:"uppercase",color:"#4A7A52",marginBottom:"0.6rem"}}>시작 전에</div>
            {["이번 질문들은 조금 더 깊어요. 생각이 정리되지 않아도 괜찮아요.","떠오르는 대로, 완성되지 않아도 되니 편하게 써주세요."].map((t,i) => (
              <div key={i} style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.82rem",fontWeight:300,color:"rgba(30,46,30,0.7)",lineHeight:1.85,display:"flex",alignItems:"flex-start",gap:"0.5rem",marginBottom:"0.2rem"}}>
                <span style={{opacity:0.5}}>—</span>{t}
              </div>
            ))}
          </div>
          <div style={{width:"48px",height:"1px",background:"#4A7A52",margin:"2rem 0"}}/>
          <div style={{marginBottom:"2rem"}}>
            {QUESTIONS2.map((q,i) => (
              <div key={q.id} style={{display:"flex",alignItems:"center",gap:"1.25rem",padding:"0.4rem 0",borderBottom:"1px solid rgba(74,122,82,0.2)"}}>
                <span style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.7rem",color:"#4A7A52",minWidth:"28px",opacity:0.8}}>{i+1}</span>
                <span style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.85rem",fontWeight:300,color:"#1E2E1E"}}>{q.title}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
            <button onClick={() => setStep("questions")} style={{background:"#4A7A52",border:"none",color:"#F7F2E8",fontFamily:"'Source Serif 4',serif",fontSize:"0.82rem",letterSpacing:"0.18em",textTransform:"uppercase",padding:"1.1rem 2.8rem",cursor:"pointer"}}>선택의 구조 확인하기</button>
            <button onClick={() => setStep("intro")} style={{background:"transparent",border:"1px solid rgba(74,122,82,0.4)",color:"rgba(30,46,30,0.6)",fontFamily:"'Source Serif 4',serif",fontSize:"0.78rem",letterSpacing:"0.15em",textTransform:"uppercase",padding:"1.1rem 1.8rem",cursor:"pointer"}}>← 마음거울로</button>
          </div>
        </div>
      </div>
    );
  }

  // ── 질문 / 로딩 / 결과 ────────────────────────────────────────
  const getBg = () => {
    if (step === "questions") return q.bg;
    if (step === "analyzing") return "#1F3A32";
    if (step === "result" || step === "result2") return "#F7F2E8";
    return "#1F3A32";
  };

  return (
    <div style={{minHeight:"100vh",background:getBg(),transition:"background 0.7s ease",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem",position:"relative",overflow:"hidden"}}>
      <style>{`
        ${FONTS}
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes breathe{0%,100%{opacity:0.35}50%{opacity:0.9}}
        .sec-appear{animation:fadeUp 1.4s ease forwards;opacity:0}
      `}</style>

      {/* 질문 */}
      {step === "questions" && (
        <div style={{width:"100%",maxWidth:640,position:"relative",zIndex:1,color:q.textColor}}>
          <Decoration type={q.deco} color={q.accentColor}/>
          <div style={{width:"100%",height:"1px",background:"rgba(0,0,0,0.1)",marginBottom:"3rem",borderRadius:"1px"}}>
            <div style={{height:"100%",width:(progress + "%"),background:q.accentColor,borderRadius:"1px",transition:"width 0.5s ease"}}/>
          </div>
          <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.65rem",letterSpacing:"0.25em",textTransform:"uppercase",marginBottom:"0.6rem",opacity:0.5}}>
            {currentQ + 1} / {questions.length}
          </div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.4rem,3.5vw,1.8rem)",fontWeight:400,lineHeight:1.4,marginBottom:"1.5rem"}}>{q.title}</h2>
          <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.88rem",fontWeight:300,lineHeight:1.9,marginBottom:"2rem",opacity:0.75}}>{q.prompt}</p>
          <textarea ref={textareaRef} value={currentAnswer} onChange={e => setCurrentAnswer(e.target.value)} placeholder={q.placeholder}
            onKeyDown={e => { if(e.key==="Enter" && e.metaKey) handleNext(); }}
            style={{width:"100%",minHeight:"160px",background:"transparent",border:"none",borderBottom:`2px solid ${q.borderColor}`,color:q.textColor,fontFamily:"'Source Serif 4',serif",fontSize:"0.97rem",fontWeight:300,lineHeight:1.85,padding:"0.5rem 0",resize:"none",outline:"none"}}/>
          <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.7rem",opacity:0.35,textAlign:"right",marginTop:"0.4rem"}}>{charCount}자</div>
          <div style={{marginTop:"1.75rem",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <button onClick={handleBack} disabled={currentQ===0} style={{background:"transparent",border:"none",fontFamily:"'Source Serif 4',serif",fontSize:"0.72rem",letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",color:q.textColor,opacity:currentQ===0?0.15:0.35,display:"flex",alignItems:"center",gap:"0.5rem"}}>
              <span>←</span><span>이전</span>
            </button>
            <div style={{display:"flex",alignItems:"center",gap:"1.5rem"}}>
              {q.skippable && <button onClick={handleSkip} style={{background:"transparent",border:"none",fontFamily:"'Source Serif 4',serif",fontSize:"0.72rem",letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",opacity:0.35,textDecoration:"underline",textUnderlineOffset:"3px",color:q.textColor}}>패스</button>}
              <button onClick={handleNext} disabled={!canProceed} style={{background:"transparent",border:"none",fontFamily:"'Source Serif 4',serif",fontSize:"0.78rem",letterSpacing:"0.18em",textTransform:"uppercase",cursor:"pointer",color:q.textColor,opacity:canProceed?1:0.25,display:"flex",alignItems:"center",gap:"0.75rem"}}>
                <span>{currentQ<questions.length-1?"다음 질문":"분석 시작"}</span><span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 로딩 */}
      {step === "analyzing" && (
        <div style={{textAlign:"center"}}>
          <p style={{fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontStyle:"italic",color:"rgba(247,242,232,0.4)",animation:"breathe 2s ease-in-out infinite"}}>
            읽고 있어요
          </p>
        </div>
      )}

      {/* 02 결과 */}
      {step === "result" && (
        <div style={{width:"100%",maxWidth:640,maxHeight:"88vh",overflowY:"auto",scrollbarWidth:"none",position:"relative",zIndex:1}} ref={resultRef}>
          <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.6rem",letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(38,50,44,0.4)",marginBottom:"0.5rem"}}>내 마음의 초기화면 — 분석 결과</div>
          <div style={{width:"100%",height:"1px",background:"rgba(38,50,44,0.12)",marginBottom:"2rem"}}/>
          {resultKeys1.map((key, i) => {
            const content = parseSection(analysis, key, resultKeys1);
            return visibleSections.includes(key) && content ? (
              <div key={key} className="sec-appear" style={{marginBottom:"2rem",animationDelay:(i*0.2)+"s"}}>
                <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.62rem",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(38,50,44,0.4)",marginBottom:"0.4rem"}}>{key}</div>
                <div style={{width:"100%",height:"1px",background:"rgba(38,50,44,0.12)",marginBottom:"1rem"}}/>
                <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"#1F3A32",lineHeight:2,whiteSpace:"pre-wrap"}}>{content}</div>
              </div>
            ) : null;
          })}
          {visibleSections.length === 6 && (
            <div>
              <FeedbackWidget />
              <div style={{display:"flex",gap:"1rem",marginTop:"2rem",flexWrap:"wrap"}}>
                <button onClick={copyResult} style={{background:"transparent",border:"1px solid rgba(38,50,44,0.25)",color:"rgba(38,50,44,0.6)",fontFamily:"'Source Serif 4',serif",fontSize:"0.75rem",letterSpacing:"0.15em",textTransform:"uppercase",cursor:"pointer",padding:"0.75rem 1.75rem"}}>결과 복사</button>
                <button onClick={downloadResult} style={{background:"transparent",border:"1px solid rgba(38,50,44,0.25)",color:"rgba(38,50,44,0.6)",fontFamily:"'Source Serif 4',serif",fontSize:"0.75rem",letterSpacing:"0.15em",textTransform:"uppercase",cursor:"pointer",padding:"0.75rem 1.75rem"}}>결과 저장</button>
                <button onClick={startStage2} style={{background:"transparent",border:"1px solid rgba(38,50,44,0.25)",color:"rgba(38,50,44,0.6)",fontFamily:"'Source Serif 4',serif",fontSize:"0.75rem",letterSpacing:"0.15em",textTransform:"uppercase",cursor:"pointer",padding:"0.75rem 1.75rem"}}>내 마음의 운영체계 →</button>
                <button onClick={restart} style={{background:"transparent",border:"1px solid rgba(38,50,44,0.2)",color:"rgba(38,50,44,0.45)",fontFamily:"'Source Serif 4',serif",fontSize:"0.75rem",letterSpacing:"0.15em",textTransform:"uppercase",cursor:"pointer",padding:"0.75rem 1.75rem"}}>← 마음거울로</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 03 결과 */}
      {step === "result2" && (
        <div style={{width:"100%",maxWidth:640,maxHeight:"88vh",overflowY:"auto",scrollbarWidth:"none",position:"relative",zIndex:1}} ref={resultRef}>
          <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.6rem",letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(38,50,44,0.4)",marginBottom:"0.5rem"}}>내 마음의 운영체계 — 분석 결과</div>
          <div style={{width:"100%",height:"1px",background:"rgba(38,50,44,0.12)",marginBottom:"2rem"}}/>
          {resultKeys2.map((key, i) => {
            const content = parseSection(analysis2, key, resultKeys2);
            return visibleSections.includes(key) && content ? (
              <div key={key} className="sec-appear" style={{marginBottom:"2rem",animationDelay:(i*0.2)+"s"}}>
                <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.62rem",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(38,50,44,0.4)",marginBottom:"0.4rem"}}>{key}</div>
                <div style={{width:"100%",height:"1px",background:"rgba(38,50,44,0.12)",marginBottom:"1rem"}}/>
                <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"#1F3A32",lineHeight:2,whiteSpace:"pre-wrap"}}>{content}</div>
              </div>
            ) : null;
          })}
          {visibleSections.length === 6 && (
            <div>
              <FeedbackWidget />
              <div style={{display:"flex",gap:"1rem",marginTop:"2rem",flexWrap:"wrap"}}>
                <button onClick={copyResult} style={{background:"transparent",border:"1px solid rgba(38,50,44,0.25)",color:"rgba(38,50,44,0.6)",fontFamily:"'Source Serif 4',serif",fontSize:"0.75rem",letterSpacing:"0.15em",textTransform:"uppercase",cursor:"pointer",padding:"0.75rem 1.75rem"}}>결과 복사</button>
                <button onClick={downloadResult} style={{background:"transparent",border:"1px solid rgba(38,50,44,0.25)",color:"rgba(38,50,44,0.6)",fontFamily:"'Source Serif 4',serif",fontSize:"0.75rem",letterSpacing:"0.15em",textTransform:"uppercase",cursor:"pointer",padding:"0.75rem 1.75rem"}}>결과 저장</button>
                <button onClick={restart} style={{background:"transparent",border:"1px solid rgba(38,50,44,0.2)",color:"rgba(38,50,44,0.45)",fontFamily:"'Source Serif 4',serif",fontSize:"0.75rem",letterSpacing:"0.15em",textTransform:"uppercase",cursor:"pointer",padding:"0.75rem 1.75rem"}}>← 마음거울로</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
