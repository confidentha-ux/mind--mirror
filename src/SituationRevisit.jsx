import { useState } from "react";

// ══════════════════════════════════════════════════════════════════
// Situation 다시 보기 — 재사용 컴포넌트 + 데이터
//
// 설계 원칙 (오늘 확정):
//  · 판정 없음 — 답을 남기되 해석/결과를 주지 않는다 (프롤로그 되돌림형과 동일 철학)
//  · 장면 회귀 — 프롤로그에서 본 장면 삽화를 다시 띄우고 그 위에 렌즈 질문을 얹는다
//  · 섹션1만 6유형 분기 — QuickTest 결과(유형)에 따라 질문이 달라진다
//
// 저장: onDone(payload) 로 상위에 전달. payload = { section, situation, question, answer }
//       진단에 쓰지 않고 종합분석 입력(낮은 가중치)으로만 사용.
// ══════════════════════════════════════════════════════════════════

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300&display=swap');`;

const DEEP = "#1F3A32";
const IVORY = "#F7F2E8";
const GOLD = "#C9A84C";

// 장면 삽화 (프롤로그와 동일 파일 재사용)
const SITUATION_IMAGES = {
  1: "/situation1.jpg",
  2: "/situation2.jpg",
  3: "/situation3.jpg",
};

// ──────────────────────────────────────────────────────────────────
// 섹션1 — Situation 1 다시 보기 (6유형 분기)
// ──────────────────────────────────────────────────────────────────

const SECTION1_BRANCHES = {
  "이해 후 행동형": {
    question: "이 장면에서, 당신은 무엇을 이해한 뒤 움직이고 싶습니까?",
    options: [
      "친구가 왜 지금 이 부탁을 꺼냈는지",
      "친구가 실제로 어떤 도움을 필요로 하는지",
      "이 일이 얼마나 급한 상황인지",
      "내가 도우면 일이 어떻게 흘러갈지",
      "거절하면 어떤 일이 생길지",
      "지금 내가 이 상황을 충분히 이해하고 있는지",
    ],
  },
  "행동 후 이해형": {
    question: "이 장면에서, 당신은 무엇을 먼저 해보며 상황을 파악하려 합니까?",
    options: [
      "친구에게 가장 급한 일이 무엇인지 바로 묻는다",
      "지금 당장 할 수 있는 작은 도움부터 찾는다",
      "내가 가능한 시간이나 범위를 먼저 말해본다",
      "완전히 돕기 어렵다면 일부라도 할 수 있는 방법을 찾는다",
      "다른 도움을 받을 수 있는 사람이나 방법을 바로 떠올린다",
      "오래 고민하기보다 지금 할 수 있는 첫 행동을 정한다",
    ],
  },
  "관계 우선형": {
    question: "이 장면에서, 당신은 이 선택이 관계에 무엇을 남길지 먼저 보려 합니까?",
    options: [
      "친구가 이 부탁을 꺼내기까지 얼마나 망설였을지",
      "내가 거절했을 때 친구가 어떤 마음이 될지",
      "도와주었을 때 이 관계가 어떻게 달라질지",
      "도와주지 않았을 때 이 관계에 무엇이 남을지",
      "이 부탁이 우리 사이의 신뢰와 어떤 관련이 있는지",
      "내가 어떤 대답을 해야 관계를 덜 상하게 할 수 있을지",
    ],
  },
  "안정 우선형": {
    question: "이 장면에서, 당신은 무엇이 무너지지 않도록 먼저 지키려 합니까?",
    options: [
      "내가 감당할 수 있는 선을 넘지 않는 것",
      "내 일정과 생활이 크게 흔들리지 않는 것",
      "친구가 혼자 감당하다 더 어려워지지 않는 것",
      "도와준 뒤 부담이 계속 커지지 않는 것",
      "급하게 대답해서 후회하지 않는 것",
      "서로에게 감당하기 어려운 약속을 만들지 않는 것",
    ],
  },
  "직관 신뢰형": {
    question: "이 장면에서, 당신은 어떤 느낌을 먼저 믿고 싶습니까?",
    options: [
      "친구의 말투에서 느껴지는 절박함",
      "이 부탁이 평소와 다르다는 느낌",
      "내가 이미 마음이 무거워졌다는 사실",
      "도와야 할 것 같다는 마음의 끌림",
      "지금 대답하면 안 될 것 같은 느낌",
      "이 부탁 뒤에 말하지 않은 무언가가 있다는 느낌",
    ],
  },
  // ※ 정확성 우선형: 현재 배포된 QuickTest에는 이 유형이 없음(5유형 운영 중).
  //    앱에 6번째 유형이 추가될 때를 대비해 분기만 미리 준비해 둠. 현재는 호출되지 않음.
  "정확성 우선형": {
    question: "이 장면에서, 당신은 무엇이 정확해야 한다고 먼저 느낍니까?",
    options: [
      "친구가 말한 상황이 정확히 어떤 일인지",
      "친구가 필요한 도움의 범위가 어디까지인지",
      "내가 책임져야 할 일과 아닌 일이 무엇인지",
      "지금 바로 답해도 될 만큼 정보가 충분한지",
      "내가 오해하고 있는 부분은 없는지",
      "어떤 대답이 상황에 가장 맞는지",
    ],
  },
};

