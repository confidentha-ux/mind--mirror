import { useState, useEffect, useRef } from "react";

const MEMORY_QUESTIONS = [
  {
    id: 1,
    type: "single",
    title: "흔들린 순간",
    question: "최근 내 마음이 크게 흔들렸던 순간을 생각해 보세요. 어떤 상황이었나요?",
    options: [
      "누군가의 말에 상처받았을 때",
      "기대했던 반응이 오지 않았을 때",
      "거절당했다고 느꼈을 때",
      "내가 실수했다고 생각했을 때",
      "답장이 늦어졌을 때",
      "비교당하는 느낌이 들었을 때",
      "무시당한다고 느꼈을 때",
      "기타",
    ],
  },
  {
    id: 2,
    type: "single",
    title: "감정",
    question: "그 순간 내가 느낀 감정은 무엇에 가까운가요?",
    options: [
      "서운함", "불안", "억울함", "부끄러움",
      "분노", "외로움", "무력감", "긴장",
    ],
  },
  {
    id: 3,
    type: "single",
    title: "강도",
    question: "그때 느낀 감정의 크기는 어느정도였나요?",
    options: [
      "잔잔했다",
      "꽤 컸다",
      "감당하기 어려울 만큼 컸다",
      "잘 모르겠다",
    ],
  },
  {
    id: 4,
    type: "single_with_input",
    title: "내면의 말",
    question: "그 순간이나 그와 유사한 순간에 내 안에 떠오르는 말은 어느 말에 가까운가요?",
    options: [
      "나는 또 부족한 사람이다",
      "상대가 나를 무시하고 있다",
      "나는 버려지고 있다",
      "실수하면 큰일 난다",
      "내가 먼저 맞춰야 한다",
      "나는 아무래도 사랑받기에 부족한 사람이다",
      "빨리 해결해야 한다",
      "그냥 참아야 한다",
      "직접 입력",
    ],
  },
  {
    id: 5,
    type: "multi_with_input",
    title: "몸의 반응",
    question: "그런 순간에 나의 몸에는 어떤 일이 벌어지나요?",
    options: [
      "얼굴이 뜨거워졌다",
      "말이 빨라졌다",
      "심장이 빨라졌다",
      "숨이 얕아졌다",
      "몸에 힘이 빠졌다",
      "목이나 어깨가 굳었다",
      "가슴이 답답해졌다",
      "배가 불편했다",
      "아무 말도 하기 싫어졌다",
      "눈물이 났다",
      "직접 입력",
    ],
  },
  {
    id: 6,
    type: "single_with_input",
    title: "반응 방식",
    question: "비슷한 상황에서 나는 주로 어떤 선택을 했어나요?",
    options: [
      "먼저 참는다",
      "혼자 생각하고 거리를 둔다",
      "바로 확인하거나 따진다",
      "괜찮은 척한다",
      "상대의 기분을 먼저 살핀다",
      "내가 잘못한 부분을 먼저 찾는다",
      "관계를 끊고 싶어진다",
      "직접 입력",
    ],
  },
  {
    id: 7,
    type: "single",
    title: "익숙함",
    question: "이런 반응은 처음인가요, 아니면 익숙한 반응인가요?",
    options: [
      "처음인 것 같다",
      "이런 상황에서는 늘 이런 반응이다",
      "상황마다 다르다",
      "잘 모르겠다",
    ],
  },
  {
    id: 8,
    type: "single_with_input",
    title: "관계",
    question: "이런 일은 주로 어느 인간 관계에서 더 자주 나타나나요?",
    options: [
      "가족",
      "친구",
      "연인 또는 배우자",
      "직장 또는 학교",
      "나를 평가할 것 같은 사람",
      "가까워지고 싶은 사람",
      "권위 있는 사람",
      "직접 입력",
    ],
  },
  {
    id: 9,
    type: "single",
    title: "판단",
    question: "이런 일들을 거치고 난뒤 자기 자신에 대한 판단은 어떤 말에 가까운가요?",
    options: [
      "나는 감정 표현이 서툰 사람이다",
      "나는 먼저 기대면 안 된다",
      "나는 잘 해내야 한다",
      "나는 사람들 앞에서 작아지는 편이다",
      "나는 상처를 오래 안고 가는 사람이다",
      "나는 혼자인 게 편하다",
      "나는 사랑받기 어려운 사람인 것 같다",
      "딱히 해당되는 게 없다",
    ],
  },
  {
    id: 10,
    type: "text",
    title: "발견",
    question: "지금까지 답하면서 새롭게 보이거나 발견한 것이 있나요? 무엇이든 괜찮습니다.",
  },
];

