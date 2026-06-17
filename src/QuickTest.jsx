import { useState, useEffect } from "react";

const QUESTIONS = [
  {
    id: 1,
    text: "새로운 프로젝트를 맡게 되었다.\n일주일 안에 방향을 정해야 한다.\n\n가장 먼저 무엇을 하나요?",
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
    text: "내가 맞다고 생각한 일이\n틀린 것으로 밝혀졌다.\n\n처음 든 생각에 가장 가까운 것은?",
    options: [
      { text: "어디서 판단이 틀어졌는지 분석한다", type: "이해 후 행동형" },
      { text: "일단 사실로 인정하고 다음으로 넘어간다", type: "행동 후 이해형" },
      { text: "다른 사람들은 어떻게 생각하는지 궁금하다", type: "관계 우선형" },
      { text: "같은 실수를 반복하지 않을 방법을 먼저 찾는다", type: "안정 우선형" },
      { text: "그때 놓친 분위기나 느낌이 있는지 다시 돌아본다", type: "직관 신뢰형" },
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
    text: "예상과 전혀 다른 결과가 나왔다.\n\n가장 먼저 하는 건?",
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
    text: "누군가가 당신을 오해하고 있다.\n\n어떻게 하나요?",
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
    text: "며칠째 해결되지 않는\n문제가 있다.\n\n어떻게 움직이나요?",
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
    text: "처음 보는 주제를\n공부해야 한다.\n\n어디에서 시작하나요?",
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
    text: "하루 종일 고민이 많을 때\n\n어떻게 정리하나요?",
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
    text: "나에게 중요한 두 가지가 부딧칠 때가 있습니다.\n(예: 진실 vs 관계, 자유 vs 안정)\n\n무엇을 기준으로 결정하나요?",
    options: [
      { text: "내가 더 맞다고 생각하는 것", type: "정확성 우선형" },
      { text: "더 오래 남는 것", type: "이해 후 행동형" },
      { text: "더 많은 사람에게 도움이 되는 것", type: "관계 우선형" },
      { text: "더 안전한 것", type: "안정 우선형" },
      { text: "지금 가장 마음이 가는 것", type: "직관 신뢰형" },
    ]
  },
];

const TYPE_IMAGES = {
  "이해 후 행동형": "type-understanding.png",
  "행동 후 이해형": "type-action.png",
  "관계 우선형": "type-relation.png",
  "안정 우선형": "type-stable.png",
  "직관 신뢰형": "type-intuition.png",
  "정확성 우선형": "type-accuracy.png",
};

const TYPE_INFO = {
  "이해 후 행동형": {
    desc: "먼저 이해하고, 확신이 생기면 움직이는 사람이에요.",
    detail: "정보를 충분히 모으고 구조를 파악한 다음 행동해요. 불확실한 상태에서의 결정이 불편하고, 한번 방향을 잡으면 일관성 있게 나아가는 편이에요.",
    strength: "한번 방향 잡으면 흔들리지 않아요. 준비된 사람의 움직임이에요.",
    weakness: '"일단 해봐"가 제일 어려운 말이에요. 정보가 없으면 발이 안 떨어져요.',
    bg: "#d8d8e0", text: "#2a2a3a", border: "#a0a0b4",
    btnBg: "#8a8a9a", btnText: "#ffffff",
  },
  "행동 후 이해형": {
    desc: "일단 움직이면서 배우는 사람이에요.",
    detail: "이론보다 실전이 편해요. 해보면서 익히고, 실패해도 빠르게 수정해요. 기다리는 것보다 뭔가 하는 게 더 자연스러운 사람이에요.",
    strength: "남들이 고민할 때 이미 움직여요. 실전에서 가장 빠르게 배우는 사람이에요.",
    weakness: "기다리는 게 고역이에요. 가만히 있으면 오히려 불안해져요.",
    bg: "#f0b8c4", text: "#6a1020", border: "#c47a8a",
    btnBg: "#c0405a", btnText: "#ffffff",
  },
  "관계 우선형": {
    desc: "사람이 있어야 힘이 나는 사람이에요.",
    detail: "혼자보다 함께할 때 더 좋은 결과가 나온다고 믿어요. 다른 사람의 감정을 먼저 살피고, 관계에서 에너지를 얻어요.",
    strength: "사람 마음을 먼저 읽어요. 팀이 있으면 혼자보다 훨씬 강해지는 사람이에요.",
    weakness: "혼자 결정하는 순간이 유독 힘들어요. 누군가 한 명만 있어도 달라져요.",
    bg: "#2d5a2d", text: "#ffffff", border: "#4a8a4a",
    btnBg: "#2d5a2d", btnText: "#ffffff",
  },
  "안정 우선형": {
    desc: "지속 가능한 것을 선택하는 사람이에요.",
    detail: "변화보다 안정에서 힘을 얻어요. 리스크를 미리 점검하고, 오래 유지될 수 있는 방향을 선호해요. 신중함이 강점이에요.",
    strength: "오래 가는 선택을 해요. 리스크를 먼저 보는 사람이 팀에 꼭 필요한 이유예요.",
    weakness: "변화가 강요될 때 에너지가 확 떨어져요. 예측 불가능한 상황이 가장 소모적이에요.",
    bg: "#b8d4b0", text: "#0d3010", border: "#7a9e6e",
    btnBg: "#4a8a3a", btnText: "#ffffff",
  },
  "직관 신뢰형": {
    desc: "느낌을 믿고 움직이는 사람이에요.",
    detail: "논리보다 직감이 먼저 와요. 설명하기 어렵지만 맞다는 느낌을 중요하게 여기고, 그 감각이 실제로 잘 맞는 편이에요.",
    strength: "설명 못 해도 맞는 방향을 알아요. 그 감각이 실제로 자주 맞아요.",
    weakness: '"왜 그렇게 생각해요?" 이 질문이 제일 난처해요. 논리로 설명해야 할 때 막혀요.',
    bg: "#a8c8e0", text: "#05203a", border: "#6a95b8",
    btnBg: "#3a6a9a", btnText: "#ffffff",
  },
  "정확성 우선형": {
    desc: "틀리면 안 된다는 사람이에요.",
    detail: "정확성과 완성도를 중요하게 여겨요. 애매한 상태가 불편하고, 근거와 논리가 있어야 안심이 돼요. 꼼꼼함이 강점이에요.",
    strength: "디테일에서 판가름 나는 일은 당신 차지예요. 한 번 한 일은 믿을 수 있어요.",
    weakness: "완벽하지 않으면 내보내기 싫어요. 그래서 시작보다 마무리가 늦어질 때가 있어요.",
    bg: "#e8a0a0", text: "#5a1010", border: "#c47070",
    btnBg: "#c04040", btnText: "#ffffff",
  },
};

const TYPE_BTN_COLORS = {
  "이해 후 행동형": { bg: "#8a8a9a", text: "#ffffff" },
  "행동 후 이해형": { bg: "#c0405a", text: "#ffffff" },
  "관계 우선형":   { bg: "#2d5a2d", text: "#ffffff" },
  "안정 우선형":   { bg: "#4a7a3a", text: "#ffffff" },
  "직관 신뢰형":   { bg: "#3a6a9a", text: "#ffffff" },
  "정확성 우선형": { bg: "#b84040", text: "#ffffff" },
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300&display=swap');`;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 나침반 SVG
const CompassSVG = ({ linesVisible, style = {} }) => {
  const lines = [
    <circle key={1} cx="100" cy="100" r="88" fill="none" stroke="#9b7fd4" strokeWidth="1.5"/>,
    <circle key={2} cx="100" cy="100" r="75" fill="none" stroke="#9b7fd4" strokeWidth="0.7" strokeDasharray="4,6"/>,
    <circle key={3} cx="100" cy="100" r="55" fill="none" stroke="#9b7fd4" strokeWidth="1"/>,
    <line key={4} x1="12" y1="100" x2="188" y2="100" stroke="#9b7fd4" strokeWidth="0.8"/>,
    <line key={5} x1="100" y1="12" x2="100" y2="188" stroke="#9b7fd4" strokeWidth="0.8"/>,
    <g key={6}><line x1="38" y1="38" x2="162" y2="162" stroke="#9b7fd4" strokeWidth="0.6"/><line x1="162" y1="38" x2="38" y2="162" stroke="#9b7fd4" strokeWidth="0.6"/></g>,
    <g key={7}><line x1="100" y1="12" x2="100" y2="22" stroke="#9b7fd4" strokeWidth="2.5"/><line x1="100" y1="178" x2="100" y2="188" stroke="#9b7fd4" strokeWidth="1.5"/><line x1="12" y1="100" x2="22" y2="100" stroke="#9b7fd4" strokeWidth="1.5"/><line x1="178" y1="100" x2="188" y2="100" stroke="#9b7fd4" strokeWidth="1.5"/></g>,
    <polygon key={8} points="100,25 95,100 105,100" fill="#9b7fd4"/>,
    <polygon key={9} points="100,175 95,100 105,100" fill="none" stroke="#9b7fd4" strokeWidth="1.2"/>,
    <circle key={10} cx="100" cy="100" r="7" fill="none" stroke="#9b7fd4" strokeWidth="1.5"/>,
    <g key={11}><text x="100" y="10" textAnchor="middle" fontFamily="serif" fontSize="12" fontStyle="italic" fill="#9b7fd4">N</text><circle cx="100" cy="100" r="3.5" fill="#9b7fd4"/></g>,
  ];
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" style={style}>
      {lines.filter((_, i) => i < linesVisible)}
    </svg>
  );
};

// 신전 SVG
const TempleSVG = ({ style = {} }) => (
  <svg width="200" height="250" viewBox="0 0 200 250" style={style}>
    <text x="100" y="20" textAnchor="middle" fontFamily="serif" fontSize="15" fontStyle="italic" fill="#9b7fd4" opacity="0.9">γνῶθι σεαυτόν</text>
    <text x="100" y="34" textAnchor="middle" fontFamily="serif" fontSize="9" fill="rgba(42,26,74,0.5)">너 자신을 알라</text>
    <line x1="40" y1="40" x2="160" y2="40" stroke="#9b7fd4" strokeWidth="0.5" opacity="0.3"/>
    <line x1="20" y1="225" x2="180" y2="225" stroke="#9b7fd4" strokeWidth="1.5"/>
    <line x1="25" y1="213" x2="175" y2="213" stroke="#9b7fd4" strokeWidth="1.5"/>
    <line x1="48" y1="213" x2="48" y2="115" stroke="#9b7fd4" strokeWidth="1.5"/>
    <line x1="80" y1="213" x2="80" y2="115" stroke="#9b7fd4" strokeWidth="1.5"/>
    <line x1="120" y1="213" x2="120" y2="115" stroke="#9b7fd4" strokeWidth="1.5"/>
    <line x1="152" y1="213" x2="152" y2="115" stroke="#9b7fd4" strokeWidth="1.5"/>
    <line x1="30" y1="115" x2="170" y2="115" stroke="#9b7fd4" strokeWidth="1.5"/>
    <line x1="25" y1="102" x2="175" y2="102" stroke="#9b7fd4" strokeWidth="1.5"/>
    <line x1="25" y1="102" x2="100" y2="55" stroke="#9b7fd4" strokeWidth="1.5"/>
    <line x1="175" y1="102" x2="100" y2="55" stroke="#9b7fd4" strokeWidth="1.5"/>
    <path d="M88,213 L88,160 Q100,148 112,160 L112,213" fill="none" stroke="#9b7fd4" strokeWidth="1.2"/>
  </svg>
);

export default function QuickTest({ onBack }) {
  const [step, setStep] = useState("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [activeType, setActiveType] = useState(null);
  const [showTemple, setShowTemple] = useState(false);

  useEffect(() => {
    if (step === "test") {
      setShuffledOptions(shuffle(QUESTIONS[current].options));
      setSelected(null);
    }
  }, [current, step]);

  useEffect(() => {
    if (step === "result") {
      // 나침반 → 신전 스케일 전환
      setTimeout(() => setShowTemple(true), 800);
    } else {
      setShowTemple(false);
    }
  }, [step]);

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
        const resultData = { type: top, desc: TYPE_INFO[top].desc, detail: TYPE_INFO[top].detail, counts };
        localStorage.setItem("mindmirror_quicktest", JSON.stringify(resultData));
        setStep("result");
      }
    }, 350);
  };

  const restart = () => {
    setStep("intro"); setCurrent(0); setAnswers([]);
    setSelected(null); setResult(null); setShowTemple(false);
  };

  const progress = (current / QUESTIONS.length) * 100;
  const typeInfo = result ? TYPE_INFO[result] : null;

  // 배경 SVG 스타일 (오른쪽 고정)
  const bgSvgStyle = {
    position: "absolute",
    right: "-50px",
    top: "50%",
    transform: "translateY(-50%)",
    opacity: 0.13,
    pointerEvents: "none",
    transition: "opacity 0.8s ease, transform 0.8s ease",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#e8e0f5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1.25rem",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .qt-option {
          width: 100%;
          background: rgba(255,255,255,0.45);
          border: 1px solid rgba(90,58,138,0.15);
          padding: 1rem 1.25rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          font-family: 'Source Serif 4', serif;
          font-size: 0.88rem;
          font-weight: 300;
          color: rgba(42,26,74,0.7);
          line-height: 1.6;
          margin-bottom: 0.5rem;
          border-radius: 2px;
        }
        .qt-option:hover { background: rgba(255,255,255,0.75); border-color: rgba(90,58,138,0.35); color: #2a1a4a; }
        .qt-option.selected { background: #2a1a4a; border-color: #2a1a4a; color: #f0eafa; }
        .qt-start-btn {
          background: #c8b8e8;
          border: none;
          color: #2a1a4a;
          font-family: 'Source Serif 4', serif;
          font-size: 0.82rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 1.1rem 2.8rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .qt-start-btn:hover { background: #b8a0d8; }
        .qt-back-btn {
          background: transparent;
          border: 1px solid rgba(90,58,138,0.25);
          color: rgba(90,58,138,0.55);
          font-family: 'Source Serif 4', serif;
          font-size: 0.78rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 1.1rem 1.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .qt-back-btn:hover { border-color: rgba(90,58,138,0.5); color: #2a1a4a; }
        .qt-ghost-btn {
          background: transparent; border: none;
          color: rgba(90,58,138,0.35);
          font-family: 'Source Serif 4', serif;
          font-size: 0.72rem; letter-spacing: 0.15em;
          text-transform: uppercase; cursor: pointer; padding: 0;
          transition: color 0.2s;
        }
        .qt-ghost-btn:hover { color: rgba(90,58,138,0.65); }
      `}</style>

      <div style={{width:"100%", maxWidth:560, position:"relative", zIndex:1}}>

        {/* 인트로 */}
        {step === "intro" && (
          <div style={{animation:"fadeIn 0.5s ease"}}>
            {/* 나침반 완성본 배경 */}
            <CompassSVG linesVisible={11} style={{...bgSvgStyle}} />

            <div style={{textAlign:"center", marginBottom:"2.5rem"}}>
              <div style={{fontFamily:"'Source Serif 4',serif", fontSize:"0.6rem", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(90,58,138,0.45)", marginBottom:"1rem"}}>나 이런 사람이었어.</div>
              <h1 style={{fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.8rem,4vw,2.6rem)", fontWeight:400, fontStyle:"italic", color:"#2a1a4a", lineHeight:1.3, marginBottom:"1.25rem"}}>내 디폴트 값 찾기</h1>
              <p style={{fontFamily:"'Source Serif 4',serif", fontSize:"0.88rem", fontWeight:300, color:"rgba(42,26,74,0.6)", lineHeight:1.9, maxWidth:400, margin:"0 auto 1rem"}}>
                누가 가르쳐준 적 없는데 늘 그렇게 하는 것들이 있어요.<br/>
                스트레스받을 때, 결정할 때, 사람 앞에 설 때.<br/>
                내가 자동으로 하는 것.<br/>
                그게 내 디폴트예요. 한 번도 제대로 본 적 없었던.
              </p>
              <p style={{fontFamily:"'Source Serif 4',serif", fontSize:"0.88rem", fontWeight:300, color:"rgba(42,26,74,0.5)", lineHeight:1.9, maxWidth:400, margin:"0 auto 1rem"}}>
                객관식이에요. 맞고 틀린 답 없어요.<br/>
                그냥 지금 나한테 더 가까운 걸 고르면 돼요.
              </p>
              <p style={{fontFamily:"'Source Serif 4',serif", fontSize:"0.88rem", fontWeight:300, color:"rgba(42,26,74,0.5)", lineHeight:1.9, maxWidth:400, margin:"0 auto 1rem"}}>
                11가지 상황에 답하다 보면<br/>
                내가 정보를 어떻게 받아들이고, 어떻게 결정하고,<br/>
                사람을 어떻게 만나는지 윤곽이 생겨요.<br/>
                잘 되는 것도, 늘 거기서 막히는 이유도요.
              </p>
              <p style={{fontFamily:"'Source Serif 4',serif", fontSize:"0.88rem", fontWeight:300, fontStyle:"italic", color:"rgba(42,26,74,0.45)", lineHeight:1.9, maxWidth:400, margin:"0 auto"}}>
                답하다 보면 — 아, 나 이런 사람이었구나 싶을 거예요.
              </p>
            </div>

            <div style={{display:"flex", gap:"0.75rem", flexWrap:"wrap", alignItems:"center", justifyContent:"center"}}>
              <button className="qt-start-btn" onClick={() => setStep("test")}>시작하기</button>
              {onBack && <button className="qt-back-btn" onClick={onBack}>← 돌아가기</button>}
            </div>
          </div>
        )}

        {/* 질문 */}
        {step === "test" && (
          <div style={{animation:"fadeIn 0.3s ease"}}>
            {/* 나침반 — 문제 풀수록 채워짐 */}
            <CompassSVG linesVisible={current} style={{...bgSvgStyle}} />

            <div style={{marginBottom:"3rem"}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.75rem"}}>
                <span style={{fontFamily:"'Source Serif 4',serif", fontSize:"0.65rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(90,58,138,0.4)"}}>{current + 1} / {QUESTIONS.length}</span>
                {onBack && <button className="qt-ghost-btn" onClick={onBack}>✕</button>}
              </div>
              <div style={{width:"100%", height:"1px", background:"rgba(90,58,138,0.12)"}}>
                <div style={{height:"100%", width:`${progress}%`, background:"rgba(90,58,138,0.4)", transition:"width 0.4s ease"}}/>
              </div>
            </div>

            <h2 style={{
              fontFamily:"'Playfair Display',serif",
              fontSize:"clamp(1.2rem,3vw,1.6rem)",
              fontWeight:400, fontStyle:"italic",
              color:"#2a1a4a", lineHeight:1.7,
              marginBottom:"2rem", whiteSpace:"pre-line",
            }}>
              {QUESTIONS[current].text}
            </h2>

            <div>
              {shuffledOptions.map((opt, i) => (
                <button
                  key={i}
                  className={`qt-option ${selected === opt ? "selected" : ""}`}
                  onClick={() => handleSelect(opt)}
                >
                  <span style={{fontFamily:"'Source Serif 4',serif", fontSize:"0.65rem", letterSpacing:"0.15em", marginRight:"0.75rem", opacity:0.4}}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 결과 */}
        {step === "result" && typeInfo && (
          <div style={{animation:"fadeIn 0.6s ease"}}>
            {/* 나침반 → 신전 전환 */}
            <div style={{position:"absolute", right:"-50px", top:"50%", transform:"translateY(-50%)", pointerEvents:"none"}}>
              <CompassSVG linesVisible={11} style={{
                opacity: showTemple ? 0 : 0.13,
                transform: showTemple ? "scale(1.3)" : "scale(1)",
                transition: "opacity 0.8s ease, transform 0.8s ease",
              }}/>
              <TempleSVG style={{
                position:"absolute", top:0, left:0,
                opacity: showTemple ? 0.13 : 0,
                transform: showTemple ? "scale(1)" : "scale(0.5)",
                transition: "opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s",
              }}/>
            </div>

            {/* 결과 카드 */}
            <div style={{
              background: "#d4c8f0",
              border:"1px solid rgba(90,58,138,0.2)",
              padding:"2.5rem 2rem",
              marginBottom:"2rem",
              textAlign:"center",
            }}>
              <div style={{fontFamily:"'Source Serif 4',serif", fontSize:"0.6rem", letterSpacing:"0.28em", textTransform:"uppercase", color:"rgba(42,26,74,0.45)", marginBottom:"1.5rem"}}>내 디폴트 값 찾기</div>
              <img src={`/${TYPE_IMAGES[result]}`} alt={result} style={{width:180, height:180, objectFit:"contain", marginBottom:"1.5rem"}}/>
              <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.6rem,4vw,2.2rem)", fontStyle:"italic", fontWeight:400, color:"#2a1a4a", marginBottom:"0.75rem"}}>{result}</h2>
              <p style={{fontFamily:"'Source Serif 4',serif", fontSize:"0.93rem", fontWeight:300, color:"rgba(42,26,74,0.7)", lineHeight:1.9, marginBottom:"1rem"}}>{typeInfo.desc}</p>
              <div style={{width:"32px", height:"1px", background:"rgba(90,58,138,0.25)", margin:"1.25rem auto"}}/>
              <p style={{fontFamily:"'Source Serif 4',serif", fontSize:"0.85rem", fontWeight:300, color:"rgba(42,26,74,0.6)", lineHeight:1.9, marginBottom:"1.5rem"}}>{typeInfo.detail}</p>

              {/* 강점 / 막히는 지점 */}
              <div style={{display:"flex", gap:"1rem", textAlign:"left"}}>
                <div style={{flex:1, background:"rgba(255,255,255,0.35)", padding:"1rem", borderRadius:"2px"}}>
                  <div style={{fontFamily:"'Source Serif 4',serif", fontSize:"0.62rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(42,26,74,0.4)", marginBottom:"0.5rem"}}>강점</div>
                  <p style={{fontFamily:"'Source Serif 4',serif", fontSize:"0.82rem", fontWeight:300, color:"rgba(42,26,74,0.7)", lineHeight:1.8}}>{typeInfo.strength}</p>
                </div>
                <div style={{flex:1, background:"rgba(255,255,255,0.35)", padding:"1rem", borderRadius:"2px"}}>
                  <div style={{fontFamily:"'Source Serif 4',serif", fontSize:"0.62rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(42,26,74,0.4)", marginBottom:"0.5rem"}}>막히는 지점</div>
                  <p style={{fontFamily:"'Source Serif 4',serif", fontSize:"0.82rem", fontWeight:300, color:"rgba(42,26,74,0.7)", lineHeight:1.8}}>{typeInfo.weakness}</p>
                </div>
              </div>
            </div>

            {/* 저장 안내 */}
            <div style={{background:"rgba(255,255,255,0.4)", border:"1px solid rgba(90,58,138,0.1)", padding:"1rem 1.25rem", marginBottom:"2rem"}}>
              <p style={{fontFamily:"'Source Serif 4',serif", fontSize:"0.78rem", fontWeight:300, color:"rgba(42,26,74,0.5)", lineHeight:1.8}}>
                이 결과는 이 브라우저에 임시 저장돼요.<br/>
                마음거울 → 오라클까지 완주하면 세 가지 결과를 통합 분석해드려요.
              </p>
            </div>

            <div style={{display:"flex", gap:"0.75rem", flexWrap:"wrap", alignItems:"center", justifyContent:"center"}}>
              <button className="qt-start-btn" onClick={restart}>다시 해보기</button>
              {onBack && <button className="qt-back-btn" onClick={onBack}>마음거울로 →</button>}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