// ──────────────────────────────────────────────────────────────────
// 다시 보기 전체 정의 (섹션 → 어느 Situation을 어떤 렌즈로)
// ──────────────────────────────────────────────────────────────────

export const REVISITS = {
  // 섹션1 — Situation 1, 기본값 렌즈, 6유형 분기
  section1: {
    situation: 1,
    intro: "내 마음의 기본값을 확인했습니다.\n이제 그 장면으로 다시 돌아갑니다.",
    branched: true,
    branches: SECTION1_BRANCHES,
  },

  // 섹션2 — Situation 2, 첫 화면 렌즈
  section2: {
    situation: 2,
    intro: "내 마음의 첫 화면을 확인했습니다.\n이제 그 회의실로 다시 돌아갑니다.",
    branched: false,
    question: "이 장면으로 다시 돌아왔을 때, 당신은 무엇이 가장 먼저 신경 쓰입니까?",
    options: [
      "고객이 실망한 이유가 무엇인지",
      "발표자가 지금 얼마나 당황했는지",
      "팀원들이 서로를 어떻게 보고 있는지",
      "사장이 아무 말도 하지 않는 이유가 무엇인지",
      "모두의 시선이 나에게 모이는 이 순간",
      "이 회의가 앞으로 관계와 평가에 무엇을 남길지",
    ],
  },

  // 섹션3 — Situation 2 (재방문), 운영체계 렌즈
  section3: {
    situation: 2,
    intro: "내 마음의 운영체계를 확인했습니다.\n다시 한번 그 회의실로 돌아갑니다.",
    branched: false,
    question: "이 장면으로 다시 돌아왔을 때, 당신은 이 상황을 무엇부터 다루려 합니까?",
    options: [
      "문제가 어디서 생겼는지 먼저 정리한다",
      "분위기가 더 굳기 전에 먼저 말을 꺼낸다",
      "고객, 발표자, 팀원의 반응을 먼저 살핀다",
      "내가 어디까지 개입해야 하는지 먼저 판단한다",
      "지금은 말하지 않고 조금 더 상황을 본다",
      "회의가 끝난 뒤 따로 정리하는 편이 낫다고 본다",
    ],
  },

  // 섹션4 — Situation 3, 메모리 렌즈
  section4: {
    situation: 3,
    intro: "내 마음의 메모리를 확인했습니다.\n이제 세 가지 가능성 앞으로 돌아갑니다.",
    branched: false,
    question: "다시 돌아와서 생각해 봅니다. 당신의 선택은 어떤 기억이나 생각에서 나왔다고 느껴집니까?",
    options: [
      "더 나아 보이는 선택을 했지만, 나중에 생각보다 감당할 것이 많았던 경험",
      "익숙한 쪽을 선택했지만, 시간이 지나고 나서 다른 가능성이 마음에 남았던 경험",
      "새로운 쪽을 선택했지만, 적응하는 동안 예상보다 많이 흔들렸던 경험",
      "당장 움직이지 않고 기다렸을 때, 오히려 상황을 더 잘 볼 수 있었던 경험",
      "조건은 좋아 보였지만, 내 기준과 잘 맞지 않아 오래 불편했던 경험",
      "확실하지 않은 선택이었지만, 시간이 지나며 나에게 필요한 길이 되었던 경험",
    ],
  },

  // 섹션5 — Situation 3 (재방문), 새창열기 렌즈: 세 장면 보고 재선택
  section5: {
    situation: 3,
    intro: "당신은 선택을 했고, 그 이유도 생각해 보았습니다.\n이제 당신이 하지 않은 선택의 하루를 봅니다.",
    branched: false,
    scenes: [
      {
        title: "다른 자리로 옮겼다면",
        lines: [
          "익숙한 곳의 다른 자리에 앉아 있습니다.",
          "사람들이 이전보다 자주 당신의 의견을 구합니다.",
          "당신의 말 한마디가 조금 더 힘을 갖기 시작했다는 걸, 스스로도 느낍니다.",
        ],
      },
      {
        title: "전혀 다른 곳으로 옮겼다면",
        lines: [
          "처음 보는 사람들 사이에 서 있습니다.",
          "낯선 공간이 오히려 당신을 깨어있게 만듭니다.",
          "아무도 당신을 예전 방식으로 보지 않는다는 것이, 생각보다 홀가분합니다.",
        ],
      },
      {
        title: "미루고 기다렸다면",
        lines: [
          "당신은 익숙한 자리에서 다시 하루를 시작합니다.",
          "서두르지 않아도 된다는 사실이 오히려 든든합니다.",
          "다음 기회를 준비하며 적어 내려가는 메모 한 줄 한 줄이, 당신이 스스로 만들어가는 길이라는 걸 알려줍니다.",
        ],
      },
    ],
    question: "이 세 장면을 모두 보고, 당신은 무엇을 선택하겠습니까?",
    options: ["다른 자리로 옮긴다", "전혀 다른 곳으로 옮긴다", "미루고 기다린다"],
  },
};