const MEMORY_SYSTEM_PROMPT = `당신은 사용자가 답한 "내 마음의 메모리" 답변을 분석하는 해설자입니다.

당신의 역할은 사용자를 교정하거나 치료하는 것이 아닙니다.

사용자가 지금 이 반응 안에서 오래된 것들을 스스로 발견하도록 조용히 비춰주세요.

분석 원칙:
1. 사용자의 반응을 판단하지 않는다
2. 모든 반응은 몸이 오래 학습한 방식임을 전제로 한다
3. 단정하지 않는다. "이번 반응은 ○○에 가까웠을 수 있어요" 형식으로
4. 사용자가 선택한 반응 유형을 짚어주되 부드럽게 교육한다
5. 이 반응이 유일한 방식이 아님을 알려준다
6. 대시를 사용하지 않는다
7. 문장은 짧게. 친한 사람이 조용히 옆에 앉아서 말하듯 써라
8. 볼드(**텍스트**) 절대 사용 금지
9. 소제목(###) 절대 사용 금지

분석 순서:
## 이번 반응에서 가장 먼저 켜진 것
## 그 반응이 작동한 방식
## 오래된 학습에서 온 것일 수 있어요
## 다른 선택의 가능성

마지막 문장:
"이 반응이 틀렸다는 뜻이 아니에요.
다만 이번에는 다르게 선택할 수도 있어요."

한국어로 작성하세요.`;

// 질문마다 배경 팔레트 — 밝은 카드색에서 점점 진하게
const Q_PALETTE = [
  { bg: "#A8C0B8", text: "#1A2E28" },
  { bg: "#98B4AC", text: "#1A2E28" },
  { bg: "#88A8A0", text: "#1A2E28" },
  { bg: "#789C94", text: "#1A2E28" },
  { bg: "#689088", text: "#1A2E28" },
  { bg: "#58847C", text: "#F7F2E8" },
  { bg: "#4A7870", text: "#F7F2E8" },
  { bg: "#3E6C64", text: "#F7F2E8" },
  { bg: "#326058", text: "#F7F2E8" },
  { bg: "#285450", text: "#F7F2E8" },
];

const ACCENT = "#2E6A5E";
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:wght@300;400&display=swap');`;

function FeedbackWidget() {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ marginTop: "2.5rem", paddingTop: "2rem", borderTop: "1px solid rgba(38,50,44,0.08)", textAlign: "center" }}>
      <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.8rem", fontWeight: 300, color: "rgba(38,50,44,0.45)", marginBottom: "1rem" }}>읽으면서 가장 크게 울린 부분이 있다면?</p>
      {!selected && (
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setSelected("yes")} style={{ background: "none", border: "1px solid rgba(38,50,44,0.15)", fontFamily: "'Source Serif 4',serif", fontSize: "0.8rem", color: "rgba(38,50,44,0.5)", padding: "0.4rem 1rem", cursor: "pointer" }}>👍 맞아요</button>
          <button onClick={() => setSelected("no")} style={{ background: "none", border: "1px solid rgba(38,50,44,0.15)", fontFamily: "'Source Serif 4',serif", fontSize: "0.8rem", color: "rgba(38,50,44,0.5)", padding: "0.4rem 1rem", cursor: "pointer" }}>👎 아닌 것 같아요</button>
          <button onClick={() => setSelected("unsure")} style={{ background: "none", border: "1px solid rgba(38,50,44,0.15)", fontFamily: "'Source Serif 4',serif", fontSize: "0.8rem", color: "rgba(38,50,44,0.5)", padding: "0.4rem 1rem", cursor: "pointer" }}>🤔 잘 모르겠어요</button>
        </div>
      )}
      {selected === "yes" && <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.8rem", fontWeight: 300, color: "rgba(38,50,44,0.45)" }}>감사해요.</p>}
      {selected === "unsure" && <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.8rem", fontWeight: 300, color: "rgba(38,50,44,0.45)" }}>그 모르겠다는 느낌도 중요한 정보예요.</p>}
      {selected === "no" && (
        <div>
          <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.85rem", fontWeight: 300, color: "rgba(38,50,44,0.55)", lineHeight: 1.9, marginBottom: "0.75rem" }}>맞지 않는 부분이 있으신가요?<br />당신이 느낀 것을 말씀해주세요.</p>
          <a href="https://forms.gle/1MK9PRZmTBpFsEPN8" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.8rem", color: "rgba(38,50,44,0.5)", textDecoration: "underline", textUnderlineOffset: "3px" }}>피드백 남기기 →</a>
        </div>
      )}
    </div>
  );
}

