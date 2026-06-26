import { useState, useEffect, useRef } from "react";

const MEMORY_INTRO = `지금 일어난 일을 있는 그대로 보는 것 같지만,

때로는 오래된 기억을 통과한 현재를 보고 있을 때가 있어요.

그 기억 안에는 사건만 있는 게 아니에요.

그때 느낀 감정, 그때 내린 해석, 그때 몸이 기억한 것들이 함께 저장되어 있어요.

이 질문지는 지금 내 반응 안에서 다시 켜지고 있는 것들을 조용히 살펴보기 위한 거예요.

정답은 없어요.

떠오르는 대로 답해주세요.`;

const MEMORY_QUESTIONS = [
  {
    id: 1,
    type: "single",
    title: "흔들린 순간",
    question: "최근 내 마음이 흔들렸던 순간이 있었나요. 어떤 상황이었나요?",
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
    question: "그때 느낀 감정은 상황에 자연스러운가요, 아니면 조금 과도하게 느껴졌나요?",
    options: [
      "자연스러웠다",
      "조금 과도했다",
      "많이 과도했다",
      "잘 모르겠다",
    ],
  },
  {
    id: 4,
    type: "single_with_input",
    title: "내면의 말",
    question: "그 순간 내 안에서 떠오른 말은 무엇에 가까운가요?",
    options: [
      "나는 또 부족한 사람이다",
      "상대가 나를 가볍게 보고 있다",
      "나는 버려지고 있다",
      "실수하면 큰일 난다",
      "내가 먼저 맞춰야 한다",
      "아무도 내 마음을 몰라준다",
      "빨리 해결해야 한다",
      "그냥 참아야 한다",
      "직접 입력",
    ],
  },
  {
    id: 5,
    type: "multi_with_input",
    title: "몸의 반응",
    question: "그 순간 나는 어떻게 반응했나요?",
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
    question: "비슷한 상황에서 나는 주로 어떻게 하나요?",
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
    question: "이 반응은 처음인가요, 아니면 익숙한 반응인가요?",
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
    question: "이 반응은 어떤 관계에서 자주 나타나나요?",
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
    question: "지금 내 안에 있는 판단은 어떤 건가요?",
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
    question: "지금까지 답하면서 나에 대해 새롭게 보이거나 발견한 것이 있나요?",
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
  return (
    <div style={{ marginTop: "0.75rem" }}>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="오늘 여기서 발견한 것..." rows={2}
        style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(143,168,160,0.3)",color:"rgba(240,237,232,0.8)",fontFamily:"'Source Serif 4',serif",fontSize:"0.88rem",fontWeight:300,lineHeight:1.8,padding:"0.75rem 1rem",resize:"none",outline:"none"}}/>
      <button onClick={() => { if (text.trim()) onSave(text.trim()); }}
        style={{marginTop:"0.5rem",background:"none",border:"1px solid rgba(143,168,160,0.4)",color:"rgba(143,168,160,0.7)",fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",padding:"0.4rem 1.2rem",cursor:"pointer"}}>기록하기</button>
    </div>
  );
}

function MemoryFeedback() {
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
  const [showIntro, setShowIntro] = useState(true); // 안내문 표시 여부
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]); // 다중선택용
  const [customInput, setCustomInput] = useState(""); // 직접입력용
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
  const lastOption = q?.options?.[q.options.length - 1] === "직접 입력";
  const directSelected = selectedOptions.includes("직접 입력") || (hasDirect && !isMulti && answers[currentQ]?.raw === "직접 입력");

  const progress = (currentQ / MEMORY_QUESTIONS.length) * 100;

  const canProceed = (() => {
    if (isText) return textAnswer.trim().length > 0;
    if (isMulti) {
      if (selectedOptions.length === 0) return false;
      if (selectedOptions.includes("직접 입력") && !customInput.trim()) return false;
      return true;
    }
    // single / single_with_input
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
    if (opt !== "직접 입력") setCustomInput("");
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
      setShowIntro(true);
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
  const bgColor = (phase === "result" || phase === "final") ? "#F7F2E8" : "#1F3A32";

  return (
    <div style={{minHeight:"100vh",background:bgColor,display:"flex",alignItems:"center",justifyContent:"center",padding:"3rem 1.5rem",position:"relative",overflow:"hidden",transition:"background 1s ease"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:wght@300;400&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes breathe { 0%,100%{opacity:0.35;} 50%{opacity:0.9;} }
        .mem-appear { animation: fadeUp 1.6s ease forwards; opacity:0; }
        .mem-option {
          width:100%; background:rgba(247,242,232,0.08);
          border:1px solid rgba(247,242,232,0.2); color:rgba(247,242,232,0.8);
          font-family:'Source Serif 4',serif; font-size:0.87rem; font-weight:300;
          text-align:left; padding:0.85rem 1.1rem; cursor:pointer;
          transition:all 0.3s; margin-bottom:0.4rem; line-height:1.5;
        }
        .mem-option:hover { background:rgba(247,242,232,0.15); border-color:rgba(247,242,232,0.4); color:#F7F2E8; }
        .mem-option.selected { background:rgba(46,106,94,0.25); border-color:#2E6A5E; color:#F7F2E8; }
        .mem-btn {
          background:rgba(46,106,94,0.15); border:1px solid #2E6A5E; color:#8FA8A0;
          font-family:'Source Serif 4',serif; font-size:0.82rem; letter-spacing:0.18em;
          text-transform:uppercase; cursor:pointer; padding:1rem 2.5rem; transition:all 0.3s;
        }
        .mem-btn:hover { background:rgba(46,106,94,0.25); }
        .mem-btn-next {
          background:transparent; border:1px solid rgba(247,242,232,0.4);
          color:rgba(247,242,232,0.75); font-family:'Source Serif 4',serif;
          font-size:0.72rem; letter-spacing:0.22em; text-transform:uppercase;
          cursor:pointer; padding:0.7rem 1.8rem; transition:all 0.3s;
        }
        .mem-btn-next:hover { border-color:rgba(247,242,232,0.8); color:#F7F2E8; }
        .mem-btn-next:disabled { opacity:0.2; cursor:default; }
        .mem-btn-result {
          background:transparent; border:1px solid rgba(46,106,94,0.35);
          color:rgba(26,46,40,0.7); font-family:'Source Serif 4',serif;
          font-size:0.72rem; letter-spacing:0.22em; text-transform:uppercase;
          cursor:pointer; padding:0.7rem 1.8rem; transition:all 0.3s;
        }
        .mem-btn-result:hover { border-color:rgba(46,106,94,0.7); color:#1A2E28; }
        .back-link {
          background:transparent; border:none; color:rgba(247,242,232,0.35);
          font-family:'Source Serif 4',serif; font-size:0.7rem;
          letter-spacing:0.2em; text-transform:uppercase; cursor:pointer; padding:0;
        }
        .back-link:hover { color:rgba(247,242,232,0.7); }
        .back-link-result {
          background:transparent; border:none; color:rgba(46,106,94,0.4);
          font-family:'Source Serif 4',serif; font-size:0.7rem;
          letter-spacing:0.2em; text-transform:uppercase; cursor:pointer; padding:0;
        }
        .back-link-result:hover { color:rgba(46,106,94,0.75); }
        .mem-textarea {
          width:100%; background:transparent; border:none;
          border-bottom:1px solid rgba(247,242,232,0.2); color:#F7F2E8;
          font-family:'Source Serif 4',serif; font-size:0.93rem; font-weight:300;
          line-height:1.95; padding:0.5rem 0; resize:none; outline:none;
          min-height:130px; caret-color:#F7F2E8; box-sizing:border-box;
        }
        .mem-textarea::placeholder { color:rgba(247,242,232,0.2); }
        .mem-custom-input {
          width:100%; background:transparent; border:none;
          border-bottom:1px solid rgba(247,242,232,0.2); color:#F7F2E8;
          font-family:'Source Serif 4',serif; font-size:0.88rem; font-weight:300;
          padding:0.5rem 0; outline:none; margin-top:0.75rem;
        }
        .mem-custom-input::placeholder { color:rgba(247,242,232,0.2); }
      `}</style>

      {phase !== "result" && phase !== "final" && (
        <VaseSVG flowersVisible={phase === "questions" ? Math.floor(currentQ / 2) : phase === "opening" ? 5 : 0} />
      )}

      {/* 인트로 */}
      {phase === "intro" && (
        <div style={{width:"100%",maxWidth:520,position:"relative",zIndex:1}}>
          <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.6rem",letterSpacing:"0.3em",textTransform:"uppercase",color:"#8FA8A0",marginBottom:"1.5rem"}}>내 마음의 메모리</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.8rem,4vw,2.6rem)",fontWeight:400,fontStyle:"italic",color:"#F7F2E8",lineHeight:1.2,marginBottom:"2rem"}}>내 마음의 메모리</h1>
          <div style={{marginBottom:"1.5rem"}}>
            <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(247,242,232,0.75)",lineHeight:2.1,marginBottom:"0.75rem"}}>우리가 반응하는 방식은 어느 날 갑자기 생긴 게 아니에요.</p>
            <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(247,242,232,0.75)",lineHeight:2.1}}>어떤 기억들이 지금의 나를 만들었는지 천천히 확인해봐요.</p>
          </div>
          <div style={{background:"rgba(46,106,94,0.12)",borderLeft:"3px solid #2E6A5E",padding:"1.1rem 1.25rem",marginBottom:"2rem"}}>
            <div style={{fontFamily:"'Source Serif 4',serif",fontSize:".68rem",letterSpacing:".2em",textTransform:"uppercase",color:"#8FA8A0",marginBottom:".6rem"}}>시작 전에</div>
            <div style={{fontFamily:"'Source Serif 4',serif",fontSize:".82rem",fontWeight:300,color:"rgba(247,242,232,0.65)",lineHeight:1.85,whiteSpace:"pre-line"}}>{MEMORY_INTRO}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:"1.2rem"}}>
            <button className="mem-btn" onClick={() => setPhase("questions")}>시작하기</button>
            <button className="back-link" onClick={onBack}>← 마음거울로</button>
          </div>
        </div>
      )}

      {/* 질문 */}
      {phase === "questions" && q && (
        <div style={{width:"100%",maxWidth:540,position:"relative",zIndex:1}}>
          <div style={{width:"100%",height:"1px",background:"rgba(247,242,232,0.1)",marginBottom:"3.5rem"}}>
            <div style={{height:"100%",width:`${progress}%`,background:"rgba(46,106,94,0.5)",transition:"width 0.6s ease"}}/>
          </div>
          <div style={{fontSize:"0.58rem",letterSpacing:"0.28em",textTransform:"uppercase",color:"rgba(247,242,232,0.35)",marginBottom:"0.6rem",fontFamily:"'Source Serif 4',serif"}}>
            {currentQ + 1} / {MEMORY_QUESTIONS.length} — {q.title}
          </div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1rem,2.8vw,1.2rem)",fontWeight:400,fontStyle:"italic",color:"#F7F2E8",lineHeight:1.7,marginBottom:"2rem",whiteSpace:"pre-line"}}>
            {q.question}
          </h2>

          {isText && (
            <textarea className="mem-textarea" value={textAnswer} onChange={e => setTextAnswer(e.target.value)} placeholder="떠오르는 대로 써주세요..."/>
          )}

          {!isText && (
            <div style={{marginBottom:"1rem"}}>
              {q.options.map(opt => {
                const isSelected = isMulti
                  ? selectedOptions.includes(opt)
                  : answers[currentQ]?.raw === opt;
                return (
                  <button key={opt} className={`mem-option ${isSelected ? "selected" : ""}`}
                    onClick={() => isMulti ? toggleMulti(opt) : selectSingle(opt)}>
                    {isMulti && <span style={{marginRight:"0.5rem",opacity:0.5}}>{isSelected ? "✓" : "○"}</span>}
                    {opt}
                  </button>
                );
              })}
              {hasDirect && (
                (isMulti ? selectedOptions.includes("직접 입력") : answers[currentQ]?.raw === "직접 입력")
              ) && (
                <input className="mem-custom-input" value={customInput} onChange={e => setCustomInput(e.target.value)} placeholder="직접 입력해주세요..."/>
              )}
            </div>
          )}

          {isMulti && (
            <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.72rem",color:"rgba(247,242,232,0.3)",marginBottom:"1rem"}}>해당되는 것 모두 선택하세요</div>
          )}

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"2rem"}}>
            <button className="back-link" onClick={handleBack}>← 이전</button>
            <button className="mem-btn-next" onClick={handleNext} disabled={!canProceed}>
              {currentQ < MEMORY_QUESTIONS.length - 1 ? "다음" : "완성"}
            </button>
          </div>
        </div>
      )}

      {/* 분석 중 */}
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
          <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.6rem",letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(46,106,94,0.5)",marginBottom:"0.5rem"}}>내 마음의 메모리 — 분석 결과</div>
          <div style={{width:"100%",height:"1px",background:"rgba(46,106,94,0.2)",marginBottom:"2rem"}}/>

          {sectionOrder.map((key, i) => visibleSections.includes(key) && parsed[key] && (
            <div key={key} className="mem-appear" style={{marginBottom:"2.5rem",animationDelay:`${i * 0.3}s`}}>
              <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.62rem",letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(46,106,94,0.55)",marginBottom:"0.4rem"}}>{key}</div>
              <div style={{width:"100%",height:"1px",background:"rgba(46,106,94,0.15)",marginBottom:"1rem"}}/>
              <div style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.93rem",fontWeight:300,color:"rgba(26,46,40,0.75)",lineHeight:2.2,whiteSpace:"pre-wrap"}}>{parsed[key]}</div>
            </div>
          ))}

          {visibleSections.length === 4 && (
            <div className="mem-appear" style={{marginTop:"2rem",paddingTop:"2rem",borderTop:"1px solid rgba(46,106,94,0.1)"}}>
              <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
                <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",fontWeight:300,color:"rgba(46,106,94,0.5)",marginBottom:"1rem"}}>읽으면서 가장 크게 울린 부분이 있다면?</p>
                <MemoryFeedback />
              </div>
              <div style={{display:"flex",gap:"1.5rem",alignItems:"center",flexWrap:"wrap"}}>
                <button className="mem-btn-result" onClick={onComprehensive}>종합 분석 보기 →</button>
                <button className="mem-btn-result" onClick={() => setPhase("final")}>마지막 장으로 →</button>
                <button className="mem-btn-result" onClick={() => {
                  const text = sectionOrder.map(k => parsed[k] ? `${k}\n${parsed[k]}` : "").filter(Boolean).join("\n\n");
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
                    const data = { sentence, date: `${today.getMonth()+1}월 ${today.getDate()}일`, timestamp: Date.now() };
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
              <button className="mem-btn-result" style={{borderColor:"rgba(240,237,232,0.3)",color:"rgba(240,237,232,0.6)"}} onClick={() => {
                const saved = localStorage.getItem("oracle_today_sentence");
                const sentencePart = saved ? `\n\n오늘의 한 문장: "${JSON.parse(saved).sentence}"` : "";
                const text = sectionOrder.map(k => parsed[k] ? `${k}\n${parsed[k]}` : "").filter(Boolean).join("\n\n") + sentencePart;
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
