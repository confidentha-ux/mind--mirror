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
- 반드시 존댓말로 쓸 것. ~요, ~습니다 형식으로. 반말 절대 금지.
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

// 꽃병 SVG — 단순한 선 드로잉
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
    {/* 꽃1: 왼쪽 바깥 낮게 — 5꽃잎 */}
    {flowersVisible >= 1 && <g style={{transition:"opacity 0.6s ease"}}>
      <line x1="70" y1="18" x2="-28" y2="-25" stroke="#0d2e2a" strokeWidth="1.2"/>
      <path d="M25,-4 Q12,-14 14,0" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <ellipse cx="-36" cy="-35" rx="7" ry="12" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <ellipse cx="-36" cy="-35" rx="7" ry="12" fill="none" stroke="#0d2e2a" strokeWidth="1" transform="rotate(72 -36 -35)"/>
      <ellipse cx="-36" cy="-35" rx="7" ry="12" fill="none" stroke="#0d2e2a" strokeWidth="1" transform="rotate(144 -36 -35)"/>
      <ellipse cx="-36" cy="-35" rx="7" ry="12" fill="none" stroke="#0d2e2a" strokeWidth="1" transform="rotate(216 -36 -35)"/>
      <ellipse cx="-36" cy="-35" rx="7" ry="12" fill="none" stroke="#0d2e2a" strokeWidth="1" transform="rotate(288 -36 -35)"/>
      <circle cx="-36" cy="-35" r="5" fill="none" stroke="#0d2e2a" strokeWidth="1.2"/>
    </g>}

    {/* 꽃2: 오른쪽 바깥 낮게 — 8꽃잎 */}
    {flowersVisible >= 2 && <g>
      <line x1="90" y1="18" x2="188" y2="-25" stroke="#0d2e2a" strokeWidth="1.2"/>
      <path d="M135,-4 Q148,-14 146,0" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <ellipse cx="196" cy="-35" rx="5" ry="10" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <ellipse cx="196" cy="-35" rx="5" ry="10" fill="none" stroke="#0d2e2a" strokeWidth="1" transform="rotate(45 196 -35)"/>
      <ellipse cx="196" cy="-35" rx="5" ry="10" fill="none" stroke="#0d2e2a" strokeWidth="1" transform="rotate(90 196 -35)"/>
      <ellipse cx="196" cy="-35" rx="5" ry="10" fill="none" stroke="#0d2e2a" strokeWidth="1" transform="rotate(135 196 -35)"/>
      <ellipse cx="196" cy="-35" rx="5" ry="10" fill="none" stroke="#0d2e2a" strokeWidth="1" transform="rotate(180 196 -35)"/>
      <ellipse cx="196" cy="-35" rx="5" ry="10" fill="none" stroke="#0d2e2a" strokeWidth="1" transform="rotate(225 196 -35)"/>
      <ellipse cx="196" cy="-35" rx="5" ry="10" fill="none" stroke="#0d2e2a" strokeWidth="1" transform="rotate(270 196 -35)"/>
      <ellipse cx="196" cy="-35" rx="5" ry="10" fill="none" stroke="#0d2e2a" strokeWidth="1" transform="rotate(315 196 -35)"/>
      <circle cx="196" cy="-35" r="4" fill="none" stroke="#0d2e2a" strokeWidth="1.2"/>
    </g>}

    {/* 꽃3: 왼쪽 1번과 5번 사이 — 4꽃잎 */}
    {flowersVisible >= 3 && <g>
      <line x1="72" y1="18" x2="-10" y2="-65" stroke="#0d2e2a" strokeWidth="1.2"/>
      <path d="M38,-18 Q22,-28 24,-12" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <ellipse cx="-18" cy="-77" rx="7" ry="12" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <ellipse cx="-18" cy="-77" rx="7" ry="12" fill="none" stroke="#0d2e2a" strokeWidth="1" transform="rotate(90 -18 -77)"/>
      <ellipse cx="-18" cy="-77" rx="7" ry="12" fill="none" stroke="#0d2e2a" strokeWidth="1" transform="rotate(180 -18 -77)"/>
      <ellipse cx="-18" cy="-77" rx="7" ry="12" fill="none" stroke="#0d2e2a" strokeWidth="1" transform="rotate(270 -18 -77)"/>
      <circle cx="-18" cy="-77" r="5" fill="none" stroke="#0d2e2a" strokeWidth="1.2"/>
    </g>}

    {/* 꽃4: 오른쪽 2번과 6번 사이 — 별꽃 */}
    {flowersVisible >= 4 && <g>
      <line x1="88" y1="18" x2="170" y2="-65" stroke="#0d2e2a" strokeWidth="1.2"/>
      <path d="M122,-18 Q138,-28 136,-12" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <polygon points="178,-77 182,-68 191,-68 184,-62 187,-53 178,-58 169,-53 172,-62 165,-68 174,-68" fill="none" stroke="#0d2e2a" strokeWidth="1.2"/>
    </g>}

    {/* 꽃5: 왼쪽 중간 — 튤립 */}
    {flowersVisible >= 5 && <g>
      <line x1="74" y1="18" x2="14" y2="-95" stroke="#0d2e2a" strokeWidth="1.2"/>
      <path d="M52,-22 Q34,-34 36,-16" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <path d="M28,-62 Q12,-74 14,-56" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <path d="M14,-95 Q4,-113 14,-123 Q24,-113 14,-95" fill="none" stroke="#0d2e2a" strokeWidth="1.2"/>
      <path d="M14,-95 Q0,-109 2,-123 Q10,-113 14,-95" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <path d="M14,-95 Q28,-109 26,-123 Q18,-113 14,-95" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
    </g>}

    {/* 꽃6: 오른쪽 중간 — 국화 */}
    {flowersVisible >= 6 && <g>
      <line x1="86" y1="18" x2="146" y2="-95" stroke="#0d2e2a" strokeWidth="1.2"/>
      <path d="M108,-22 Q126,-34 124,-16" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <path d="M130,-62 Q148,-74 146,-56" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <circle cx="152" cy="-108" r="13" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <circle cx="152" cy="-108" r="7" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <ellipse cx="152" cy="-108" rx="3" ry="13" fill="none" stroke="#0d2e2a" strokeWidth="0.8"/>
      <ellipse cx="152" cy="-108" rx="3" ry="13" fill="none" stroke="#0d2e2a" strokeWidth="0.8" transform="rotate(30 152 -108)"/>
      <ellipse cx="152" cy="-108" rx="3" ry="13" fill="none" stroke="#0d2e2a" strokeWidth="0.8" transform="rotate(60 152 -108)"/>
      <ellipse cx="152" cy="-108" rx="3" ry="13" fill="none" stroke="#0d2e2a" strokeWidth="0.8" transform="rotate(90 152 -108)"/>
      <ellipse cx="152" cy="-108" rx="3" ry="13" fill="none" stroke="#0d2e2a" strokeWidth="0.8" transform="rotate(120 152 -108)"/>
      <ellipse cx="152" cy="-108" rx="3" ry="13" fill="none" stroke="#0d2e2a" strokeWidth="0.8" transform="rotate(150 152 -108)"/>
    </g>}

    {/* 꽃7: 왼쪽 높이 — 해바라기 */}
    {flowersVisible >= 7 && <g>
      <line x1="76" y1="18" x2="28" y2="-118" stroke="#0d2e2a" strokeWidth="1.2"/>
      <path d="M60,-22 Q42,-34 44,-16" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <path d="M46,-72 Q28,-84 30,-66" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <circle cx="22" cy="-132" r="10" fill="none" stroke="#0d2e2a" strokeWidth="1.2"/>
      <circle cx="22" cy="-132" r="5" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <circle cx="22" cy="-132" r="2" fill="#0d2e2a" opacity="0.4"/>
      <line x1="22" y1="-122" x2="22" y2="-118" stroke="#0d2e2a" strokeWidth="1.2"/>
      <line x1="22" y1="-142" x2="22" y2="-146" stroke="#0d2e2a" strokeWidth="1.2"/>
      <line x1="32" y1="-132" x2="36" y2="-132" stroke="#0d2e2a" strokeWidth="1.2"/>
      <line x1="12" y1="-132" x2="8" y2="-132" stroke="#0d2e2a" strokeWidth="1.2"/>
      <line x1="29" y1="-125" x2="33" y2="-121" stroke="#0d2e2a" strokeWidth="1"/>
      <line x1="15" y1="-139" x2="11" y2="-143" stroke="#0d2e2a" strokeWidth="1"/>
      <line x1="29" y1="-139" x2="33" y2="-143" stroke="#0d2e2a" strokeWidth="1"/>
      <line x1="15" y1="-125" x2="11" y2="-121" stroke="#0d2e2a" strokeWidth="1"/>
    </g>}

    {/* 꽃8: 오른쪽 높이 — 로제트 */}
    {flowersVisible >= 8 && <g>
      <line x1="84" y1="18" x2="132" y2="-118" stroke="#0d2e2a" strokeWidth="1.2"/>
      <path d="M100,-22 Q118,-34 116,-16" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <path d="M114,-72 Q132,-84 130,-66" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <circle cx="138" cy="-130" r="12" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <circle cx="138" cy="-130" r="7" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <circle cx="138" cy="-130" r="3" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <path d="M138,-142 Q144,-136 138,-130 Q132,-136 138,-142" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <path d="M138,-118 Q132,-124 138,-130 Q144,-124 138,-118" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <path d="M126,-130 Q132,-124 138,-130 Q132,-136 126,-130" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <path d="M150,-130 Q144,-136 138,-130 Q144,-124 150,-130" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
    </g>}

    {/* 꽃9: 중앙 살짝 왼쪽 — 큰 데이지 */}
    {flowersVisible >= 9 && <g>
      <line x1="78" y1="18" x2="60" y2="-145" stroke="#0d2e2a" strokeWidth="1.3"/>
      <path d="M72,-28 Q54,-40 56,-22" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <path d="M66,-88 Q48,-100 50,-82" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <ellipse cx="57" cy="-160" rx="7" ry="13" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <ellipse cx="57" cy="-160" rx="7" ry="13" fill="none" stroke="#0d2e2a" strokeWidth="1" transform="rotate(60 57 -160)"/>
      <ellipse cx="57" cy="-160" rx="7" ry="13" fill="none" stroke="#0d2e2a" strokeWidth="1" transform="rotate(120 57 -160)"/>
      <ellipse cx="57" cy="-160" rx="7" ry="13" fill="none" stroke="#0d2e2a" strokeWidth="1" transform="rotate(180 57 -160)"/>
      <ellipse cx="57" cy="-160" rx="7" ry="13" fill="none" stroke="#0d2e2a" strokeWidth="1" transform="rotate(240 57 -160)"/>
      <ellipse cx="57" cy="-160" rx="7" ry="13" fill="none" stroke="#0d2e2a" strokeWidth="1" transform="rotate(300 57 -160)"/>
      <circle cx="57" cy="-160" r="6" fill="none" stroke="#0d2e2a" strokeWidth="1.2"/>
    </g>}

    {/* 꽃10: 정중앙 최고높이 — 장미 완성 */}
    {flowersVisible >= 10 && <g>
      <line x1="80" y1="18" x2="80" y2="-145" stroke="#0d2e2a" strokeWidth="1.4"/>
      <path d="M80,-35 Q98,-47 96,-29" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <path d="M80,-90 Q62,-102 64,-84" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <circle cx="80" cy="-163" r="18" fill="none" stroke="#0d2e2a" strokeWidth="1.2"/>
      <circle cx="80" cy="-163" r="12" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <circle cx="80" cy="-163" r="7" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <circle cx="80" cy="-163" r="3" fill="#0d2e2a" opacity="0.35"/>
      <path d="M80,-181 Q88,-172 80,-163 Q72,-172 80,-181" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <path d="M80,-145 Q72,-154 80,-163 Q88,-154 80,-145" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <path d="M62,-163 Q71,-155 80,-163 Q71,-171 62,-163" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <path d="M98,-163 Q89,-171 80,-163 Q89,-155 98,-163" fill="none" stroke="#0d2e2a" strokeWidth="1"/>
      <path d="M68,-150 Q74,-159 80,-163 Q74,-167 68,-176" fill="none" stroke="#0d2e2a" strokeWidth="0.8"/>
      <path d="M92,-150 Q86,-159 80,-163 Q86,-167 92,-176" fill="none" stroke="#0d2e2a" strokeWidth="0.8"/>
    </g>}

    {/* 화병 (고정) */}
    <ellipse cx="80" cy="22" rx="20" ry="5" fill="none" stroke="#0d2e2a" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M60,22 Q56,38 52,52" fill="none" stroke="#0d2e2a" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M100,22 Q104,38 108,52" fill="none" stroke="#0d2e2a" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M52,52 Q30,70 28,110 Q26,148 32,170 Q38,188 50,196" fill="none" stroke="#0d2e2a" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M108,52 Q130,70 132,110 Q134,148 128,170 Q122,188 110,196" fill="none" stroke="#0d2e2a" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M54,48 Q80,52 106,48" fill="none" stroke="#0d2e2a" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M52,56 Q80,60 108,56" fill="none" stroke="#0d2e2a" strokeWidth="1" strokeLinecap="round"/>
    <path d="M30,118 Q80,124 130,118" fill="none" stroke="#0d2e2a" strokeWidth="1" strokeLinecap="round"/>
    <path d="M29,130 Q80,136 131,130" fill="none" stroke="#0d2e2a" strokeWidth="1" strokeLinecap="round"/>
    <path d="M50,196 Q80,204 110,196" fill="none" stroke="#0d2e2a" strokeWidth="1.8" strokeLinecap="round"/>
    <ellipse cx="80" cy="200" rx="32" ry="6" fill="none" stroke="#0d2e2a" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

