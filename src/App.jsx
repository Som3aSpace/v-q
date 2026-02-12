import { useEffect, useRef, useState } from "react";
import TreasureGame from "./TreasureGame";
import "./App.css";

export default function App() {
  const noRef = useRef(null);
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const [noBaseRect, setNoBaseRect] = useState(null);
  const [toast, setToast] = useState({ text: "", top: 0, left: 0, visible: false });
  const [yesToastVisible, setYesToastVisible] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [flowStepIndex, setFlowStepIndex] = useState(-1);
  const [showQuestion, setShowQuestion] = useState(true);
  const [shatter, setShatter] = useState(false);
  const [flowOutIndex, setFlowOutIndex] = useState(-1);
  const yesToastTimerRef = useRef(null);
  const flowTimerRef = useRef(null);
  const breakTimerRef = useRef(null);
  const fadeTimerRef = useRef(null);
  const [, setClickCount] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [noFlipped, setNoFlipped] = useState(false);
  const [yesBounce, setYesBounce] = useState(false);

  const quotes = [
    "يا اسلام 🧐",
    "يا بنتي!!! 😲😲",
    "بلاش",
    "افتكري انك مصرة 😶",
    "هضرب والله 😡",
    "طب اهو، وريني بقي هتقولي لا ازاي 😂",
  ];

  const flowSteps = [
    "Because you’re a good girl and you said you love me 💗",
    "I have a gift for you 🎁",
    "But you’re so smart, so there’s a little challenge ✨",
    "Follow the map to find your gift 🗺️",
  ];

  const rand = (min, max) => Math.random() * (max - min) + min;

  const updateBaseRect = () => {
    if (!noRef.current) return;
    setNoBaseRect(noRef.current.getBoundingClientRect());
  };

  const showToastAt = (rect) => {
    const text = quotes[quoteIndex] ?? quotes[quotes.length - 1];
    setToast({
      text,
      top: rect.top + rect.height + 8,
      left: rect.left,
      visible: true,
    });
    setClickCount(0);

    if (quoteIndex >= quotes.length - 1) {
      setNoFlipped(true);
      setNoOffset({ x: 0, y: 0 });
    } else {
      setQuoteIndex((i) => i + 1);
    }
  };

  const registerClick = () => {
    setClickCount((c) => {
      const next = c + 1;
      if (next >= 2) setToast((t) => ({ ...t, visible: false }));
      return next;
    });
  };

  const moveNoButton = () => {
    if (!noRef.current || noFlipped) return;

    setYesBounce(false);
    requestAnimationFrame(() => setYesBounce(true));

    const rect = noRef.current.getBoundingClientRect();
    showToastAt(rect);

    const base = noBaseRect || rect;
    const minX = -base.left;
    const maxX = window.innerWidth - base.right;
    const minY = -base.top;
    const maxY = window.innerHeight - base.bottom;

    const x = rand(minX, maxX);
    const y = rand(minY, maxY);

    setNoOffset({ x, y });
  };

  const startFlowSteps = () => {
    setShatter(false);
    setShowQuestion(true);
    setFlowOutIndex(-1);
    setFlowStepIndex(0);
  };

  useEffect(() => {
    if (flowStepIndex < 0) return;
    if (flowStepIndex >= flowSteps.length) {
      setShatter(true);
      if (breakTimerRef.current) clearTimeout(breakTimerRef.current);
      breakTimerRef.current = setTimeout(() => {
        setShowQuestion(false);
        setFlowOutIndex(0);
      }, 900);
      return;
    }
    if (flowTimerRef.current) clearTimeout(flowTimerRef.current);
    flowTimerRef.current = setTimeout(() => {
      setFlowStepIndex((i) => i + 1);
    }, 1800);
  }, [flowStepIndex, flowSteps.length]);

  useEffect(() => {
    if (flowOutIndex < 0) return;
    if (flowOutIndex >= flowSteps.length) {
      setFlowOutIndex(-1);
      setFlowStepIndex(-1);
      setShowMap(true);
      return;
    }
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = setTimeout(() => {
      setFlowOutIndex((i) => i + 1);
    }, 500);
  }, [flowOutIndex, flowSteps.length]);

  const showYesToast = () => {
    setToast((t) => ({ ...t, visible: false }));
    setYesToastVisible(true);
    if (yesToastTimerRef.current) clearTimeout(yesToastTimerRef.current);
    yesToastTimerRef.current = setTimeout(() => {
      setYesToastVisible(false);
      startFlowSteps();
    }, 1600);
  };

  useEffect(() => {
    updateBaseRect();
    const handleResize = () => {
      updateBaseRect();
      setNoOffset({ x: 0, y: 0 });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (yesToastTimerRef.current) clearTimeout(yesToastTimerRef.current);
      if (flowTimerRef.current) clearTimeout(flowTimerRef.current);
      if (breakTimerRef.current) clearTimeout(breakTimerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, []);

  return (
    <div className="app">
      {!showMap && (
        <div className="question-shell">
          {showQuestion && (
            <div className={`content ${shatter ? "shatter" : ""}`}>
              <h1 className="question">Do you love me? ❤️</h1>
              <div className="buttons">
                <button
                  className={`yes-button ${yesBounce ? "yes-flip" : ""}`}
                  onAnimationEnd={() => setYesBounce(false)}
                  onClick={() => {
                    registerClick();
                    showYesToast();
                  }}
                >
                  Yes
                </button>
                <button
                  ref={noRef}
                  className={`${noFlipped ? "yes-button flip-yes" : "no-button"}`}
                  style={noFlipped ? undefined : { transform: `translate(${noOffset.x}px, ${noOffset.y}px)` }}
                  onMouseEnter={noFlipped ? undefined : moveNoButton}
                  onMouseDown={() => {
                    registerClick();
                    if (noFlipped) {
                      showYesToast();
                    } else {
                      moveNoButton();
                    }
                  }}
                >
                  {noFlipped ? "Yes" : "No"}
                </button>
              </div>
            </div>
          )}

          {(flowStepIndex >= 0 || flowOutIndex >= 0) && (
            <div className="flow-ring" aria-live="polite">
              {flowSteps.map((text, i) => (
                <div
                  key={text}
                  className={[
                    "flow-step",
                    i <= flowStepIndex ? "is-visible" : "",
                    flowOutIndex >= 0 && i < flowOutIndex ? "is-exit" : "",
                  ].join(" ")}
                >
                  <span className="flow-step__text">{text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {toast.visible && (
        <div className="toast" style={{ top: toast.top, left: toast.left }}>
          {toast.text}
        </div>
      )}

      {yesToastVisible && (
        <div className="yes-toast">
          <span className="yes-toast__sparkle">✨</span>
          <span className="yes-toast__text">You are my best 💖</span>
          <span className="yes-toast__sparkle">✨</span>
        </div>
      )}

      {showMap && <TreasureGame title="Treasure Hunt 🗺️" />}
    </div>
  );
}
