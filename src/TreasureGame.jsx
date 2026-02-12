import { useEffect, useState } from "react";

const CELL = 28;
const MAP = [
  "############",
  ".....W.....#",
  "#..........#",
  "#...F......#",
  "#.........S#",
  "#......SSSS#",
  "#..#########",
  "#..........#",
  "#..T....BBB#",
  "#..V....BBB#",
  "#..W.......#",
  "############",
];
const MAP_SIZE = { rows: MAP.length, cols: MAP[0].length };

// Route follows the green path (==== and corridors)
const ROUTE = [
  [1, 0], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
  [7, 1], [8, 1], [9, 1],
  [9, 2], [9, 3] // V (valentine gift)
];

const key = (r, c) => `${r},${c}`;
const ROUTE_SET = new Set(ROUTE.map(([r, c]) => key(r, c)));

const TV_POS = { r: 8, c: 3 };
const WINDOW_POS = { r: 1, c: 5 };
const VALENTINE_POS = { r: 9, c: 3 };

export default function TreasureGame({ title = "Find your Valentine gift 🎁" }) {
  const [hero, setHero] = useState({ r: ROUTE[0][0], c: ROUTE[0][1] });
  const [step, setStep] = useState(0);
  const [foundTv, setFoundTv] = useState(false);
  const [foundWindow, setFoundWindow] = useState(false);
  const [foundValentine, setFoundValentine] = useState(false);
  const [runKey, setRunKey] = useState(0);

  const resetGame = () => {
    setHero({ r: ROUTE[0][0], c: ROUTE[0][1] });
    setStep(0);
    setFoundTv(false);
    setFoundWindow(false);
    setFoundValentine(false);
    setRunKey((k) => k + 1);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => {
        const next = Math.min(s + 1, ROUTE.length - 1);
        const [r, c] = ROUTE[next];
        setHero({ r, c });
        if (r === TV_POS.r && c === TV_POS.c) setFoundTv(true);
        if (r === WINDOW_POS.r && c === WINDOW_POS.c) setFoundWindow(true);
        if (r === VALENTINE_POS.r && c === VALENTINE_POS.c) setFoundValentine(true);
        return next;
      });
    }, 260);

    return () => clearInterval(timer);
  }, [runKey]);

  return (
    <div className="treasure">
      <h2 className="treasure__title">{title}</h2>

      <div
        className="treasure__map"
        style={{
          width: MAP_SIZE.cols * CELL,
          height: MAP_SIZE.rows * CELL,
        }}
      >
        {MAP.map((row, r) =>
          row.split("").map((ch, c) => {
            const isRoute = ROUTE_SET.has(key(r, c));
            const isWall = ch === "#";
            const isTv = ch === "T";
            const isWindow = ch === "W";
            const isSofa = ch === "S";
            const isBed = ch === "B";
            const isValentine = ch === "V";

            return (
              <div
                key={`${r}-${c}`}
                className={[
                  "treasure__cell",
                  isWall ? "treasure__cell--wall" : "treasure__cell--floor",
                  isRoute ? "treasure__cell--route" : "",
                  isTv ? "treasure__cell--tv" : "",
                  isWindow ? "treasure__cell--window" : "",
                  isSofa ? "treasure__cell--sofa" : "",
                  isBed ? "treasure__cell--bed" : "",
                  isValentine ? "treasure__cell--valentine" : "",
                ].join(" ")}
              >
                {isTv && (
                  <>
                    <span className={`treasure__treasure ${foundTv ? "is-found" : ""}`}>💎</span>
                    <span className="treasure__blocker">TV</span>
                  </>
                )}
                {isWindow && (
                  <>
                    <span className={`treasure__treasure ${foundWindow ? "is-found" : ""}`}>💎</span>
                    <span className="treasure__blocker">Window</span>
                  </>
                )}
                {isValentine && (
                  <span className={`treasure__gift ${foundValentine ? "is-found" : ""}`}>🎁</span>
                )}
                {isSofa && <span className="treasure__label">Sofa</span>}
                {isBed && <span className="treasure__label">Bed</span>}
              </div>
            );
          })
        )}

        <div
          className="treasure__hero"
          style={{
            left: (hero.c + 0.5) * CELL,
            top: (hero.r + 0.5) * CELL,
          }}
        >
          🧑‍🚀
        </div>
      </div>

      <div className="treasure__status">
        {foundValentine ? "Valentine gift found! 💝" : "Searching..."}
      </div>

      <div className="treasure__actions">
        <button className="treasure__reset" onClick={resetGame}>
          Go!
        </button>
      </div>
    </div>
  );
}
