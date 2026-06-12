import { useState, useEffect, useRef } from "react";

const ORACLE_QUESTIONS = [
  {
    id: 1,
    title: "에너지",
    question: "지난 일주일을 떠올려보세요.\n당신의 삶에서 가장 많은 자리를 차지한 것은 무엇입니까?",
    options: [
      "정보를 찾고 공부하는 일",
      "사람들과 이야기하거나 관계를 유지하는 일",
      "해야 할 일을 처리하는 일",
      "혼자 생각하고 정리하는 일",
      "새로운 가능성을 탐색하는 일",
      "버티고 회복하는 일",
    ],
  },
  {
    id: 2,
    title: "반복 장면",
    question: "당신의 삶이 영화라면,\n반복되는 장면은 무엇입니까?",
    options: [
      "출발선에 서 있지만 아직 뛰지 않는 장면",
      "짐을 싸다가 다시 내려놓는 장면",
      "사람들 사이에서 혼자 조용히 맞춰가는 장면",
      "지도 없이 혼자 걷고 있는 장면",
      "새로운 문을 열었다가 다시 닫는 장면",
      "같은 교차로에서 다시 멈추는 장면",
    ],
  },
  {
    id: 3,
    title: "반복 독백",
    question: "마음속으로 스스로에게\n되뇌이듯 하는 말은 무엇입니까?",
    options: [
      "아직 준비가 덜 됐다",
      "지금은 때가 아니다",
      "언젠가는 알게 될 것이다",
      "누가 답을 알려주면 좋겠다",
      "내가 원하는 게 뭔지 모르겠다",
      "나는 원래 이런 사람이다",
    ],
  },
  {
    id: 4,
    title: "회피",
    question: "스스로 생각하기에\n자신이 미루는 일은 어떤 종류입니까?",
    options: [
      "오래 미뤄온 결정",
      "누군가와 나눠야 할 진짜 대화",
      "시작하면 돌아올 수 없을 것 같은 일",
      "아무도 없을 때 찾아오는 나 자신",
      "끝내야 하는데 손이 가지 않는 일",
      "특별히 떠오르지 않는다",
    ],
  },
  {
    id: 5,
    title: "감정",
    question: "지난 한 달간\n불현듯 자신에게 많이 찾아온 감정은 무엇입니까?",
    options: [
      "뭔가 곧 일어날 것 같은 두근거림",
      "이유 없이 긴장이 풀리지 않는 느낌",
      "해야 할 말이 목 안에 걸려 있는 느낌",
      "아무도 없는 방에 혼자 있는 느낌",
      "다 해도 아무것도 없는 것 같은 느낌",
      "말로 설명이 안 되는 무언가",
    ],
  },
  {
    id: 6,
    title: "갈망",
    question: "당신이 당신의 인생에서\n늘 원했던 것은 어떤 종류입니까?",
    options: [
      "안정과 안전",
      "사랑과 연결",
      "자유와 여유",
      "성장과 변화",
      "이해와 인정",
      "의미와 목적",
    ],
  },
  {
    id: 7,
    title: "관계",
    question: "주변 사람들과의 관계에서\n반복되는 장면은 무엇입니까?",
    options: [
      "먼저 다가가지 못하고 기다린다",
      "맞춰주다가 어느 순간 멀어진다",
      "가까워질수록 조심스러워진다",
      "혼자 해결하고 나중에 말한다",
      "말하고 싶지만 때를 놓친다",
      "관계보다 일이나 생각이 먼저다",
    ],
  },
  {
    id: 8,
    title: "미완성",
    question: "당신의 마음 한구석에\n오래전부터 남아 있는 것은 무엇입니까?",
    options: [
      "하지 못한 선택",
      "끝내지 못한 일",
      "놓친 관계",
      "이루지 못한 꿈",
      "답을 얻지 못한 질문",
      "특별히 떠오르지 않는다",
    ],
  },
  {
    id: 9,
    title: "문",
    question: "만약 지금 당신 앞에\n오래전부터 서 있었던 문이 하나 있다면,\n그 문 너머에는 무엇이 있을 것 같습니까?",
    type: "text",
  },
  {
    id: 10,
    title: "마지막",
    question: "지금까지 질문들에 답하면서\n가장 많이 떠오른 단어나 장면,\n혹은 감정이나 마음은 무엇입니까?",
    type: "text",
  },
];

