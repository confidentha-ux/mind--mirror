import { useState } from "react";

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
      { text: "생각을 계속 해본다", type: "이해 후 행동형" },
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
  },
  "행동 후 이해형": {
    desc: "일단 움직이면서 배우는 사람이에요.",
    detail: "이론보다 실전이 편해요. 해보면서 익히고, 실패해도 빠르게 수정해요. 기다리는 것보다 뭔가 하는 게 더 자연스러운 사람이에요.",
    strength: "남들이 고민할 때 이미 움직여요. 실전에서 가장 빠르게 배우는 사람이에요.",
    weakness: "기다리는 게 고역이에요. 가만히 있으면 오히려 불안해져요.",
  },
  "관계 우선형": {
    desc: "사람이 있어야 힘이 나는 사람이에요.",
    detail: "혼자보다 함께할 때 더 좋은 결과가 나온다고 믿어요. 다른 사람의 감정을 먼저 살피고, 관계에서 에너지를 얻어요.",
    strength: "사람 마음을 먼저 읽어요. 팀이 있으면 혼자보다 훨씬 강해지는 사람이에요.",
    weakness: "혼자 결정하는 순간이 유독 힘들어요. 누군가 한 명만 있어도 달라져요.",
  },
  "안정 우선형": {
    desc: "지속 가능한 것을 선택하는 사람이에요.",
    detail: "변화보다 안정에서 힘을 얻어요. 리스크를 미리 점검하고, 오래 유지될 수 있는 방향을 선호해요. 신중함이 강점이에요.",
    strength: "오래 가는 선택을 해요. 리스크를 먼저 보는 사람이 팀에 꼭 필요한 이유예요.",
    weakness: "변화가 강요될 때 에너지가 확 떨어져요. 예측 불가능한 상황이 가장 소모적이에요.",
  },
  "직관 신뢰형": {
    desc: "느낌을 믿고 움직이는 사람이에요.",
    detail: "논리보다 직감이 먼저 와요. 설명하기 어렵지만 맞다는 느낌을 중요하게 여기고, 그 감각이 실제로 잘 맞는 편이에요.",
    strength: "설명 못 해도 맞는 방향을 알아요. 그 감각이 실제로 자주 맞아요.",
    weakness: '"왜 그렇게 생각해요?" 이 질문이 제일 난처해요. 논리로 설명해야 할 때 막혀요.',
  },
  "정확성 우선형": {
    desc: "틀리면 안 된다는 사람이에요.",
    detail: "정확성과 완성도를 중요하게 여겨요. 애매한 상태가 불편하고, 근거와 논리가 있어야 안심이 돼요. 꼼꼼함이 강점이에요.",
    strength: "디테일에서 판가름 나는 일은 당신 차지예요. 한 번 한 일은 믿을 수 있어요.",
    weakness: "완벽하지 않으면 내보내기 싫어요. 그래서 시작보다 마무리가 늦어질 때가 있어요.",
  },
};

const Q_PALETTE = { bg: "#EEE0CB", text: "#3A2410" };

