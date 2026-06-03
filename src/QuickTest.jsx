import { useState, useEffect } from "react";

const QUESTIONS = [
  {
    id: 1,
    text: "새로운 프로젝트를 맡게 되었다.\n일주일 안에 방향을 정해야 한다.\n\n보통 가장 먼저 무엇을 하나요?",
    options: [
      { text: "관련 자료와 사례를 찾아 정보를 모은다", type: "이해 후 행동형" },
      { text: "일단 작은 작업을 시작해 움직인다", type: "행동 후 이해형" },
      { text: "함께 이야기할 사람을 찾아 논의한다", type: "관계 우선형" },
      { text: "실패 가능성과 위험을 먼저 점검한다", type: "안정 우선형" },
      { text: "직감적으로 끌리는 방향을 떠올린다", type: "직관 신뢰형" },
    ]
  },
  {
    id: 2,
    text: "내가 맞다고 생각한 일이\n틀린 것으로 밝혀졌다.\n\n가장 먼저 드는 반응은?",
    options: [
      { text: "어디서 판단이 틀어졌는지 분석한다", type: "이해 후 행동형" },
      { text: "일단 사실로 인정하고 다음으로 넘어간다", type: "행동 후 이해형" },
      { text: "다른 사람들은 어떻게 생각하는지 궁금하다", type: "관계 우선형" },
      { text: "같은 실수를 반복하지 않을 방법을 먼저 찾는다", type: "안정 우선형" },
      { text: "왜 그런 느낌을 받았는지 다시 돌아본다", type: "직관 신뢰형" },
    ]
  },
  {
    id: 3,
    text: "중요한 결정을 내려야 하는데\n정보가 부족하다.\n\n보통 어떻게 하나요?",
    options: [
      { text: "정보가 더 충분히 모일 때까지 찾는다", type: "이해 후 행동형" },
      { text: "일단 결정하고 이후에 수정한다", type: "행동 후 이해형" },
      { text: "믿는 사람과 상의한 후 결정한다", type: "관계 우선형" },
      { text: "결정을 미루고 상황을 본다", type: "안정 우선형" },
      { text: "느낌이 가는 쪽을 따라 결정한다", type: "직관 신뢰형" },
    ]
  },
  {
    id: 4,
    text: "예상과 전혀 다른 결과가 나왔다.\n\n가장 먼저 하는 행동은?",
    options: [
      { text: "원인을 분석한다", type: "이해 후 행동형" },
      { text: "다시 시도한다", type: "행동 후 이해형" },
      { text: "다른 사람의 의견을 듣는다", type: "관계 우선형" },
      { text: "잠시 멈추고 정리한다", type: "안정 우선형" },
      { text: "내가 놓친 다른 해석이나 가능성이 있는지 살펴본다", type: "직관 신뢰형" },
    ]
  },
  {
    id: 5,
    text: "누군가가 당신을 오해하고 있다.\n\n보통 어떻게 하나요?",
    options: [
      { text: "충분히 설명하려고 노력한다", type: "이해 후 행동형" },
      { text: "시간이 지나면 괜찮아질 거라고 생각한다", type: "행동 후 이해형" },
      { text: "상대의 감정을 먼저 살핀다", type: "관계 우선형" },
      { text: "굳이 에너지를 쓰지 않고 넘긴다", type: "안정 우선형" },
      { text: "왜 그런 오해가 생겼는지 궁금해진다", type: "직관 신뢰형" },
    ]
  },
  {
    id: 6,
    text: "며칠째 해결되지 않는\n문제가 있다.\n\n보통 어떻게 움직이나요?",
    options: [
      { text: "문제 자체의 정의와 범위를 다시 짚는다", type: "이해 후 행동형" },
      { text: "완전히 다른 방법을 시도한다", type: "행동 후 이해형" },
      { text: "다른 사람의 도움을 구한다", type: "관계 우선형" },
      { text: "잠시 거리를 두고 쉬었다 돌아온다", type: "안정 우선형" },
      { text: "계속 파고들어 해결하려 한다", type: "정확성 우선형" },
    ]
  },
  {
    id: 7,
    text: "처음 보는 주제를\n공부해야 한다.\n\n보통 어디서 시작하나요?",
    options: [
      { text: "개념과 원리부터 체계적으로 이해한다", type: "이해 후 행동형" },
      { text: "직접 해보면서 배운다", type: "행동 후 이해형" },
      { text: "경험자와 이야기하며 배운다", type: "관계 우선형" },
      { text: "전체 구조와 개요를 먼저 본다", type: "안정 우선형" },
      { text: "흥미가 가는 부분부터 시작한다", type: "직관 신뢰형" },
    ]
  },
  {
    id: 8,
    text: "가장 불편한 상황은?",
    options: [
      { text: "충분히 이해되지 않은 상태에서 결정해야 할 때", type: "이해 후 행동형" },
      { text: "아무것도 할 수 없이 기다려야 할 때", type: "행동 후 이해형" },
      { text: "혼자 모든 책임을 져야 할 때", type: "관계 우선형" },
      { text: "미래가 매우 불확실할 때", type: "안정 우선형" },
      { text: "자신의 행동 이유를 설명할 수 없을 때", type: "직관 신뢰형" },
    ]
  },
  {
    id: 9,
    text: "가장 몰입하는 순간은?",
    options: [
      { text: "복잡한 것이 이해될 때", type: "이해 후 행동형" },
      { text: "직접 문제를 해결할 때", type: "행동 후 이해형" },
      { text: "사람과 깊게 연결될 때", type: "관계 우선형" },
      { text: "일이 안정적으로 흘러갈 때", type: "안정 우선형" },
      { text: "새로운 가능성을 발견할 때", type: "직관 신뢰형" },
    ]
  },
  {
    id: 10,
    text: "하루 종일 고민이 생겼을 때\n\n보통 어떻게 정리하나요?",
    options: [
      { text: "생각을 계속 분석하고 구조화한다", type: "이해 후 행동형" },
      { text: "행동을 하면서 잊는다", type: "행동 후 이해형" },
      { text: "누군가와 이야기하며 정리한다", type: "관계 우선형" },
      { text: "시간을 두고 가라앉힌다", type: "안정 우선형" },
      { text: "떠오르는 느낌을 따라가 본다", type: "직관 신뢰형" },
    ]
  },
  {
    id: 11,
    text: "당신에게 중요한 두 가지가 충돌했다.\n\n예: 진실 vs 관계, 자유 vs 안정\n\n무엇을 기준으로 결정하는가?",
    options: [
      { text: "더 옳다고 생각하는 것", type: "정확성 우선형" },
      { text: "더 오래 남을 것", type: "이해 후 행동형" },
      { text: "더 많은 사람에게 도움이 되는 것", type: "관계 우선형" },
      { text: "더 안전한 것", type: "안정 우선형" },
      { text: "지금 가장 끌리는 것", type: "직관 신뢰형" },
    ]
  },
];

