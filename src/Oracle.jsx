import { useState, useEffect, useRef } from "react";

const ORACLE_QUESTIONS = [
  {
    id: 1,
    title: "남아있는 것",
    question: "이상하게 아직도 내 안에 남아 있는 것은 무엇인가요?",
    options: [
      "풀리지 않은 일",
      "지나간 기회",
      "잊히지 않는 사람",
      "다시 겪고 싶지 않은 순간",
      "닫히지 않은 가능성",
      "계속 따라오는 질문",
      "설명하기 어려운 감정",
    ],
  },
  {
    id: 2,
    title: "느낌",
    question: "그 기억은 내 안에서 어떤 느낌에 가까운가요?",
    options: [
      "아직 열지 못한 편지 같은",
      "오래된 상처 자국 같은",
      "자꾸 켜지는 알람 같은",
      "흐릿한데 지워지지 않는 사진 같은",
      "아직 닫히지 않은 탭 같은",
      "오래 품고 있던 돌 같은",
      "이름 붙이기 어려운 냄새 같은",
    ],
  },
  {
    id: 3,
    title: "반응",
    question: "그 기억이 떠오를 때 나는 보통 어떻게 반응하나요?",
    options: [
      "왜 그랬는지 다시 생각한다",
      "아쉬움이 올라온다",
      "피하고 싶어진다",
      "마음이 무거워진다",
      "다른 가능성을 상상한다",
      "그 일의 의미를 다시 묻는다",
      "그때의 감정이 다시 느껴진다",
    ],
  },
  {
    id: 4,
    title: "이유",
    question: "그 기억이 쉽게 지나가지 않는 이유는 무엇 때문일까요?",
    options: [
      "아직 이해가 안 되는 부분이 있어서",
      "내가 달랐다면 어땠을지 자꾸 생각해서",
      "그 사람이나 관계가 아직 마음에 남아서",
      "다시는 그런 일이 생기지 않길 바라서",
      "아직 끝나지 않은 것 같은 느낌이 있어서",
      "그 일이 나에게 중요한 무언가를 건드려서",
      "그때의 내가 아직도 선명해서",
    ],
  },
  {
    id: 5,
    title: "기억",
    question: "1번에서 떠올린 기억 하나를 골라 적어주세요.\n장면 하나, 사람 한 명, 말 한마디, 감정 하나만 적어도 충분해요.\n그 기억은 지금 내 안에 어떤 모습으로 남아 있나요?",
    type: "text",
  },
];