function TodaySentence({ onSave }) {
  const [text, setText] = useState("");
  return (
    <div style={{ marginTop: "0.75rem" }}>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="오늘 여기서 발견한 것..." rows={2}
        style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(184,154,94,0.3)", color: "rgba(240,237,232,0.8)", fontFamily: "'Source Serif 4',serif", fontSize: "0.88rem", fontWeight: 300, lineHeight: 1.8, padding: "0.75rem 1rem", resize: "none", outline: "none" }} />
      <button onClick={() => { if (text.trim()) onSave(text.trim()); }}
        style={{ marginTop: "0.5rem", background: "none", border: "1px solid rgba(184,154,94,0.4)", color: "rgba(184,154,94,0.7)", fontFamily: "'Source Serif 4',serif", fontSize: "0.8rem", padding: "0.4rem 1.2rem", cursor: "pointer" }}>기록하기</button>
    </div>
  );
}

export default function Oracle({ onBack, onComprehensive, initialPhase = "intro" }) {
  const [phase, setPhase] = useState(initialPhase);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [customInput, setCustomInput] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [memoryText, setMemoryText] = useState(() => localStorage.getItem("mindmirror_oracle") || "");
  const [visibleSections, setVisibleSections] = useState([]);
  const resultRef = useRef(null);

  useEffect(() => {
    if (initialPhase === "final") {
      setVisibleSections(["이번 반응에서 가장 먼저 켜진 것", "그 반응이 작동한 방식", "오래된 학습에서 온 것일 수 있어요", "다른 선택의 가능성"]);
    }
  }, [initialPhase]);

  useEffect(() => {
    if (phase !== "result" || !memoryText) return;
    setVisibleSections([]);
    const sections = ["이번 반응에서 가장 먼저 켜진 것", "그 반응이 작동한 방식", "오래된 학습에서 온 것일 수 있어요", "다른 선택의 가능성"];
    sections.forEach((s, i) => {
      setTimeout(() => setVisibleSections(prev => [...prev, s]), i * 1600);
    });
  }, [phase, memoryText]);

  const q = MEMORY_QUESTIONS[currentQ];
  const isMulti = q?.type === "multi_with_input";
  const isText = q?.type === "text";
  const hasDirect = q?.type === "single_with_input" || q?.type === "multi_with_input";
  const directSelected = selectedOptions.includes("직접 입력") || (hasDirect && !isMulti && answers[currentQ]?.raw === "직접 입력");
  const qPalette = Q_PALETTE[currentQ] || Q_PALETTE[Q_PALETTE.length - 1];
  const progress = (currentQ / MEMORY_QUESTIONS.length) * 100;

  const canProceed = (() => {
    if (isText) return textAnswer.trim().length > 0;
    if (isMulti) {
      if (selectedOptions.length === 0) return false;
      if (selectedOptions.includes("직접 입력") && !customInput.trim()) return false;
      return true;
    }
    const sel = answers[currentQ]?.raw;
    if (!sel) return false;
    if (sel === "직접 입력" && !customInput.trim()) return false;
    return true;
  })();

  function selectSingle(opt) {
    setAnswers(prev => ({ ...prev, [currentQ]: { raw: opt } }));
    if (opt !== "직접 입력") setCustomInput("");
  }

  function toggleMulti(opt) {
    setSelectedOptions(prev =>
      prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]
    );
  }

  function getAnswerText() {
    if (isText) return textAnswer;
    if (isMulti) {
      const opts = selectedOptions.filter(o => o !== "직접 입력");
      if (selectedOptions.includes("직접 입력") && customInput.trim()) opts.push(customInput.trim());
      return opts.join(", ");
    }
    const raw = answers[currentQ]?.raw;
    if (raw === "직접 입력") return customInput.trim();
    return raw || "";
  }

  function handleNext() {
    if (!canProceed) return;
    const answerText = getAnswerText();
    const newAnswers = { ...answers, [currentQ]: { title: q.title, answer: answerText } };
    setAnswers(newAnswers);
    setSelectedOptions([]);
    setCustomInput("");
    setTextAnswer("");
    if (currentQ < MEMORY_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setPhase("opening");
      callMemory(newAnswers);
    }
  }

  function handleBack() {
    if (currentQ === 0) {
      setPhase("intro");
    } else {
      setCurrentQ(currentQ - 1);
      setSelectedOptions([]);
      setCustomInput("");
      setTextAnswer("");
    }
  }

  async function callMemory(allAnswers) {
    const formatted = MEMORY_QUESTIONS.map((q, i) => {
      const a = allAnswers[i];
      return `${q.title}: ${a ? a.answer : "미응답"}`;
    }).join("\n");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 4000,
          system: MEMORY_SYSTEM_PROMPT,
          messages: [{ role: "user", content: `다음은 사용자의 응답입니다:\n\n${formatted}` }],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      localStorage.setItem("mindmirror_oracle", text);
      setMemoryText(text);
      setPhase("result");
    } catch (e) {
      setMemoryText("## 이번 반응에서 가장 먼저 켜진 것\n잠시 연결이 되지 않았어요. 다시 시도해주세요.\n\n## 그 반응이 작동한 방식\n\n## 오래된 학습에서 온 것일 수 있어요\n\n## 다른 선택의 가능성\n이 반응이 틀렸다는 뜻이 아니에요.\n다만 이번에는 다르게 선택할 수도 있어요.");
      setPhase("result");
    }
  }

  function parseMemory(text) {
    const sections = {};
    const order = ["이번 반응에서 가장 먼저 켜진 것", "그 반응이 작동한 방식", "오래된 학습에서 온 것일 수 있어요", "다른 선택의 가능성"];
    order.forEach((key, i) => {
      const next = order[i + 1];
      const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const nextEscaped = next ? next.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : null;
      const regex = nextEscaped
        ? new RegExp(`##\\s*${escaped}([\\s\\S]*?)##\\s*${nextEscaped}`)
        : new RegExp(`##\\s*${escaped}([\\s\\S]*?)$`);
      const match = text.match(regex);
      sections[key] = match ? match[1].trim() : "";
    });
    return sections;
  }

  const parsed = memoryText ? parseMemory(memoryText) : {};
  const sectionOrder = ["이번 반응에서 가장 먼저 켜진 것", "그 반응이 작동한 방식", "오래된 학습에서 온 것일 수 있어요", "다른 선택의 가능성"];
  const bgColor = (phase === "result" || phase === "final") ? "#F7F2E8" : phase === "questions" ? qPalette.bg : phase === "intro" ? "#A8C0B8" : "#1F3A32";
  const textColor = (phase === "result" || phase === "final") ? "#26322C" : phase === "questions" ? qPalette.text : "#1A2E28";

  return (
    <div style={{
      minHeight: "100vh", background: bgColor,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "3rem 1.5rem", position: "relative", overflow: "hidden",
      transition: "background 0.6s ease",
    }}>
      <style>{`
        ${FONTS}
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes breathe { 0%,100%{opacity:0.35;} 50%{opacity:0.9;} }
        .mem-appear { animation: fadeUp 1.6s ease forwards; opacity:0; }
      `}</style>

      {/* 인트로 */}
      {phase === "intro" && (
        <div style={{ width: "100%", maxWidth: 520, position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: ACCENT, marginBottom: "1.5rem" }}>내 마음의 메모리</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 400, color: "#1A2E28", lineHeight: 1.2, marginBottom: "2rem" }}>지워지지 않고<br />계속 남아있는 것</h1>
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(26,46,40,0.75)", lineHeight: 1.9, marginBottom: "0.75rem" }}>우리가 반응하는 방식은 어느 날 갑자기 생긴 게 아니에요.</p>
            <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(26,46,40,0.75)", lineHeight: 1.9, marginBottom: "0.75rem" }}>어떤 기억들이 지금의 나를 만들었는지 천천히 확인해봐요.</p>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "0.95rem", fontStyle: "italic", color: ACCENT, lineHeight: 1.9 }}>일어난 일을 있는 그대로 보는 것 같지만,<br />때로는 오래된 기억을 통과한 현재를 보고 있을 때가 있어요.</p>
          </div>
          <div style={{ background: "rgba(46,106,94,0.1)", borderLeft: "3px solid " + ACCENT, padding: "1.1rem 1.25rem", marginBottom: "2rem" }}>
            <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT, marginBottom: "0.6rem" }}>시작 전에</div>
            {[
              "정답은 없어요. 떠오르는 대로 답해주세요.",
              "10개 질문으로 구성되어 있어요.",
              "입력하신 내용은 앱에 저장되지 않아요.",
            ].map((t, i) => (
              <div key={i} style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.82rem", fontWeight: 300, color: "rgba(26,46,40,0.7)", lineHeight: 1.85, display: "flex", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.2rem" }}>
                <span style={{ opacity: 0.5 }}>—</span>{t}
              </div>
            ))}
          </div>

          <div style={{ width: "48px", height: "1px", background: ACCENT, margin: "2rem 0" }} />

          <div style={{ marginBottom: "2rem" }}>
            {MEMORY_QUESTIONS.map((q, i) => (
              <div key={q.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.4rem 0", borderBottom: "1px solid rgba(46,106,94,0.2)" }}>
                <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.7rem", color: ACCENT, opacity: 0.8, minWidth: "1.5rem" }}>{i + 1}</span>
                <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.85rem", fontWeight: 300, color: "#1A2E28" }}>{q.title}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1.2rem" }}>
            <button onClick={() => setPhase("questions")} style={{
              background: ACCENT, border: "none", color: "#F7F2E8",
              fontFamily: "'Source Serif 4',serif", fontSize: "0.82rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              padding: "1.1rem 2.8rem", cursor: "pointer",
            }}>시작하기</button>
            <button onClick={onBack} style={{
              background: "transparent", border: "1px solid rgba(46,106,94,0.4)",
              color: "rgba(26,46,40,0.6)", fontFamily: "'Source Serif 4',serif",
              fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase",
              padding: "0.6rem 1.4rem", cursor: "pointer",
            }}>← 마음거울로</button>
          </div>
        </div>
      )}

      {/* 질문 */}
      {phase === "questions" && q && (
        <div style={{ width: "100%", maxWidth: 540, position: "relative", zIndex: 1 }}>
          <div style={{ width: "100%", height: "1px", background: "rgba(0,0,0,0.1)", marginBottom: "3.5rem" }}>
            <div style={{ height: "100%", width: (progress + "%"), background: ACCENT, transition: "width 0.6s ease" }} />
          </div>
          <div style={{ fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: qPalette.text, opacity: 0.5, marginBottom: "0.6rem", fontFamily: "'Source Serif 4',serif" }}>
            {currentQ + 1} / {MEMORY_QUESTIONS.length}
          </div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.4rem,3.5vw,1.8rem)", fontWeight: 400, color: qPalette.text, lineHeight: 1.5, marginBottom: "2rem", whiteSpace: "pre-line" }}>
            {q.question}
          </h2>

          {isText && (
            <textarea value={textAnswer} onChange={e => setTextAnswer(e.target.value)} placeholder="떠오르는 대로 써주세요..."
              style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(0,0,0,0.15)", color: qPalette.text, fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, lineHeight: 1.95, padding: "0.5rem 0", resize: "none", outline: "none", minHeight: "130px", boxSizing: "border-box" }} />
          )}

          {!isText && (
            <div style={{ marginBottom: "1rem" }}>
              {q.options.map(opt => {
                const isSelected = isMulti ? selectedOptions.includes(opt) : answers[currentQ]?.raw === opt;
                return (
                  <button key={opt}
                    onClick={() => isMulti ? toggleMulti(opt) : selectSingle(opt)}
                    style={{
                      width: "100%", background: isSelected ? "rgba(46,106,94,0.2)" : "rgba(0,0,0,0.06)",
                      border: isSelected ? "1px solid " + ACCENT : "1px solid rgba(0,0,0,0.12)",
                      color: qPalette.text, fontFamily: "'Source Serif 4',serif",
                      fontSize: "0.87rem", fontWeight: 300, textAlign: "left",
                      padding: "0.85rem 1.1rem", cursor: "pointer",
                      transition: "all 0.3s", marginBottom: "0.4rem", lineHeight: 1.5,
                    }}>
                    {isMulti && <span style={{ marginRight: "0.5rem", opacity: 0.5 }}>{isSelected ? "✓" : "○"}</span>}
                    {opt}
                  </button>
                );
              })}
              {hasDirect && directSelected && (
                <input value={customInput} onChange={e => setCustomInput(e.target.value)} placeholder="직접 입력해주세요..."
                  style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(0,0,0,0.15)", color: qPalette.text, fontFamily: "'Source Serif 4',serif", fontSize: "0.88rem", fontWeight: 300, padding: "0.5rem 0", outline: "none", marginTop: "0.75rem" }} />
              )}
              {isMulti && (
                <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.72rem", color: qPalette.text, opacity: 0.4, marginTop: "0.5rem" }}>해당되는 것 모두 선택하세요</div>
              )}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem" }}>
            <button onClick={handleBack} style={{
              background: "transparent", border: "1px solid rgba(0,0,0,0.15)",
              color: qPalette.text, opacity: 0.6, fontFamily: "'Source Serif 4',serif",
              fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase",
              cursor: "pointer", padding: "0.6rem 1.4rem",
            }}>← 이전</button>
            <button onClick={handleNext} disabled={!canProceed} style={{
              background: canProceed ? ACCENT : "transparent",
              border: "1px solid " + (canProceed ? ACCENT : "rgba(0,0,0,0.15)"),
              color: canProceed ? "#F7F2E8" : qPalette.text,
              opacity: canProceed ? 1 : 0.3,
              fontFamily: "'Source Serif 4',serif", fontSize: "0.72rem",
              letterSpacing: "0.22em", textTransform: "uppercase",
              cursor: canProceed ? "pointer" : "default", padding: "0.7rem 1.8rem",
              transition: "all 0.3s",
            }}>
              {currentQ < MEMORY_QUESTIONS.length - 1 ? "다음" : "완성"}
            </button>
          </div>
        </div>
      )}

      {/* 로딩 */}
      {phase === "opening" && (
        <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(247,242,232,0.4)", animation: "breathe 2s ease-in-out infinite" }}>
            잠시 기다려주세요
          </p>
        </div>
      )}

      {/* 결과 */}
      {phase === "result" && (
        <div ref={resultRef} style={{ width: "100%", maxWidth: 680, paddingTop: "2rem" }}>
          <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(38,50,44,0.4)", marginBottom: "0.5rem" }}>내 마음의 메모리 — 분석 결과</div>
          <div style={{ width: "100%", height: "1px", background: "rgba(38,50,44,0.12)", marginBottom: "2rem" }} />

          {sectionOrder.map((key, i) => visibleSections.includes(key) && parsed[key] && (
            <div key={key} className="mem-appear" style={{ marginBottom: "2.5rem", animationDelay: (i * 0.3) + "s" }}>
              <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(38,50,44,0.4)", marginBottom: "0.4rem" }}>{key}</div>
              <div style={{ width: "100%", height: "1px", background: "rgba(38,50,44,0.12)", marginBottom: "1rem" }} />
              <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, color: "#26322C", lineHeight: 2.2, whiteSpace: "pre-wrap" }}>{parsed[key]}</div>
            </div>
          ))}

          {visibleSections.length === 4 && (
            <div className="mem-appear" style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid rgba(38,50,44,0.1)" }}>
              <FeedbackWidget />
              <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap", marginTop: "2rem" }}>
                <button onClick={onComprehensive} style={{ background: "transparent", border: "1px solid rgba(38,50,44,0.25)", color: "rgba(38,50,44,0.6)", fontFamily: "'Source Serif 4',serif", fontSize: "0.72rem", letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer", padding: "0.7rem 1.8rem" }}>종합 분석 보기 →</button>
                <button onClick={() => setPhase("final")} style={{ background: "transparent", border: "1px solid rgba(38,50,44,0.25)", color: "rgba(38,50,44,0.6)", fontFamily: "'Source Serif 4',serif", fontSize: "0.72rem", letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer", padding: "0.7rem 1.8rem" }}>마지막 장으로 →</button>
                <button onClick={() => { const text = sectionOrder.map(k => parsed[k] ? `${k}\n${parsed[k]}` : "").filter(Boolean).join("\n\n"); navigator.clipboard.writeText(text); alert("복사되었습니다"); }} style={{ background: "transparent", border: "1px solid rgba(38,50,44,0.25)", color: "rgba(38,50,44,0.6)", fontFamily: "'Source Serif 4',serif", fontSize: "0.72rem", letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer", padding: "0.7rem 1.8rem" }}>결과 복사</button>
                <button onClick={onBack} style={{ background: "transparent", border: "1px solid rgba(38,50,44,0.2)", color: "rgba(38,50,44,0.45)", fontFamily: "'Source Serif 4',serif", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", padding: "0.6rem 1.4rem" }}>← 마음거울로</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 마지막 장 */}
      {phase === "final" && (() => {
        const today = new Date();
        const savedSentence = localStorage.getItem("oracle_today_sentence");
        return (
          <div style={{ width: "100%", maxWidth: 580, paddingTop: "2rem", paddingBottom: "4rem" }}>
            <div style={{ position: "relative", padding: "3rem 2.5rem", border: "4px solid #C9A84C", boxShadow: "inset 0 0 0 8px #1F3A32, inset 0 0 0 10px rgba(201,168,76,0.2)" }}>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.1rem", fontStyle: "italic", color: "#C9A84C", lineHeight: 1.8, marginBottom: "2rem" }}>너 자신을 알라.</p>
              <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(240,237,232,0.75)", lineHeight: 2, marginBottom: "2rem" }}>당신은 자신을 보았습니다. 쉽지 않은 일이에요.</p>
              <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(240,237,232,0.75)", lineHeight: 2, marginBottom: "2rem" }}>이 결과는 당신이 누구인지를 정의하지 않습니다. 마음거울이 본 것은 당신이 반복적으로 선택해온 방식, 세상을 해석해온 습관, 무의식적으로 돌아가기 쉬운 길입니다. 그것은 당신의 전부가 아니라, 오늘 드러난 당신의 한 부분입니다.</p>
              <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(240,237,232,0.75)", lineHeight: 2, marginBottom: "2rem" }}>언젠가 다시 돌아오세요. 오늘 당신이 했던 말과, 그때 당신이 할 말은 달라져 있을 것입니다.</p>
              <div>
                <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(240,237,232,0.75)", lineHeight: 2, marginBottom: "1rem" }}>오늘 여기서 하나만 가져간다면 — 무엇인가요?</p>
                {!savedSentence ? (
                  <TodaySentence onSave={(sentence) => {
                    const data = { sentence, date: `${today.getMonth() + 1}월 ${today.getDate()}일`, timestamp: Date.now() };
                    localStorage.setItem("oracle_today_sentence", JSON.stringify(data));
                    window.location.reload();
                  }} />
                ) : (
                  <div style={{ marginTop: "1rem" }}>
                    <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.1rem", fontStyle: "italic", color: "#C9A84C", lineHeight: 1.9 }}>"{JSON.parse(savedSentence).sentence}"</p>
                    <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.75rem", color: "rgba(240,237,232,0.3)", marginTop: "0.5rem" }}>{JSON.parse(savedSentence).date} 기록</p>
                  </div>
                )}
              </div>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "0.95rem", fontStyle: "italic", color: "rgba(240,237,232,0.5)", lineHeight: 1.9, marginTop: "2rem", marginBottom: "2rem" }}>오늘의 당신을 기억하세요.</p>
              <div style={{ paddingTop: "1.5rem", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
                <a href="https://forms.gle/A6xXdAVUQoaNqaEWA" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.8rem", color: "rgba(201,168,76,0.55)", textDecoration: "underline", textUnderlineOffset: "3px" }}>피드백 남기기 →</a>
              </div>
            </div>
            <div style={{ marginTop: "3rem", display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
              <button onClick={() => {
                const saved = localStorage.getItem("oracle_today_sentence");
                const sentencePart = saved ? `\n\n오늘의 한 문장: "${JSON.parse(saved).sentence}"` : "";
                const text = sectionOrder.map(k => parsed[k] ? `${k}\n${parsed[k]}` : "").filter(Boolean).join("\n\n") + sentencePart;
                navigator.clipboard.writeText(text);
                alert("복사되었습니다");
              }} style={{ background: "transparent", border: "1px solid rgba(240,237,232,0.3)", color: "rgba(240,237,232,0.6)", fontFamily: "'Source Serif 4',serif", fontSize: "0.72rem", letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer", padding: "0.7rem 1.8rem" }}>결과 복사</button>
              <button onClick={onBack} style={{ background: "transparent", border: "1px solid rgba(240,237,232,0.2)", color: "rgba(240,237,232,0.35)", fontFamily: "'Source Serif 4',serif", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", padding: "0.6rem 1.4rem" }}>← 마음거울로</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
