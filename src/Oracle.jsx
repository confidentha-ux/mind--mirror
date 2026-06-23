import { useState, useEffect, useRef } from "react";

const ORACLE_QUESTIONS = [
  {
    id: 1,
    title: "선택 후",
    question: "선택을 끝낸 뒤, 나는 주로 무엇을 다시 생각하는가?",
    options: [
      "내가 놓친 정보가 있었는지",
      "더 빨리 움직였어야 했는지",
      "상대가 어떻게 받아들였을지",
      "위험한 선택은 아니었는지",
      "다른 가능성을 닫아버린 건 아닌지",
      "이 선택이 내 삶의 방향과 맞는지",
      "내가 왜 이렇게 불편한지",
    ],
  },
  {
    id: 2,
    title: "불편함",
    question: "결정한 뒤에도 마음이 편하지 않을 때, 나는 보통 무엇을 의심하는가?",
    options: [
      "내 판단이 충분히 정확했는가",
      "내가 너무 늦게 행동했는가",
      "누군가를 실망시킨 것은 아닌가",
      "손해나 문제가 생기지는 않을까",
      "더 좋은 길이 있었던 것은 아닐까",
      "이게 정말 내가 원하는 길인가",
      "내 감정이 나에게 무엇을 말하고 있는가",
    ],
  },
  {
    id: 3,
    title: "자기변명",
    question: "내가 자주 하는 자기변명은 무엇인가?",
    options: [
      "\"더 알아보고 결정하려고 했을 뿐이야.\"",
      "\"일단 해봐야 알잖아.\"",
      "\"사람 마음을 생각하지 않을 수 없잖아.\"",
      "\"조심해서 나쁠 건 없잖아.\"",
      "\"가능성을 열어두는 게 중요하잖아.\"",
      "\"의미 없는 일은 하고 싶지 않았어.\"",
      "\"그때 내 마음이 너무 힘들었어.\"",
    ],
  },
  {
    id: 4,
    title: "감정",
    question: "선택 후에 내가 가장 자주 느끼는 감정은?",
    options: [
      "찜찜함 — 더 정확히 알았어야 했다는 느낌",
      "답답함 — 더 빨리 했어야 했다는 느낌",
      "미안함 — 누군가에게 영향을 준 것 같다는 느낌",
      "불안함 — 문제가 생길 것 같다는 느낌",
      "아쉬움 — 다른 가능성을 놓친 것 같다는 느낌",
      "허무함 — 이게 무슨 의미인지 모르겠다는 느낌",
      "피로감 — 감정적으로 너무 많이 소모됐다는 느낌",
    ],
  },
  {
    id: 5,
    title: "혼잣말",
    question: "일이 끝난 뒤, 내가 가장 자주 하는 말은?",
    options: [
      "\"분석을 더 했어야 했어.\"",
      "\"그냥 바로 했어야 했어.\"",
      "\"그 사람 입장을 더 생각했어야 했어.\"",
      "\"처음부터 위험했어.\"",
      "\"다른 방법도 있었을 텐데.\"",
      "\"이게 나에게 맞는 일이었나?\"",
      "\"내가 왜 이렇게 힘들었지?\"",
    ],
  },
  {
    id: 6,
    title: "붙잡힘",
    question: "나를 가장 오래 붙잡는 것은 무엇인가?",
    options: [
      "이해되지 않는 원인",
      "하지 못한 행동",
      "어긋난 관계",
      "예상하지 못한 위험",
      "사라진 가능성",
      "잃어버린 의미",
      "정리되지 않은 감정",
    ],
  },
  {
    id: 7,
    title: "바꾸고 싶은 것",
    question: "같은 상황이 다시 온다면, 나는 무엇을 바꾸고 싶은가?",
    options: [
      "더 정확한 기준을 세우고 싶다",
      "더 빨리 움직이고 싶다",
      "내 선택과 타인의 반응을 분리하고 싶다",
      "위험을 보되 멈추지는 않고 싶다",
      "가능성을 보되 하나는 선택하고 싶다",
      "의미를 찾되 실행도 하고 싶다",
      "감정을 느끼되 감정에 끌려가지는 않고 싶다",
    ],
  },
  {
    id: 8,
    title: "반복 장면",
    question: "당신의 삶이 영화라면, 반복되는 장면은?",
    type: "text",
  },
  {
    id: 9,
    title: "문",
    question: "지금 당신 앞에 오래전부터 서 있었던 문이 하나 있다면,\n그 너머에는?",
    type: "text",
  },
];