const ORACLE_SYSTEM_PROMPT = `당신은 Story Oracle이다.

당신의 역할은 사용자를 진단하거나 평가하는 것이 아니다.
당신은 사용자의 답변 속에서 반복되는 패턴, 긴장, 갈망, 모순을 발견하고 그것을 비추어 주는 존재이다.
당신은 심리학자도, 상담사도, 점쟁이도 아니다.
당신은 사용자가 스스로 자기 삶의 저자가 되도록 돕는 오라클이다.

절대 하지 말 것:
- 사용자를 유형으로 규정하지 말 것
- 단정하지 말 것
- 마크다운 볼드(**텍스트**)를 절대 사용하지 말 것
- 교훈을 설교하지 말 것
- 조언을 남발하지 말 것

언어 원칙:
- 신탁의 목소리로 말할 것. 짧고 시적이고 여백이 있어야 한다
- 각 섹션은 간결하게. 전체가 하나의 흐름처럼 읽혀야 한다
- Oracle 섹션은 반드시 "혹시" 또는 "어쩌면"으로 시작하는 문장을 포함한다
- Empowerment는 단 한 문장의 질문으로 끝낸다

출력 구조:

## Reflection
3-5줄. 사용자가 답한 내용을 짧은 문장들로 정리. 해석 없이.

## Recognition
2-3문단. 반복 패턴. 사용자가 "맞아"라고 느낄 수 있어야 한다.

## Oracle
2-3문단. 균열. 반드시 "혹시" 또는 "어쩌면" 포함.

## Story
5-8줄. 시처럼 짧은 줄들로.

## Empowerment
단 한 문장. 질문으로 끝낸다.

반드시 한국어로 응답하라.
반드시 ## Reflection, ## Recognition, ## Oracle, ## Story, ## Empowerment 헤더를 정확히 사용하라.`;

