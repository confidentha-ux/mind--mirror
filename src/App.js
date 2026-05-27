import { useState, useRef, useEffect } from "react";

const QUESTIONS = [
  {
    id: 1,
    title: "나는 누구인가요",
    prompt: "먼저 자기 자신에 대해 편하게 이야기해 주세요. 어떤 사람인지, 어떤 일을 하는지, 중요하게 생각하는 게 뭔지 생각나는 대로 쓰시면 돼요. 많이 쓰시면 좋고요. 적게 쓰셔도 전혀 상관없어요.",
    placeholder: "예: 나는 기본적으로 ___한 사람인 것 같아요. 왜냐하면...",
    bg: "#e8d5c0", textColor: "#2a1200", accentColor: "#8b4513", borderColor: "#c4956a",
    deco: "circle", skippable: false
  },
  {
    id: 2,
    title: "내 사람들",
    prompt: "나에게 중요한 사람, 편한 사람, 그리고 거슬리는 사람 — 다 써보세요. 왜 그런지 이유도 함께요.",
    placeholder: "예: 나에게 제일 중요한 사람은 ___인데, 왜냐하면...",
    bg: "#c8bfdf", textColor: "#1a0f35", accentColor: "#5c4a8a", borderColor: "#9b89c4",
    deco: "mirror", skippable: false
  },
  {
    id: 3,
    title: "억울했던 순간",
    prompt: "누군가에게 오해받거나 억울했던 적 있나요? 그때 하고 싶었던 말이 있다면 여기서 해보세요.",
    placeholder: "예: 그때 나는 정말 ___하고 싶었는데...",
    bg: "#e8c8b8", textColor: "#2a0e00", accentColor: "#a0522d", borderColor: "#c47a5a",
    deco: "shards", skippable: true
  },
  {
    id: 4,
    title: "자꾸 떠오르는 것",
    prompt: "오래 전 일인데도 자꾸 머릿속에 맴도는 사건이나 장면이 있으신가요? 그게 왜 떠오르는지 생각해 보신 적 있으세요? 한 번도 생각해 보신 적 없으시다면 지금 해보시겠어요. 물론 패스하셔도 전혀 상관없어요.",
    placeholder: "예: 몇 년이 지났는데도 자꾸 생각나는 건...",
    bg: "#e8d48a", textColor: "#1e1400", accentColor: "#8b6914", borderColor: "#c9a84c",
    deco: "spiral", skippable: true
  },
  {
    id: 5,
    title: "반복되는 그 말, 그 상황",
    prompt: "살면서 '또 이러네' 싶었던 순간이 있으셨나요? 비슷한 상황, 비슷한 감정이 반복된다는 느낌이요. 어떤 상황이었는지, 그때 어떤 마음이었는지 써주세요.",
    placeholder: "예: 이상하게 나는 항상 ___한 상황에서...",
    bg: "#b8d4b0", textColor: "#0d200e", accentColor: "#2d6b32", borderColor: "#7a9e6e",
    deco: "grid", skippable: false
  },
  {
    id: 6,
    title: "부러웠던 순간",
    prompt: "누군가가, 아니면 어떤 순간이 부러우셨던 적이 있으신가요? 어떤 부분이 부러우셨는지, 기억나시는 대로 써주세요.",
    placeholder: "예: ___ 이 부러웠는데, 돌아보면 내가 원하는 건...",
    bg: "#f0b8c4", textColor: "#2a0a10", accentColor: "#9b2335", borderColor: "#c47a8a",
    deco: "star", skippable: false
  },
  {
    id: 7,
    title: "빛났던 순간",
    prompt: "스스로가 뿌듯하거나 자랑스러웠던 순간이 있으신가요? 크고 대단한 일이 아니어도 좋아요. 그때 어떤 기분이었는지, 기억나시는 대로 써주세요.",
    placeholder: "예: 별것 아닌 것 같지만, 그때 나는 정말...",
    bg: "#a8c8e0", textColor: "#05182a", accentColor: "#1a4d6e", borderColor: "#6a95b8",
    deco: "rays", skippable: false
  }
];