const ORACLE_SYSTEM_PROMPT = `당신은 마음거울의 분석가이다.

당신의 역할은 사용자를 진단하거나 평가하는 것이 아니다.
당신은 사용자의 답변 속에서 반복되는 패턴, 긴장, 갈망, 모순을 발견하고 그것을 비추어 주는 존재이다.
당신은 심리학자도, 상담사도, 점쟁이도 아니다.
당신은 사용자가 스스로 자기 삶의 저자가 되도록 돕는 거울이다.

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
  <svg
    width="360"
    height="600"
    viewBox="-60 -280 280 480"
    style={{
      position: "absolute",
      right: "-10px",
      top: "50%",
      transform: "translateY(-50%)",
      opacity: 0.12,
      pointerEvents: "none",
    }}
  >
    {flowersVisible >= 1 && <g style={{transition:"opacity 0.6s ease"}}>
      <line x1="70" y1="18" x2="-28" y2="-25" stroke="#F7F2E8" strokeWidth="1.2"/>
      <path d="M25,-4 Q12,-14 14,0" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <ellipse cx="-36" cy="-35" rx="7" ry="12" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <ellipse cx="-36" cy="-35" rx="7" ry="12" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(72 -36 -35)"/>
      <ellipse cx="-36" cy="-35" rx="7" ry="12" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(144 -36 -35)"/>
      <ellipse cx="-36" cy="-35" rx="7" ry="12" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(216 -36 -35)"/>
      <ellipse cx="-36" cy="-35" rx="7" ry="12" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(288 -36 -35)"/>
      <circle cx="-36" cy="-35" r="5" fill="none" stroke="#F7F2E8" strokeWidth="1.2"/>
    </g>}
    {flowersVisible >= 2 && <g>
      <line x1="90" y1="18" x2="188" y2="-25" stroke="#F7F2E8" strokeWidth="1.2"/>
      <path d="M135,-4 Q148,-14 146,0" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <ellipse cx="196" cy="-35" rx="5" ry="10" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <ellipse cx="196" cy="-35" rx="5" ry="10" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(45 196 -35)"/>
      <ellipse cx="196" cy="-35" rx="5" ry="10" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(90 196 -35)"/>
      <ellipse cx="196" cy="-35" rx="5" ry="10" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(135 196 -35)"/>
      <ellipse cx="196" cy="-35" rx="5" ry="10" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(180 196 -35)"/>
      <ellipse cx="196" cy="-35" rx="5" ry="10" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(225 196 -35)"/>
      <ellipse cx="196" cy="-35" rx="5" ry="10" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(270 196 -35)"/>
      <ellipse cx="196" cy="-35" rx="5" ry="10" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(315 196 -35)"/>
      <circle cx="196" cy="-35" r="4" fill="none" stroke="#F7F2E8" strokeWidth="1.2"/>
    </g>}
    {flowersVisible >= 3 && <g>
      <line x1="72" y1="18" x2="-10" y2="-65" stroke="#F7F2E8" strokeWidth="1.2"/>
      <path d="M38,-18 Q22,-28 24,-12" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <ellipse cx="-18" cy="-77" rx="7" ry="12" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <ellipse cx="-18" cy="-77" rx="7" ry="12" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(90 -18 -77)"/>
      <ellipse cx="-18" cy="-77" rx="7" ry="12" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(180 -18 -77)"/>
      <ellipse cx="-18" cy="-77" rx="7" ry="12" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(270 -18 -77)"/>
      <circle cx="-18" cy="-77" r="5" fill="none" stroke="#F7F2E8" strokeWidth="1.2"/>
    </g>}
    {flowersVisible >= 4 && <g>
      <line x1="88" y1="18" x2="170" y2="-65" stroke="#F7F2E8" strokeWidth="1.2"/>
      <path d="M122,-18 Q138,-28 136,-12" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <polygon points="178,-77 182,-68 191,-68 184,-62 187,-53 178,-58 169,-53 172,-62 165,-68 174,-68" fill="none" stroke="#F7F2E8" strokeWidth="1.2"/>
    </g>}
    {flowersVisible >= 5 && <g>
      <line x1="74" y1="18" x2="14" y2="-95" stroke="#F7F2E8" strokeWidth="1.2"/>
      <path d="M52,-22 Q34,-34 36,-16" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <path d="M28,-62 Q10,-74 12,-56" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <path d="M14,-95 Q4,-113 14,-123 Q24,-113 14,-95" fill="none" stroke="#F7F2E8" strokeWidth="1.2"/>
      <path d="M14,-95 Q0,-109 2,-123 Q10,-113 14,-95" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <path d="M14,-95 Q28,-109 26,-123 Q18,-113 14,-95" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
    </g>}
    {flowersVisible >= 6 && <g>
      <line x1="86" y1="18" x2="146" y2="-95" stroke="#F7F2E8" strokeWidth="1.2"/>
      <path d="M108,-22 Q126,-34 124,-16" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <path d="M130,-62 Q148,-74 146,-56" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <circle cx="152" cy="-108" r="13" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <circle cx="152" cy="-108" r="7" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <ellipse cx="152" cy="-108" rx="3" ry="13" fill="none" stroke="#F7F2E8" strokeWidth="0.8"/>
      <ellipse cx="152" cy="-108" rx="3" ry="13" fill="none" stroke="#F7F2E8" strokeWidth="0.8" transform="rotate(30 152 -108)"/>
      <ellipse cx="152" cy="-108" rx="3" ry="13" fill="none" stroke="#F7F2E8" strokeWidth="0.8" transform="rotate(60 152 -108)"/>
      <ellipse cx="152" cy="-108" rx="3" ry="13" fill="none" stroke="#F7F2E8" strokeWidth="0.8" transform="rotate(90 152 -108)"/>
      <ellipse cx="152" cy="-108" rx="3" ry="13" fill="none" stroke="#F7F2E8" strokeWidth="0.8" transform="rotate(120 152 -108)"/>
      <ellipse cx="152" cy="-108" rx="3" ry="13" fill="none" stroke="#F7F2E8" strokeWidth="0.8" transform="rotate(150 152 -108)"/>
    </g>}
    {flowersVisible >= 7 && <g>
      <line x1="76" y1="18" x2="28" y2="-118" stroke="#F7F2E8" strokeWidth="1.2"/>
      <path d="M60,-22 Q42,-34 44,-16" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <path d="M46,-72 Q28,-84 30,-66" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <circle cx="22" cy="-132" r="10" fill="none" stroke="#F7F2E8" strokeWidth="1.2"/>
      <circle cx="22" cy="-132" r="5" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <circle cx="22" cy="-132" r="2" fill="#F7F2E8" opacity="0.4"/>
      <line x1="22" y1="-122" x2="22" y2="-118" stroke="#F7F2E8" strokeWidth="1.2"/>
      <line x1="22" y1="-142" x2="22" y2="-146" stroke="#F7F2E8" strokeWidth="1.2"/>
      <line x1="32" y1="-132" x2="36" y2="-132" stroke="#F7F2E8" strokeWidth="1.2"/>
      <line x1="12" y1="-132" x2="8" y2="-132" stroke="#F7F2E8" strokeWidth="1.2"/>
      <line x1="29" y1="-125" x2="33" y2="-121" stroke="#F7F2E8" strokeWidth="1"/>
      <line x1="15" y1="-139" x2="11" y2="-143" stroke="#F7F2E8" strokeWidth="1"/>
      <line x1="29" y1="-139" x2="33" y2="-143" stroke="#F7F2E8" strokeWidth="1"/>
      <line x1="15" y1="-125" x2="11" y2="-121" stroke="#F7F2E8" strokeWidth="1"/>
    </g>}
    {flowersVisible >= 8 && <g>
      <line x1="84" y1="18" x2="132" y2="-118" stroke="#F7F2E8" strokeWidth="1.2"/>
      <path d="M100,-22 Q118,-34 116,-16" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <path d="M114,-72 Q132,-84 130,-66" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <circle cx="138" cy="-130" r="12" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <circle cx="138" cy="-130" r="7" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <circle cx="138" cy="-130" r="3" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <path d="M138,-142 Q144,-136 138,-130 Q132,-136 138,-142" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <path d="M138,-118 Q132,-124 138,-130 Q144,-124 138,-118" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <path d="M126,-130 Q132,-124 138,-130 Q132,-136 126,-130" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <path d="M150,-130 Q144,-136 138,-130 Q144,-124 150,-130" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
    </g>}
    {flowersVisible >= 9 && <g>
      <line x1="78" y1="18" x2="60" y2="-145" stroke="#F7F2E8" strokeWidth="1.3"/>
      <path d="M72,-28 Q54,-40 56,-22" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <path d="M66,-88 Q48,-100 50,-82" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <ellipse cx="57" cy="-160" rx="7" ry="13" fill="none" stroke="#F7F2E8" strokeWidth="1"/>
      <ellipse cx="57" cy="-160" rx="7" ry="13" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(60 57 -160)"/>
      <ellipse cx="57" cy="-160" rx="7" ry="13" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(120 57 -160)"/>
      <ellipse cx="57" cy="-160" rx="7" ry="13" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(180 57 -160)"/>
      <ellipse cx="57" cy="-160" rx="7" ry="13" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(240 57 -160)"/>
      <ellipse cx="57" cy="-160" rx="7" ry="13" fill="none" stroke="#F7F2E8" strokeWidth="1" transform="rotate(300 57 -160)"/>
      <circle cx="57" cy="-160" r="6" fill="none" stroke="#F7F2E8" strokeWidth="1.2"/>
    </g>}
    <ellipse cx="80" cy="22" rx="20" ry="5" fill="none" stroke="#F7F2E8" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M60,22 Q56,38 52,52" fill="none" stroke="#F7F2E8" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M100,22 Q104,38 108,52" fill="none" stroke="#F7F2E8" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M52,52 Q30,70 28,110 Q26,148 32,170 Q38,188 50,196" fill="none" stroke="#F7F2E8" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M108,52 Q130,70 132,110 Q134,148 128,170 Q122,188 110,196" fill="none" stroke="#F7F2E8" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M54,48 Q80,52 106,48" fill="none" stroke="#F7F2E8" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M52,56 Q80,60 108,56" fill="none" stroke="#F7F2E8" strokeWidth="1" strokeLinecap="round"/>
    <path d="M30,118 Q80,124 130,118" fill="none" stroke="#F7F2E8" strokeWidth="1" strokeLinecap="round"/>
    <path d="M29,130 Q80,136 131,130" fill="none" stroke="#F7F2E8" strokeWidth="1" strokeLinecap="round"/>
    <path d="M50,196 Q80,204 110,196" fill="none" stroke="#F7F2E8" strokeWidth="1.8" strokeLinecap="round"/>
    <ellipse cx="80" cy="200" rx="32" ry="6" fill="none" stroke="#F7F2E8" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

function TodaySentence({ onSave }) {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!text.trim()) return;
    onSave(text.trim());
    setSaved(true);
  };

  if (saved) return null;

  return (
    <div style={{ marginTop: "0.75rem" }}>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="오늘 여기서 발견한 것..."
        rows={2}
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(143,168,160,0.3)",
          color: "rgba(240,237,232,0.8)",
          fontFamily: "'Source Serif 4', serif",
          fontSize: "0.88rem",
          fontWeight: 300,
          lineHeight: 1.8,
          padding: "0.75rem 1rem",
          resize: "none",
          outline: "none",
        }}
      />
      <button
        onClick={handleSave}
        style={{
          marginTop: "0.5rem",
          background: "none",
          border: "1px solid rgba(143,168,160,0.4)",
          color: "rgba(143,168,160,0.7)",
          fontFamily: "'Source Serif 4', serif",
          fontSize: "0.8rem",
          padding: "0.4rem 1.2rem",
          cursor: "pointer",
        }}
      >기록하기</button>
    </div>
  );
}

function OracleSlides() {
  return (
    <div style={{ borderTop: "1px solid rgba(247,242,232,0.15)", paddingTop: "1.5rem", textAlign: "left" }}>
      <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(247,242,232,0.35)", marginBottom: "1rem" }}>우리가 스스로를 못 보는 이유</p>
      <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.88rem", fontWeight: 300, color: "rgba(247,242,232,0.75)", lineHeight: 2, whiteSpace: "pre-line" }}>{`우리는 왜 자신을 잘 모를까요?

