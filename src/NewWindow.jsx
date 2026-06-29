import { useState } from "react";

const NW_QUESTIONS = [
  {
    id: 1,
    type: "text",
    title: "기억",
    question: "잠깐 눈을 감아보세요.\n지금 이 순간 떠오르는 기억이 있나요?\n오래된 것도 좋아요. 작은 것도 좋아요.\n하나의 기억이면 충분해요.\n\n떠올랐나요?\n그 기억을 오늘 같이 바라볼게요.\n\n어떤 기억인가요?",
    placeholder: "떠오르는 대로 적어주세요...",
  },
  {
    id: 2,
    type: "single",
    title: "첫 생각",
    question: "그 기억을 잠깐 바라보세요.\n어떤 느낌이 먼저 오나요?\n그 기억을 떠올릴 때 가장 먼저 드는 생각은 무엇인가요?",
    options: [
      "\"내가 뭔가 놓친 것 같아.\"",
      "\"그때 다르게 했어야 했는데.\"",
      "\"누군가와 마음이 어긋났어.\"",
      "\"그때는 많이 조심스러웠어.\"",
      "\"다른 길도 있었을 텐데.\"",
      "\"그냥 지나갈 수 없는 일이었어.\"",
      "\"그때의 내가 아직도 선명해.\"",
      "\"그때의 나, 잘했다는 생각이 들어.\"",
    ],
  },
  {
    id: 3,
    type: "single",
    title: "지금의 상태",
    question: "그 기억은 내 안에 어떻게 있나요?",
    options: [
      "가끔 그런 일이 있었는데, 라고 생각해보곤 한다",
      "가끔 떠오르면 아직도 그때 그 감정이 그대로 올라온다",
      "뭔지 정확히 모르겠는데 어딘가 걸려있는 느낌이다",
      "그냥 깊이 묻어두고 있다",
      "이 기억은 나에게 중요한 것 같다, 왜인지는 모르겠지만",
      "가끔 꺼내보고 싶은 기억으로 남아있다",
    ],
  },
  {
    id: 4,
    type: "multi",
    title: "감정",
    question: "모든 기억 안에는 감정이 있어요.\n그 기억이 주는 감정은 무엇인가요?",
    options: [
      "억울함 — 나는 그러지 않았는데",
      "아쉬움 — 그때 달랐다면",
      "미안함과 자책 — 내가 더 잘했어야 했는데",
      "그리움 — 그 사람이, 그 시간이",
      "뿌듯함 — 그래도 잘했다는 느낌",
      "외로움 — 혼자였던 느낌",
      "따뜻함 — 지금도 좋은 기억으로 남은",
      "혼란 — 아직도 뭔지 모르겠다",
    ],
  },
  {
    id: 5,
    type: "single",
    title: "새창",
    question: "그 기억을 지금의 당신이 바라보세요.\n천천히요.\n\n그때의 장면, 감정, 당신을 그대로 두고\n현재의 당신이 살펴보세요.\n\n달라 보이는 것이 있나요?",
    options: [
      "내가 그때 나쁜 사람이었다고 생각했는데, 꼭 그렇지 않았을 수도 있다",
      "내 탓이라고 생각했는데, 꼭 그렇지 않았을 수도 있다",
      "그 사람이 나쁘다고 생각했는데, 꼭 그렇지 않았을 수도 있다",
      "어쩔 수 없었다고 생각했는데, 다른 선택이 있었을 수도 있다",
      "이미 끝났다고 생각했는데, 아직 열려있을 수도 있다",
      "그 일이 의미없다고 생각했는데, 의미가 있었을 수도 있다",
      "그때의 내가 부족했다고 생각했는데, 충분했을 수도 있다",
      "좋은 기억인데, 지금의 나와 연결해본 적이 없었다",
    ],
  },
  {
    id: 6,
    type: "text",
    title: "어쩌면",
    question: "지금 이 기억을 바라보며\n마음에 새로 드는 것이 있나요?\n\n완벽한 문장이 아니어도 괜찮아요.\n단어 하나도 좋고, 질문으로 남겨도 좋아요.\n\n지금 떠오르는 것을 그대로 적어주세요.\n어쩌면, 으로 시작해도 좋아요.",
    placeholder: "어쩌면...",
  },
];

