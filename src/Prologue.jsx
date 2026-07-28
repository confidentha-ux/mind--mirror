import { useState } from "react";

// ────────────────────────────────────────────────────────────────
// 장면 데이터 — 별도 객체로 분리 (나중에 "Situation 다시 보기"가 재사용)
// ────────────────────────────────────────────────────────────────

const SITUATIONS = [
  {
    id: 1,
    label: "Situation 01",
    scene: [
      "오랜만에 만난 친구와 마주 앉아 있습니다.",
      "처음에는 가벼운 이야기가 오갔습니다.",
      "하지만 어느 순간부터 친구의 말수가 줄어듭니다.",
      "친구는 컵을 만지작거리다가 한참 뒤에야 조심스럽게 입을 엽니다.",
    ],
    quote: "\u201C미안한데\u2026 이번 한 번만 나 좀 도와줄 수 있을까?\u201D",
    sceneAfter: [
      "당신도 지금 여유가 없습니다. 이미 해야 할 일들이 밀려 있고, 마음도 충분히 지쳐 있습니다.",
      "도와주면 당신의 계획은 흔들릴 수 있습니다. 거절하면 친구는 혼자 이 문제를 감당해야 할지도 모릅니다.",
      "친구는 더 말하지 않습니다. 그저 당신의 대답을 기다리고 있습니다.",
    ],
    question: "이 순간 당신에게 가장 먼저 걸리는 것은 무엇입니까?",
    options: [
      "친구가 이 말을 꺼내기까지 얼마나 망설였을지",
      "내가 지금 감당할 수 있는 여유가 얼마나 남아 있는지",
      "도와주지 않았을 때 이 관계에 무엇이 남을지",
      "도와준 뒤 내 일정과 생활이 얼마나 흔들릴지",
      "지금 바로 대답해도 되는 상황인지",
      "부탁을 듣는 순간 내 마음이 이미 무거워졌다는 사실",
    ],
  },
  {
    id: 2,
    label: "Situation 02",
    scene: [
      "당신은 프로젝트의 중간 관리자입니다.",
      "몇 달 동안 준비해 온 프로젝트의 최종 발표가 막 끝났습니다.",
      "회의실에는 네 부류의 사람이 앉아 있습니다.",
      "프로젝트를 승인할 사장, 결과를 기다리는 고객, 함께 준비한 팀원들, 그리고 그 사이에 있는 당신.",
    ],
    quote: "\u201C죄송하지만, 저희가 기대했던 방향과는 조금 다른 것 같습니다.\u201D",
    sceneAfter: [
      "회의실의 공기가 무거워집니다. 발표자는 당황한 표정으로 자료를 다시 넘깁니다.",
      "팀원들은 서로의 눈치를 보기 시작합니다. 사장은 아무 말도 하지 않습니다.",
      "당신은 문득 깨닫습니다. 지금 이 회의실에서 가장 먼저 말을 해야 하는 사람이 어쩌면 자신일 수도 있다는 것을. 그 순간, 회의실의 시선이 천천히 당신에게 모입니다.",
    ],
    question: "이 순간 당신 안에서 가장 먼저 생기는 감정은 무엇입니까?",
    options: [
      "누군가 상처받을 것 같은 조심스러움",
      "내가 뭔가 해야 할 것 같은 부담감",
      "분위기가 더 나빠질 것 같은 불안",
      "제대로 준비되지 않은 상황에 대한 답답함",
      "서로를 탓할 것 같은 피로감",
      "잠시 아무 말도 하지 않고 지켜보고 싶은 마음",
    ],
  },
  {
    id: 3,
    label: "Situation 03",
    scene: [
      "늦은 오후, 당신은 잠시 하던 일을 멈추고 창밖을 봅니다.",
      "지금 있는 자리가 나쁘지 않습니다. 오히려 편안합니다.",
      "다만 요즘 들어, 편안함 너머에 무언가 더 있을지도 모른다는 생각이 자꾸 마음을 두드립니다.",
      "마침, 당신 앞에 세 가지 가능성이 열렸습니다.",
    ],
    quote: null,
    sceneAfter: [],
    question: "세 가지 가능성 앞에서, 당신은 처음 어디로 움직입니까?",
    options: [
      "지금 있는 곳에서 다른 자리로 옮긴다 \u2014 지위는 오르지만 돈은 그대로다",
      "전혀 다른 곳으로 옮긴다 \u2014 해본 적 없는 일이지만 돈은 지금보다 오른다",
      "두 가능성을 모두 미룬다 \u2014 지금 있는 곳에 머물며, 다음 기회를 만든다",
    ],
  },
];