평생 자신과 함께 살았는데
정작 자신을 모르는 경우가 많아요.

우리는 보고 싶은 것만 봐요.
감정이 렌즈가 돼요 — 두려울 때 자신을 객관적으로 보기 어려워요.

오랫동안 자신을 설명하다 보면
그게 진짜인지 습관인지 구분이 안 돼요.

불행하게도 습관은 쉽게 사라지지 않고
낡은 방식은 끈질기게 존속돼요.

그래서 거울이 필요해요.
마음거울은 그 거울이에요.`}</p>
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

export default function Oracle({ onBack, onComprehensive }) {
  const [phase, setPhase] = useState("intro");
  const [showComprehensive, setShowComprehensive] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [otherText, setOtherText] = useState("");
  const [showOther, setShowOther] = useState(false);
  const [oracleText, setOracleText] = useState("");
  const [visibleSections, setVisibleSections] = useState([]);
  const resultRef = useRef(null);

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

  if (showComprehensive) {
    if (onComprehensive) onComprehensive();
    return null;
  }

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

  const bgColor = phase === "result" ? "#F7F2E8" : "#1F3A32";

  return (
    <div style={{
      minHeight: "100vh",
      background: bgColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "3rem 1.5rem",
      position: "relative",
      overflow: "hidden",
      transition: "background 1s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:wght@300;400&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes breathe { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.9; } }
        @keyframes flicker { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.85; } }
        .oracle-appear { animation: fadeUp 1.8s ease forwards; opacity: 0; }
        .oracle-option {
          width: 100%; background: rgba(247,242,232,0.08);
          border: 1px solid rgba(247,242,232,0.2);
          color: rgba(247,242,232,0.8);
          font-family: 'Source Serif 4', serif; font-size: 0.87rem; font-weight: 300;
          text-align: left; padding: 0.85rem 1.1rem; cursor: pointer;
          transition: all 0.3s; margin-bottom: 0.45rem; border-radius: 1px; line-height: 1.5;
        }
        .oracle-option:hover { background: rgba(247,242,232,0.15); border-color: rgba(247,242,232,0.4); color: #F7F2E8; }
        .oracle-option.selected { background: rgba(143,168,160,0.2); border-color: #8FA8A0; color: #F7F2E8; }
        .oracle-btn {
          background: transparent; border: 1px solid rgba(247,242,232,0.4);
          color: rgba(247,242,232,0.75); font-family: 'Source Serif 4', serif;
          font-size: 0.72rem; letter-spacing: 0.22em; text-transform: uppercase;
          cursor: pointer; padding: 0.7rem 1.8rem; transition: all 0.3s;
        }
        .oracle-btn:hover { border-color: rgba(247,242,232,0.8); color: #F7F2E8; }
        .oracle-btn:disabled { opacity: 0.2; cursor: default; }
        .oracle-btn-result {
          background: transparent; border: 1px solid rgba(90,58,138,0.3);
          color: rgba(90,58,138,0.65); font-family: 'Source Serif 4', serif;
          font-size: 0.72rem; letter-spacing: 0.22em; text-transform: uppercase;
          cursor: pointer; padding: 0.7rem 1.8rem; transition: all 0.3s;
        }
        .oracle-btn-result:hover { border-color: rgba(90,58,138,0.7); color: #2a1a4a; }
        .door-open-btn {
          background: rgba(143,168,160,0.15); border: 1px solid #8FA8A0; color: #8FA8A0;
          font-family: 'Source Serif 4', serif; font-size: 0.82rem; letter-spacing: 0.18em;
          text-transform: uppercase; cursor: pointer; padding: 1rem 2.5rem; transition: all 0.4s;
        }
        .door-open-btn:hover { background: rgba(143,168,160,0.25); border-color: #8FA8A0; opacity: 1; }
        .back-link {
          background: transparent; border: none; color: rgba(247,242,232,0.35);
          font-family: 'Source Serif 4', serif; font-size: 0.7rem;
          letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; padding: 0; transition: all 0.3s;
        }
        .back-link:hover { color: rgba(247,242,232,0.7); }
        .back-link-result {
          background: transparent; border: none; color: rgba(90,58,138,0.3);
          font-family: 'Source Serif 4', serif; font-size: 0.7rem;
          letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; padding: 0; transition: all 0.3s;
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
        .oracle-textarea:focus { border-bottom-color: rgba(247,242,232,0.4); }
        .greek { font-family: 'Playfair Display', serif; font-size: 1rem; letter-spacing: 0.2em; font-style: italic; }
      `}</style>

      {phase !== "result" && <VaseSVG flowersVisible={phase === "questions" ? currentQ : phase === "door" || phase === "opening" ? 9 : 0} />}

      {/* 인트로 */}
      {phase === "intro" && (() => {
        const saved = localStorage.getItem("oracle_today_sentence");
        const prev = saved ? JSON.parse(saved) : null;
        return (
        <div style={{ width: "100%", maxWidth: 520, position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8FA8A0", marginBottom: "1.5rem" }}>내 마음의 메모리</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 400, fontStyle: "italic", color: "#F7F2E8", lineHeight: 1.2, marginBottom: "2rem" }}>내 마음의 메모리</h1>

          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(247,242,232,0.75)", lineHeight: 2.1, marginBottom: "0.75rem" }}>선택은 끝났는데도<br/>마음이 다시 열어보는 창이 있습니다.</p>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(247,242,232,0.75)", lineHeight: 2.1, marginBottom: "0.75rem" }}>사람마다 선택 뒤에 자주 돌아가는 자리가 달라요.<br/>그 자리가 당신이 중요하게 여기는 것을 보여줘요.</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontStyle: "italic", color: "#8FA8A0", lineHeight: 2, marginBottom: "0.75rem" }}>가장 가까운 답을 골라주세요.</p>
          </div>

          <div style={{ background: "rgba(143,168,160,0.1)", borderLeft: "3px solid #8FA8A0", padding: "1.1rem 1.25rem", marginBottom: "2rem" }}>
            <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: ".68rem", letterSpacing: ".2em", textTransform: "uppercase", color: "#8FA8A0", marginBottom: ".6rem" }}>시작 전에</div>
            <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: ".82rem", fontWeight: 300, color: "rgba(247,242,232,0.65)", lineHeight: 1.85, display: "flex", alignItems: "flex-start", gap: ".5rem" }}>
              <span style={{ opacity: .5 }}>—</span>맞고 틀린 답 없어요. 지금 나한테 가장 가까운 걸 고르면 돼요.
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1.2rem" }}>
            {prev && (
              <div style={{ marginBottom: "0.5rem", padding: "1rem 1.25rem", border: "1px solid rgba(143,168,160,0.2)", width: "100%" }}>
                <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(143,168,160,0.4)", marginBottom: "0.4rem" }}>지난번 당신의 한 문장 ({prev.date})</p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.9rem", fontStyle: "italic", color: "rgba(247,242,232,0.6)", lineHeight: 1.8 }}>"{prev.sentence}"</p>
              </div>
            )}
            <button className="door-open-btn" onClick={() => setPhase("questions")}>시작하기</button>
            <button className="back-link" onClick={onBack}>← 돌아가기</button>
          </div>
        </div>
        );
      })()}

      {/* 질문 */}
      {phase === "questions" && q && (
        <div style={{ width: "100%", maxWidth: 540, position: "relative", zIndex: 1 }}>
          <div style={{ width: "100%", height: "1px", background: "rgba(247,242,232,0.1)", marginBottom: "3.5rem" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "rgba(247,242,232,0.35)", transition: "width 0.6s ease" }} />
          </div>
          <div style={{ fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(247,242,232,0.35)", marginBottom: "0.6rem", fontFamily: "'Source Serif 4', serif" }}>
            {currentQ + 1} / {ORACLE_QUESTIONS.length} — {q.title}
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1rem, 2.8vw, 1.25rem)", fontWeight: 400, fontStyle: "italic", color: "#F7F2E8", lineHeight: 1.7, marginBottom: "2.2rem", whiteSpace: "pre-line" }}>
            {q.question}
          </h2>
          {!isTextQ && (
            <div style={{ marginBottom: "2rem" }}>
              {q.options.map((opt) => (
                <button key={opt} className={`oracle-option ${selectedOption === opt ? "selected" : ""}`} onClick={() => handleSelect(opt)}>
                  {opt}
                </button>
              ))}
              <button className={`oracle-option ${selectedOption === "기타" ? "selected" : ""}`} onClick={() => handleSelect("기타")}>기타</button>
              {showOther && (
                <input
                  type="text" value={otherText} onChange={(e) => setOtherText(e.target.value)}
                  placeholder="직접 입력해주세요" autoFocus
                  style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(247,242,232,0.3)", color: "#F7F2E8", fontFamily: "'Source Serif 4', serif", fontSize: "0.88rem", fontWeight: 300, padding: "0.6rem 0", outline: "none", marginTop: "0.5rem", boxSizing: "border-box" }}
                />
              )}
            </div>
          )}
          {isTextQ && (
            <textarea className="oracle-textarea" value={textAnswer} onChange={(e) => setTextAnswer(e.target.value)} placeholder="떠오르는 대로 써주세요..." />
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem" }}>
            <button className="back-link" onClick={handleBack}>← 이전</button>
            <button className="oracle-btn" onClick={handleNext} disabled={!canProceed}>
              {currentQ < ORACLE_QUESTIONS.length - 1 ? "다음" : "완성"}
            </button>
          </div>
        </div>
      )}

      {/* 문 앞 */}
      {phase === "door" && (
        <div style={{ width: "100%", maxWidth: 520, textAlign: "center", position: "relative", zIndex: 1 }}>
          <div className="greek" style={{ color: "rgba(247,242,232,0.35)", marginBottom: "3rem" }}>γνῶθι σεαυτόν</div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(247,242,232,0.45)", marginBottom: "3rem", lineHeight: 1.9, animation: "flicker 4s ease-in-out infinite" }}>
            마음거울이 당신의 답변을 읽고 있습니다
          </p>
          <OracleSlides />
          <button className="door-open-btn" onClick={openDoor} style={{ marginTop: "2.5rem" }}>시작하기</button>
        </div>
      )}

      {/* 열리는 중 */}
      {phase === "opening" && (
        <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div className="greek" style={{ color: "rgba(247,242,232,0.35)", marginBottom: "2rem" }}>γνῶθι σεαυτόν</div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(247,242,232,0.4)", animation: "breathe 2s ease-in-out infinite" }}>
            잠시 기다려주세요
          </p>
        </div>
      )}

      {/* 결과 */}
      {phase === "result" && (
        <div ref={resultRef} style={{ width: "100%", maxWidth: 680, paddingTop: "2rem" }}>
          {visibleSections.includes("Reflection") && parsed["Reflection"] && (
            <div className="oracle-appear" style={{ marginBottom: "2.5rem" }}>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(90,58,138,0.45)", marginBottom: "0.4rem" }}>당신의 말</div>
              <div style={{ width: "100%", height: "1px", background: "rgba(90,58,138,0.15)", marginBottom: "1rem" }}/>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(42,26,74,0.7)", lineHeight: 2.2, whiteSpace: "pre-wrap" }}>{parsed["Reflection"]}</div>
            </div>
          )}
          {visibleSections.includes("Recognition") && parsed["Recognition"] && (
            <div className="oracle-appear" style={{ marginBottom: "2.5rem" }}>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(90,58,138,0.45)", marginBottom: "0.4rem" }}>마음거울이 본 것</div>
              <div style={{ width: "100%", height: "1px", background: "rgba(90,58,138,0.15)", marginBottom: "1rem" }}/>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(42,26,74,0.7)", lineHeight: 2.2, whiteSpace: "pre-wrap" }}>{parsed["Recognition"]}</div>
            </div>
          )}
          {visibleSections.includes("Oracle") && parsed["Oracle"] && (
            <div className="oracle-appear" style={{ marginBottom: "2.5rem" }}>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(90,58,138,0.45)", marginBottom: "0.4rem" }}>마음거울의 가설</div>
              <div style={{ width: "100%", height: "1px", background: "rgba(90,58,138,0.15)", marginBottom: "1rem" }}/>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(42,26,74,0.7)", lineHeight: 2.2, whiteSpace: "pre-wrap" }}>{parsed["Oracle"]}</div>
            </div>
          )}
          {visibleSections.includes("Story") && parsed["Story"] && (
            <div className="oracle-appear" style={{ marginBottom: "2.5rem" }}>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(90,58,138,0.45)", marginBottom: "0.4rem" }}>마음거울의 제안</div>
              <div style={{ width: "100%", height: "1px", background: "rgba(90,58,138,0.15)", marginBottom: "1rem" }}/>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, fontStyle: "italic", color: "rgba(42,26,74,0.7)", lineHeight: 2.2, whiteSpace: "pre-wrap" }}>{parsed["Story"]}</div>
            </div>
          )}
          {visibleSections.includes("Empowerment") && parsed["Empowerment"] && (
            <div className="oracle-appear" style={{ marginBottom: "3rem" }}>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(90,58,138,0.45)", marginBottom: "0.4rem" }}>문을 나서기 전에</div>
              <div style={{ width: "100%", height: "1px", background: "rgba(90,58,138,0.15)", marginBottom: "1rem" }}/>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(42,26,74,0.7)", lineHeight: 2.2, whiteSpace: "pre-wrap" }}>{parsed["Empowerment"]}</div>
            </div>
          )}
          {visibleSections.length === 5 && (
            <div className="oracle-appear" style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid rgba(90,58,138,0.1)" }}>
              <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
                <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",fontWeight:300,color:"rgba(90,58,138,0.4)",marginBottom:"1rem"}}>이 분석이 당신에게 맞나요?</p>
                <OracleFeedback />
              </div>
              <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
                <button className="oracle-btn-result" onClick={() => setShowComprehensive(true)}>종합 분석 보기 →</button>
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
        <div style={{ width: "100%", maxWidth: 580, paddingTop: "2rem", paddingBottom: "4rem" }}>
          <div className="greek" style={{ color: "rgba(240,237,232,0.3)", marginBottom: "3rem", fontSize: "0.9rem" }}>γνῶθι σεαυτόν</div>

          <div style={{ position: "relative", padding: "3rem 2.5rem", border: "4px solid #B89A5E", boxShadow: "inset 0 0 0 8px #1F3A32, inset 0 0 0 10px rgba(184,154,94,0.2)" }}>

            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontStyle: "italic", color: "#B89A5E", lineHeight: 1.8, marginBottom: "2rem" }}>너 자신을 알라.</p>

            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(240,237,232,0.75)", lineHeight: 2, marginBottom: "2rem" }}>델포이 신전의 문에는 오래된 문장이 새겨져 있었습니다. 사람들은 신탁을 얻기 위해 그곳을 찾아갔습니다. 하지만 신탁을 구하기 전, 그들은 먼저 이 문장 앞에 섰습니다.</p>

            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(240,237,232,0.75)", lineHeight: 2, marginBottom: "2rem" }}>당신은 자신을 보았습니다. 쉽지 않은 일이에요.</p>

            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(240,237,232,0.75)", lineHeight: 2, marginBottom: "2rem" }}>이 결과는 당신이 누구인지를 정의하지 않습니다. 마음거울이 본 것은 당신이 반복적으로 선택해온 방식, 세상을 해석해온 습관, 무의식적으로 돌아가기 쉬운 길입니다. 그것은 당신의 전부가 아니라, 오늘 드러난 당신의 한 부분입니다.</p>

            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(240,237,232,0.75)", lineHeight: 2, marginBottom: "2rem" }}>그리고 이제 조용히 묻습니다. 앞으로도 같은 길을 선택하시겠어요?</p>

            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(240,237,232,0.75)", lineHeight: 2, marginBottom: "2rem" }}>앎이 나를 바꿔줄 거라고 기대했던 적 있으신가요? 달라지는 것은 언제나 그다음 선택입니다.</p>

            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(240,237,232,0.75)", lineHeight: 2, marginBottom: "2rem" }}>이 결과를 누군가와 함께 읽어보셔도 좋습니다. 또는 당신의 AI에게 가져가 다시 물어보셔도 좋습니다. 같은 결과도 다른 질문 앞에서는 다르게 읽힐 수 있습니다.</p>

            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(240,237,232,0.75)", lineHeight: 2, marginBottom: "2rem" }}>언젠가 다시 돌아오세요. 오늘 당신이 했던 말과, 그때 당신이 할 말은 달라져 있을 것입니다. 그것이 바로 당신이 살아있다는 뜻입니다.</p>

            <div>
              <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(240,237,232,0.75)", lineHeight: 2, marginBottom: "1rem" }}>
                오늘 여기서 발견한 것을 한 문장으로 남겨보세요. 하나만 가져간다면 — 무엇인가요?
              </p>
              {!savedSentence ? (
                <TodaySentence onSave={(sentence) => {
                  const data = { sentence, date: `${month}월 ${day}일`, timestamp: Date.now() };
                  localStorage.setItem("oracle_today_sentence", JSON.stringify(data));
                  window.location.reload();
                }} />
              ) : (
                <div style={{ marginTop: "1rem" }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontStyle: "italic", color: "#c9a84c", lineHeight: 1.9 }}>
                    "{JSON.parse(savedSentence).sentence}"
                  </p>
                  <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.75rem", color: "rgba(240,237,232,0.3)", marginTop: "0.5rem" }}>
                    {JSON.parse(savedSentence).date} 기록
                  </p>
                </div>
              )}
            </div>

            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontStyle: "italic", color: "rgba(240,237,232,0.5)", lineHeight: 1.9, marginTop: "2rem", marginBottom: "2rem" }}>
              오늘의 당신을 기억하세요.
            </p>

            <div style={{ paddingTop: "1.5rem", borderTop: "1px solid rgba(184,154,94,0.15)" }}>
              <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.82rem", fontWeight: 300, color: "rgba(240,237,232,0.35)", lineHeight: 1.9, marginBottom: "0.75rem" }}>이 거울은 아직 완성되는 중입니다. 당신이 남긴 한마디가 다음 사람의 거울을 더 선명하게 만듭니다.</p>
              <a href="https://forms.gle/A6xXdAVUQoaNqaEWA" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.8rem", color: "rgba(184,154,94,0.55)", textDecoration: "underline", textUnderlineOffset: "3px" }}>피드백 남기기 →</a>
            </div>

          </div>

          <div style={{ marginTop: "3rem", display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <button className="oracle-btn-result" style={{borderColor:"rgba(240,237,232,0.4)",color:"rgba(240,237,232,0.7)"}} onClick={() => {
              setPhase("intro");
              setAnswers({});
              setCurrentQ(0);
              setOracleText("");
              setVisibleSections([]);
              setSelectedOption(null);
              setTextAnswer("");
            }}>다시 시작</button>
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