const ACCENT = "#8C6640";
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300&display=swap');`;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuickTest({ onBack }) {
  const [step, setStep] = useState("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  const handleStart = () => {
    setShuffledOptions(shuffle(QUESTIONS[0].options));
    setStep("test");
  };

  const handleSelect = (option) => {
    setSelected(option);
    setTimeout(() => {
      const newAnswers = [...answers, option.type];
      setAnswers(newAnswers);
      if (current < QUESTIONS.length - 1) {
        const next = current + 1;
        setCurrent(next);
        setShuffledOptions(shuffle(QUESTIONS[next].options));
        setSelected(null);
      } else {
        const counts = {};
        newAnswers.forEach(t => { counts[t] = (counts[t] || 0) + 1; });
        const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
        setResult(top);
        setStep("result");
      }
    }, 350);
  };

  const handleBack = () => {
    if (current > 0) {
      const prev = current - 1;
      setCurrent(prev);
      setAnswers(answers.slice(0, prev));
      setShuffledOptions(shuffle(QUESTIONS[prev].options));
      setSelected(null);
    } else {
      setStep("intro");
    }
  };

  const restart = () => {
    setStep("intro");
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
    setResult(null);
  };

  const progress = (current / QUESTIONS.length) * 100;
  const typeInfo = result ? TYPE_INFO[result] : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: step === "result" ? "#F7F2E8" : "#EEE0CB",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1.25rem",
      position: "relative",
      overflow: "hidden",
      transition: "background 0.5s ease",
    }}>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes breathe { 0%,100%{opacity:0.4} 50%{opacity:1} }
      `}</style>

      <div style={{ width: "100%", maxWidth: 560, position: "relative", zIndex: 1 }}>

        {/* 인트로 */}
        {step === "intro" && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{
              fontFamily: "'Source Serif 4',serif",
              fontSize: "0.6rem", letterSpacing: "0.3em",
              textTransform: "uppercase", color: ACCENT, marginBottom: "1.5rem",
            }}>내 마음의 기본값</div>

            <h1 style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(1.8rem,4vw,2.6rem)",
              fontWeight: 400, color: "#3A2410",
              lineHeight: 1.2, marginBottom: "2rem",
            }}>내 마음이 먼저 향하는 방향</h1>

            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(58,36,16,0.75)", lineHeight: 1.9, marginBottom: "0.75rem" }}>
                우리는 어떤 상황 앞에서, 자신도 모르게 먼저 향하는 방향이 있습니다.<br />
                누군가는 원인을 찾고, 누군가는 사람의 마음을 살피고,<br />
                누군가는 바로 움직이려 합니다.
              </p>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "0.95rem", fontStyle: "italic", color: ACCENT, lineHeight: 1.9, marginBottom: "0.75rem" }}>
                11개의 짧은 질문을 통해<br />
                내가 상황 앞에서 무엇을 먼저 보고,<br />
                어떤 쪽으로 움직이는지 살펴봅니다.
              </p>
              <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(58,36,16,0.6)", lineHeight: 1.9 }}>
                깊게 고민하지 않아도 괜찮습니다.<br />
                지금의 나와 가장 가까운 선택지를 고르면 됩니다.
              </p>
            </div>

            <div style={{
              background: "rgba(140,102,64,0.1)", borderLeft: "3px solid " + ACCENT,
              padding: "1.1rem 1.25rem", marginBottom: "2rem",
            }}>
              <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT, marginBottom: "0.6rem" }}>시작 전에</div>
              {["맞고 틀린 답 없어요. 지금 나한테 가장 가까운 걸 고르면 돼요.", "선택지를 고르면 바로 다음 질문으로 넘어가요.", "11개 모두 객관식이에요."].map((t, i) => (
                <div key={i} style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.82rem", fontWeight: 300, color: "rgba(58,36,16,0.7)", lineHeight: 1.85, display: "flex", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.2rem" }}>
                  <span style={{ opacity: 0.5 }}>—</span>{t}
                </div>
              ))}
            </div>

            <div style={{ width: "48px", height: "1px", background: ACCENT, margin: "2rem 0" }} />

            <div style={{ marginBottom: "2rem" }}>
              {QUESTIONS.map((q, i) => (
                <div key={q.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.4rem 0", borderBottom: "1px solid rgba(140,102,64,0.2)" }}>
                  <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.7rem", color: ACCENT, opacity: 0.8, minWidth: "1.5rem" }}>{i + 1}</span>
                  <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.85rem", fontWeight: 300, color: "#3A2410" }}>{q.text.split("\n")[0]}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
              <button onClick={handleStart} style={{
                background: ACCENT, border: "none", color: "#F7F2E8",
                fontFamily: "'Source Serif 4',serif", fontSize: "0.82rem",
                letterSpacing: "0.18em", textTransform: "uppercase",
                padding: "1.1rem 2.8rem", cursor: "pointer",
              }}>가볍게 시작하기</button>
              {onBack && (
                <button onClick={onBack} style={{
                  background: "transparent", border: "1px solid rgba(140,102,64,0.4)",
                  color: "rgba(58,36,16,0.6)", fontFamily: "'Source Serif 4',serif",
                  fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase",
                  padding: "1.1rem 1.8rem", cursor: "pointer",
                }}>← 마음거울로</button>
              )}
            </div>
          </div>
        )}

        {/* 질문 */}
        {step === "test" && (
          <div style={{ animation: "fadeIn 0.3s ease", color: Q_PALETTE.text }}>
            <div style={{ marginBottom: "3rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: Q_PALETTE.text, opacity: 0.5 }}>
                  {current + 1} / {QUESTIONS.length}
                </span>
              </div>
              <div style={{ width: "100%", height: "1px", background: "rgba(0,0,0,0.1)" }}>
                <div style={{ height: "100%", width: (progress + "%"), background: ACCENT, transition: "width 0.4s ease" }} />
              </div>
            </div>

            <h2 style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(1.4rem,3.5vw,1.8rem)",
              fontWeight: 400, color: Q_PALETTE.text,
              lineHeight: 1.5, marginBottom: "2rem", whiteSpace: "pre-line",
            }}>
              {QUESTIONS[current].text}
            </h2>

            <div style={{ marginBottom: "2rem" }}>
              {shuffledOptions.map((opt, i) => (
                <button key={i}
                  onClick={() => handleSelect(opt)}
                  style={{
                    width: "100%", background: selected === opt ? "rgba(140,102,64,0.2)" : "rgba(0,0,0,0.06)",
                    border: selected === opt ? "1px solid " + ACCENT : "1px solid rgba(0,0,0,0.12)",
                    outline: "none", padding: "1rem 1.25rem", cursor: "pointer",
                    textAlign: "left", fontFamily: "'Source Serif 4',serif",
                    fontSize: "0.88rem", fontWeight: 300, color: Q_PALETTE.text,
                    lineHeight: 1.6, marginBottom: "0.5rem", borderRadius: "2px",
                    transition: "all 0.2s",
                  }}>
                  <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.65rem", letterSpacing: "0.15em", marginRight: "0.75rem", opacity: 0.4 }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt.text}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <button onClick={handleBack} style={{
                background: "transparent", border: "none",
                fontFamily: "'Source Serif 4',serif", fontSize: "0.72rem",
                letterSpacing: "0.12em", textTransform: "uppercase",
                cursor: "pointer", color: Q_PALETTE.text, opacity: 0.4,
                padding: 0, transition: "opacity 0.2s",
              }}>← 이전</button>
            </div>
          </div>
        )}

        {/* 결과 */}
        {step === "result" && typeInfo && (
          <div style={{ animation: "fadeIn 0.6s ease" }}>
            <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(58,36,16,0.4)", marginBottom: "0.5rem" }}>내 마음의 기본값 — 분석 결과</div>
            <div style={{ width: "100%", height: "1px", background: "rgba(58,36,16,0.12)", marginBottom: "2rem" }} />

            <div style={{
              background: "#DDD0B8",
              border: "1px solid rgba(58,36,16,0.15)",
              padding: "2.5rem 2rem",
              marginBottom: "2rem",
              textAlign: "center",
            }}>
              <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.6rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(58,36,16,0.45)", marginBottom: "1.5rem" }}>내 기본값 찾기</div>
              <img src={"/" + TYPE_IMAGES[result]} alt={result} style={{ width: 180, height: 180, objectFit: "contain", marginBottom: "1.5rem" }} />
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 400, color: "#3A2410", marginBottom: "0.75rem" }}>{result}</h2>
              <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(58,36,16,0.7)", lineHeight: 1.9, marginBottom: "1rem" }}>{typeInfo.desc}</p>
              <div style={{ width: "32px", height: "1px", background: "rgba(58,36,16,0.2)", margin: "1.25rem auto" }} />
              <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.85rem", fontWeight: 300, color: "rgba(58,36,16,0.6)", lineHeight: 1.9, marginBottom: "1.5rem" }}>{typeInfo.detail}</p>

              <div style={{ display: "flex", gap: "1rem", textAlign: "left" }}>
                <div style={{ flex: 1, background: "#C9A884", padding: "1rem", borderRadius: "2px" }}>
                  <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(58,36,16,0.5)", marginBottom: "0.5rem" }}>강점</div>
                  <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.82rem", fontWeight: 300, color: "rgba(58,36,16,0.85)", lineHeight: 1.8 }}>{typeInfo.strength}</p>
                </div>
                <div style={{ flex: 1, background: "#C9A884", padding: "1rem", borderRadius: "2px" }}>
                  <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(58,36,16,0.5)", marginBottom: "0.5rem" }}>막히는 지점</div>
                  <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.82rem", fontWeight: 300, color: "rgba(58,36,16,0.85)", lineHeight: 1.8 }}>{typeInfo.weakness}</p>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
              <button onClick={restart} style={{
                background: ACCENT, border: "none", color: "#F7F2E8",
                fontFamily: "'Source Serif 4',serif", fontSize: "0.82rem",
                letterSpacing: "0.18em", textTransform: "uppercase",
                padding: "1.1rem 2.8rem", cursor: "pointer",
              }}>다시 해보기</button>
              {onBack && (
                <button onClick={onBack} style={{
                  background: "transparent", border: "1px solid rgba(58,36,16,0.25)",
                  color: "rgba(58,36,16,0.6)", fontFamily: "'Source Serif 4',serif",
                  fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase",
                  padding: "1.1rem 1.8rem", cursor: "pointer",
                }}>← 마음거울로</button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