const CutePerson = ({ type }) => {
  const configs = {
    "이해 후 행동형": {
      bodyColor: "#fbbf24", shirtColor: "#f59e0b", pantsColor: "#92400e",
      skinColor: "#fde68a", hairColor: "#92400e",
      extra: (
        <>
          <rect x="52" y="72" width="20" height="14" rx="3" fill="#3b82f6" stroke="#1e40af" strokeWidth="1.5"/>
          <rect x="52" y="72" width="10" height="14" rx="3" fill="#60a5fa" stroke="#1e40af" strokeWidth="1.5"/>
          <line x1="62" y1="72" x2="62" y2="86" stroke="#1e40af" strokeWidth="1"/>
          <circle cx="85" cy="45" r="8" fill="none" stroke="#f59e0b" strokeWidth="2"/>
          <line x1="91" y1="51" x2="96" y2="56" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
        </>
      )
    },
    "행동 후 이해형": {
      bodyColor: "#f87171", shirtColor: "#ef4444", pantsColor: "#7f1d1d",
      skinColor: "#fecaca", hairColor: "#1f2937",
      extra: (
        <>
          <line x1="15" y1="60" x2="32" y2="60" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
          <line x1="10" y1="70" x2="30" y2="70" stroke="#f87171" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
          <line x1="18" y1="80" x2="33" y2="80" stroke="#fca5a5" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
          <text x="82" y="38" fontSize="14" fill="#fbbf24">⚡</text>
        </>
      )
    },
    "관계 우선형": {
      bodyColor: "#f472b6", shirtColor: "#ec4899", pantsColor: "#831843",
      skinColor: "#fbcfe8", hairColor: "#be185d",
      extra: (
        <>
          <text x="78" y="38" fontSize="13" fill="#f472b6">♥</text>
          <text x="88" y="55" fontSize="9" fill="#fb7185">♥</text>
          <text x="72" y="55" fontSize="8" fill="#fda4af">♥</text>
          <circle cx="92" cy="80" r="10" fill="#fbcfe8" stroke="#ec4899" strokeWidth="1.5"/>
          <line x1="92" y1="90" x2="92" y2="110" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"/>
          <line x1="92" y1="98" x2="84" y2="105" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"/>
          <line x1="92" y1="98" x2="100" y2="105" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"/>
          <line x1="92" y1="110" x2="87" y2="122" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"/>
          <line x1="92" y1="110" x2="97" y2="122" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"/>
        </>
      )
    },
    "안정 우선형": {
      bodyColor: "#34d399", shirtColor: "#10b981", pantsColor: "#065f46",
      skinColor: "#a7f3d0", hairColor: "#064e3b",
      extra: (
        <>
          <polygon points="78,65 95,65 95,85 78,85" fill="#d1fae5" stroke="#10b981" strokeWidth="1.5"/>
          <polygon points="74,67 99,67 86.5,50" fill="#6ee7b7" stroke="#10b981" strokeWidth="1.5"/>
          <rect x="83" y="74" width="7" height="11" rx="1" fill="#10b981"/>
          <ellipse cx="25" cy="35" rx="12" ry="8" fill="white" stroke="#d1d5db" strokeWidth="1.5"/>
          <ellipse cx="35" cy="32" rx="10" ry="7" fill="white" stroke="#d1d5db" strokeWidth="1.5"/>
          <ellipse cx="18" cy="38" rx="8" ry="6" fill="white" stroke="#d1d5db" strokeWidth="1.5"/>
        </>
      )
    },
    "직관 신뢰형": {
      bodyColor: "#a78bfa", shirtColor: "#8b5cf6", pantsColor: "#4c1d95",
      skinColor: "#ede9fe", hairColor: "#5b21b6",
      extra: (
        <>
          <text x="78" y="35" fontSize="16" fill="#fbbf24">★</text>
          <text x="88" y="52" fontSize="10" fill="#a78bfa">★</text>
          <text x="73" y="50" fontSize="8" fill="#c4b5fd">★</text>
          <text x="20" y="38" fontSize="10" fill="#fbbf24">✦</text>
          <text x="15" y="55" fontSize="8" fill="#a78bfa">✦</text>
          <path d="M20 90 Q28 85 36 90 Q44 95 52 90" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"/>
        </>
      )
    },
    "정확성 우선형": {
      bodyColor: "#fb923c", shirtColor: "#f97316", pantsColor: "#7c2d12",
      skinColor: "#fed7aa", hairColor: "#431407",
      extra: (
        <>
          <circle cx="88" cy="60" r="18" fill="white" stroke="#f97316" strokeWidth="2"/>
          <circle cx="88" cy="60" r="12" fill="#fff7ed" stroke="#f97316" strokeWidth="1.5"/>
          <circle cx="88" cy="60" r="6" fill="#fed7aa" stroke="#f97316" strokeWidth="1.5"/>
          <circle cx="88" cy="60" r="2.5" fill="#f97316"/>
          <line x1="68" y1="60" x2="84" y2="60" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round"/>
          <polygon points="84,57 88,60 84,63" fill="#7c2d12"/>
        </>
      )
    },
  };

  const cfg = configs[type] || configs["이해 후 행동형"];

  return (
    <svg width="130" height="145" viewBox="0 0 120 135" fill="none">
      <circle cx="60" cy="68" r="55" fill={cfg.bodyColor} opacity="0.15"/>
      {cfg.extra}
      <path d="M50 100 Q46 115 42 128" stroke={cfg.pantsColor} strokeWidth="8" strokeLinecap="round"/>
      <path d="M70 100 Q74 115 78 128" stroke={cfg.pantsColor} strokeWidth="8" strokeLinecap="round"/>
      <rect x="42" y="62" width="36" height="42" rx="12" fill={cfg.shirtColor}/>
      <path d="M44 70 Q30 78 26 88" stroke={cfg.shirtColor} strokeWidth="9" strokeLinecap="round"/>
      <path d="M76 70 Q90 78 94 88" stroke={cfg.shirtColor} strokeWidth="9" strokeLinecap="round"/>
      <circle cx="25" cy="90" r="7" fill={cfg.skinColor} stroke={cfg.shirtColor} strokeWidth="1.5"/>
      <circle cx="95" cy="90" r="7" fill={cfg.skinColor} stroke={cfg.shirtColor} strokeWidth="1.5"/>
      <rect x="54" y="52" width="12" height="14" rx="5" fill={cfg.skinColor}/>
      <ellipse cx="60" cy="36" rx="24" ry="22" fill={cfg.skinColor} stroke={cfg.hairColor} strokeWidth="2"/>
      <path d="M36 30 Q38 14 60 13 Q82 14 84 30" fill={cfg.hairColor} stroke={cfg.hairColor} strokeWidth="1"/>
      <ellipse cx="36" cy="32" rx="5" ry="8" fill={cfg.hairColor}/>
      <ellipse cx="84" cy="32" rx="5" ry="8" fill={cfg.hairColor}/>
      <ellipse cx="52" cy="34" rx="4" ry="4.5" fill="white"/>
      <ellipse cx="68" cy="34" rx="4" ry="4.5" fill="white"/>
      <circle cx="53" cy="35" r="2.5" fill="#1f2937"/>
      <circle cx="69" cy="35" r="2.5" fill="#1f2937"/>
      <circle cx="54" cy="34" r="1" fill="white"/>
      <circle cx="70" cy="34" r="1" fill="white"/>
      <ellipse cx="44" cy="42" rx="6" ry="4" fill={cfg.shirtColor} opacity="0.4"/>
      <ellipse cx="76" cy="42" rx="6" ry="4" fill={cfg.shirtColor} opacity="0.4"/>
      <path d="M54 46 Q60 51 66 46" fill="none" stroke="#be123c" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
};
const TYPE_IMAGES = {
  "이해 후 행동형": "type-understanding..PNG",
  "행동 후 이해형": "type-action..PNG",
  "관계 우선형": "type-relation.PNG",
  "안정 우선형": "type-stable..PNG",
  "직관 신뢰형": "type-intuition..PNG",
  "정확성 우선형": "type-accuracy..PNG",
};
};
const TYPE_INFO = {
  "이해 후 행동형": {
    emoji: "🔍",
    desc: "먼저 이해하고, 확신이 생기면 움직이는 사람이에요.",
    detail: "정보를 충분히 모으고 구조를 파악한 다음 행동해요. 불확실한 상태에서의 결정이 불편하고, 한번 방향을 잡으면 일관성 있게 나아가는 편이에요.",
    bg: "#fff8e1", accent: "#f59e0b",
  },
  "행동 후 이해형": {
    emoji: "⚡",
    desc: "일단 움직이면서 배우는 사람이에요.",
    detail: "이론보다 실전이 편해요. 해보면서 익히고, 실패해도 빠르게 수정해요. 기다리는 것보다 뭔가 하는 게 더 자연스러운 사람이에요.",
    bg: "#fff0f0", accent: "#ef4444",
  },
  "관계 우선형": {
    emoji: "🤝",
    desc: "사람이 있어야 힘이 나는 사람이에요.",
    detail: "혼자보다 함께할 때 더 좋은 결과가 나온다고 믿어요. 다른 사람의 감정을 먼저 살피고, 관계에서 에너지를 얻어요.",
    bg: "#fdf0f8", accent: "#ec4899",
  },
  "안정 우선형": {
    emoji: "🏠",
    desc: "지속 가능한 것을 선택하는 사람이에요.",
    detail: "변화보다 안정에서 힘을 얻어요. 리스크를 미리 점검하고, 오래 유지될 수 있는 방향을 선호해요. 신중함이 강점이에요.",
    bg: "#f0faf0", accent: "#10b981",
  },
  "직관 신뢰형": {
    emoji: "✨",
    desc: "느낌을 믿고 움직이는 사람이에요.",
    detail: "논리보다 직감이 먼저 와요. 설명하기 어렵지만 맞다는 느낌을 중요하게 여기고, 그 감각이 실제로 잘 맞는 편이에요.",
    bg: "#f5f0ff", accent: "#8b5cf6",
  },
  "정확성 우선형": {
    emoji: "🎯",
    desc: "틀리면 안 된다는 사람이에요.",
    detail: "정확성과 완성도를 중요하게 여겨요. 애매한 상태가 불편하고, 근거와 논리가 있어야 안심이 돼요. 꼼꼼함이 강점이에요.",
    bg: "#fff8f0", accent: "#f97316",
  },
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const CARD_COLORS = [
  "#fff3e0","#fce4ec","#e8f5e9","#e3f2fd","#f3e5f5",
  "#fffde7","#e0f2f1","#fbe9e7","#e8eaf6","#f1f8e9",
];

export default function QuickTest({ onBack }) {
  const [step, setStep] = useState("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [cardColors, setCardColors] = useState([]);

  useEffect(() => {
    if (step === "test") {
      const opts = shuffle(QUESTIONS[current].options);
      setShuffledOptions(opts);
      setCardColors(shuffle(CARD_COLORS).slice(0, opts.length));
      setSelected(null);
    }
  }, [current, step]);

  const handleSelect = (option) => {
    setSelected(option);
    setTimeout(() => {
      const newAnswers = [...answers, option.type];
      setAnswers(newAnswers);
      if (current < QUESTIONS.length - 1) {
        setCurrent(current + 1);
      } else {
        const counts = {};
        newAnswers.forEach(t => { counts[t] = (counts[t] || 0) + 1; });
        const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
        setResult(top);
        setStep("result");
      }
    }, 350);
  };

  const restart = () => {
    setStep("intro"); setCurrent(0); setAnswers([]);
    setSelected(null); setResult(null);
  };

  const progress = (current / QUESTIONS.length) * 100;
  const typeInfo = result ? TYPE_INFO[result] : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fafaf7",
      fontFamily: "'Gaegu', cursive",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Gaegu:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .qcard {
          border: 2.5px solid #222;
          border-radius: 16px;
          box-shadow: 4px 4px 0px #222;
          padding: 1rem 1.25rem;
          margin-bottom: 0.75rem;
          cursor: pointer;
          transition: transform 0.12s, box-shadow 0.12s;
          width: 100%;
          text-align: left;
          font-family: 'Gaegu', cursive;
          font-size: 1.15rem;
          line-height: 1.5;
          color: #222;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .qcard:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0px #222; }
        .qcard.sel { background: #222 !important; color: white; transform: translate(2px,2px); box-shadow: 2px 2px 0px #222; }
        .main-btn {
          background: #222; color: white; border: 2.5px solid #222;
          border-radius: 14px; padding: 0.9rem 2.5rem;
          font-family: 'Gaegu', cursive; font-size: 1.3rem;
          cursor: pointer; box-shadow: 4px 4px 0px #555;
          transition: transform 0.12s, box-shadow 0.12s;
        }
        .main-btn:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0px #555; }
        .sub-btn {
          background: white; color: #555; border: 2px solid #bbb;
          border-radius: 14px; padding: 0.75rem 1.75rem;
          font-family: 'Gaegu', cursive; font-size: 1.1rem;
          cursor: pointer; box-shadow: 3px 3px 0px #ddd;
          transition: transform 0.12s;
        }
        .sub-btn:hover { transform: translate(-1px,-1px); }
      `}</style>

      <div style={{width:"100%", maxWidth:500}}>

        {step === "intro" && (
          <div style={{textAlign:"center"}}>
            <img src="/intro.PNG" alt="거울" style={{width:"120px", height:"120px", objectFit:"contain", marginBottom:"0.5rem"}}/>
            <h1 style={{fontSize:"2.8rem", fontWeight:700, color:"#222", marginBottom:"0.5rem", lineHeight:1.2}}>
              나는 어떤 사람일까?
            </h1>
            <p style={{fontSize:"1.2rem", color:"#666", marginBottom:"0.25rem", lineHeight:1.7}}>
              11가지 상황에 답하면<br/>당신의 인지 유형을 알려드려요
            </p>
            <p style={{fontSize:"1rem", color:"#aaa", marginBottom:"2rem"}}>약 3분</p>
            <div style={{display:"flex", gap:"0.6rem", justifyContent:"center", flexWrap:"wrap", marginBottom:"2.5rem"}}>
              {Object.entries(TYPE_INFO).map(([t, info]) => (
                <span key={t} style={{
                  background: info.bg, border:`2px solid ${info.accent}`,
                  borderRadius:"20px", padding:"0.3rem 0.9rem",
                  fontSize:"0.95rem", color:"#333", boxShadow:`2px 2px 0px ${info.accent}`,
                }}>
                  {info.emoji} {t}
                </span>
              ))}
            </div>
            <div style={{display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap"}}>
              <button className="main-btn" onClick={() => setStep("test")}>시작하기 →</button>
              {onBack && <button className="sub-btn" onClick={onBack}>← 마음거울로</button>}
            </div>
          </div>
        )}

        {step === "test" && (
          <div>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.5rem"}}>
              <span style={{fontSize:"1.1rem", color:"#888"}}>{current + 1} / {QUESTIONS.length}</span>
              {onBack && <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:"#ccc",fontSize:"1.2rem",fontFamily:"'Gaegu',cursive"}}>✕</button>}
            </div>
            <div style={{height:8, background:"#eee", borderRadius:4, border:"1.5px solid #ddd", overflow:"hidden", marginBottom:"1.75rem"}}>
              <div style={{height:"100%", background:"#222", borderRadius:4, width:`${progress}%`, transition:"width 0.4s ease"}}/>
            </div>
            <h2 style={{fontSize:"1.45rem", fontWeight:700, color:"#222", marginBottom:"1.75rem", lineHeight:1.65, whiteSpace:"pre-line"}}>
              {QUESTIONS[current].text}
            </h2>
            <div>
              {shuffledOptions.map((opt, i) => (
                <button
                  key={i}
                  className={`qcard ${selected === opt ? "sel" : ""}`}
                  style={{background: selected === opt ? "#222" : (cardColors[i] || "#fff")}}
                  onClick={() => handleSelect(opt)}
                >
                  <span style={{
                    width:28, height:28, borderRadius:"50%",
                    border: selected === opt ? "2px solid white" : "2px solid #555",
                    display:"inline-flex", alignItems:"center", justifyContent:"center",
                    fontSize:"0.85rem", flexShrink:0,
                    background: selected === opt ? "white" : "transparent",
                    color: selected === opt ? "#222" : "#555", fontWeight:700,
                  }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "result" && typeInfo && (
          <div>
            <p style={{fontSize:"1.1rem", color:"#888", marginBottom:"0.5rem", textAlign:"center"}}>
              당신의 인지 유형은
            </p>
            <div style={{
              background: typeInfo.bg,
              border:`3px solid ${typeInfo.accent}`,
              borderRadius:24,
              boxShadow:`6px 6px 0px ${typeInfo.accent}`,
              padding:"2rem",
              marginBottom:"1.5rem",
              textAlign:"center",
            }}>
              <div style={{display:"flex", justifyContent:"center", marginBottom:"0.5rem"}}>
                <img src={`/${TYPE_IMAGES[result]}`} alt={result} style={{width:"180px", height:"180px", objectFit:"contain"}}/>
              </div>
              <h2 style={{fontSize:"2.2rem", fontWeight:700, color:"#222", marginBottom:"0.5rem"}}>
                {typeInfo.emoji} {result}
              </h2>
              <p style={{fontSize:"1.2rem", color:"#444", marginBottom:"1rem", fontWeight:700}}>
                {typeInfo.desc}
              </p>
              <p style={{fontSize:"1rem", color:"#555", lineHeight:1.8}}>
                {typeInfo.detail}
              </p>
            </div>
            <div style={{display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap"}}>
              <button className="main-btn" onClick={restart}>다시 해보기</button>
              {onBack && (
                <button className="sub-btn" onClick={onBack}>
                  마음거울로 깊이 들어가기 →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
