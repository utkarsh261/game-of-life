import { useState, useRef, useCallback } from "react";
import "./styles.css";

import produce from "immer";

const numCols = 50;
const numRows = 50;
const dx = [1, 0, -1, 0, -1, 1, 1, -1];
const dy = [0, 1, 0, -1, -1, 1, -1, 1];

const generateEmptyGrid = () => {
  const rows = Array.from({ length: numRows }).map(() =>
    Array.from({ length: numCols }).fill(0)
  );
  return rows;
};
export default function App() {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;
  const runSimulation = useCallback(() => {
    // Value of running will not get updated with state
    // because this fuction will be running only once (due to useCallback).
    // Hence useRef;
    if (!runningRef.current) {
      return;
    }
    const isSafe = (x, y) => {
      if (x < numRows && x >= 0 && y < numCols && y >= 0) {
        return true;
      }
      return false;
    };
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; ++i) {
          for (let j = 0; j < numCols; ++j) {
            let cnt = 0;
            for (let dir = 0; dir < 8; ++dir) {
              const x = i + dx[dir],
                y = j + dy[dir];
              if (isSafe(x, y)) {
                cnt += g[x][y];
              }
            }
            if (g[i][j]) {
              cnt < 2 || cnt > 3 ? (gridCopy[i][j] = 0) : (gridCopy[i][j] = 1);
            } else {
              cnt === 3 ? (gridCopy[i][j] = 1) : (gridCopy[i][j] = 0);
            }
          }
        }
      });
    });

    setInterval(runSimulation, 1000);
  }, []);

  return (
    <div className="App">
      <div className="title-wrapper">
        <p className="title">Conway's Game of Life</p>
      </div>
      <div className="buttons-wrapper">
        <div className="buttons">
          <button
            className="button"
            onClick={() => {
              if (!running) {
                runningRef.current = true;
                runSimulation();
              }
              setRunning(!running);
            }}
          >
            {running ? "stop" : "start"}
          </button>
        </div>
        <div className="buttons">
          <button
            className="button"
            onClick={() => {
              setGrid(generateEmptyGrid());
            }}
          >
            reset
          </button>
        </div>
        <div className="buttons">
          <button
            className="button"
            onClick={() => {
              const randomGrid = [];
              for (let i = 0; i < numRows; i++) {
                randomGrid.push(
                  Array.from(Array(numCols), () =>
                    Math.random() > 0.5 ? 1 : 0
                  )
                );
              }
              setGrid(randomGrid);
            }}
          >
            random
          </button>
        </div>
      </div>

      <div className="grid-wrapper">
        <div className="Grid">
          {grid.map((rows, i) =>
            rows.map((_, j) => (
              <div
                className="cell"
                onClick={() => {
                  const newGrid = produce(grid, (gridCopy) => {
                    gridCopy[i][j] = gridCopy[i][j] ^ 1;
                  });
                  setGrid(newGrid);
                }}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: grid[i][j] ? "black" : undefined,
                  border: "solid 1 px black"
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