function OracleFeedback() {
  const [selected, setSelected] = React.useState(null);
  return (
    <div>
      {!selected && (
        <div style={{display:"flex",gap:"0.75rem",justifyContent:"center"}}>
          <button onClick={() => setSelected("yes")} style={{background:"none",border:"1px solid rgba(90,58,138,0.2)",fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",color:"rgba(90,58,138,0.5)",padding:"0.4rem 1rem",cursor:"pointer"}}>👍 맞아요</button>
          <button onClick={() => setSelected("no")} style={{background:"none",border:"1px solid rgba(90,58,138,0.2)",fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",color:"rgba(90,58,138,0.5)",padding:"0.4rem 1rem",cursor:"pointer"}}>👎 아닌 것 같아요</button>
          <button onClick={() => setSelected("unsure")} style={{background:"none",border:"1px solid rgba(90,58,138,0.2)",fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",color:"rgba(90,58,138,0.5)",padding:"0.4rem 1rem",cursor:"pointer"}}>🤔 잘 모르겠어요</button>
        </div>
      )}
      {selected === "yes" && <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",fontWeight:300,color:"rgba(90,58,138,0.4)"}}>감사해요.</p>}
      {selected === "unsure" && <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",fontWeight:300,color:"rgba(90,58,138,0.4)"}}>그 모르겠다는 느낌도 중요한 정보예요.</p>}
      {selected === "no" && (
        <div>
          <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.85rem",fontWeight:300,color:"rgba(90,58,138,0.55)",lineHeight:1.9,marginBottom:"0.75rem"}}>맞지 않는 부분이 있으신가요?<br/>당신이 느낀 것을 말씀해주세요.</p>
          <a href="https://forms.gle/1MK9PRZmTBpFsEPN8" target="_blank" rel="noopener noreferrer" style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",color:"rgba(90,58,138,0.5)",textDecoration:"underline",textUnderlineOffset:"3px"}}>피드백 남기기 →</a>
        </div>
      )}
    </div>
  );
}

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
      localStorage.setItem("mindmirror_oracle", text);
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

  const bgColor = phase === "result" ? "#e8e0f5" : phase === "final" ? "#2d5a2d" : "#7dd4c8";
  const textColor = phase === "result" ? "#2a1a4a" : "#0d2e2a";

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
          width: 100%; background: transparent;
          border: 1px solid rgba(13,46,42,0.15);
          color: rgba(13,46,42,0.65);
          font-family: 'Source Serif 4', serif; font-size: 0.87rem; font-weight: 300;
          text-align: left; padding: 0.85rem 1.1rem; cursor: pointer;
          transition: all 0.3s; margin-bottom: 0.45rem; border-radius: 1px; line-height: 1.5;
        }
        .oracle-option:hover { background: rgba(13,46,42,0.06); border-color: rgba(13,46,42,0.35); color: #0d2e2a; }
        .oracle-option.selected { background: rgba(13,46,42,0.1); border-color: rgba(13,46,42,0.5); color: #0d2e2a; }
        .oracle-btn {
          background: transparent; border: 1px solid rgba(13,46,42,0.3);
          color: rgba(13,46,42,0.65); font-family: 'Source Serif 4', serif;
          font-size: 0.72rem; letter-spacing: 0.22em; text-transform: uppercase;
          cursor: pointer; padding: 0.7rem 1.8rem; transition: all 0.3s;
        }
        .oracle-btn:hover { border-color: rgba(13,46,42,0.6); color: #0d2e2a; }
        .oracle-btn:disabled { opacity: 0.2; cursor: default; }
        .oracle-btn-result {
          background: transparent; border: 1px solid rgba(90,58,138,0.3);
          color: rgba(90,58,138,0.65); font-family: 'Source Serif 4', serif;
          font-size: 0.72rem; letter-spacing: 0.22em; text-transform: uppercase;
          cursor: pointer; padding: 0.7rem 1.8rem; transition: all 0.3s;
        }
        .oracle-btn-result:hover { border-color: rgba(90,58,138,0.7); color: #2a1a4a; }
        .door-open-btn {
          background: transparent; border: 1px solid rgba(13,46,42,0.4); color: #0d2e2a;
          font-family: 'Playfair Display', serif; font-size: 1.1rem; font-style: italic;
          cursor: pointer; padding: 1.1rem 3rem; transition: all 0.4s;
          animation: breathe 3s ease-in-out infinite; letter-spacing: 0.03em;
        }
        .door-open-btn:hover { background: rgba(13,46,42,0.07); border-color: #0d2e2a; animation: none; opacity: 1; }
        .back-link {
          background: transparent; border: none; color: rgba(13,46,42,0.3);
          font-family: 'Source Serif 4', serif; font-size: 0.7rem;
          letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; padding: 0; transition: all 0.3s;
        }
        .back-link:hover { color: rgba(13,46,42,0.65); }
        .back-link-result {
          background: transparent; border: none; color: rgba(90,58,138,0.3);
          font-family: 'Source Serif 4', serif; font-size: 0.7rem;
          letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; padding: 0; transition: all 0.3s;
        }
        .back-link-result:hover { color: rgba(90,58,138,0.65); }
        .oracle-textarea {
          width: 100%; background: transparent; border: none;
          border-bottom: 1px solid rgba(13,46,42,0.2); color: #0d2e2a;
          font-family: 'Source Serif 4', serif; font-size: 0.93rem; font-weight: 300;
          line-height: 1.95; padding: 0.5rem 0; resize: none; outline: none;
          min-height: 130px; caret-color: #0d2e2a; box-sizing: border-box;
        }
        .oracle-textarea::placeholder { color: rgba(13,46,42,0.2); }
        .oracle-textarea:focus { border-bottom-color: rgba(13,46,42,0.4); }
        .greek { font-family: 'Playfair Display', serif; font-size: 1rem; letter-spacing: 0.2em; font-style: italic; }
      `}</style>

      {phase !== "result" && <VaseSVG flowersVisible={phase === "questions" ? currentQ : phase === "door" || phase === "opening" ? 10 : 0} />}

      {/* 인트로 */}
      {phase === "intro" && (
        <div style={{ width: "100%", maxWidth: 520, position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.8rem",
              fontWeight: 700,
              fontStyle: "italic",
              color: "#0d2e2a",
              marginBottom: "0.4rem",
              lineHeight: 1.2,
            }}>너 자신을 알라</div>
            <div style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "0.78rem",
              fontWeight: 300,
              color: "rgba(13,46,42,0.45)",
              letterSpacing: "0.08em",
            }}>γνῶθι σεαυτόν (그노티 세아우톤)</div>
          </div>

          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.88rem", fontWeight: 300, color: "rgba(13,46,42,0.7)", lineHeight: 2.1, marginBottom: "1.5rem" }}>
            2,500년 전 델포이 신전에 새겨진 말.<br/>
            소크라테스가 평생의 화두로 삼은 질문입니다.<br/>
            가장 오래된 질문이 아직도 가장 어렵습니다.
          </p>

          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.88rem", fontWeight: 300, color: "rgba(13,46,42,0.7)", lineHeight: 2.1, marginBottom: "1.5rem" }}>
            당신은 아직 자신을 다 모릅니다.<br/>
            마음거울 오라클은 거기서 시작해요.
          </p>

          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.88rem", fontWeight: 300, color: "rgba(13,46,42,0.7)", lineHeight: 2.1, marginBottom: "2rem" }}>
            고대 그리스인들은 신탁을 구하러 가기 전,<br/>
            이 말 앞에 멈춰 섰습니다.<br/>
            오라클은 답을 주는 존재가 아니에요.<br/>
            당신이 아직 던지지 못한 질문을 돌려주는 존재입니다.
          </p>

          <div style={{ width: "40px", height: "1px", background: "rgba(13,46,42,0.2)", margin: "2rem 0" }}/>

          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.88rem", fontWeight: 300, color: "rgba(13,46,42,0.7)", lineHeight: 2.1, marginBottom: "1.5rem" }}>
            영화 매트릭스에서 네오는 자신이 선택받은 자임을<br/>
            확인받기 위해 오라클을 찾아갔습니다.<br/>
            그러나 오라클이 준 건 확인이 아니라 질문이었어요.<br/>
            네오는 오라클을 떠난 후에야 스스로 선택했습니다.
          </p>

          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(13,46,42,0.6)", lineHeight: 2, marginBottom: "2.5rem", paddingLeft: "1.2rem", borderLeft: "1px solid rgba(13,46,42,0.2)" }}>
            "조심해."<br/>
            네오가 돌아보는 순간 꽃병이 떨어졌습니다.<br/>
            "내가 말하지 않았다면 어땠을까?"
          </p>

          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.88rem", fontWeight: 300, color: "rgba(13,46,42,0.7)", lineHeight: 2.1, marginBottom: "3rem" }}>
            이 오라클은 열 가지 질문을 통해<br/>
            지금 당신이 반복하고 있는 장면,<br/>
            실제로 원하는 것,<br/>
            스스로에게 던지고 있는 진짜 질문을 찾아드립니다.<br/>
            답을 드리지 않아요.<br/>
            당신이 이미 알고 있었지만<br/>
            아직 말로 꺼내지 못한 것들을 비춰드립니다.
          </p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1.2rem" }}>
            <button className="oracle-btn" onClick={() => setPhase("questions")}>문 앞에 서다</button>
            <button className="back-link" onClick={onBack}>← 돌아가기</button>
          </div>
        </div>
      )}

      {/* 질문 */}
      {phase === "questions" && q && (
        <div style={{ width: "100%", maxWidth: 540, position: "relative", zIndex: 1 }}>
          <div style={{ width: "100%", height: "1px", background: "rgba(13,46,42,0.1)", marginBottom: "3.5rem" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "rgba(13,46,42,0.35)", transition: "width 0.6s ease" }} />
          </div>

          <div style={{ fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(13,46,42,0.35)", marginBottom: "0.6rem", fontFamily: "'Source Serif 4', serif" }}>
            {currentQ + 1} / {ORACLE_QUESTIONS.length} — {q.title}
          </div>

          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1rem, 2.8vw, 1.25rem)", fontWeight: 400, fontStyle: "italic", color: "#0d2e2a", lineHeight: 1.7, marginBottom: "2.2rem", whiteSpace: "pre-line" }}>
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
                  style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(13,46,42,0.3)", color: "#0d2e2a", fontFamily: "'Source Serif 4', serif", fontSize: "0.88rem", fontWeight: 300, padding: "0.6rem 0", outline: "none", marginTop: "0.5rem", boxSizing: "border-box" }}
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
          <div className="greek" style={{ color: "rgba(13,46,42,0.35)", marginBottom: "3rem" }}>γνῶθι σεαυτόν</div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(13,46,42,0.45)", marginBottom: "3rem", lineHeight: 1.9, animation: "flicker 4s ease-in-out infinite" }}>
            오라클이 당신의 답변을 읽고 있습니다
          </p>
          {/* 교육 텍스트 */}
          <div style={{ borderTop: "1px solid rgba(13,46,42,0.12)", paddingTop: "2rem", textAlign: "left", marginBottom: "3rem" }}>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(13,46,42,0.3)", marginBottom: "0.75rem" }}>우리가 스스로를 못 보는 이유</p>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.85rem", fontWeight: 300, color: "rgba(13,46,42,0.5)", lineHeight: 1.9, whiteSpace: "pre-line" }}>{`이상하지 않나요.
가장 오래 함께 산 사람이 자신인데
정작 자신을 가장 모르는 경우가 많아요.

이유가 있어요.

첫째, 우리는 보고 싶은 것만 봐요.
이미 믿고 있는 것을 확인해주는 정보만
자연스럽게 눈에 들어오거든요.
"나는 이런 사람이야"라는 믿음이 생기면
그 반대의 증거는 조용히 사라져요.

둘째, 감정이 렌즈가 돼요.
두렵거나 화가 났을 때
우리는 자신을 객관적으로 보기 어려워요.
감정이 현실을 해석하는 필터가 되거든요.

셋째, 자신과 너무 오래 가까이 있다 보니
정작 자신은 자신을 볼 수 없어요.

넷째, 우리는 오랫동안 특정한 방식으로
자신을 설명해왔어요.
그러다 보면 그게 진짜인지
습관인지 구분이 안 되기도 해요.

그래서 거울이 필요해요.
오라클은 그 거울이에요.`}</p>
          </div>
          <button className="door-open-btn" onClick={openDoor}>문을 열다</button>
        </div>
      )}

      {/* 열리는 중 */}
      {phase === "opening" && (
        <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div className="greek" style={{ color: "rgba(13,46,42,0.35)", marginBottom: "2rem" }}>γνῶθι σεαυτόν</div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(13,46,42,0.4)", animation: "breathe 2s ease-in-out infinite" }}>
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
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(42,26,74,0.7)", lineHeight: 2.2, whiteSpace: "pre-wrap" }}>
                {parsed["Reflection"]}
              </div>
            </div>
          )}

          {visibleSections.includes("Recognition") && parsed["Recognition"] && (
            <div className="oracle-appear" style={{ marginBottom: "2.5rem" }}>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(90,58,138,0.45)", marginBottom: "0.4rem" }}>오라클이 본 것</div>
              <div style={{ width: "100%", height: "1px", background: "rgba(90,58,138,0.15)", marginBottom: "1rem" }}/>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(42,26,74,0.7)", lineHeight: 2.2, whiteSpace: "pre-wrap" }}>
                {parsed["Recognition"]}
              </div>
            </div>
          )}

          {visibleSections.includes("Oracle") && parsed["Oracle"] && (
            <div className="oracle-appear" style={{ marginBottom: "2.5rem" }}>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(90,58,138,0.45)", marginBottom: "0.4rem" }}>오라클의 가설</div>
              <div style={{ width: "100%", height: "1px", background: "rgba(90,58,138,0.15)", marginBottom: "1rem" }}/>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(42,26,74,0.7)", lineHeight: 2.2, whiteSpace: "pre-wrap" }}>
                {parsed["Oracle"]}
              </div>
            </div>
          )}

          {visibleSections.includes("Story") && parsed["Story"] && (
            <div className="oracle-appear" style={{ marginBottom: "2.5rem" }}>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(90,58,138,0.45)", marginBottom: "0.4rem" }}>가설</div>
              <div style={{ width: "100%", height: "1px", background: "rgba(90,58,138,0.15)", marginBottom: "1rem" }}/>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, fontStyle: "italic", color: "rgba(42,26,74,0.7)", lineHeight: 2.2, whiteSpace: "pre-wrap" }}>
                {parsed["Story"]}
              </div>
            </div>
          )}

          {visibleSections.includes("Empowerment") && parsed["Empowerment"] && (
            <div className="oracle-appear" style={{ marginBottom: "3rem" }}>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(90,58,138,0.45)", marginBottom: "0.4rem" }}>문을 나서기 전에</div>
              <div style={{ width: "100%", height: "1px", background: "rgba(90,58,138,0.15)", marginBottom: "1rem" }}/>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(42,26,74,0.7)", lineHeight: 2.2, whiteSpace: "pre-wrap" }}>
                {parsed["Empowerment"]}
              </div>
            </div>
          )}

          {visibleSections.length === 5 && (
            <div className="oracle-appear" style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid rgba(90,58,138,0.1)" }}>
              <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
                <p style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",fontWeight:300,color:"rgba(90,58,138,0.4)",marginBottom:"1rem"}}>이 분석이 당신에게 맞나요?</p>
                <OracleFeedback />
              </div>
              <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                <button className="oracle-btn-result" onClick={() => setPhase("final")}>오라클의 제안 →</button>
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
      {phase === "final" && (
        <div style={{ width: "100%", maxWidth: 580, paddingTop: "2rem", paddingBottom: "4rem" }}>
          <div className="greek" style={{ color: "rgba(240,237,232,0.3)", marginBottom: "3rem", fontSize: "0.9rem" }}>γνῶθι σεαυτόν</div>

          {/* 골드+라벤더 더블 테두리 액자 */}
          <div style={{ position: "relative", padding: "3rem 2.5rem", border: "4px solid #c9a84c", boxShadow: "inset 0 0 0 8px #2d5a2d, inset 0 0 0 10px rgba(160,140,200,0.35)" }}>

            <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(240,237,232,0.75)", lineHeight: 1.9, whiteSpace: "pre-line" }}>
{`당신은 자신을 보았습니다.

이 결과는 당신이 누구인지를 정의하지 않아요.
오라클은 사람을 분류하거나 당신의 미래를 예측하는 것도 아닙니다.
오라클은 단지 당신이 반복적으로 선택해온 방식,
세상을 해석해온 습관,
그리고 무의식적으로 돌아가기 쉬운 길을 보여줄 뿐이에요.`}
            </div>

            <div style={{ width: "32px", height: "1px", background: "rgba(201,168,76,0.3)", margin: "2rem 0" }}/>

            <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(240,237,232,0.75)", lineHeight: 1.9, whiteSpace: "pre-line" }}>
{`당신이 지금까지 살아온 방식은
당신의 강점이었고,
여기까지 데려온 힘이었어요.

하지만 같은 방식이 한 방향으로만 반복된다면
때로는 같은 문제를 반복하게 만들기도 해요.

그리고 묻습니다.

당신은 왜 늘 같은 길을 선택해왔나요?`}
            </div>

            <div style={{ width: "32px", height: "1px", background: "rgba(201,168,76,0.3)", margin: "2rem 0" }}/>

            <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(240,237,232,0.75)", lineHeight: 1.9, whiteSpace: "pre-line" }}>
{`매트릭스에서 네오는 자신이 선택받은 자인지
확인받기 위해 오라클을 찾아갔어요.
하지만 오라클이 준 건 확인이 아니라 질문이었죠.
네오는 오라클과 헤어진 뒤
스스로 자신의 길을 생각하고 선택했습니다.

뭔가를 알게 되면 확신이 생겨
내가 달라질 거라고 기대하지 마세요.
달라진 내가 되기 위한 새로운 선택,
그것으로 충분합니다.`}
            </div>

            <div style={{ width: "32px", height: "1px", background: "rgba(201,168,76,0.3)", margin: "2rem 0" }}/>

            <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(240,237,232,0.75)", lineHeight: 1.9, whiteSpace: "pre-line" }}>
{`오라클은 당신의 전부를 본 것이 아니에요.
당신이 쓴 몇 개의 문장으로
당신이라는 사람 전체를 알 수는 없어요.
오라클이 본 건 그 문장들 안에 있는 패턴이에요.
당신의 일부분이고, 그것도 오늘의 일부분이에요.

분석이 맞지 않는다고 느껴지신다면
그 느낌 자체가 중요한 정보예요.
무엇이 틀렸는지, 왜 다르게 느껴지는지 —
분석지를 복사하셔서 당신의 AI와 상의해보세요.
직접 인지구조 검사를 요청하시는 것도 좋아요.

가족이나 가까운 사람들에게 보여주시고
피드백을 받아보세요.
특히 이해에 어려움을 겪은 상대가 있으시다면
함께 해보시고 분석지를 돌려가며 읽어보시면
도움이 되실 거예요.`}
            </div>

            <div style={{ width: "32px", height: "1px", background: "rgba(201,168,76,0.3)", margin: "2rem 0" }}/>

            <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.93rem", fontWeight: 300, color: "rgba(240,237,232,0.75)", lineHeight: 1.9, whiteSpace: "pre-line" }}>
{`그리고 언젠가 다시 오세요.
오늘 당신이 오라클에게 했던 말과
그 때 당신이 할 말이 달라져 있으실 거예요.

그것이 바로 당신 자신에 대해
조금이라도 새롭게 알게 되셨다는 증거니까요.

같이 기뻐하겠습니다.`}
            </div>

          </div>

          <div style={{ marginTop: "3rem", display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <button className="oracle-btn-result" onClick={() => {
              setPhase("intro");
              setAnswers({});
              setCurrentQ(0);
              setOracleText("");
              setVisibleSections([]);
              setSelectedOption(null);
              setTextAnswer("");
            }}>다시 시작</button>
            <button className="oracle-btn-result" onClick={() => {
              const text = `${parsed["Reflection"]}\n\n${parsed["Recognition"]}\n\n${parsed["Oracle"]}\n\n${parsed["Story"]}\n\n${parsed["Empowerment"]}`;
              navigator.clipboard.writeText(text);
              alert("복사되었습니다");
            }}>결과 복사</button>
            <a href="https://forms.gle/A6xXdAVUQoaNqaEWA" target="_blank" rel="noopener noreferrer" style={{fontFamily:"'Source Serif 4',serif",fontSize:"0.8rem",color:"rgba(240,237,232,0.45)",textDecoration:"underline",textUnderlineOffset:"3px"}}>당신의 경험을 들려주세요 →</a>
            <button className="back-link-result" onClick={onBack}>← 마음거울로</button>
          </div>
        </div>
      )}
    </div>
  );
}
