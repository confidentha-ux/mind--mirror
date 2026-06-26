import { useState } from "react";

const NEWWINDOW_QUESTIONS = [
  {
    id: 1,
    type: "text",
    title: "기억",
    question: "오늘 같이 바라볼 기억 하나를 골라주세요.\n장면 하나, 말 한마디, 떠오르는 사람, 아직 남아 있는 느낌 하나면 충분해요.",
  },
  {
    id: 2,
    type: "mc",
    title: "첫 생각",
    question: "그 기억을 떠올릴 때 가장 먼저 따라오는 생각은?",
    options: [
      "\"내가 뭔가 놓친 것 같아.\"",
      "\"그때 다르게 했어야 했는데.\"",
      "\"누군가와 마음이 어긋났어.\"",
      "\"그때는 많이 조심스러웠어.\"",
      "\"다른 길도 있었을 텐데.\"",
      "\"그냥 지나칠 수 없는 일이었어.\"",
      "\"그때의 내가 아직도 선명해.\"",
    ],
  },
  {
    id: 3,
    type: "mc",
    title: "시간",
    question: "그 생각은 얼마나 오래 내 안에 있었나요?",
    options: [
      "생각해보니 꽤 오래된 것 같다",
      "그 일이 있고 나서 생긴 것 같다",
      "언제부터인지 모르겠다",
      "최근에 다시 강해진 것 같다",
    ],
  },
  {
    id: 4,
    type: "mc",
    title: "균열",
    question: "혹시 그 생각이 전부가 아닐 수도 있다면, 가장 먼저 흔들리는 것은?",
    options: [
      "내가 그 일을 이해하던 방식",
      "내가 나를 탓하던 방식",
      "내가 그 사람을 기억하던 방식",
      "내가 그때의 조심스러움을 해석하던 방식",
      "내가 닫혔다고 생각한 가능성",
      "내가 그 일에 붙인 의미",
      "내가 그때의 나를 바라보던 방식",
    ],
  },
  {
    id: 5,
    type: "text",
    title: "새창",
    question: "지금 이 기억을 바라보며 떠오르는 문장이나 질문이 있다면 적어주세요.\n\"어쩌면…\"으로 시작해도 좋고, 질문으로 남겨도 괜찮아요.",
  },
];

const NEWWINDOW_PROMPT = `당신은 사용자가 작성한 "내 마음의 새창열기" 답변을 분석하는 해설자입니다.

당신의 역할은 사용자를 교정하거나 치료하는 것이 아닙니다.
정답을 알려주거나 특정 해석을 강요하지 마세요.

대신 사용자가 어떤 생각을 오래 붙들고 있었는지, 그 생각이 어떤 방식으로 머물러 있었는지,
그리고 이번 질문을 통해 어떤 작은 균열이나 가능성이 나타났는지 조심스럽게 비춰주세요.

분석 원칙:
1. 사용자의 기존 해석이 틀렸다고 말하지 않는다.
2. 새로운 해석을 단정적으로 제시하지 않는다.
3. "어쩌면", "또 다른 가능성", "다른 창에서 보면" 같은 표현을 사용한다.
4. 사용자의 답변에서 반복적으로 등장하는 주제, 감정, 의미를 찾아준다.
5. 상처를 외면하지 않되, 그 안에서 가능성을 찾는다.
6. 분석의 목적은 결론이 아니라 관찰이다.
7. 볼드(**텍스트**) 절대 사용 금지.
8. 소제목(###) 절대 사용 금지.
9. 존댓말로 쓸 것.

분석 순서:
## 지금까지 바라보던 창
## 가장 먼저 흔들린 지점
## 새롭게 보이기 시작한 것
## 어쩌면
## 오늘의 새창

마지막은 반드시 이 문장으로 마무리한다:
"지금까지 보던 창이 틀렸다는 뜻은 아닙니다.
다만, 오늘은 그 옆에 작은 창 하나가 더 생겼습니다."

한국어로 작성하세요.`;

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:wght@300;400&display=swap');`;