const NW_PROMPT = `당신은 사용자가 작성한 답변을 분석하는 해설자입니다.

당신의 역할은 사용자를 교정하거나 치료하는 것이 아닙니다.
정답을 알려주거나 특정 해석을 강요하지 마세요.

대신 사용자가 어떤 생각을 오래 붙들고 있었는지, 그 생각이 어떤 방식으로 머물러 있었는지,
그리고 이번 질문을 통해 어떤 작은 가능성이 나타났는지 조심스럽게 비춰주세요.

분석 원칙:
1. 사용자의 기존 해석이 틀렸다고 말하지 않는다.
2. 새로운 해석을 단정적으로 제시하지 않는다.
3. "어쩌면", "또 다른 가능성", "다른 창에서 보면" 같은 표현을 사용한다.
4. 사용자의 답변에서 반복적으로 등장하는 주제, 감정, 의미를 찾아준다.
5. 상처를 외면하지 않되, 그 안에서 가능성을 찾는다.
6. 분석의 목적은 결론이 아니라 관찰이다.
7. 대시를 사용하지 않는다.
8. 문장은 짧게. 친한 사람이 조용히 옆에 앉아서 말하듯 써라.
9. "~군요", "~네요" 같은 감탄 어투 금지. 대신 "~일 수 있어요", "~했을 수도 있어요" 형식으로.
10. 볼드(**텍스트**) 절대 사용 금지.
11. 소제목(###) 절대 사용 금지.
12. 존댓말로 쓸 것.

분석 순서:
## 지금까지 바라보던 창
## 가장 먼저 흔들린 지점
## 새롭게 보이기 시작한 것
## 어쩌면
## 오늘의 새창

마지막은 반드시 이 문장으로 마무리한다:
"지금까지 보던 창이 틀렸다는 뜻은 아니에요.
다만, 오늘 그 옆에 작은 창 하나가 새로 생겼기를 바래요."

한국어로 작성하세요.`;

const AI_MIDPOINT_PROMPT = `당신은 사용자가 5번에서 선택한 답변을 보고 질문 하나를 던지는 역할이에요.
목적은 사용자가 6번으로 넘어가기 전에 잠깐 더 머물게 하는 거예요.
질문은 하나만. 짧게. 따뜻하게.

규칙:
1. 사용자의 선택을 판단하지 않는다.
2. 새로운 해석을 강요하지 않는다.
3. 질문은 한 문장. 끝에 물음표.
4. "어쩌면", "혹시", "그때" 같은 부드러운 표현을 쓴다.
5. 사용자가 답하지 않아도 되는 질문이어야 한다.
6. 대시를 사용하지 않는다.
7. "~군요", "~네요" 같은 감탄 어투 금지.
8. 반드시 한국어로 응답하라.
9. 질문 하나만. 다른 말 없이.`;

const Q_PALETTE = [
  { bg: "#B0BED0", text: "#1A2234" },
  { bg: "#A0B0C8", text: "#1A2234" },
  { bg: "#90A2C0", text: "#1A2234" },
  { bg: "#8094B8", text: "#1A2234" },
  { bg: "#7086B0", text: "#1A2234" },
  { bg: "#607AA8", text: "#1A2234" },
];

const ACCENT = "#3A5278";
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:wght@300;400&display=swap');`;
const sectionOrder = ["지금까지 바라보던 창", "가장 먼저 흔들린 지점", "새롭게 보이기 시작한 것", "어쩌면", "오늘의 새창"];

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