// ──────────────────────────────────────────────────────────────────
// 재사용 컴포넌트
//   props: sectionKey ("section1".."section5"), userType (섹션1 분기용), onDone(payload)
// ──────────────────────────────────────────────────────────────────

export default function SituationRevisit({ sectionKey, userType, onDone }) {
  const spec = REVISITS[sectionKey];
  const [answered, setAnswered] = useState(false);

  // 섹션1은 유형 분기 — 유형이 없거나 매칭 안 되면 관계 우선형으로 폴백(안전장치)
  let question, options;
  if (spec.branched) {
    const branch = spec.branches[userType] || spec.branches["관계 우선형"];
    question = branch.question;
    options = branch.options;
  } else {
    question = spec.question;
    options = spec.options;
  }

  function choose(opt) {
    setAnswered(true);
    setTimeout(() => {
      onDone && onDone({
        section: sectionKey,
        situation: spec.situation,
        question,
        answer: opt,
      });
    }, 340);
  }

  return (
    <div style={{
      minHeight: "100vh", background: DEEP,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "3rem 1.5rem",
    }}>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px);} to {opacity:1; transform:translateY(0);} }
        .fade { animation: fadeUp 1.1s ease forwards; opacity:0; }
        .choice-btn { transition: all 0.35s ease; }
        .choice-btn:hover { background: rgba(201,168,76,0.12) !important; border-color: ${GOLD} !important; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 600 }}>
        {/* 라벨 */}
        <div className="fade" style={{ animationDelay: "0.1s" }}>
          <div style={{
            fontFamily: "'Source Serif 4',serif", fontSize: "0.6rem",
            letterSpacing: "0.3em", textTransform: "uppercase",
            color: GOLD, marginBottom: "1.5rem",
          }}>Situation {String(spec.situation).padStart(2, "0")} · 다시 보기</div>
        </div>

        {/* 도입 */}
        <div className="fade" style={{ animationDelay: "0.3s", marginBottom: "1.75rem" }}>
          {spec.intro.split("\n").map((line, i) => (
            <p key={i} style={{
              fontFamily: "'Source Serif 4',serif", fontSize: "0.95rem",
              fontWeight: 300, color: "rgba(247,242,232,0.7)", lineHeight: 1.95,
            }}>{line}</p>
          ))}
        </div>

        {/* 장면 삽화 재등장 */}
        <div className="fade" style={{ animationDelay: "0.5s", marginBottom: "2rem" }}>
          <div style={{
            width: "100%", aspectRatio: "3/4", maxHeight: 300,
            borderRadius: "3px", overflow: "hidden",
            border: "1px solid rgba(201,168,76,0.2)",
          }}>
            <img src={SITUATION_IMAGES[spec.situation]} alt={`Situation ${spec.situation}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </div>

        {/* 섹션5 전용: 세 장면 먼저 보여주기 */}
        {spec.scenes && (
          <div className="fade" style={{ animationDelay: "0.7s", marginBottom: "2.5rem" }}>
            {spec.scenes.map((sc, i) => (
              <div key={i} style={{
                marginBottom: "1.5rem", paddingBottom: "1.5rem",
                borderBottom: i < spec.scenes.length - 1 ? "1px solid rgba(247,242,232,0.1)" : "none",
              }}>
                <div style={{
                  fontFamily: "'Source Serif 4',serif", fontSize: "0.6rem",
                  letterSpacing: "0.2em", textTransform: "uppercase",
                  color: GOLD, marginBottom: "0.75rem", opacity: 0.8,
                }}>{sc.title}</div>
                {sc.lines.map((l, j) => (
                  <p key={j} style={{
                    fontFamily: "'Source Serif 4',serif", fontSize: "0.92rem",
                    fontWeight: 300, color: "rgba(247,242,232,0.75)",
                    lineHeight: 1.9, marginBottom: "0.3rem",
                  }}>{l}</p>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* 질문 */}
        <div className="fade" style={{ animationDelay: spec.scenes ? "0.9s" : "0.7s", marginBottom: "1.5rem" }}>
          <p style={{
            fontFamily: "'Playfair Display',serif", fontSize: "1.12rem",
            fontWeight: 400, color: IVORY, lineHeight: 1.5,
          }}>{question}</p>
        </div>

        {/* 선택지 */}
        <div className="fade" style={{ animationDelay: spec.scenes ? "1.1s" : "0.9s", opacity: answered ? 0.4 : undefined }}>
          {options.map((opt, i) => (
            <button key={i} className="choice-btn" disabled={answered} onClick={() => choose(opt)} style={{
              width: "100%", background: "rgba(247,242,232,0.04)",
              border: "1px solid rgba(247,242,232,0.14)",
              color: "rgba(247,242,232,0.85)",
              fontFamily: "'Source Serif 4',serif", fontSize: "0.9rem", fontWeight: 300,
              textAlign: "left", padding: "0.95rem 1.2rem",
              cursor: answered ? "default" : "pointer", marginBottom: "0.5rem", lineHeight: 1.5,
            }}>{opt}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