// ────────────────────────────────────────────────────────────────
// 스타일 토큰 (기존 앱과 동일)
// ────────────────────────────────────────────────────────────────

const SITUATION_IMAGES = {
  1: "/situation1.jpg",
  2: "/situation2.jpg",
  3: "/situation3.jpg",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300&display=swap');`;

const DEEP = "#1F3A32";
const IVORY = "#F7F2E8";
const GOLD = "#C9A84C";

// ────────────────────────────────────────────────────────────────
// Prologue 컴포넌트
// ────────────────────────────────────────────────────────────────

export default function Prologue({ onEnter, onBack }) {
  const [phase, setPhase] = useState("door");      // door → situations → reveal
  const [current, setCurrent] = useState(0);
  const [choices, setChoices] = useState({});       // { 0: optionText, 1: ..., 2: ... }

  const sit = SITUATIONS[current];

  function choose(opt) {
    const next = { ...choices, [current]: opt };
    setChoices(next);
    setTimeout(() => {
      if (current < SITUATIONS.length - 1) {
        setCurrent(current + 1);
      } else {
        setPhase("reveal");
      }
    }, 320);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: DEEP,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "3rem 1.5rem",
    }}>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slowGlow { 0%,100%{opacity:0.5} 50%{opacity:0.9} }
        .fade { animation: fadeUp 1.1s ease forwards; opacity:0; }
        .choice-btn { transition: all 0.35s ease; }
        .choice-btn:hover { background: rgba(201,168,76,0.12) !important; border-color: ${GOLD} !important; }
      `}</style>

      {/* ── 문 앞 ─────────────────────────────────────────── */}
      {phase === "door" && (
        <div style={{ width: "100%", maxWidth: 560, textAlign: "center" }}>
          <div className="fade" style={{ animationDelay: "0.05s", marginBottom: "2.5rem" }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: "1rem", color: "rgba(247,242,232,0.55)", marginBottom: "0.15rem" }}>마음거울</div>
            <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(247,242,232,0.3)" }}>Mirroring Mind</div>
          </div>
          <div className="fade" style={{ animationDelay: "0.1s" }}>
            <div style={{
              fontFamily: "'Source Serif 4',serif", fontSize: "0.62rem",
              letterSpacing: "0.35em", textTransform: "uppercase",
              color: GOLD, marginBottom: "2.5rem",
            }}>Prologue</div>
          </div>

          <div className="fade" style={{ animationDelay: "0.5s" }}>
            <h1 style={{
              fontFamily: "'Playfair Display',serif", fontStyle: "italic",
              fontSize: "clamp(1.7rem,4.5vw,2.4rem)", fontWeight: 400,
              color: IVORY, lineHeight: 1.3, marginBottom: "2.5rem",
            }}>Read Your Life Again.</h1>
          </div>

          <div className="fade" style={{ animationDelay: "1.1s", marginBottom: "3rem" }}>
            {[
              "사람은 같은 삶을 반복하는 것이 아니라,",
              "같은 질문을 반복하며 살아갈 때가 있습니다.",
              "그 질문은 나를 지켜주기도 하고,",
              "때로는 나를 같은 자리로 되돌려 놓기도 합니다.",
            ].map((line, i) => (
              <p key={i} style={{
                fontFamily: "'Source Serif 4',serif", fontSize: "0.95rem",
                fontWeight: 300, color: "rgba(247,242,232,0.7)",
                lineHeight: 2, marginBottom: "0.2rem",
              }}>{line}</p>
            ))}
            <p style={{
              fontFamily: "'Source Serif 4',serif", fontSize: "0.95rem",
              fontWeight: 300, color: "rgba(247,242,232,0.7)",
              lineHeight: 2, marginTop: "1.5rem",
            }}>오늘, 그 질문을 만나러 갑니다.</p>
          </div>

          <div className="fade" style={{ animationDelay: "1.8s" }}>
            <button onClick={() => setPhase("situations")} style={{
              background: "transparent", border: `1px solid ${GOLD}`,
              color: GOLD, fontFamily: "'Source Serif 4',serif",
              fontSize: "0.82rem", letterSpacing: "0.25em", textTransform: "uppercase",
              padding: "1.1rem 3.2rem", cursor: "pointer",
            }}>Begin</button>
            {onBack && (
              <div style={{ marginTop: "1.5rem" }}>
                <button onClick={onBack} style={{
                  background: "transparent", border: "none",
                  color: "rgba(247,242,232,0.35)", fontFamily: "'Source Serif 4',serif",
                  fontSize: "0.72rem", letterSpacing: "0.12em", cursor: "pointer",
                }}>건너뛰기</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 세 가지 상황 ──────────────────────────────────── */}
      {phase === "situations" && sit && (
        <div key={current} style={{ width: "100%", maxWidth: 600 }}>
          {/* 진행 표시 */}
          <div className="fade" style={{ animationDelay: "0.05s", display: "flex", gap: "0.5rem", marginBottom: "2.5rem" }}>
            {SITUATIONS.map((_, i) => (
              <div key={i} style={{
                flex: 1, height: "2px",
                background: i <= current ? GOLD : "rgba(247,242,232,0.15)",
                transition: "background 0.5s ease",
              }} />
            ))}
          </div>

          <div className="fade" style={{ animationDelay: "0.2s" }}>
            <div style={{
              fontFamily: "'Source Serif 4',serif", fontSize: "0.6rem",
              letterSpacing: "0.3em", textTransform: "uppercase",
              color: GOLD, marginBottom: "1.75rem",
            }}>{sit.label}</div>
          </div>

          {/* 삽화 */}
          <div className="fade" style={{ animationDelay: "0.4s", marginBottom: "1.75rem" }}>
            <div style={{
              width: "100%", aspectRatio: "3/4", maxHeight: 340,
              borderRadius: "3px", overflow: "hidden",
              border: "1px solid rgba(201,168,76,0.2)",
            }}>
              <img
                src={SITUATION_IMAGES[sit.id]}
                alt={sit.label}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          </div>
          <div className="fade" style={{ animationDelay: "0.6s", marginBottom: sit.quote ? "1.5rem" : "2rem" }}>
            {sit.scene.map((line, i) => (
              <p key={i} style={{
                fontFamily: "'Source Serif 4',serif", fontSize: "0.95rem",
                fontWeight: 300, color: "rgba(247,242,232,0.78)",
                lineHeight: 1.95, marginBottom: "0.3rem",
              }}>{line}</p>
            ))}
          </div>

          {sit.quote && (
            <div className="fade" style={{ animationDelay: "0.7s", marginBottom: "1.5rem" }}>
              <p style={{
                fontFamily: "'Playfair Display',serif", fontStyle: "italic",
                fontSize: "1.05rem", color: GOLD, lineHeight: 1.7,
                paddingLeft: "1.25rem", borderLeft: `2px solid rgba(201,168,76,0.4)`,
              }}>{sit.quote}</p>
            </div>
          )}

          {sit.sceneAfter.length > 0 && (
            <div className="fade" style={{ animationDelay: "0.9s", marginBottom: "2.5rem" }}>
              {sit.sceneAfter.map((line, i) => (
                <p key={i} style={{
                  fontFamily: "'Source Serif 4',serif", fontSize: "0.92rem",
                  fontWeight: 300, color: "rgba(247,242,232,0.68)",
                  lineHeight: 1.95, marginBottom: "0.6rem",
                }}>{line}</p>
              ))}
            </div>
          )}

          {/* 질문 */}
          <div className="fade" style={{ animationDelay: "1.1s", marginBottom: "1.5rem" }}>
            <p style={{
              fontFamily: "'Playfair Display',serif", fontSize: "1.15rem",
              fontWeight: 400, color: IVORY, lineHeight: 1.5,
            }}>{sit.question}</p>
          </div>

          {/* 선택지 */}
          <div className="fade" style={{ animationDelay: "1.3s" }}>
            {sit.options.map((opt, i) => (
              <button key={i} className="choice-btn" onClick={() => choose(opt)} style={{
                width: "100%", background: "rgba(247,242,232,0.04)",
                border: "1px solid rgba(247,242,232,0.14)",
                color: "rgba(247,242,232,0.85)",
                fontFamily: "'Source Serif 4',serif", fontSize: "0.9rem", fontWeight: 300,
                textAlign: "left", padding: "0.95rem 1.2rem",
                cursor: "pointer", marginBottom: "0.5rem", lineHeight: 1.5,
              }}>{opt}</button>
            ))}
          </div>
        </div>
      )}

      {/* ── 되돌림형 패턴 화면 ─────────────────────────────── */}
      {phase === "reveal" && (
        <div style={{ width: "100%", maxWidth: 600 }}>
          <div className="fade" style={{ animationDelay: "0.3s", marginBottom: "2.5rem" }}>
            <h2 style={{
              fontFamily: "'Playfair Display',serif", fontStyle: "italic",
              fontSize: "clamp(1.4rem,3.5vw,1.9rem)", fontWeight: 400,
              color: IVORY, lineHeight: 1.4,
            }}>세 개의 장면을 지나왔습니다.</h2>
          </div>

          <div className="fade" style={{ animationDelay: "1.0s", marginBottom: "2.5rem" }}>
            <p style={{
              fontFamily: "'Source Serif 4',serif", fontSize: "0.95rem",
              fontWeight: 300, color: "rgba(247,242,232,0.7)", lineHeight: 2,
            }}>당신이 남긴 선택을 다시 놓아둡니다.</p>
          </div>

          {/* 유저 선택 되비추기 */}
          <div className="fade" style={{ animationDelay: "1.6s", marginBottom: "3rem" }}>
            {SITUATIONS.map((s, i) => (
              <div key={i} style={{
                paddingBottom: "1.25rem", marginBottom: "1.25rem",
                borderBottom: i < SITUATIONS.length - 1 ? "1px solid rgba(247,242,232,0.1)" : "none",
              }}>
                <div style={{
                  fontFamily: "'Source Serif 4',serif", fontSize: "0.58rem",
                  letterSpacing: "0.25em", textTransform: "uppercase",
                  color: GOLD, marginBottom: "0.5rem", opacity: 0.8,
                }}>{s.label}</div>
                <p style={{
                  fontFamily: "'Source Serif 4',serif", fontSize: "0.95rem",
                  fontWeight: 300, color: "rgba(247,242,232,0.85)", lineHeight: 1.7,
                }}>{choices[i]}</p>
              </div>
            ))}
          </div>

          <div className="fade" style={{ animationDelay: "2.2s", marginBottom: "2rem" }}>
            <p style={{
              fontFamily: "'Source Serif 4',serif", fontSize: "0.95rem",
              fontWeight: 300, color: "rgba(247,242,232,0.7)", lineHeight: 2,
            }}>여기에 어떤 반복이 보이는지, 혹은 보이지 않는지,
            그건 당신이 읽을 몫입니다.</p>
          </div>

          <div className="fade" style={{ animationDelay: "2.6s", marginBottom: "3rem" }}>
            <p style={{
              fontFamily: "'Playfair Display',serif", fontStyle: "italic",
              fontSize: "1.05rem", color: GOLD, lineHeight: 1.7,
            }}>이제, 다섯 개의 거울이 당신을 기다립니다.</p>
          </div>

          <div className="fade" style={{ animationDelay: "3.0s" }}>
            <button onClick={() => onEnter && onEnter(choices)} style={{
              background: "transparent", border: `1px solid ${GOLD}`,
              color: GOLD, fontFamily: "'Source Serif 4',serif",
              fontSize: "0.82rem", letterSpacing: "0.25em", textTransform: "uppercase",
              padding: "1.1rem 3rem", cursor: "pointer",
            }}>다섯 개의 거울로</button>
          </div>
        </div>
      )}
    </div>
  );
}