export default function NewWindow({ onBack, onComprehensive }) {
  const [phase, setPhase] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [textAnswer, setTextAnswer] = useState("");
  const [result, setResult] = useState("");
  const [midQuestion, setMidQuestion] = useState("");
  const [midAnswer, setMidAnswer] = useState("");
  const [loadingMid, setLoadingMid] = useState(false);
  const [showMid, setShowMid] = useState(false);
  const [visibleSections, setVisibleSections] = useState([]);

  const q = NW_QUESTIONS[currentQ];
  const isText = q?.type === "text";
  const isMulti = q?.type === "multi";
  const isSingle = q?.type === "single";
  const qPalette = Q_PALETTE[currentQ] || Q_PALETTE[Q_PALETTE.length - 1];
  const progress = (currentQ / NW_QUESTIONS.length) * 100;

  const canProceed = (() => {
    if (isText) return textAnswer.trim().length > 0;
    if (isMulti) return selectedOptions.length > 0;
    return !!answers[currentQ]?.answer;
  })();

  function selectSingle(opt) {
    setAnswers(prev => ({ ...prev, [currentQ]: { title: q.title, answer: opt } }));
  }

  function toggleMulti(opt) {
    setSelectedOptions(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]);
  }

  async function fetchMidQuestion(q5Answer) {
    setLoadingMid(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 150,
          system: AI_MIDPOINT_PROMPT,
          messages: [{ role: "user", content: `사용자가 선택한 답변: ${q5Answer}` }],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      setMidQuestion(text.trim());
    } catch (e) {
      setMidQuestion("어쩌면 그 기억은 아직 당신에게 무언가를 말하고 싶은 게 있을 수도 있어요.");
    }
    setLoadingMid(false);
  }

  function handleNext() {
    if (!canProceed) return;
    let answerText = "";
    if (isText) answerText = textAnswer;
    else if (isMulti) answerText = selectedOptions.join(", ");
    else answerText = answers[currentQ]?.answer || "";

    const newAnswers = { ...answers, [currentQ]: { title: q.title, answer: answerText } };
    setAnswers(newAnswers);

    if (currentQ === 4) {
      setShowMid(true);
      fetchMidQuestion(answerText);
      setSelectedOptions([]);
      setTextAnswer("");
      return;
    }

    setSelectedOptions([]);
    setTextAnswer("");

    if (currentQ < NW_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      analyze(newAnswers);
    }
  }

  function handleBack() {
    if (showMid) { setShowMid(false); return; }
    if (currentQ === 0) {
      setPhase("intro");
    } else {
      setCurrentQ(currentQ - 1);
      setSelectedOptions([]);
      setTextAnswer("");
    }
  }

  function proceedFromMid() {
    setShowMid(false);
    setMidAnswer("");
    setCurrentQ(5);
  }

  async function analyze(allAnswers) {
    setPhase("analyzing");
    const formatted = NW_QUESTIONS.map((q, i) => {
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
          system: NW_PROMPT,
          messages: [{ role: "user", content: `다음은 사용자의 응답입니다:\n\n${formatted}` }],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      setResult(text);
      localStorage.setItem("mindmirror_newwindow", text);
      setPhase("result");
      sectionOrder.forEach((s, i) => {
        setTimeout(() => setVisibleSections(prev => [...prev, s]), i * 1400);
      });
    } catch (e) {
      setResult("잠시 연결이 되지 않았어요. 다시 시도해주세요.");
      setPhase("result");
    }
  }

  function parseResult(text) {
    const sections = {};
    sectionOrder.forEach((key, i) => {
      const next = sectionOrder[i + 1];
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

  function splitClosing(text) {
    const closing = "지금까지 보던 창이 틀렸다는 뜻은 아니에요.";
    const idx = text.indexOf(closing);
    if (idx === -1) return { body: text, closing: "" };
    return { body: text.slice(0, idx).trim(), closing: text.slice(idx).trim() };
  }

  const parsed = result ? parseResult(result) : {};
  const userMemory = answers[0]?.answer || "";

  const getBg = () => {
    if (phase === "intro") return "#B0BED0";
    if (phase === "questions") return qPalette.bg;
    if (phase === "analyzing") return "#1F3A32";
    if (phase === "result") return "#F7F2E8";
    return "#1F3A32";
  };

  return (
    <div style={{
      minHeight: "100vh", background: getBg(),
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "3rem 1.5rem", transition: "background 0.6s ease",
    }}>
      <style>{`
        ${FONTS}
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes breathe { 0%,100%{opacity:0.35;} 50%{opacity:0.9;} }
        .nw-appear { animation: fadeUp 1.2s ease forwards; opacity:0; }
      `}</style>

      {/* 인트로 */}
      {phase === "intro" && (
        <div style={{ width: "100%", maxWidth: 520, position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: ACCENT, marginBottom: "1.5rem" }}>내 마음의 새창열기</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 400, color: "#1A2234", lineHeight: 1.2, marginBottom: "2rem" }}>작은 창 하나를 더</h1>
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(26,34,52,0.75)", lineHeight: 1.9, marginBottom: "0.75rem" }}>오래 가지고 있던 기억 하나를 꺼내볼 거예요.<br />그 기억을 처음 갖게 된 날이 있었을 거예요.</p>
            <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(26,34,52,0.75)", lineHeight: 1.9, marginBottom: "0.75rem" }}>그날의 당신이 볼 수 없었던 것들이 있었을 수 있어요.<br />지금의 눈으로 그 기억을 다시 바라보는 거예요.</p>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "0.95rem", fontStyle: "italic", color: ACCENT, lineHeight: 1.9 }}>그 생각을 지우거나 고치려는 게 아니에요.<br />그 옆에 작은 창 하나를 더 열어보는 거예요.</p>
          </div>
          <div style={{ background: "rgba(58,82,120,0.08)", borderLeft: "3px solid " + ACCENT, padding: "1.1rem 1.25rem", marginBottom: "2rem" }}>
            <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT, marginBottom: "0.6rem" }}>시작 전에</div>
            {[
              "오래된 기억 하나를 떠올리며 시작해요.",
              "6개 질문으로 구성되어 있어요.",
              "5번 질문 후 AI가 짧은 질문 하나를 드려요.",
            ].map((t, i) => (
              <div key={i} style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.82rem", fontWeight: 300, color: "rgba(26,34,52,0.7)", lineHeight: 1.85, display: "flex", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.2rem" }}>
                <span style={{ opacity: 0.5 }}>—</span>{t}
              </div>
            ))}
          </div>

          <div style={{ width: "48px", height: "1px", background: ACCENT, margin: "2rem 0" }} />

          <div style={{ marginBottom: "2rem" }}>
            {NW_QUESTIONS.map((q, i) => (
              <div key={q.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.4rem 0", borderBottom: "1px solid rgba(58,82,120,0.2)" }}>
                <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.7rem", color: ACCENT, opacity: 0.8, minWidth: "1.5rem" }}>{i + 1}</span>
                <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.85rem", fontWeight: 300, color: "#1A2234" }}>{q.title}</span>
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
              background: "transparent", border: "1px solid rgba(58,82,120,0.4)",
              color: "rgba(26,34,52,0.6)", fontFamily: "'Source Serif 4',serif",
              fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase",
              padding: "0.6rem 1.4rem", cursor: "pointer",
            }}>← 마음거울로</button>
          </div>
        </div>
      )}

      {/* 질문 */}
      {phase === "questions" && q && !showMid && (
        <div style={{ width: "100%", maxWidth: 540, position: "relative", zIndex: 1 }}>
          <div style={{ width: "100%", height: "1px", background: "rgba(0,0,0,0.1)", marginBottom: "3.5rem" }}>
            <div style={{ height: "100%", width: (progress + "%"), background: ACCENT, transition: "width 0.6s ease" }} />
          </div>
          <div style={{ fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: qPalette.text, opacity: 0.5, marginBottom: "0.6rem", fontFamily: "'Source Serif 4',serif" }}>
            {currentQ + 1} / {NW_QUESTIONS.length}
          </div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1rem,2.5vw,1.2rem)", fontWeight: 400, color: qPalette.text, lineHeight: 1.8, marginBottom: "2rem", whiteSpace: "pre-line" }}>
            {q.question}
          </h2>

          {isText && (
            <textarea value={textAnswer} onChange={e => setTextAnswer(e.target.value)} placeholder={q.placeholder || "떠오르는 대로 써주세요..."}
              style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(0,0,0,0.15)", color: qPalette.text, fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, lineHeight: 1.95, padding: "0.5rem 0", resize: "none", outline: "none", minHeight: "120px", boxSizing: "border-box" }} />
          )}

          {(isSingle || isMulti) && (
            <div style={{ marginBottom: "1rem" }}>
              {q.options.map(opt => {
                const isSelected = isMulti ? selectedOptions.includes(opt) : answers[currentQ]?.answer === opt;
                return (
                  <button key={opt}
                    onClick={() => isMulti ? toggleMulti(opt) : selectSingle(opt)}
                    style={{
                      width: "100%", background: isSelected ? "rgba(58,82,120,0.2)" : "rgba(0,0,0,0.06)",
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
              {isMulti && <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.72rem", color: qPalette.text, opacity: 0.4, marginTop: "0.5rem" }}>해당되는 것 모두 선택하세요</div>}
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
              fontFamily: "'Source Serif 4',serif", fontSize: "0.82rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              cursor: canProceed ? "pointer" : "default", padding: "0.7rem 1.8rem",
              transition: "all 0.3s",
            }}>
              {currentQ < NW_QUESTIONS.length - 1 ? "다음" : "완성"}
            </button>
          </div>
        </div>
      )}

      {/* AI 중간 질문 */}
      {phase === "questions" && showMid && (
        <div style={{ width: "100%", maxWidth: 520, position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "2rem" }}>
            {loadingMid ? (
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "1rem", fontStyle: "italic", color: qPalette.text, opacity: 0.5, animation: "breathe 2s ease-in-out infinite" }}>잠깐만요...</p>
            ) : (
              <div className="nw-appear">
                <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.1rem,3vw,1.35rem)", fontStyle: "italic", color: qPalette.text, lineHeight: 1.8, marginBottom: "1.5rem" }}>
                  {midQuestion}
                </p>
                <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.78rem", color: qPalette.text, opacity: 0.45, marginBottom: "1.25rem" }}>답하지 않아도 괜찮아요. 떠오르는 게 있다면 적어보세요.</p>
                <textarea
                  value={midAnswer}
                  onChange={e => setMidAnswer(e.target.value)}
                  placeholder="어쩌면..."
                  style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(0,0,0,0.15)", color: qPalette.text, fontFamily: "'Source Serif 4',serif", fontSize: "0.93rem", fontWeight: 300, lineHeight: 1.95, padding: "0.5rem 0", resize: "none", outline: "none", minHeight: "80px", boxSizing: "border-box", marginBottom: "2rem" }}
                />
              </div>
            )}
          </div>
          {!loadingMid && (
            <button onClick={proceedFromMid} style={{
              background: ACCENT, border: "none", color: "#F7F2E8",
              fontFamily: "'Source Serif 4',serif", fontSize: "0.82rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              cursor: "pointer", padding: "0.7rem 1.8rem",
            }}>계속하기 →</button>
          )}
        </div>
      )}

      {/* 로딩 */}
      {phase === "analyzing" && (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(247,242,232,0.4)", animation: "breathe 2s ease-in-out infinite" }}>
            새 창을 열고 있어요
          </p>
        </div>
      )}

      {/* 결과 */}
      {phase === "result" && (
        <div style={{ width: "100%", maxWidth: 640, paddingTop: "2rem" }}>

          <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(38,50,44,0.4)", marginBottom: "0.75rem" }}>내 마음의 새창열기 — 분석 결과</div>
          <div style={{ width: "100%", height: "1px", background: "rgba(38,50,44,0.12)", marginBottom: "1rem" }} />
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 400, color: "#26322C", marginBottom: "2rem", paddingBottom: "1.25rem", borderBottom: "1px solid rgba(38,50,44,0.12)" }}>내 마음의 새창열기</h2>

          {userMemory && (
            <div className="nw-appear" style={{ marginBottom: "3rem" }}>
              <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(38,50,44,0.35)", marginBottom: "1rem" }}>오늘 바라본 기억</div>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.2rem,3vw,1.6rem)", fontStyle: "italic", color: "#26322C", lineHeight: 1.7 }}>"{userMemory}"</p>
            </div>
          )}

          {sectionOrder.map((key, i) => {
            if (!visibleSections.includes(key) || !parsed[key]) return null;
            const isUmeo = key === "어쩌면";
            const isLast = key === "오늘의 새창";
            const { body, closing } = isLast ? splitClosing(parsed[key]) : { body: parsed[key], closing: "" };

            return (
              <div key={key} className="nw-appear" style={{
                marginBottom: "2.5rem",
                animationDelay: (i * 0.3) + "s",
                ...(isLast ? { background: "rgba(58,82,120,0.05)", padding: "1.5rem", marginLeft: "-1.5rem", marginRight: "-1.5rem" } : {}),
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.58rem", color: "rgba(38,50,44,0.3)" }}>0{i + 1}</span>
                  <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(38,50,44,0.4)" }}>{key}</div>
                </div>
                <div style={{ width: "100%", height: "1px", background: "rgba(38,50,44,0.1)", marginBottom: "1rem" }} />
                <div style={{
                  fontFamily: isUmeo ? "'Playfair Display',serif" : "'Source Serif 4',serif",
                  fontSize: isUmeo ? "1rem" : "0.95rem",
                  fontWeight: isUmeo ? 400 : 300,
                  fontStyle: isUmeo ? "italic" : "normal",
                  color: "#26322C", lineHeight: 2.1, whiteSpace: "pre-wrap",
                }}>
                  {body}
                </div>
                {closing && (
                  <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(38,50,44,0.08)" }}>
                    <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "0.95rem", fontStyle: "italic", color: "rgba(38,50,44,0.55)", lineHeight: 1.9 }}>{closing}</p>
                  </div>
                )}
              </div>
            );
          })}

          {visibleSections.length === 5 && (
            <div>
              <FeedbackWidget />
              <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid rgba(38,50,44,0.1)", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1rem" }}>
                <button onClick={() => { if (onComprehensive) onComprehensive(); else onBack(); }} style={{
                  background: ACCENT, border: "none", color: "#F7F2E8",
                  fontFamily: "'Source Serif 4',serif", fontSize: "0.82rem",
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  cursor: "pointer", padding: "1rem 2.5rem",
                }}>내 마음의 전체화면으로 →</button>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <button onClick={() => {
                    const text = sectionOrder.map(k => parsed[k] ? `${k}\n${parsed[k]}` : "").filter(Boolean).join("\n\n");
                    navigator.clipboard.writeText(text);
                    alert("복사되었습니다");
                  }} style={{ background: "transparent", border: "1px solid rgba(38,50,44,0.2)", color: "rgba(38,50,44,0.5)", fontFamily: "'Source Serif 4',serif", fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", padding: "0.6rem 1.4rem" }}>결과 복사</button>
                  <button onClick={onBack} style={{ background: "transparent", border: "1px solid rgba(38,50,44,0.2)", color: "rgba(38,50,44,0.45)", fontFamily: "'Source Serif 4',serif", fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", padding: "0.6rem 1.4rem" }}>← 마음거울로</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