export default function NewWindow({ onBack }) {
  const [phase, setPhase] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const q = NEWWINDOW_QUESTIONS[currentQ];
  const isText = q?.type === "text";
  const progress = (currentQ / NEWWINDOW_QUESTIONS.length) * 100;
  const canProceed = isText ? textAnswer.trim().length > 0 : selectedOption !== null;

  function handleNext() {
    if (!canProceed) return;
    const answer = isText ? textAnswer : selectedOption;
    const newAnswers = { ...answers, [q.id]: { title: q.title, answer } };
    setAnswers(newAnswers);

    if (currentQ < NEWWINDOW_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOption(null);
      setTextAnswer("");
    } else {
      analyze(newAnswers);
    }
  }

  function handleBack() {
    if (currentQ === 0) {
      setPhase("intro");
    } else {
      const prevQ = NEWWINDOW_QUESTIONS[currentQ - 1];
      const prevAnswer = answers[prevQ.id];
      if (prevAnswer) {
        if (prevQ.type === "text") setTextAnswer(prevAnswer.answer);
        else setSelectedOption(prevAnswer.answer);
      }
      setCurrentQ(currentQ - 1);
    }
  }

  async function analyze(allAnswers) {
    setPhase("analyzing");
    setLoading(true);
    const formatted = NEWWINDOW_QUESTIONS.map(q => {
      const a = allAnswers[q.id];
      return `${q.title}: ${a ? a.answer : "미응답"}`;
    }).join("\n");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 4000,
          system: NEWWINDOW_PROMPT,
          messages: [{ role: "user", content: `다음은 사용자의 응답입니다:\n\n${formatted}` }],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      setResult(text);
      setPhase("result");
    } catch (e) {
      setResult("잠시 연결이 되지 않았어요. 다시 시도해주세요.");
      setPhase("result");
    }
    setLoading(false);
  }

  function parseResult(text) {
    const sections = {};
    const order = ["지금까지 바라보던 창", "가장 먼저 흔들린 지점", "새롭게 보이기 시작한 것", "어쩌면", "오늘의 새창"];
    order.forEach((key, i) => {
      const next = order[i + 1];
      const regex = next
        ? new RegExp(`##\\s*${key}([\\s\\S]*?)##\\s*${next}`)
        : new RegExp(`##\\s*${key}([\\s\\S]*?)$`);
      const match = text.match(regex);
      sections[key] = match ? match[1].trim() : "";
    });
    return sections;
  }

  const parsed = result ? parseResult(result) : {};
  const sectionOrder = ["지금까지 바라보던 창", "가장 먼저 흔들린 지점", "새롭게 보이기 시작한 것", "어쩌면", "오늘의 새창"];

  return (
    <div style={{
      minHeight: "100vh",
      background: phase === "result" ? "#F7F2E8" : "#1F3A32",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "3rem 1.5rem",
      transition: "background 1s ease",
    }}>
      <style>{`
        ${FONTS}
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes breathe { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.9; } }
        .nw-appear { animation: fadeUp 1.4s ease forwards; opacity: 0; }
        .nw-option {
          width: 100%; background: rgba(247,242,232,0.08);
          border: 1px solid rgba(247,242,232,0.2); color: rgba(247,242,232,0.8);
          font-family: 'Source Serif 4', serif; font-size: 0.87rem; font-weight: 300;
          text-align: left; padding: 0.85rem 1.1rem; cursor: pointer;
          transition: all 0.3s; margin-bottom: 0.45rem; line-height: 1.5;
        }
        .nw-option:hover { background: rgba(247,242,232,0.15); border-color: rgba(247,242,232,0.4); color: #F7F2E8; }
        .nw-option.selected { background: rgba(201,168,76,0.15); border-color: #C9A84C; color: #F7F2E8; }
        .nw-btn {
          background: transparent; border: 1px solid rgba(247,242,232,0.4);
          color: rgba(247,242,232,0.75); font-family: 'Source Serif 4', serif;
          font-size: 0.72rem; letter-spacing: 0.22em; text-transform: uppercase;
          cursor: pointer; padding: 0.7rem 1.8rem; transition: all 0.3s;
        }
        .nw-btn:hover { border-color: rgba(247,242,232,0.8); color: #F7F2E8; }
        .nw-btn:disabled { opacity: 0.2; cursor: default; }
        .nw-back {
          background: transparent; border: none; color: rgba(247,242,232,0.35);
          font-family: 'Source Serif 4', serif; font-size: 0.7rem;
          letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; padding: 0;
        }
        .nw-back:hover { color: rgba(247,242,232,0.7); }
        .nw-textarea {
          width: 100%; background: transparent; border: none;
          border-bottom: 1px solid rgba(247,242,232,0.2); color: #F7F2E8;
          font-family: 'Source Serif 4', serif; font-size: 0.93rem; font-weight: 300;
          line-height: 1.95; padding: 0.5rem 0; resize: none; outline: none;
          min-height: 120px; caret-color: #F7F2E8; box-sizing: border-box;
        }
        .nw-textarea::placeholder { color: rgba(247,242,232,0.2); }
        .nw-result-btn {
          background: transparent; border: 1px solid rgba(90,58,138,0.3);
          color: rgba(90,58,138,0.65); font-family: 'Source Serif 4', serif;
          font-size: 0.72rem; letter-spacing: 0.22em; text-transform: uppercase;
          cursor: pointer; padding: 0.7rem 1.8rem; transition: all 0.3s;
        }
        .nw-result-btn:hover { border-color: rgba(90,58,138,0.7); color: #2a1a4a; }
        .nw-back-result {
          background: transparent; border: none; color: rgba(90,58,138,0.3);
          font-family: 'Source Serif 4', serif; font-size: 0.7rem;
          letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; padding: 0;
        }
        .nw-back-result:hover { color: rgba(90,58,138,0.65); }
      `}</style>

      {/* 인트로 */}
      {phase === "intro" && (
        <div style={{ width: "100%", maxWidth: 520, position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "1.5rem" }}>내 마음의 새창열기</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 400, fontStyle: "italic", color: "#F7F2E8", lineHeight: 1.2, marginBottom: "2rem" }}>내 마음의 새창열기</h1>

          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(247,242,232,0.75)", lineHeight: 2.1, marginBottom: "0.75rem" }}>같은 일도 어디서 바라보느냐에 따라 다르게 보입니다.</p>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(247,242,232,0.75)", lineHeight: 2.1, marginBottom: "0.75rem" }}>당신이 오래 가지고 있던 생각 하나를 꺼내보세요.<br/>그 생각을 처음 갖게 된 날이 있었을 거예요.<br/>그날의 당신이 볼 수 없었던 것들이 있었을 수 있어요.</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontStyle: "italic", color: "#C9A84C", lineHeight: 2 }}>이 섹션은 그 생각을 지우거나 고치려는 게 아니에요.<br/>그 옆에 작은 창 하나를 더 열어보는 거예요.</p>
          </div>

          <div style={{ background: "rgba(201,168,76,0.08)", borderLeft: "3px solid #C9A84C", padding: "1.1rem 1.25rem", marginBottom: "2rem" }}>
            <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: ".68rem", letterSpacing: ".2em", textTransform: "uppercase", color: "#C9A84C", marginBottom: ".6rem" }}>시작 전에</div>
            <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: ".82rem", fontWeight: 300, color: "rgba(247,242,232,0.65)", lineHeight: 1.85, display: "flex", alignItems: "flex-start", gap: ".5rem" }}>
              <span style={{ opacity: .5 }}>—</span>같은 풍경도 다른 창으로 보면 조금 다르게 보일 수 있으니까요.
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1.2rem" }}>
            <button className="nw-btn" style={{ background: "rgba(201,168,76,0.15)", border: "1px solid #C9A84C", color: "#C9A84C" }} onClick={() => setPhase("questions")}>시작하기</button>
            <button className="nw-back" onClick={onBack}>← 마음거울로</button>
          </div>
        </div>
      )}

      {/* 질문 */}
      {phase === "questions" && q && (
        <div style={{ width: "100%", maxWidth: 540, position: "relative", zIndex: 1 }}>
          <div style={{ width: "100%", height: "1px", background: "rgba(247,242,232,0.1)", marginBottom: "3.5rem" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "rgba(201,168,76,0.5)", transition: "width 0.6s ease" }} />
          </div>
          <div style={{ fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(247,242,232,0.35)", marginBottom: "0.6rem", fontFamily: "'Source Serif 4', serif" }}>
            {currentQ + 1} / {NEWWINDOW_QUESTIONS.length} — {q.title}
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1rem, 2.8vw, 1.25rem)", fontWeight: 400, fontStyle: "italic", color: "#F7F2E8", lineHeight: 1.7, marginBottom: "2.2rem", whiteSpace: "pre-line" }}>
            {q.question}
          </h2>

          {isText ? (
            <textarea className="nw-textarea" value={textAnswer} onChange={e => setTextAnswer(e.target.value)} placeholder="떠오르는 대로 써주세요..." />
          ) : (
            <div style={{ marginBottom: "2rem" }}>
              {q.options.map(opt => (
                <button key={opt} className={`nw-option ${selectedOption === opt ? "selected" : ""}`} onClick={() => setSelectedOption(opt)}>
                  {opt}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem" }}>
            <button className="nw-back" onClick={handleBack}>← 이전</button>
            <button className="nw-btn" onClick={handleNext} disabled={!canProceed}>
              {currentQ < NEWWINDOW_QUESTIONS.length - 1 ? "다음" : "완성"}
            </button>
          </div>
        </div>
      )}

      {/* 분석 중 */}
      {phase === "analyzing" && (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(247,242,232,0.4)", animation: "breathe 2s ease-in-out infinite" }}>
            새 창을 열고 있어요
          </p>
        </div>
      )}

      {/* 결과 */}
      {phase === "result" && (
        <div style={{ width: "100%", maxWidth: 680, paddingTop: "2rem" }}>
          <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(90,58,138,0.4)", marginBottom: "0.5rem" }}>내 마음의 새창열기 — 분석 결과</div>
          <div style={{ width: "100%", height: "1px", background: "rgba(90,58,138,0.15)", marginBottom: "2rem" }} />

          {sectionOrder.map((key, i) => parsed[key] && (
            <div key={key} className="nw-appear" style={{ marginBottom: "2.5rem", animationDelay: `${i * 0.8}s` }}>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(90,58,138,0.45)", marginBottom: "0.4rem" }}>{key}</div>
              <div style={{ width: "100%", height: "1px", background: "rgba(90,58,138,0.12)", marginBottom: "1rem" }} />
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(42,26,74,0.75)", lineHeight: 2.2, whiteSpace: "pre-wrap", fontStyle: key === "어쩌면" ? "italic" : "normal" }}>
                {parsed[key]}
              </div>
            </div>
          ))}

          <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid rgba(90,58,138,0.1)", display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <button className="nw-result-btn" onClick={() => {
              const text = sectionOrder.map(k => parsed[k] ? `${k}\n${parsed[k]}` : "").filter(Boolean).join("\n\n");
              navigator.clipboard.writeText(text);
              alert("복사되었습니다");
            }}>결과 복사</button>
            <button className="nw-result-btn" onClick={() => {
              setPhase("questions");
              setCurrentQ(0);
              setAnswers({});
              setSelectedOption(null);
              setTextAnswer("");
              setResult("");
            }}>마음거울로</button>
            <button className="nw-back-result" onClick={onBack}>← 마음거울로</button>
          </div>
        </div>
      )}
    </div>
  );
}