const ORACLE_SYSTEM_PROMPT = `당신은 마음거울의 분석가이다.

당신의 역할은 사용자를 진단하거나 평가하는 것이 아니다.
당신은 사용자의 답변 속에서 반복되는 패턴, 긴장, 갈망, 모순을 발견하고 그것을 비추어 주는 존재이다.

절대 하지 말 것:
- 사용자를 유형으로 규정하지 말 것
- 단정하지 말 것
- 마크다운 볼드(**텍스트**)를 절대 사용하지 말 것
- 교훈을 설교하지 말 것
- 조언을 남발하지 말 것

언어 원칙:
- 반드시 존댓말로 쓸 것. ~요, ~습니다 형식으로. 반말 절대 금지.
- 짧고 시적이고 여백이 있어야 한다
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

const VaseSVG = ({ flowersVisible = 0 }) => (
  <svg width="360" height="600" viewBox="-60 -280 280 480" style={{position:"absolute",right:"-10px",top:"50%",transform:"translateY(-50%)",opacity:0.12,pointerEvents:"none"}}>
    {flowersVisible >= 1 && <g>
      <line x1="70" y1="18" x2="-28" y2="-25" stroke="#F7F2E8" strokeWidth="1.2"/>
      <ellipse cx="-36" cy="-35" rx="7" ry="12" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <ellipse cx="-36" cy="-35" rx="7" ry="12" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(72 -36 -35)"/>
      <ellipse cx="-36" cy="-35" rx="7" ry="12" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(144 -36 -35)"/>
      <ellipse cx="-36" cy="-35" rx="7" ry="12" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(216 -36 -35)"/>
      <ellipse cx="-36" cy="-35" rx="7" ry="12" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(288 -36 -35)"/>
      <circle cx="-36" cy="-35" r="5" fill="none" stroke="#F7F2E8" strokeWidth="1.2"/>
    </g>}
    {flowersVisible >= 2 && <g>
      <line x1="90" y1="18" x2="188" y2="-25" stroke="#F7F2E8" strokeWidth="1.2"/>
      <ellipse cx="196" cy="-35" rx="5" ry="10" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <ellipse cx="196" cy="-35" rx="5" ry="10" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(45 196 -35)"/>
      <ellipse cx="196" cy="-35" rx="5" ry="10" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(90 196 -35)"/>
      <ellipse cx="196" cy="-35" rx="5" ry="10" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(135 196 -35)"/>
      <ellipse cx="196" cy="-35" rx="5" ry="10" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(180 196 -35)"/>
      <circle cx="196" cy="-35" r="4" fill="none" stroke="#F7F2E8" strokeWidth="1.2"/>
    </g>}
    {flowersVisible >= 3 && <g>
      <line x1="72" y1="18" x2="-10" y2="-65" stroke="#F7F2E8" strokeWidth="1.2"/>
      <ellipse cx="-18" cy="-77" rx="7" ry="12" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <ellipse cx="-18" cy="-77" rx="7" ry="12" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(90 -18 -77)"/>
      <ellipse cx="-18" cy="-77" rx="7" ry="12" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(180 -18 -77)"/>
      <ellipse cx="-18" cy="-77" rx="7" ry="12" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(270 -18 -77)"/>
      <circle cx="-18" cy="-77" r="5" fill="none" stroke="#F7F2E8" strokeWidth="1.2"/>
    </g>}
    {flowersVisible >= 4 && <g>
      <line x1="88" y1="18" x2="170" y2="-65" stroke="#F7F2E8" strokeWidth="1.2"/>
      <polygon points="178,-77 182,-68 191,-68 184,-62 187,-53 178,-58 169,-53 172,-62 165,-68 174,-68" fill="none" stroke="#F7F2E8" strokeWidth="1.2"/>
    </g>}
    {flowersVisible >= 5 && <g>
      <line x1="74" y1="18" x2="14" y2="-95" stroke="#F7F2E8" strokeWidth="1.2"/>
      <path d="M14,-95 Q4,-113 14,-123 Q24,-113 14,-95" fill="none" stroke="#F7F2E8" strokeWidth="1.2"/>
      <path d="M14,-95 Q0,-109 2,-123 Q10,-113 14,-95" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <path d="M14,-95 Q28,-109 26,-123 Q18,-113 14,-95" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
    </g>}
    <ellipse cx="80" cy="22" rx="20" ry="5" fill="none" stroke="#F7F2E8" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M60,22 Q56,38 52,52" fill="none" stroke="#F7F2E8" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M100,22 Q104,38 108,52" fill="none" stroke="#F7F2E8" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M52,52 Q30,70 28,110 Q26,148 32,170 Q38,188 50,196" fill="none" stroke="#F7F2E8" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M108,52 Q130,70 132,110 Q134,148 128,170 Q122,188 110,196" fill="none" stroke="#F7F2E8" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M50,196 Q80,204 110,196" fill="none" stroke="#F7F2E8" strokeWidth="1.8" strokeLinecap="round"/>
    <ellipse cx="80" cy="200" rx="32" ry="6" fill="none" stroke="#F7F2E8" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

function TodaySentence({ onSave }) {
  const [text, setText] = useState("");
  const handleSave = () => {
    if (!text.trim()) return;
    onSave(text.trim());
  };
  return (
    <div style={{ marginTop: "0.75rem" }}>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="오늘 여기서 발견한 것..." rows={2}
        style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(143,168,160,0.3)",color:"rgba(240,237,232,0.8)",fontFamily:"'Source Serif 4',serif",fontSize:"0.88rem",fontWeight:300,lineHeight:1.8,padding:"0.75rem 1rem",resize:"none",outline:"none"}}/>
      <button onClick={handleSave}
        style={{marginTop:"0.5rem",background:"none",border:"1px solid rgba(143,168,160,0.4)",color:"rgba(143,168,160,0.7)",fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",padding:"0.4rem 1.2rem",cursor:"pointer"}}>기록하기</button>
    </div>
  );
}

function OracleFeedback() {
  const [selected, setSelected] = useState(null);
  return (
    <div>
      {!selected && (
        <div style={{display:"flex",gap:"0.75rem",justifyContent:"center"}}>
          <button onClick={() => setSelected("yes")} style={{background:"none",border:"1px solid rgba(143,168,160,0.2)",fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",color:"rgba(143,168,160,0.5)",padding:"0.4rem 1rem",cursor:"pointer"}}>👍 맞아요</button>
          <button onClick={() => setSelected("no")} style={{background:"none",border:"1px solid rgba(143,168,160,0.2)",fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",color:"rgba(143,168,160,0.5)",padding:"0.4rem 1rem",cursor:"pointer"}}>👎 아닌 것 같아요</button>
          <button onClick={() => setSelected("unsure")} style={{background:"none",border:"1px solid rgba(143,168,160,0.2)",fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",color:"rgba(143,168,160,0.5)",padding:"0.4rem 1rem",cursor:"pointer"}}>🤔 잘 모르겠어요</button>
        </div>
      )}
      {selected === "yes" && <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",fontWeight:300,color:"rgba(143,168,160,0.4)"}}>감사해요.</p>}
      {selected === "unsure" && <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",fontWeight:300,color:"rgba(143,168,160,0.4)"}}>그 모르겠다는 느낌도 중요한 정보예요.</p>}
      {selected === "no" && (
        <div>
          <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.85rem",fontWeight:300,color:"rgba(143,168,160,0.55)",lineHeight:1.9,marginBottom:"0.75rem"}}>맞지 않는 부분이 있으신가요?<br/>당신이 느낀 것을 말씀해주세요.</p>
          <a href="https://forms.gle/1MK9PRZmTBpFsEPN8" target="_blank" rel="noopener noreferrer" style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",color:"rgba(143,168,160,0.5)",textDecoration:"underline",textUnderlineOffset:"3px"}}>피드백 남기기 →</a>
        </div>
      )}
    </div>
  );
}

export default function Oracle({ onBack, onComprehensive, initialPhase = "intro" }) {
  const [phase, setPhase] = useState(initialPhase);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [oracleText, setOracleText] = useState(() => localStorage.getItem("mindmirror_oracle") || "");
  const [visibleSections, setVisibleSections] = useState([]);
  const resultRef = useRef(null);

  useEffect(() => {
    // final phase로 시작할 때 기존 oracle 결과 파싱을 위해 섹션 즉시 표시
    if (initialPhase === "final") {
      setVisibleSections(["Reflection", "Recognition", "Oracle", "Story", "Empowerment"]);
    }
  }, [initialPhase]);

  useEffect(() => {
    if (phase !== "result" || !oracleText) return;
    setVisibleSections([]);
    const sections = ["Reflection", "Recognition", "Oracle", "Story", "Empowerment"];
    sections.forEach((s, i) => {
      setTimeout(() => {
        setVisibleSections(prev => [...prev, s]);
      }, i * 1800);
    });
  }, [phase, oracleText]);

  const q = ORACLE_QUESTIONS[currentQ];
  const isTextQ = q?.type === "text";
  const progress = (currentQ / ORACLE_QUESTIONS.length) * 100;
  const canProceed = isTextQ ? textAnswer.trim().length > 0 : selectedOption !== null;

  function handleNext() {
    if (!canProceed) return;
    const answer = isTextQ ? textAnswer : selectedOption;
    const newAnswers = { ...answers, [q.id]: { title: q.title, answer } };
    setAnswers(newAnswers);
    if (currentQ < ORACLE_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOption(null);
      setTextAnswer("");
    } else {
      setPhase("opening");
      callOracle(newAnswers);
    }
  }

  function handleBack() {
    if (currentQ === 0) {
      setPhase("intro");
    } else {
      const prevQ = ORACLE_QUESTIONS[currentQ - 1];
      const prevAnswer = answers[prevQ.id];
      if (prevAnswer) {
        if (prevQ.type === "text") setTextAnswer(prevAnswer.answer);
        else setSelectedOption(prevAnswer.answer);
      }
      setCurrentQ(currentQ - 1);
    }
  }

  async function callOracle(allAnswers) {
    const formatted = ORACLE_QUESTIONS.map(q => {
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
          system: ORACLE_SYSTEM_PROMPT,
          messages: [{ role: "user", content: `다음은 사용자의 응답입니다:\n\n${formatted}` }],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      localStorage.setItem("mindmirror_oracle", text);
      setOracleText(text);
      setPhase("result");
    } catch (e) {
      setOracleText("## Reflection\n마음거울이 잠시 침묵하고 있습니다.\n\n## Recognition\n다시 시도해주세요.\n\n## Oracle\n어쩌면 지금은 때가 아닐 수 있습니다.\n\n## Story\n문은 여전히 거기 있습니다.\n\n## Empowerment\n다시 문 앞에 서겠습니까?");
      setPhase("result");
    }
  }

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
  const bgColor = (phase === "result" || phase === "final") ? "#F7F2E8" : "#1F3A32";

  return (
    <div style={{minHeight:"100vh",background:bgColor,display:"flex",alignItems:"center",justifyContent:"center",padding:"3rem 1.5rem",position:"relative",overflow:"hidden",transition:"background 1s ease"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:wght@300;400&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes breathe { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.9; } }
        .oracle-appear { animation: fadeUp 1.8s ease forwards; opacity: 0; }
        .oracle-option {
          width: 100%; background: rgba(247,242,232,0.08);
          border: 1px solid rgba(247,242,232,0.2); color: rgba(247,242,232,0.8);
          font-family: 'Source Serif 4', serif; font-size: 0.87rem; font-weight: 300;
          text-align: left; padding: 0.85rem 1.1rem; cursor: pointer;
          transition: all 0.3s; margin-bottom: 0.45rem; line-height: 1.5;
        }
        .oracle-option:hover { background: rgba(247,242,232,0.15); border-color: rgba(247,242,232,0.4); color: #F7F2E8; }
        .oracle-option.selected { background: rgba(143,168,160,0.2); border-color: #8FA8A0; color: #F7F2E8; }
        .oracle-btn {
          background: rgba(143,168,160,0.15); border: 1px solid #8FA8A0; color: #8FA8A0;
          font-family: 'Source Serif 4', serif; font-size: 0.82rem; letter-spacing: 0.18em;
          text-transform: uppercase; cursor: pointer; padding: 1rem 2.5rem; transition: all 0.3s;
        }
        .oracle-btn:hover { background: rgba(143,168,160,0.25); }
        .oracle-btn:disabled { opacity: 0.2; cursor: default; }
        .oracle-btn-next {
          background: transparent; border: 1px solid rgba(247,242,232,0.4);
          color: rgba(247,242,232,0.75); font-family: 'Source Serif 4', serif;
          font-size: 0.72rem; letter-spacing: 0.22em; text-transform: uppercase;
          cursor: pointer; padding: 0.7rem 1.8rem; transition: all 0.3s;
        }
        .oracle-btn-next:hover { border-color: rgba(247,242,232,0.8); color: #F7F2E8; }
        .oracle-btn-next:disabled { opacity: 0.2; cursor: default; }
        .oracle-btn-result {
          background: transparent; border: 1px solid rgba(90,58,138,0.3);
          color: rgba(90,58,138,0.65); font-family: 'Source Serif 4', serif;
          font-size: 0.72rem; letter-spacing: 0.22em; text-transform: uppercase;
          cursor: pointer; padding: 0.7rem 1.8rem; transition: all 0.3s;
        }
        .oracle-btn-result:hover { border-color: rgba(90,58,138,0.7); color: #2a1a4a; }
        .back-link {
          background: transparent; border: none; color: rgba(247,242,232,0.35);
          font-family: 'Source Serif 4', serif; font-size: 0.7rem;
          letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; padding: 0;
        }
        .back-link:hover { color: rgba(247,242,232,0.7); }
        .back-link-result {
          background: transparent; border: none; color: rgba(90,58,138,0.3);
          font-family: 'Source Serif 4', serif; font-size: 0.7rem;
          letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; padding: 0;
        }
        .back-link-result:hover { color: rgba(90,58,138,0.65); }
        .oracle-textarea {
          width: 100%; background: transparent; border: none;
          border-bottom: 1px solid rgba(247,242,232,0.2); color: #F7F2E8;
          font-family: 'Source Serif 4', serif; font-size: 0.93rem; font-weight: 300;
          line-height: 1.95; padding: 0.5rem 0; resize: none; outline: none;
          min-height: 130px; caret-color: #F7F2E8; box-sizing: border-box;
        }
        .oracle-textarea::placeholder { color: rgba(247,242,232,0.2); }
      `}</style>

      {phase !== "result" && phase !== "final" && (
        <VaseSVG flowersVisible={phase === "questions" ? currentQ : phase === "opening" ? 5 : 0} />
      )}

      {/* 인트로 */}
      {phase === "intro" && (
        <div style={{width:"100%",maxWidth:520,position:"relative",zIndex:1}}>
          <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.6rem",letterSpacing:"0.3em",textTransform:"uppercase",color:"#8FA8A0",marginBottom:"1.5rem"}}>내 마음의 메모리</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.8rem,4vw,2.6rem)",fontWeight:400,fontStyle:"italic",color:"#F7F2E8",lineHeight:1.2,marginBottom:"2rem"}}>내 마음의 메모리</h1>
          <div style={{marginBottom:"1.5rem"}}>
            <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(247,242,232,0.75)",lineHeight:2.1,marginBottom:"0.75rem"}}>선택은 끝났는데도<br/>지워지지 않고 남아있는 것들이 있어요.</p>
            <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(247,242,232,0.75)",lineHeight:2.1,marginBottom:"0.75rem"}}>놓친 것, 남은 감정, 자꾸 떠오르는 장면.<br/>그게 당신이 중요하게 여기는 것을 보여줘요.</p>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:"0.95rem",fontStyle:"italic",color:"#8FA8A0",lineHeight:2}}>사람은 무엇을 선택했는지보다<br/>선택 후 무엇이 남는지에서 더 많이 드러나요.</p>
          </div>
          <div style={{background:"rgba(143,168,160,0.1)",borderLeft:"3px solid #8FA8A0",padding:"1.1rem 1.25rem",marginBottom:"2rem"}}>
            <div style={{fontFamily:"'Source Serif 4',serif",fontSize:".68rem",letterSpacing:".2em",textTransform:"uppercase",color:"#8FA8A0",marginBottom:".6rem"}}>시작 전에</div>
            <div style={{fontFamily:"'Source Serif 4',serif",fontSize:".82rem",fontWeight:300,color:"rgba(247,242,232,0.65)",lineHeight:1.85,display:"flex",alignItems:"flex-start",gap:".5rem"}}>
              <span style={{opacity:.5}}>—</span>맞고 틀린 답 없어요. 지금 나한테 가장 가까운 걸 고르면 돼요.
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:"1.2rem"}}>
            <button className="oracle-btn" onClick={() => setPhase("questions")}>시작하기</button>
            <button className="back-link" onClick={onBack}>← 마음거울로</button>
          </div>
        </div>
      )}

      {/* 질문 */}
      {phase === "questions" && q && (
        <div style={{width:"100%",maxWidth:540,position:"relative",zIndex:1}}>
          <div style={{width:"100%",height:"1px",background:"rgba(247,242,232,0.1)",marginBottom:"3.5rem"}}>
            <div style={{height:"100%",width:`${progress}%`,background:"rgba(247,242,232,0.35)",transition:"width 0.6s ease"}}/>
          </div>
          <div style={{fontSize:"0.58rem",letterSpacing:"0.28em",textTransform:"uppercase",color:"rgba(247,242,232,0.35)",marginBottom:"0.6rem",fontFamily:"'Source Serif 4',serif"}}>
            {currentQ + 1} / {ORACLE_QUESTIONS.length} — {q.title}
          </div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1rem,2.8vw,1.25rem)",fontWeight:400,fontStyle:"italic",color:"#F7F2E8",lineHeight:1.7,marginBottom:"2.2rem",whiteSpace:"pre-line"}}>
            {q.question}
          </h2>
          {!isTextQ && (
            <div style={{marginBottom:"2rem"}}>
              {q.options.map(opt => (
                <button key={opt} className={`oracle-option ${selectedOption === opt ? "selected" : ""}`} onClick={() => setSelectedOption(opt)}>
                  {opt}
                </button>
              ))}
            </div>
          )}
          {isTextQ && (
            <textarea className="oracle-textarea" value={textAnswer} onChange={e => setTextAnswer(e.target.value)} placeholder="떠오르는 대로 써주세요..."/>
          )}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"2rem"}}>
            <button className="back-link" onClick={handleBack}>← 이전</button>
            <button className="oracle-btn-next" onClick={handleNext} disabled={!canProceed}>
              {currentQ < ORACLE_QUESTIONS.length - 1 ? "다음" : "완성"}
            </button>
          </div>
        </div>
      )}

      {/* 열리는 중 */}
      {phase === "opening" && (
        <div style={{textAlign:"center",position:"relative",zIndex:1}}>
          <p style={{fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontStyle:"italic",color:"rgba(247,242,232,0.4)",animation:"breathe 2s ease-in-out infinite"}}>
            잠시 기다려주세요
          </p>
        </div>
      )}

      {/* 결과 */}
      {phase === "result" && (
        <div ref={resultRef} style={{width:"100%",maxWidth:680,paddingTop:"2rem"}}>
          {visibleSections.includes("Reflection") && parsed["Reflection"] && (
            <div className="oracle-appear" style={{marginBottom:"2.5rem"}}>
              <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.62rem",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(90,58,138,0.45)",marginBottom:"0.4rem"}}>당신의 말</div>
              <div style={{width:"100%",height:"1px",background:"rgba(90,58,138,0.15)",marginBottom:"1rem"}}/>
              <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(42,26,74,0.7)",lineHeight:2.2,whiteSpace:"pre-wrap"}}>{parsed["Reflection"]}</div>
            </div>
          )}
          {visibleSections.includes("Recognition") && parsed["Recognition"] && (
            <div className="oracle-appear" style={{marginBottom:"2.5rem"}}>
              <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.62rem",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(90,58,138,0.45)",marginBottom:"0.4rem"}}>마음거울이 본 것</div>
              <div style={{width:"100%",height:"1px",background:"rgba(90,58,138,0.15)",marginBottom:"1rem"}}/>
              <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(42,26,74,0.7)",lineHeight:2.2,whiteSpace:"pre-wrap"}}>{parsed["Recognition"]}</div>
            </div>
          )}
          {visibleSections.includes("Oracle") && parsed["Oracle"] && (
            <div className="oracle-appear" style={{marginBottom:"2.5rem"}}>
              <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.62rem",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(90,58,138,0.45)",marginBottom:"0.4rem"}}>마음거울의 가설</div>
              <div style={{width:"100%",height:"1px",background:"rgba(90,58,138,0.15)",marginBottom:"1rem"}}/>
              <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(42,26,74,0.7)",lineHeight:2.2,whiteSpace:"pre-wrap"}}>{parsed["Oracle"]}</div>
            </div>
          )}
          {visibleSections.includes("Story") && parsed["Story"] && (
            <div className="oracle-appear" style={{marginBottom:"2.5rem"}}>
              <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.62rem",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(90,58,138,0.45)",marginBottom:"0.4rem"}}>마음거울의 제안</div>
              <div style={{width:"100%",height:"1px",background:"rgba(90,58,138,0.15)",marginBottom:"1rem"}}/>
              <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,fontStyle:"italic",color:"rgba(42,26,74,0.7)",lineHeight:2.2,whiteSpace:"pre-wrap"}}>{parsed["Story"]}</div>
            </div>
          )}
          {visibleSections.includes("Empowerment") && parsed["Empowerment"] && (
            <div className="oracle-appear" style={{marginBottom:"3rem"}}>
              <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.62rem",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(90,58,138,0.45)",marginBottom:"0.4rem"}}>문을 나서기 전에</div>
              <div style={{width:"100%",height:"1px",background:"rgba(90,58,138,0.15)",marginBottom:"1rem"}}/>
              <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(42,26,74,0.7)",lineHeight:2.2,whiteSpace:"pre-wrap"}}>{parsed["Empowerment"]}</div>
            </div>
          )}
          {visibleSections.length === 5 && (
            <div className="oracle-appear" style={{marginTop:"2rem",paddingTop:"2rem",borderTop:"1px solid rgba(90,58,138,0.1)"}}>
              <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
                <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",fontWeight:300,color:"rgba(90,58,138,0.4)",marginBottom:"1rem"}}>이 분석이 당신에게 맞나요?</p>
                <OracleFeedback />
              </div>
              <div style={{display:"flex",gap:"1.5rem",alignItems:"center",flexWrap:"wrap"}}>
                <button className="oracle-btn-result" onClick={onComprehensive}>종합 분석 보기 →</button>
                <button className="oracle-btn-result" onClick={() => setPhase("final")}>마지막 장으로 →</button>
                <button className="oracle-btn-result" onClick={() => {
                  const text = `${parsed["Reflection"]}\n\n${parsed["Recognition"]}\n\n${parsed["Oracle"]}\n\n${parsed["Story"]}\n\n${parsed["Empowerment"]}`;
                  navigator.clipboard.writeText(text);
                  alert("복사되었습니다");
                }}>결과 복사</button>
                <button className="back-link-result" onClick={onBack}>← 마음거울로</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 마지막 장 */}
      {phase === "final" && (() => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const savedSentence = localStorage.getItem("oracle_today_sentence");
        return (
          <div style={{width:"100%",maxWidth:580,paddingTop:"2rem",paddingBottom:"4rem"}}>
            <div style={{position:"relative",padding:"3rem 2.5rem",border:"4px solid #B89A5E",boxShadow:"inset 0 0 0 8px #1F3A32, inset 0 0 0 10px rgba(184,154,94,0.2)"}}>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",fontStyle:"italic",color:"#B89A5E",lineHeight:1.8,marginBottom:"2rem"}}>너 자신을 알라.</p>
              <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(240,237,232,0.75)",lineHeight:2,marginBottom:"2rem"}}>당신은 자신을 보았습니다. 쉽지 않은 일이에요.</p>
              <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(240,237,232,0.75)",lineHeight:2,marginBottom:"2rem"}}>이 결과는 당신이 누구인지를 정의하지 않습니다. 마음거울이 본 것은 당신이 반복적으로 선택해온 방식, 세상을 해석해온 습관, 무의식적으로 돌아가기 쉬운 길입니다. 그것은 당신의 전부가 아니라, 오늘 드러난 당신의 한 부분입니다.</p>
              <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(240,237,232,0.75)",lineHeight:2,marginBottom:"2rem"}}>언젠가 다시 돌아오세요. 오늘 당신이 했던 말과, 그때 당신이 할 말은 달라져 있을 것입니다.</p>
              <div>
                <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(240,237,232,0.75)",lineHeight:2,marginBottom:"1rem"}}>오늘 여기서 하나만 가져간다면 — 무엇인가요?</p>
                {!savedSentence ? (
                  <TodaySentence onSave={(sentence) => {
                    const data = { sentence, date: `${month}월 ${day}일`, timestamp: Date.now() };
                    localStorage.setItem("oracle_today_sentence", JSON.stringify(data));
                    window.location.reload();
                  }} />
                ) : (
                  <div style={{marginTop:"1rem"}}>
                    <p style={{fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",fontStyle:"italic",color:"#c9a84c",lineHeight:1.9}}>"{JSON.parse(savedSentence).sentence}"</p>
                    <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.75rem",color:"rgba(240,237,232,0.3)",marginTop:"0.5rem"}}>{JSON.parse(savedSentence).date} 기록</p>
                  </div>
                )}
              </div>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:"0.95rem",fontStyle:"italic",color:"rgba(240,237,232,0.5)",lineHeight:1.9,marginTop:"2rem",marginBottom:"2rem"}}>오늘의 당신을 기억하세요.</p>
              <div style={{paddingTop:"1.5rem",borderTop:"1px solid rgba(184,154,94,0.15)"}}>
                <a href="https://forms.gle/A6xXdAVUQoaNqaEWA" target="_blank" rel="noopener noreferrer" style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",color:"rgba(184,154,94,0.55)",textDecoration:"underline",textUnderlineOffset:"3px"}}>피드백 남기기 →</a>
              </div>
            </div>
            <div style={{marginTop:"3rem",display:"flex",gap:"1.5rem",alignItems:"center",flexWrap:"wrap"}}>
              <button className="oracle-btn-result" style={{borderColor:"rgba(240,237,232,0.4)",color:"rgba(240,237,232,0.7)"}} onClick={() => {
                setPhase("intro"); setAnswers({}); setCurrentQ(0);
                setOracleText(""); setVisibleSections([]); setSelectedOption(null); setTextAnswer("");
              }}>마음거울로</button>
              <button className="oracle-btn-result" style={{borderColor:"rgba(240,237,232,0.4)",color:"rgba(240,237,232,0.7)"}} onClick={() => {
                const saved = localStorage.getItem("oracle_today_sentence");
                const sentencePart = saved ? `\n\n오늘의 한 문장: "${JSON.parse(saved).sentence}"` : "";
                const text = `${parsed["Reflection"]}\n\n${parsed["Recognition"]}\n\n${parsed["Oracle"]}\n\n${parsed["Story"]}\n\n${parsed["Empowerment"]}${sentencePart}`;
                navigator.clipboard.writeText(text);
                alert("복사되었습니다");
              }}>결과 복사</button>
              <button className="back-link-result" style={{color:"rgba(240,237,232,0.35)"}} onClick={onBack}>← 마음거울로</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
