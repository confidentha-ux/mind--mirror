import { useState } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:wght@300;400&display=swap');`;

const NW_QUESTIONS = [
  {
    id: 1,
    type: "text",
    title: "기억",
    question: "잠깐 눈을 감아보세요.\n지금 이 순간, 아무 이유 없이 떠오르는 기억이 있나요.\n오래된 것도 좋아요. 작은 것도 좋아요.\n그냥 거기 있는 것 하나면 충분해요.\n\n떠올랐나요?\n그 기억을 오늘 같이 바라볼게요.",
    placeholder: "떠오르는 대로 적어주세요...",
  },
  {
    id: 2,
    type: "single",
    title: "첫 생각",
    question: "그 기억을 잠깐 바라보세요.\n어떤 느낌이 먼저 오나요.\n그 기억을 떠올릴 때 가장 먼저 따라오는 생각은 무엇인가요?",
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
    question: "그 기억은 지금 내 안에 어떻게 있나요?",
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
    question: "모든 기억 안에는 감정들이 있어요.\n지금 떠오르는 것들을 그대로 골라보세요.\n그 기억에서 주된 감정은 무엇인가요?",
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
    question: "그 기억을 지금의 당신으로 다시 바라보세요.\n천천히요.\n\n그때의 장면, 그때의 감정, 그때의 당신을 그대로 두고\n지금의 눈으로 조용히 살펴보세요.\n\n달라 보이는 것이 있나요?",
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
    question: "지금 이 기억을 바라보며\n마음 안에 떠오르는 것이 있나요.\n\n완벽한 문장이 아니어도 괜찮아요.\n단어 하나도 좋고, 질문으로 남겨도 좋아요.\n\"어쩌면…\"으로 시작해도 좋아요.\n\n지금 떠오르는 것을 그대로 적어주세요.",
    placeholder: "어쩌면...",
  },
];

const NW_PROMPT = `당신은 사용자가 작성한 "내 마음의 새창열기" 답변을 분석하는 해설자입니다.

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
7. 대시를 사용하지 않는다.
8. 문장은 짧게. 친한 사람이 조용히 옆에 앉아서 말하듯 써라.
9. 볼드(**텍스트**) 절대 사용 금지.
10. 소제목(###) 절대 사용 금지.
11. 존댓말로 쓸 것.

분석 순서:
## 지금까지 바라보던 창
## 가장 먼저 흔들린 지점
## 새롭게 보이기 시작한 것
## 어쩌면
## 오늘의 새창

마지막은 반드시 이 문장으로 마무리한다:
"지금까지 보던 창이 틀렸다는 뜻은 아니에요.
다만, 오늘은 그 옆에 작은 창 하나가 더 생겼어요."

한국어로 작성하세요.`;

const AI_MIDPOINT_PROMPT = `당신은 사용자가 5번에서 선택한 답변을 보고 질문 하나를 던지는 역할이에요.
목적은 사용자가 6번으로 넘어가기 전에 잠깐 더 머물게 하는 거예요.
질문은 하나만. 짧게. 따뜻하게.
답을 요구하지 않아요. 그냥 그 안에 머물게 하는 질문이에요.

규칙:
1. 사용자의 선택을 판단하지 않는다.
2. 새로운 해석을 강요하지 않는다.
3. 질문은 한 문장. 끝에 물음표.
4. "어쩌면", "혹시", "그때" 같은 부드러운 표현을 쓴다.
5. 사용자가 답하지 않아도 되는 질문이어야 한다.
6. 대시를 사용하지 않는다.
7. 반드시 한국어로 응답하라.
8. 질문 하나만. 다른 말 없이.`;