const systemPrompt = `당신은 대화 기반 인지구조 분석 전문가입니다.
사용자가 제공한 7가지 답변을 분석합니다.

각 질문의 분석 의도:
1. 나는 누구인가요 → 자기개념과 정체성 언어
2. 내 사람들 → 관계 스키마와 대상 분류 방식
3. 억울했던 순간 → 귀인 방식 (외부/내부), 억압된 감정
4. 자꾸 떠오르는 것 → 미해결 감정, 무의식적 집착
5. 반복되는 그 말, 그 상황 → 행동 패턴과 관계 반복
6. 부러웠던 순간 → 결핍과 욕구
7. 빛났던 순간 → 자기효능감과 핵심 가치관

분석 원칙:
- 모든 항목에 반드시 실제 발화를 직접 인용할 것
- 인용 형식: "..." (사용자 표현 그대로)
- 주관적 평가 없이 관찰된 패턴만 기술할 것
- 아첨하지 말 것
- 임상 진단이 아님을 명시할 것
- 스킵하거나 "(미입력)"인 항목은 침묵 데이터로 분석할 것

출력 구조 (반드시 이 순서로, 반드시 아래 제목 그대로 사용):

## 주요 감정 키워드
답변 전체에서 반복 등장하는 감정 단어 3가지.
각각 어느 질문에서 어떤 맥락으로 나왔는지 발화 인용과 함께.

## 관계에서 반복되는 패턴
2번, 3번, 5번을 교차 분석하여 관계 패턴 3가지 도출.
각각 발화 인용 포함.

## 말하지 못한 말들
억울했던 순간, 자꾸 떠오르는 것, 반복되는 패턴에서 공통적으로 억압되거나 표현되지 못한 주제 3가지.
발화 인용 포함.

## 정체성의 일관성
1번(나는 누구인가)과 7번(빛났던 순간)을 교차 분석.
자기 인식과 실제 경험이 일치하는지, 괴리가 있는지.
발화 인용 포함.

## 정서 톤
전체 답변의 감정 온도와 방향성.
따뜻한지/차가운지, 능동적인지/수동적인지, 타인 지향인지/자기 지향인지.
근거 발화 인용 포함.

## 침묵 데이터
스킵하거나 짧게 답하거나 회피한 질문과 주제.
이것이 무엇을 말해주는지 해석.

## 시간 구조
과거/현재/미래 중 어디에 머무는지.
각 시제별 발화 비중과 패턴 분석.
발화 인용 포함.

## 한 줄 요약
이 사람을 관통하는 단 한 문장.

## 한계 고지
임상 진단이 아닙니다. 발화 패턴에서 관찰된 것만 돌려드립니다.

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

export default function App() {
  const [step, setStep] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef(null);
  const resultRef = useRef(null);

  useEffect(() => {
    if (step === "questions" && textareaRef.current) textareaRef.current.focus();
  }, [step, currentQ]);

  useEffect(() => {
    setCharCount(currentAnswer.length);
  }, [currentAnswer]);

  const handleNext = () => {
    const newAnswers = { ...answers, [currentQ]: currentAnswer };
    setAnswers(newAnswers);
    setCurrentAnswer("");
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep("analyzing");
      analyze(newAnswers);
    }
  };

  const handleSkip = () => {
    const newAnswers = { ...answers, [currentQ]: "" };
    setAnswers(newAnswers);
    setCurrentAnswer("");
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep("analyzing");
      analyze(newAnswers);
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
      const response = await fetch("https:///api/analyze/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          system: systemPrompt,
          messages: [{ role: "user", content: userContent }]
        })
      });
      const data = await response.json();
      setAnalysis(data.content?.map(b => b.text || "").join("") || "분석 실패");
      setStep("result");
    } catch (e) {
      setAnalysis("오류가 발생했습니다.");
      setStep("result");
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(analysis).then(() => {
      alert("복사되었습니다.");
    });
  };

  const restart = () => {
    setStep("intro"); setCurrentQ(0); setAnswers({});
    setCurrentAnswer(""); setAnalysis(""); setCharCount(0);
  };

  const progress = (currentQ / QUESTIONS.length) * 100;
  const q = QUESTIONS[currentQ];
  const canProceed = currentAnswer.trim().length > 0;

  return (
    <div style={{
      minHeight: "100vh",
      background: step==="intro" ? "#fef6ed" : step==="questions" ? q.bg : step==="analyzing" ? "#f5ede0" : "#faf5ef",
      transition: "background 0.7s ease",
      fontFamily: "Georgia,serif",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem", position: "relative", overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .container{width:100%;max-width:640px;position:relative;z-index:1}
        .intro-eyebrow{font-family:'Source Serif 4',serif;font-size:.7rem;letter-spacing:.25em;text-transform:uppercase;color:#c4956a;margin-bottom:1.5rem}
        .intro-title{font-family:'Playfair Display',serif;font-size:clamp(2.4rem,6vw,3.6rem);font-weight:400;line-height:1.15;color:#2a1200;margin-bottom:2rem}
        .intro-body{font-family:'Source Serif 4',serif;font-size:1rem;font-weight:300;color:#6b4c2a;line-height:1.9;margin-bottom:1.25rem}
        .intro-italic{font-family:'Source Serif 4',serif;font-size:.93rem;font-weight:300;font-style:italic;color:#9a7856;line-height:1.9;margin-bottom:1.5rem}
        .intro-notice-box{background:rgba(196,149,106,0.1);border-left:3px solid #c4956a;padding:1.1rem 1.25rem;margin-bottom:2rem}
        .intro-notice-title{font-family:'Source Serif 4',serif;font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;color:#c4956a;margin-bottom:.6rem}
        .intro-notice-item{font-family:'Source Serif 4',serif;font-size:.82rem;font-weight:300;color:#6b4c2a;line-height:1.85;display:flex;align-items:flex-start;gap:.5rem;margin-bottom:.2rem}
        .intro-notice-item::before{content:"—";opacity:.5;flex-shrink:0}
        .divider{width:48px;height:1px;background:#c4956a;margin:2rem 0}
        .q-list{margin-bottom:2rem}
        .q-list-item{display:flex;align-items:center;gap:1.25rem;padding:.8rem 0;border-bottom:1px solid rgba(196,149,106,.25)}
        .q-num{font-family:'Playfair Display',serif;font-size:1.1rem;font-style:italic;color:#c4956a;min-width:28px;opacity:.7}
        .q-name{font-family:'Source Serif 4',serif;font-size:.9rem;font-weight:300;color:#5a3c1e}
        .notice{font-family:'Source Serif 4',serif;font-size:.73rem;color:#b8a080;line-height:1.7;margin-bottom:2.5rem;font-style:italic}
        .start-btn{background:#2a1200;border:none;color:#fdf0e0;font-family:'Source Serif 4',serif;font-size:.82rem;letter-spacing:.18em;text-transform:uppercase;padding:1.1rem 2.8rem;cursor:pointer;transition:all .3s}
        .start-btn:hover{background:#8b4513}
        .q-label{font-family:'Source Serif 4',serif;font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;margin-bottom:.6rem;opacity:.5}
        .q-title{font-family:'Playfair Display',serif;font-size:clamp(1.9rem,4vw,2.8rem);font-weight:700;font-style:italic;line-height:1.15;margin-bottom:1.5rem}
        .q-prompt{font-family:'Source Serif 4',serif;font-size:.88rem;font-weight:300;line-height:1.9;margin-bottom:2rem;opacity:.75}
        .char-count{font-family:'Source Serif 4',serif;font-size:.7rem;opacity:.35;text-align:right;margin-top:.4rem}
        .char-hint{color:#c4956a;opacity:.7}
        .btn-row{margin-top:1.75rem;display:flex;align-items:center;justify-content:space-between}
        .next-btn{background:transparent;border:none;font-family:'Source Serif 4',serif;font-size:.78rem;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;padding:0;display:flex;align-items:center;gap:.75rem;opacity:.25;transition:opacity .3s;pointer-events:none}
        .next-btn.active{opacity:1;pointer-events:auto}
        .skip-btn{background:transparent;border:none;font-family:'Source Serif 4',serif;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;padding:0;opacity:.35;transition:opacity .3s;text-decoration:underline;text-underline-offset:3px}
        .skip-btn:hover{opacity:.65}
        .back-btn{background:transparent;border:none;font-family:'Source Serif 4',serif;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;padding:0;display:flex;align-items:center;gap:.5rem;opacity:.35;transition:opacity .3s}
        .back-btn:hover{opacity:.7}
        .back-btn:disabled{opacity:.15;cursor:default}
        .analyzing{text-align:center}
        .analyzing-title{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,4vw,2.6rem);font-style:italic;color:#6b4c2a;animation:breathe 3s ease-in-out infinite;line-height:1.4}
        .analyzing-sub{font-family:'Source Serif 4',serif;font-size:.78rem;letter-spacing:.15em;color:#b8a080;margin-top:1.25rem;text-transform:uppercase}
        .analyzing-note{font-family:'Source Serif 4',serif;font-size:.72rem;color:#c4956a;margin-top:.75rem;font-style:italic}
        @keyframes breathe{0%,100%{opacity:.35;transform:scale(.98)}50%{opacity:1;transform:scale(1)}}
        .result-wrap{width:100%;max-width:640px;max-height:88vh;overflow-y:auto;scrollbar-width:none;position:relative;z-index:1}
        .result-wrap::-webkit-scrollbar{display:none}
        .result-eyebrow{font-family:'Source Serif 4',serif;font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;color:#c4956a;margin-bottom:.5rem}
        .result-title{font-family:'Playfair Display',serif;font-size:1.9rem;color:#2a1200;margin-bottom:1.5rem;padding-bottom:1.25rem;border-bottom:2px solid #c4956a}
        .result-body{font-family:'Source Serif 4',serif;font-size:.93rem;font-weight:300;line-height:2;color:#3a2010;white-space:pre-wrap}
        .result-body h2{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700;font-style:italic;color:#2a1200;margin-top:2.5rem;margin-bottom:.75rem;padding-left:.75rem;border-left:3px solid #c4956a}
        .result-body blockquote{font-style:italic;opacity:.75;padding-left:.75rem;border-left:2px solid #c4956a;margin:.5rem 0}
        .result-actions{display:flex;gap:1rem;margin-top:3rem;flex-wrap:wrap}
        .restart-btn{background:transparent;border:1px solid #c4956a;color:#8b4513;font-family:'Source Serif 4',serif;font-size:.75rem;letter-spacing:.15em;text-transform:uppercase;cursor:pointer;padding:.75rem 1.75rem;transition:all .3s}
        .restart-btn:hover{background:#2a1200;color:#fdf0e0;border-color:#2a1200}
        .copy-btn{background:#2a1200;border:1px solid #2a1200;color:#fdf0e0;font-family:'Source Serif 4',serif;font-size:.75rem;letter-spacing:.15em;text-transform:uppercase;cursor:pointer;padding:.75rem 1.75rem;transition:all .3s}
        .copy-btn:hover{background:#8b4513;border-color:#8b4513}
      `}</style>

      {/* INTRO */}
      {step === "intro" && (
        <div className="container">
          <svg style={{position:"absolute",top:"-80px",right:"-80px",opacity:0.1,pointerEvents:"none"}} width="380" height="380" viewBox="0 0 380 380">
            <circle cx="190" cy="190" r="170" fill="none" stroke="#8b4513" strokeWidth="1.5"/>
            <circle cx="190" cy="190" r="120" fill="none" stroke="#8b4513" strokeWidth="1"/>
            <circle cx="190" cy="190" r="70" fill="none" stroke="#8b4513" strokeWidth="0.5"/>
            <circle cx="190" cy="190" r="30" fill="#8b4513" opacity="0.12"/>
          </svg>
          <div className="intro-eyebrow">AI 인지구조 분석</div>
          <h1 className="intro-title">당신은<br/>어떻게<br/>생각하나요</h1>
          <p className="intro-body">살면서 왜 같은 상황이 반복되는지,<br/>왜 특정 순간에 늘 비슷한 감정이 오는지<br/>궁금했던 적 있나요.</p>
          <p className="intro-italic">
            우리는 자신에 대해 생각보다 모르는 게 많아요.<br/>
            자기 자신을 밖에서 보기가 원래 어렵거든요.<br/><br/>
            일곱 가지 질문에 솔직하게 답해주시면,<br/>
            AI가 당신의 말에서 패턴을 찾아 돌려드려요.<br/>
            거울 하나 건네드리겠습니다.
          </p>

          <div className="intro-notice-box">
            <div className="intro-notice-title">시작 전에</div>
            <div className="intro-notice-item">틀린 답은 없어요. 생각나는 대로, 편한 만큼만 쓰시면 돼요.</div>
            <div className="intro-notice-item">질문마다 자유롭게 돌아가서 수정할 수 있어요.</div>
            <div className="intro-notice-item">패스하고 싶은 질문은 건너뛰셔도 괜찮아요.</div>
            <div className="intro-notice-item">입력하신 내용은 저장되지 않아요.</div>
            <div className="intro-notice-item">임상 진단이 아니에요. 당신이 쓴 말들에서 찾은 패턴을 돌려드리는 거에요.</div>
          </div>

          <div className="divider"/>
          <div className="q-list">
            {QUESTIONS.map((q,i) => (
              <div className="q-list-item" key={q.id}>
                <span className="q-num">{i+1}</span>
                <span className="q-name">{q.title}</span>
              </div>
            ))}
          </div>
          <button className="start-btn" onClick={() => setStep("questions")}>시작하기</button>
        </div>
      )}

      {/* QUESTIONS */}
      {step === "questions" && (
        <div className="container" style={{color: q.textColor}}>
          <Decoration type={q.deco} color={q.accentColor}/>
          <div style={{width:"100%",height:"2px",background:"rgba(0,0,0,0.08)",marginBottom:"3rem",borderRadius:"2px"}}>
            <div style={{height:"100%",width:`${progress}%`,background:q.accentColor,borderRadius:"2px",transition:"width 0.5s ease"}}/>
          </div>
          <div className="q-label" style={{color:q.accentColor}}>{currentQ+1} / {QUESTIONS.length}</div>
          <h2 className="q-title">{q.title}</h2>
          <p className="q-prompt">{q.prompt}</p>
          <textarea
            ref={textareaRef}
            value={currentAnswer}
            onChange={e => setCurrentAnswer(e.target.value)}
            placeholder={q.placeholder}
            onKeyDown={e => { if(e.key==="Enter" && e.metaKey) handleNext(); }}
            style={{
              width:"100%", minHeight:"160px",
              background:"transparent", border:"none",
              borderBottom:`2px solid ${q.borderColor}`,
              color:q.textColor,
              fontFamily:"'Source Serif 4',serif",
              fontSize:"0.97rem", fontWeight:300,
              lineHeight:1.85, padding:"0.5rem 0",
              resize:"none", outline:"none"
            }}
          />
          <div className="char-count" style={{color:q.accentColor}}>
            {charCount}자
            {charCount > 0 && charCount < 30 && (
              <span className="char-hint"> — 조금 더 써주시면 분석이 더 정확해요</span>
            )}
          </div>

          <div className="btn-row">
            <button
              className="back-btn"
              onClick={handleBack}
              disabled={currentQ === 0}
              style={{color:q.accentColor}}
            >
              <span>←</span><span>이전</span>
            </button>

            <div style={{display:"flex", alignItems:"center", gap:"1.5rem"}}>
              {q.skippable && (
                <button className="skip-btn" onClick={handleSkip} style={{color:q.accentColor}}>
                  패스
                </button>
              )}
              <button
                className={`next-btn ${canProceed ? "active" : ""}`}
                onClick={handleNext}
                style={{color:q.accentColor}}
              >
                <span>{currentQ < QUESTIONS.length-1 ? "다음 질문" : "분석 시작"}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ANALYZING */}
      {step === "analyzing" && (
        <div className="analyzing">
          <p className="analyzing-title">당신의 이야기를<br/>읽고 있어요</p>
          <p className="analyzing-sub">잠시만요</p>
          <p className="analyzing-note">보통 20~30초 걸려요</p>
        </div>
      )}

      {/* RESULT */}
      {step === "result" && (
        <div className="result-wrap" ref={resultRef}>
          <div className="result-eyebrow">분석 보고서</div>
          <h2 className="result-title">인지구조 분석</h2>
          <div
            className="result-body"
            dangerouslySetInnerHTML={{
              __html: analysis
                .replace(/## (.+)/g, '<h2>$1</h2>')
                .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#2a1200;font-weight:600">$1</strong>')
                .replace(/"(.+?)"/g, '<blockquote>"$1"</blockquote>')
            }}
          />
          <div className="result-actions">
            <button className="copy-btn" onClick={copyResult}>결과 복사</button>
            <button className="restart-btn" onClick={restart}>다시 시작</button>
          </div>
        </div>
      )}
    </div>
  );
}
