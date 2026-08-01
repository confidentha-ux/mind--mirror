import { useState } from "react";

// ──────────────────────────────────────────────────────────────────
// Situation 다시 보기
// App.js에서 sectionKey, userType, onDone을 전달받아 사용합니다.
// 답변 결과는 { section, situation, question, answer } 형태로 반환합니다.
// 섹션5(최종 선택)만 answer 뒤에 짧은 이유(reason) 질문이 추가됩니다.
// ──────────────────────────────────────────────────────────────────

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300&display=swap');`;

const DEEP = "#1F3A32";
const IVORY = "#F7F2E8";
const GOLD = "#C9A84C";

const SITUATION_IMAGES = {
  1: "/situation1.jpg",
  2: "/situation2.jpg",
  3: "/situation3.jpg",
};

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
    question:
      "이 장면에서, 당신은 무엇을 먼저 해보며 상황을 파악하려 합니까?",
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
    question:
      "이 장면에서, 당신은 이 선택이 관계에 무엇을 남길지 먼저 보려 합니까?",
    options: [
      "친구가 이 부탁을 꺼내기까지 얼마나 망설였을지",
      "내가 거절했을 때 친구가 어떤 마음이 될지",
      "도와주었을 때 이 관계가 어떻게 달라질지",
      "도와주지 않았을 때 이 관계에 무엇이 남을지",
      "이 부탁이 우리 사이의 신뢰와 어떤 관련이 있는지",
      "내가 어떤 대답을 해야 관계를 덜 상하게 할 수 있을지",
    ],
  },

  "안전 우선형": {
    question:
      "이 장면에서, 당신은 무엇이 무너지지 않도록 먼저 지키려 합니까?",
    options: [
      "내가 감당할 수 있는 선을 넘지 않는 것",
      "내 일정과 생활이 크게 흔들리지 않는 것",
      "친구가 혼자 감당하다 더 어려워지지 않는 것",
      "도와준 뒤 부담이 계속 커지지 않는 것",
      "급하게 대답해서 후회하지 않는 것",
      "서로에게 감당하기 어려운 약속을 만들지 않는 것",
    ],
  },

  // 이전 저장 데이터와도 호환되도록 남겨둡니다.
  "안정 우선형": {
    question:
      "이 장면에서, 당신은 무엇이 무너지지 않도록 먼저 지키려 합니까?",
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

  "정확성 우선형": {
    question:
      "이 장면에서, 당신은 무엇이 정확해야 한다고 먼저 느낍니까?",
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

export const REVISITS = {
  section1: {
    situation: 1,
    intro:
      "당신은 친구의 부탁 앞에서 한 번 선택했습니다.\n이제 같은 장면으로 돌아가, 무엇을 먼저 기준으로 삼는지 다시 확인합니다.",
    branched: true,
    branches: SECTION1_BRANCHES,
  },

  section2: {
    situation: 2,
    intro:
      "회의실의 상황으로 다시 돌아갑니다.\n이번에는 분석하거나 해결하기 전에, 무엇이 가장 먼저 마음에 걸리는지 살펴봅니다.",
    branched: false,
    question: "이 순간 당신에게 가장 먼저 걸리는 것은 무엇입니까?",
    options: [
      "고객이 실망한 이유가 무엇인지",
      "발표자가 지금 얼마나 당황했는지",
      "팀원들이 서로를 어떻게 보고 있는지",
      "책임자가 아무 말도 하지 않는 이유가 무엇인지",
      "모두의 시선이 나에게 모이는 이 순간",
      "이 회의가 앞으로 관계와 평가에 무엇을 남길지",
    ],
  },

  section3: {
    situation: 2,
    intro:
      "같은 회의실로 다시 돌아갑니다.\n이번에는 이 상황을 어떤 순서로 처리하려는지 살펴봅니다.",
    branched: false,
    question: "이 상황을 다시 처리해야 한다면, 무엇부터 하겠습니까?",
    options: [
      "문제가 어디서 생겼는지 먼저 정리한다",
      "분위기가 더 굳기 전에 먼저 말을 꺼낸다",
      "고객과 발표자, 팀원의 반응을 먼저 살핀다",
      "내가 어디까지 개입해야 하는지 먼저 판단한다",
      "지금은 말하지 않고 상황을 조금 더 확인한다",
      "회의가 끝난 뒤 따로 정리할 내용을 먼저 생각한다",
    ],
  },

  section4: {
    situation: 3,
    intro:
      "세 가지 경력 선택 앞에서 했던 판단으로 다시 돌아갑니다.\n이번에는 선택 자체보다, 그 선택을 떠받치고 있던 걱정을 확인합니다.",
    branched: false,
    question:
      "이 장면으로 다시 돌아왔을 때, 당신 안에서 가장 걱정되는 것은 무엇입니까?",
    options: [
      "새로운 역할을 맡았지만 기대만큼 성장하지 못하는 것",
      "더 높은 책임을 맡고도 충분히 해내지 못하는 것",
      "새 회사로 옮긴 뒤 예상과 다른 현실을 만나는 것",
      "새로운 환경에 적응하는 동안 지금까지 쌓은 것을 잃는 것",
      "두 제안을 거절한 뒤 좋은 기회를 놓쳤다고 후회하는 것",
      "현재 자리에 남았지만 다음 기회를 스스로 만들지 못하는 것",
    ],
  },

  section5: {
    situation: 3,
    intro:
      "당신은 세 가지 가능성 앞에서 한 번 선택했습니다.\n이제 각각의 선택 이후에 이어질 하루를 보고, 다시 판단합니다.",
    branched: false,
    scenes: [
      {
        title: "A · 지금 있는 곳에서 역할을 확장했다면",
        lines: [
          "당신은 익숙한 곳 안의 새로운 자리에 앉아 있습니다.",
          "직책과 책임은 달라졌고, 이전보다 더 많은 사람이 당신의 판단을 기다립니다.",
          "조건은 크게 달라지지 않았지만, 앞으로 맡을 수 있는 일의 범위는 넓어졌습니다.",
        ],
      },
      {
        title: "B · 전혀 다른 곳으로 옮겼다면",
        lines: [
          "당신은 처음 보는 사람들과 새로운 일을 시작합니다.",
          "배워야 할 것이 많지만, 이전보다 나은 조건과 새로운 가능성이 열려 있습니다.",
          "낯선 일정들이 하나둘 잡히고 있습니다.",
        ],
      },
      {
        title: "C · 현재 자리에서 기반을 강화했다면",
        lines: [
          "당신은 두 가능성을 모두 미루고 익숙한 자리에서 다시 하루를 시작합니다.",
          "하지만 이전과 같은 하루를 반복하는 것은 아닙니다.",
          "다음 기회를 맡을 사람에게 필요한 경험과 기준을 현재 자리에서 쌓아갑니다.",
        ],
      },
    ],
    question:
      "세 가지 가능성을 다시 본 지금, 당신은 무엇을 선택하겠습니까?",
    options: [
      "지금 있는 곳에서 새로운 역할로 확장한다",
      "전혀 다른 곳에서 새로운 일을 시작한다",
      "현재 자리에서 다음 기회를 준비한다",
    ],
  },
};

export default function SituationRevisit({
  sectionKey,
  userType,
  onDone,
}) {
  const spec = REVISITS[sectionKey];
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [askReason, setAskReason] = useState(false);
  const [reasonText, setReasonText] = useState("");

  if (!spec) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: DEEP,
          color: IVORY,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          fontFamily: "'Source Serif 4', serif",
        }}
      >
        다시 볼 장면을 찾을 수 없습니다.
      </div>
    );
  }

  let question = spec.question;
  let options = spec.options;

  if (spec.branched) {
    const branch =
      spec.branches[userType] || spec.branches["관계 우선형"];

    question = branch.question;
    options = branch.options;
  }

  function finish(option, reason) {
    if (onDone) {
      onDone({
        section: sectionKey,
        situation: spec.situation,
        question,
        answer: option,
        ...(reason ? { reason } : {}),
      });
    }
  }

  function choose(option) {
    if (answered) return;

    setAnswered(true);
    setSelectedAnswer(option);

    // 섹션5(최종 선택)만: 답 고르고 짧은 이유를 하나 더 물어본 뒤 완료 처리
    if (sectionKey === "section5") {
      window.setTimeout(() => setAskReason(true), 340);
      return;
    }

    window.setTimeout(() => finish(option), 340);
  }

  function submitReason() {
    finish(selectedAnswer, reasonText.trim());
  }

  if (askReason) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: DEEP,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 1.5rem",
        }}
      >
        <style>{`
          ${FONTS}
          * { box-sizing: border-box; }
          body { margin: 0; }
          @keyframes fadeUp { from { opacity:0; transform:translateY(18px);} to {opacity:1; transform:translateY(0);} }
          .revisit-fade { opacity: 0; animation: fadeUp 0.9s ease forwards; }
        `}</style>
        <main style={{ width: "100%", maxWidth: 600 }}>
          <div className="revisit-fade" style={{ animationDelay: "0.1s", marginBottom: "1.5rem" }}>
            <div style={{
              fontFamily: "'Source Serif 4', serif", fontSize: "0.62rem",
              letterSpacing: "0.3em", textTransform: "uppercase",
              color: GOLD, marginBottom: "1.5rem",
            }}>마지막으로</div>
            <p style={{
              fontFamily: "'Playfair Display', serif", fontSize: "1.12rem",
              fontWeight: 400, color: IVORY, lineHeight: 1.5,
            }}>"{selectedAnswer}" — 이 선택을 이끈 것은 무엇이었나요?</p>
          </div>
          <div className="revisit-fade" style={{ animationDelay: "0.35s", marginBottom: "1.25rem" }}>
            <textarea
              value={reasonText}
              onChange={e => setReasonText(e.target.value)}
              placeholder="짧게, 떠오르는 대로 적어주세요"
              rows={3}
              style={{
                width: "100%", background: "rgba(247,242,232,0.05)",
                border: "1px solid rgba(247,242,232,0.18)", color: IVORY,
                fontFamily: "'Source Serif 4', serif", fontSize: "0.92rem", fontWeight: 300,
                padding: "0.9rem 1rem", resize: "none", outline: "none", lineHeight: 1.7,
              }}
            />
          </div>
          <div className="revisit-fade" style={{ animationDelay: "0.5s" }}>
            <button onClick={submitReason} disabled={!reasonText.trim()} style={{
              background: reasonText.trim() ? GOLD : "transparent",
              border: `1px solid ${GOLD}`,
              color: reasonText.trim() ? "#1F3A32" : GOLD,
              opacity: reasonText.trim() ? 1 : 0.4,
              fontFamily: "'Source Serif 4', serif", fontSize: "0.75rem",
              letterSpacing: "0.2em", textTransform: "uppercase",
              padding: "0.75rem 1.8rem", cursor: reasonText.trim() ? "pointer" : "default",
            }}>다음으로 →</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: DEEP,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.5rem",
      }}
    >
      <style>{`
        ${FONTS}

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .revisit-fade {
          opacity: 0;
          animation: fadeUp 0.9s ease forwards;
        }

        .revisit-choice {
          transition:
            background 0.25s ease,
            border-color 0.25s ease,
            opacity 0.25s ease,
            transform 0.25s ease;
        }

        .revisit-choice:hover:not(:disabled) {
          background: rgba(201, 168, 76, 0.12) !important;
          border-color: ${GOLD} !important;
          transform: translateY(-1px);
        }

        .revisit-choice:focus-visible {
          outline: 2px solid ${GOLD};
          outline-offset: 3px;
        }

        @media (max-width: 640px) {
          .revisit-shell {
            padding-top: 1rem;
            padding-bottom: 1rem;
          }

          .revisit-image {
            max-height: 260px !important;
          }
        }
      `}</style>

      <main
        className="revisit-shell"
        style={{
          width: "100%",
          maxWidth: 620,
        }}
      >
        <div
          className="revisit-fade"
          style={{ animationDelay: "0.05s" }}
        >
          <div
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "0.62rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: GOLD,
              marginBottom: "1.5rem",
            }}
          >
            그 장면, 다시
          </div>
        </div>

        <section
          className="revisit-fade"
          style={{
            animationDelay: "0.15s",
            marginBottom: "1.75rem",
          }}
        >
          {spec.intro.split("\n").map((line, index) => (
            <p
              key={index}
              style={{
                margin: 0,
                fontFamily: "'Source Serif 4', serif",
                fontSize: "0.97rem",
                fontWeight: 300,
                color: "rgba(247,242,232,0.72)",
                lineHeight: 1.95,
              }}
            >
              {line}
            </p>
          ))}
        </section>

        <div
          className="revisit-fade"
          style={{
            animationDelay: "0.25s",
            marginBottom: "2rem",
          }}
        >
          <div
            className="revisit-image"
            style={{
              width: "100%",
              aspectRatio: "3 / 4",
              maxHeight: 300,
              borderRadius: 3,
              overflow: "hidden",
              border: "1px solid rgba(201,168,76,0.2)",
            }}
          >
            <img
              src={SITUATION_IMAGES[spec.situation]}
              alt={`Situation ${spec.situation}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        </div>

        {spec.scenes && (
          <section
            className="revisit-fade"
            style={{
              animationDelay: "0.35s",
              marginBottom: "2.5rem",
            }}
          >
            {spec.scenes.map((scene, index) => (
              <div
                key={scene.title}
                style={{
                  marginBottom: "1.5rem",
                  paddingBottom: "1.5rem",
                  borderBottom:
                    index < spec.scenes.length - 1
                      ? "1px solid rgba(247,242,232,0.1)"
                      : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "0.64rem",
                    letterSpacing: "0.16em",
                    color: GOLD,
                    marginBottom: "0.75rem",
                    opacity: 0.9,
                  }}
                >
                  {scene.title}
                </div>

                {scene.lines.map((line, lineIndex) => (
                  <p
                    key={lineIndex}
                    style={{
                      margin: "0 0 0.3rem",
                      fontFamily: "'Source Serif 4', serif",
                      fontSize: "0.92rem",
                      fontWeight: 300,
                      color: "rgba(247,242,232,0.76)",
                      lineHeight: 1.9,
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </section>
        )}

        <section
          className="revisit-fade"
          style={{
            animationDelay: spec.scenes ? "0.45s" : "0.35s",
            marginBottom: "1.5rem",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.15rem",
              fontWeight: 400,
              color: IVORY,
              lineHeight: 1.6,
            }}
          >
            {question}
          </p>
        </section>

        <section
          className="revisit-fade"
          style={{
            animationDelay: spec.scenes ? "0.55s" : "0.45s",
          }}
        >
          {options.map((option) => {
            const isSelected = selectedAnswer === option;

            return (
              <button
                key={option}
                type="button"
                className="revisit-choice"
                disabled={answered}
                onClick={() => choose(option)}
                style={{
                  width: "100%",
                  background: isSelected
                    ? "rgba(201,168,76,0.16)"
                    : "rgba(247,242,232,0.04)",
                  border: isSelected
                    ? `1px solid ${GOLD}`
                    : "1px solid rgba(247,242,232,0.14)",
                  color: "rgba(247,242,232,0.88)",
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "0.9rem",
                  fontWeight: 300,
                  textAlign: "left",
                  padding: "0.95rem 1.2rem",
                  cursor: answered ? "default" : "pointer",
                  marginBottom: "0.55rem",
                  lineHeight: 1.55,
                  opacity: answered && !isSelected ? 0.42 : 1,
                }}
              >
                {option}
              </button>
            );
          })}
        </section>
      </main>
    </div>
  );
}