export default function NewWindow({ onBack, onComprehensive }) {
  const [phase, setPhase] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [textAnswer, setTextAnswer] = useState("");
  const [result, setResult] = useState("");
  const [midQuestion, setMidQuestion] = useState("");
  const [loadingMid, setLoadingMid] = useState(false);
  const [showMid, setShowMid] = useState(false);

  const q = NW_QUESTIONS[currentQ];
  const isText = q?.type === "text";
  const isMulti = q?.type === "multi";
  const isSingle = q?.type === "single";
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

    // 5번 완료 후 AI 중간 질문
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
    if (showMid) {
      setShowMid(false);
      return;
    }
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
    setCurrentQ(5); // 6번 질문으로
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
      setPhase("result");
    } catch (e) {
      setResult("잠시 연결이 되지 않았어요. 다시 시도해주세요.");
      setPhase("result");
    }
  }

  function parseResult(text) {
    const sections = {};
    const order = ["지금까지 바라보던 창", "가장 먼저 흔들린 지점", "새롭게 보이기 시작한 것", "어쩌면", "오늘의 새창"];
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

  const parsed = result ? parseResult(result) : {};
  const sectionOrder = ["지금까지 바라보던 창", "가장 먼저 흔들린 지점", "새롭게 보이기 시작한 것", "어쩌면", "오늘의 새창"];
  const userMemory = answers[0]?.answer || "";

  const resultBg = "#E8E4DC";
  const resultText = "#26322C";

  return (
    <div style={{
      minHeight: "100vh",
      background: phase === "result" ? resultBg : "#1F3A32",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "3rem 1.5rem",
      transition: "background 1s ease",
    }}>
      <style>{`
        ${FONTS}
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes breathe { 0%,100%{opacity:0.35;} 50%{opacity:0.9;} }
        .nw-appear { animation: fadeUp 1.2s ease forwards; opacity:0; }
        .nw-option {
          width:100%; background:rgba(247,242,232,0.08);
          border:1px solid rgba(247,242,232,0.2); color:rgba(247,242,232,0.8);
          font-family:'Source Serif 4',serif; font-size:0.87rem; font-weight:300;
          text-align:left; padding:0.85rem 1.1rem; cursor:pointer;
          transition:all 0.3s; margin-bottom:0.4rem; line-height:1.5;
        }
        .nw-option:hover { background:rgba(247,242,232,0.15); border-color:rgba(247,242,232,0.4); color:#F7F2E8; }
        .nw-option.selected { background:rgba(58,82,120,0.2); border-color:#3A5278; color:#F7F2E8; }
        .nw-btn {
  background:#C9A84C; border:1px solid #C9A84C;
  color:#1F3A32; font-family:'Source Serif 4',serif;
  font-size:0.72rem; letter-spacing:0.22em; text-transform:uppercase;
  cursor:pointer; padding:0.7rem 1.8rem; transition:all 0.3s;
}
.nw-btn:hover { background:#b8963e; border-color:#b8963e; }
.nw-btn:disabled { opacity:0.2; cursor:default; }
        .nw-back {
  background:transparent; border:1px solid rgba(247,242,232,0.25); color:rgba(247,242,232,0.55);
  font-family:'Source Serif 4',serif; font-size:0.7rem;
  letter-spacing:0.2em; text-transform:uppercase; cursor:pointer; padding:0.6rem 1.4rem;
}
.nw-back:hover { border-color:rgba(247,242,232,0.5); color:rgba(247,242,232,0.85); }
        .nw-textarea {
          width:100%; background:transparent; border:none;
          border-bottom:1px solid rgba(247,242,232,0.2); color:#F7F2E8;
          font-family:'Source Serif 4',serif; font-size:0.93rem; font-weight:300;
          line-height:1.95; padding:0.5rem 0; resize:none; outline:none;
          min-height:120px; caret-color:#F7F2E8; box-sizing:border-box;
        }
        .nw-textarea::placeholder { color:rgba(247,242,232,0.2); }
     .nw-result-btn {
  background:transparent; border:1px solid rgba(38,50,44,0.25);
  color:rgba(38,50,44,0.6); font-family:'Source Serif 4',serif;
  font-size:0.72rem; letter-spacing:0.22em; text-transform:uppercase;
  cursor:pointer; padding:0.7rem 1.8rem; transition:all 0.3s;
}
.nw-result-btn:hover { border-color:rgba(38,50,44,0.6); color:#26322C; }
.nw-back-result {
  background:transparent; border:1px solid rgba(38,50,44,0.2); color:rgba(38,50,44,0.45);
  font-family:'Source Serif 4',serif; font-size:0.7rem;
  letter-spacing:0.2em; text-transform:uppercase; cursor:pointer; padding:0.6rem 1.4rem;
}
.nw-back-result:hover { border-color:rgba(38,50,44,0.5); color:rgba(38,50,44,0.8); } 
      `}</style>

      {/* 인트로 */}
      {phase === "intro" && (
        <div style={{ width:"100%", maxWidth:520, position:"relative", zIndex:1 }}>
          <div style={{ fontFamily:"'Source Serif 4',serif", fontSize:"0.6rem", letterSpacing:"0.3em", textTransform:"uppercase", color:"#C9A84C", marginBottom:"1.5rem" }}>내 마음의 새창열기</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.8rem,4vw,2.6rem)", fontWeight:400, fontStyle:"italic", color:"#F7F2E8", lineHeight:1.2, marginBottom:"2rem" }}>내 마음의 새창열기</h1>
          <div style={{ marginBottom:"1.5rem" }}>
            <p style={{ fontFamily:"'Source Serif 4',serif", fontSize:"0.93rem", fontWeight:300, color:"rgba(247,242,232,0.75)", lineHeight:2.1, marginBottom:"0.75rem" }}>같은 일도 어디서 바라보느냐에 따라 다르게 보입니다.</p>
            <p style={{ fontFamily:"'Source Serif 4',serif", fontSize:"0.93rem", fontWeight:300, color:"rgba(247,242,232,0.75)", lineHeight:2.1, marginBottom:"0.75rem" }}>당신이 오래 가지고 있던 생각 하나를 꺼내보세요.<br/>그 생각을 처음 갖게 된 날이 있었을 거예요.<br/>그날의 당신이 볼 수 없었던 것들이 있었을 수 있어요.</p>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.95rem", fontStyle:"italic", color:"#C9A84C", lineHeight:2 }}>이 섹션은 그 생각을 지우거나 고치려는 게 아니에요.<br/>그 옆에 작은 창 하나를 더 열어보는 거예요.</p>
          </div>
          <div style={{ background:"rgba(201,168,76,0.08)", borderLeft:"3px solid #C9A84C", padding:"1.1rem 1.25rem", marginBottom:"2rem" }}>
            <div style={{ fontFamily:"'Source Serif 4',serif", fontSize:".68rem", letterSpacing:".2em", textTransform:"uppercase", color:"#C9A84C", marginBottom:".6rem" }}>시작 전에</div>
            <div style={{ fontFamily:"'Source Serif 4',serif", fontSize:".82rem", fontWeight:300, color:"rgba(247,242,232,0.65)", lineHeight:1.85 }}>
              같은 풍경도 다른 창으로 보면 조금 다르게 보일 수 있으니까요.
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", gap:"1.2rem" }}>
        <button className="nw-btn" onClick={() => setPhase("questions")}>시작하기</button>
            <button className="nw-back" onClick={onBack}>← 마음거울로</button>
          </div>
        </div>
      )}

      {/* 질문 */}
      {phase === "questions" && q && !showMid && (
        <div style={{ width:"100%", maxWidth:540, position:"relative", zIndex:1 }}>
          <div style={{ width:"100%", height:"1px", background:"rgba(247,242,232,0.1)", marginBottom:"3.5rem" }}>
            <div style={{ height:"100%", width:(progress + "%"), background:"rgba(201,168,76,0.5)", transition:"width 0.6s ease" }}/>
        </div>
          <div style={{ fontSize:"0.58rem", letterSpacing:"0.28em", textTransform:"uppercase", color:"rgba(247,242,232,0.35)", marginBottom:"0.6rem", fontFamily:"'Source Serif 4',serif" }}>
            {currentQ + 1} / {NW_QUESTIONS.length} — {q.title}
          </div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(0.95rem,2.5vw,1.15rem)", fontWeight:400, fontStyle:"italic", color:"#F7F2E8", lineHeight:1.8, marginBottom:"2rem", whiteSpace:"pre-line" }}>
            {q.question}
          </h2>

          {isText && (
            <textarea className="nw-textarea" value={textAnswer} onChange={e => setTextAnswer(e.target.value)} placeholder={q.placeholder || "떠오르는 대로 써주세요..."}/>
          )}

          {(isSingle || isMulti) && (
            <div style={{ marginBottom:"1rem" }}>
              {q.options.map(opt => {
                const isSelected = isMulti ? selectedOptions.includes(opt) : answers[currentQ]?.answer === opt;
                return (
                  <button key={opt} className={`nw-option ${isSelected ? "selected" : ""}`}
                    onClick={() => isMulti ? toggleMulti(opt) : selectSingle(opt)}>
                    {isMulti && <span style={{ marginRight:"0.5rem", opacity:0.5 }}>{isSelected ? "✓" : "○"}</span>}
                    {opt}
                  </button>
                );
              })}
              {isMulti && <div style={{ fontFamily:"'Source Serif 4',serif", fontSize:"0.72rem", color:"rgba(247,242,232,0.3)", marginTop:"0.5rem" }}>해당되는 것 모두 선택하세요</div>}
            </div>
          )}

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"2rem" }}>
            <button className="nw-back" onClick={handleBack}>← 이전</button>
            <button className="nw-btn" onClick={handleNext} disabled={!canProceed}>
              {currentQ < NW_QUESTIONS.length - 1 ? "다음" : "완성"}
            </button>
          </div>
        </div>
      )}

      {/* AI 중간 질문 (5번 완료 후) */}
      {phase === "questions" && showMid && (
        <div style={{ width:"100%", maxWidth:520, position:"relative", zIndex:1, textAlign:"center" }}>
          <div style={{ marginBottom:"3rem" }}>
            {loadingMid ? (
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1rem", fontStyle:"italic", color:"rgba(247,242,232,0.4)", animation:"breathe 2s ease-in-out infinite" }}>잠깐만요...</p>
            ) : (
              <div className="nw-appear">
                <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.1rem,3vw,1.4rem)", fontStyle:"italic", color:"rgba(247,242,232,0.85)", lineHeight:1.8, marginBottom:"2.5rem" }}>
                  {midQuestion}
                </p>
                <p style={{ fontFamily:"'Source Serif 4',serif", fontSize:"0.78rem", color:"rgba(247,242,232,0.3)", marginBottom:"2.5rem" }}>답하지 않아도 괜찮아요. 잠깐 머물러보세요.</p>
              </div>
            )}
          </div>
          {!loadingMid && (
            <button className="nw-btn" onClick={proceedFromMid}>계속하기 →</button>
          )}
        </div>
      )}

      {/* 분석 중 */}
      {phase === "analyzing" && (
        <div style={{ textAlign:"center" }}>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1rem", fontStyle:"italic", color:"rgba(247,242,232,0.4)", animation:"breathe 2s ease-in-out infinite" }}>
            새 창을 열고 있어요
          </p>
        </div>
      )}

      {/* 결과 */}
      {phase === "result" && (
        <div style={{ width:"100%", maxWidth:680, paddingTop:"2rem" }}>
          <div style={{ fontFamily:"'Source Serif 4',serif", fontSize:"0.6rem", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(38,50,44,0.4)", marginBottom:"0.5rem" }}>내 마음의 새창열기 — 분석 결과</div>
          <div style={{ width:"100%", height:"1px", background:`rgba(38,50,44,0.12)`, marginBottom:"2rem" }}/>

          {/* 사용자가 적은 기억 인용 */}
          {userMemory && (
            <div className="nw-appear" style={{ marginBottom:"2.5rem" }}>
              <div style={{
                background:"rgba(45,74,62,0.07)",
                borderLeft:"2px solid #8FA8A0",
                padding:"1.2rem 1.5rem",
              }}>
                <div style={{ fontFamily:"'Source Serif 4',serif", fontSize:"0.6rem", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(38,50,44,0.4)", marginBottom:"0.75rem" }}>오늘 바라본 기억</div>
                <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1rem", fontStyle:"italic", color:resultText, lineHeight:1.9 }}>"{userMemory}"</p>
              </div>
            </div>
          )}

          {sectionOrder.map((key, i) => parsed[key] && (
            <div key={key} className="nw-appear" style={{ marginBottom:"2.5rem", animationDelay:(i * 0.6) + "s" }}>
              <div style={{ fontFamily:"'Source Serif 4',serif", fontSize:"0.62rem", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(38,50,44,0.4)", marginBottom:"0.4rem" }}>{key}</div>
              <div style={{ width:"100%", height:"1px", background:`rgba(38,50,44,0.12)`, marginBottom:"1rem" }}/>
              <div style={{
                fontFamily:"'Source Serif 4',serif", fontSize:"0.93rem", fontWeight:300,
                color:resultText, lineHeight:2.2, whiteSpace:"pre-wrap",
                fontStyle: key === "어쩌면" ? "italic" : "normal"
              }}>
                {parsed[key]}
              </div>
            </div>
          ))}

          <div style={{ marginTop:"2rem", paddingTop:"2rem", borderTop:`1px solid rgba(38,50,44,0.1)`, display:"flex", gap:"1.5rem", alignItems:"center", flexWrap:"wrap" }}>
            <button className="nw-result-btn" onClick={() => {
              if (onComprehensive) onComprehensive();
              else onBack();
            }}>내 마음의 전체화면으로 →</button>
            <button className="nw-result-btn" onClick={() => {
              const text = sectionOrder.map(k => parsed[k] ? `${k}\n${parsed[k]}` : "").filter(Boolean).join("\n\n");
              navigator.clipboard.writeText(text);
              alert("복사되었습니다");
            }}>결과 복사</button>
            <button className="nw-back-result" onClick={onBack}>← 마음거울로</button>
          </div>
        </div>
      )}
    </div>
  );
}