export default function Oracle({ onBack }) {
  const [phase, setPhase] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [otherText, setOtherText] = useState("");
  const [showOther, setShowOther] = useState(false);
  const [oracleText, setOracleText] = useState("");
  const [visibleSections, setVisibleSections] = useState([]);
  const resultRef = useRef(null);

  const q = ORACLE_QUESTIONS[currentQ];
  const isTextQ = q?.type === "text";
  const progress = (currentQ / ORACLE_QUESTIONS.length) * 100;

  const canProceed = isTextQ
    ? textAnswer.trim().length > 0
    : selectedOption !== null && (selectedOption !== "기타" || otherText.trim().length > 0);

  function handleSelect(option) {
    if (option === "기타") {
      setShowOther(true);
      setSelectedOption("기타");
    } else {
      setSelectedOption(option);
      setShowOther(false);
      setOtherText("");
    }
  }

  function handleNext() {
    if (!canProceed) return;
    const answer = isTextQ
      ? textAnswer
      : selectedOption === "기타"
      ? otherText
      : selectedOption;

    const newAnswers = { ...answers, [q.id]: { title: q.title, answer } };
    setAnswers(newAnswers);

    if (currentQ < ORACLE_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOption(null);
      setTextAnswer("");
      setOtherText("");
      setShowOther(false);
    } else {
      setPhase("door");
    }
  }

  function handleBack() {
    if (currentQ === 0) {
      setPhase("intro");
    } else {
      const prevQ = ORACLE_QUESTIONS[currentQ - 1];
      const prevAnswer = answers[prevQ.id];
      if (prevAnswer) {
        if (prevQ.type === "text") {
          setTextAnswer(prevAnswer.answer);
        } else {
          setSelectedOption(prevAnswer.answer);
        }
      }
      setCurrentQ(currentQ - 1);
      setShowOther(false);
      setOtherText("");
    }
  }

  async function openDoor() {
    setPhase("opening");
    await callOracle();
  }

  async function callOracle() {
    const formatted = ORACLE_QUESTIONS.map((q) => {
      const a = answers[q.id];
      return `${q.title}: ${a ? a.answer : "미응답"}`;
    }).join("\n");

    const userMessage = `다음은 사용자의 응답입니다:\n\n${formatted}`;

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1500,
          system: ORACLE_SYSTEM_PROMPT,
          messages: [{ role: "user", content: userMessage }],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      setOracleText(text);
      setPhase("result");
    } catch (e) {
      setOracleText("## Reflection\n오라클이 잠시 침묵하고 있습니다.\n\n## Recognition\n다시 시도해주세요.\n\n## Oracle\n어쩌면 지금은 때가 아닐 수 있습니다.\n\n## Story\n문은 여전히 거기 있습니다.\n\n## Empowerment\n다시 문 앞에 서겠습니까?");
      setPhase("result");
    }
  }

  useEffect(() => {
    if (phase !== "result" || !oracleText) return;
    setVisibleSections([]);
    const sections = ["Reflection", "Recognition", "Oracle", "Story", "Empowerment"];
    sections.forEach((s, i) => {
      setTimeout(() => {
        setVisibleSections((prev) => [...prev, s]);
      }, i * 1800);
    });
  }, [phase, oracleText]);

  function parseOracle(text) {
    const sections = {};
    const order = ["Reflection", "Recognition", "Oracle", "Story", "Empowerment"];
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

  const parsed = oracleText ? parseOracle(oracleText) : {};

  return (
    <div style={{
      minHeight: "100vh",
      background: "#08080f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "3rem 1.5rem",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:wght@300;400&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.9; }
        }
        @keyframes flicker {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.85; }
        }
        .oracle-appear {
          animation: fadeUp 1.8s ease forwards;
          opacity: 0;
        }
        .oracle-option {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(180,150,100,0.18);
          color: rgba(200,175,130,0.75);
          font-family: 'Source Serif 4', serif;
          font-size: 0.87rem;
          font-weight: 300;
          text-align: left;
          padding: 0.85rem 1.1rem;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 0.45rem;
          border-radius: 1px;
          line-height: 1.5;
        }
        .oracle-option:hover {
          background: rgba(180,150,100,0.07);
          border-color: rgba(180,150,100,0.4);
          color: #e8d8aa;
        }
        .oracle-option.selected {
          background: rgba(180,150,100,0.12);
          border-color: rgba(180,150,100,0.6);
          color: #f0e0b8;
        }
        .oracle-btn {
          background: transparent;
          border: 1px solid rgba(180,150,100,0.35);
          color: rgba(180,150,100,0.7);
          font-family: 'Source Serif 4', serif;
          font-size: 0.72rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          cursor: pointer;
          padding: 0.7rem 1.8rem;
          transition: all 0.3s;
        }
        .oracle-btn:hover {
          border-color: rgba(180,150,100,0.7);
          color: #e8d8aa;
        }
        .oracle-btn:disabled {
          opacity: 0.2;
          cursor: default;
        }
        .door-open-btn {
          background: transparent;
          border: 1px solid rgba(180,150,100,0.5);
          color: #e8d8aa;
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-style: italic;
          cursor: pointer;
          padding: 1.1rem 3rem;
          transition: all 0.4s;
          animation: breathe 3s ease-in-out infinite;
          letter-spacing: 0.03em;
        }
        .door-open-btn:hover {
          background: rgba(180,150,100,0.08);
          border-color: #e8d8aa;
          animation: none;
          opacity: 1;
        }
        .back-link {
          background: transparent;
          border: none;
          color: rgba(180,150,100,0.3);
          font-family: 'Source Serif 4', serif;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          padding: 0;
          transition: all 0.3s;
        }
        .back-link:hover { color: rgba(180,150,100,0.7); }
        .oracle-textarea {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(180,150,100,0.25);
          color: #e8d8aa;
          font-family: 'Source Serif 4', serif;
          font-size: 0.93rem;
          font-weight: 300;
          line-height: 1.95;
          padding: 0.5rem 0;
          resize: none;
          outline: none;
          min-height: 130px;
          caret-color: #b49664;
          box-sizing: border-box;
        }
        .oracle-textarea::placeholder { color: rgba(180,150,100,0.22); }
        .oracle-textarea:focus { border-bottom-color: rgba(180,150,100,0.5); }
        .greek {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          letter-spacing: 0.2em;
          color: rgba(180,150,100,0.3);
          font-style: italic;
        }
      `}</style>

      {/* 인트로 */}
      {phase === "intro" && (
        <div style={{ width: "100%", maxWidth: 520, textAlign: "center" }}>
          <div className="greek" style={{ marginBottom: "3rem" }}>
            γνῶθι σεαυτόν
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.9rem, 5vw, 2.8rem)",
            fontWeight: 400,
            fontStyle: "italic",
            color: "#e8d8aa",
            lineHeight: 1.4,
            marginBottom: "2.5rem",
            letterSpacing: "0.02em",
          }}>
            당신은 지금 어떤 문 앞에 서 있습니까
          </h1>
          <p style={{
            fontSize: "0.88rem",
            fontWeight: 300,
            color: "rgba(200,175,130,0.55)",
            lineHeight: 2.2,
            marginBottom: "3rem",
            fontFamily: "'Source Serif 4', serif",
            whiteSpace: "pre-line",
            textAlign: "left",
          }}>
            {`이 오라클은 당신을 진단하거나 평가하지 않습니다.

열 가지 질문에 답하고 나면, 오라클이 당신의 답변 속에서 세 가지를 찾아드립니다.

지금 당신이 반복하고 있는 장면.
지금 당신이 실제로 원하는 것.
지금 당신이 스스로에게 던지고 있는 진짜 질문.

이것은 평가가 아닙니다.
당신이 이미 알고 있었지만 아직 말로 꺼내지 못한 것들입니다.`}
          </p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem" }}>
            <button className="oracle-btn" onClick={() => setPhase("questions")}>
              문 앞에 서다
            </button>
            <button className="back-link" onClick={onBack}>← 돌아가기</button>
          </div>
        </div>
      )}

      {/* 질문 */}
      {phase === "questions" && q && (
        <div style={{ width: "100%", maxWidth: 540 }}>
          <div style={{
            width: "100%", height: "1px",
            background: "rgba(180,150,100,0.1)",
            marginBottom: "3.5rem",
          }}>
            <div style={{
              height: "100%",
              width: `${progress}%`,
              background: "rgba(180,150,100,0.4)",
              transition: "width 0.6s ease",
            }} />
          </div>

          <div style={{
            fontSize: "0.58rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(180,150,100,0.35)",
            marginBottom: "0.6rem",
            fontFamily: "'Source Serif 4', serif",
          }}>
            {currentQ + 1} / {ORACLE_QUESTIONS.length} — {q.title}
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1rem, 2.8vw, 1.25rem)",
            fontWeight: 400,
            fontStyle: "italic",
            color: "#e8d8aa",
            lineHeight: 1.7,
            marginBottom: "2.2rem",
            whiteSpace: "pre-line",
          }}>
            {q.question}
          </h2>

          {!isTextQ && (
            <div style={{ marginBottom: "2rem" }}>
              {q.options.map((opt) => (
                <button
                  key={opt}
                  className={`oracle-option ${selectedOption === opt ? "selected" : ""}`}
                  onClick={() => handleSelect(opt)}
                >
                  {opt}
                </button>
              ))}
              <button
                className={`oracle-option ${selectedOption === "기타" ? "selected" : ""}`}
                onClick={() => handleSelect("기타")}
              >
                기타
              </button>
              {showOther && (
                <input
                  type="text"
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  placeholder="직접 입력해주세요"
                  autoFocus
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(180,150,100,0.35)",
                    color: "#e8d8aa",
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "0.88rem",
                    fontWeight: 300,
                    padding: "0.6rem 0",
                    outline: "none",
                    marginTop: "0.5rem",
                    boxSizing: "border-box",
                  }}
                />
              )}
            </div>
          )}

          {isTextQ && (
            <textarea
              className="oracle-textarea"
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="떠오르는 대로 써주세요..."
            />
          )}

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "2rem",
          }}>
            <button className="back-link" onClick={handleBack}>← 이전</button>
            <button className="oracle-btn" onClick={handleNext} disabled={!canProceed}>
              {currentQ < ORACLE_QUESTIONS.length - 1 ? "다음" : "완성"}
            </button>
          </div>
        </div>
      )}

      {/* 문 앞 */}
      {phase === "door" && (
        <div style={{ width: "100%", maxWidth: 480, textAlign: "center" }}>
          <div className="greek" style={{ marginBottom: "4rem" }}>
            γνῶθι σεαυτόν
          </div>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1rem",
            fontStyle: "italic",
            color: "rgba(200,175,130,0.5)",
            marginBottom: "4rem",
            lineHeight: 1.9,
            animation: "flicker 4s ease-in-out infinite",
          }}>
            오라클이 당신의 답변을 읽고 있습니다
          </p>
          <button className="door-open-btn" onClick={openDoor}>
            문을 열다
          </button>
        </div>
      )}

      {/* 열리는 중 */}
      {phase === "opening" && (
        <div style={{ textAlign: "center" }}>
          <div className="greek" style={{ marginBottom: "2rem" }}>
            γνῶθι σεαυτόν
          </div>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1rem",
            fontStyle: "italic",
            color: "rgba(200,175,130,0.45)",
            animation: "breathe 2s ease-in-out infinite",
          }}>
            잠시 기다려주세요
          </p>
        </div>
      )}

      {/* 결과 */}
      {phase === "result" && (
        <div ref={resultRef} style={{ width: "100%", maxWidth: 580, paddingTop: "2rem" }}>

          {visibleSections.includes("Reflection") && parsed["Reflection"] && (
            <div className="oracle-appear" style={{ marginBottom: "3rem" }}>
              <div style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "0.92rem",
                fontWeight: 300,
                color: "rgba(200,175,130,0.65)",
                lineHeight: 2.2,
                whiteSpace: "pre-wrap",
              }}>
                {parsed["Reflection"]}
              </div>
            </div>
          )}

          {visibleSections.includes("Recognition") && parsed["Recognition"] && (
            <div className="oracle-appear" style={{ marginBottom: "3rem" }}>
              <div style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: "0.95rem",
                fontWeight: 300,
                color: "rgba(210,185,140,0.8)",
                lineHeight: 2.2,
                whiteSpace: "pre-wrap",
              }}>
                {parsed["Recognition"]}
              </div>
            </div>
          )}

          {visibleSections.includes("Oracle") && parsed["Oracle"] && (
            <div className="oracle-appear" style={{ marginBottom: "3rem" }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.15rem",
                fontStyle: "italic",
                fontWeight: 400,
                color: "#e8d8aa",
                lineHeight: 2.3,
                whiteSpace: "pre-wrap",
                paddingLeft: "1.5rem",
                borderLeft: "1px solid rgba(180,150,100,0.25)",
              }}>
                {parsed["Oracle"]}
              </div>
            </div>
          )}

          {visibleSections.includes("Story") && parsed["Story"] && (
            <div className="oracle-appear" style={{ marginBottom: "3rem" }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "0.95rem",
                fontStyle: "italic",
                fontWeight: 400,
                color: "rgba(210,185,140,0.7)",
                lineHeight: 2.3,
                whiteSpace: "pre-wrap",
              }}>
                {parsed["Story"]}
              </div>
            </div>
          )}

          {visibleSections.includes("Empowerment") && parsed["Empowerment"] && (
            <div className="oracle-appear" style={{ marginBottom: "4rem" }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.3rem",
                fontStyle: "italic",
                fontWeight: 400,
                color: "#f0e0b8",
                lineHeight: 1.9,
                whiteSpace: "pre-wrap",
              }}>
                {parsed["Empowerment"]}
              </div>
            </div>
          )}

          {visibleSections.length === 5 && (
            <div className="oracle-appear" style={{
              marginTop: "2rem",
              paddingTop: "2.5rem",
              borderTop: "1px solid rgba(180,150,100,0.1)",
            }}>
              <div className="greek" style={{ marginBottom: "2rem" }}>
                γνῶθι σεαυτόν
              </div>
              <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                <button className="oracle-btn" onClick={() => {
                  setPhase("intro");
                  setAnswers({});
                  setCurrentQ(0);
                  setOracleText("");
                  setVisibleSections([]);
                  setSelectedOption(null);
                  setTextAnswer("");
                }}>
                  다시 시작
                </button>
                <button className="back-link" onClick={onBack}>
                  ← 마음거울로
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
