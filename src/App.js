import { useEffect, useState } from "react";
import "./App.css";
function App() {
  const [score, setScore] = useState(0);
  const [burstLeft, setBurstLeft] = useState(20);
  const [target, setTarget] = useState(150);
  const [totalgame, setTotalGame] = useState(-1);
  const [gameWon, setGameWon] = useState(0);
  const [gameLoss, setGameLoss] = useState(0);
  const [arr, setArr] = useState([]);

  useEffect(() => {
    filldashboard();
  }, []);
  function handleRestart() {
    if (window.confirm("If you left the Game, you will lose it")) {
      setGameLoss(gameLoss + 1);
      filldashboard();
    }
  }
  function filldashboard() {
    const row = 10,
      col = 10;
    let temparr = [...arr];
    for (let i = 0; i < row; i++) {
      temparr[i] = [];
      for (let j = 0; j < col; j++) {
        temparr[i][j] = randomRGB();
      }
    }
    setArr([...temparr]);
    setScore(0);
    setTotalGame(totalgame + 1);
    setBurstLeft((Math.floor(Math.random() * 100) % 11) + 15);
    setTarget((Math.floor(Math.random() * 1000) % 101) + 150);
  }
  function randomRGB() {
    switch (Math.floor(Math.random() * 10) % 3) {
      case 0:
        return "r";
      case 1:
        return "g";
      default:
        return "b";
    }
  }
  function handleClick(e) {
    const x = Number(e.target.id[0]);
    const y = Number(e.target.id[1]);
    const burst = willBurst(x, y);
    if (burst) {
      let temp = arr.map((row) => row.slice());
      let count = burstThem(x, y, temp, 0);
      setScore(count + score);
      setArr([...temp]);
      setTimeout(() => {
        candydown(temp);
        setArr([...temp]);
      }, 500);
      setTimeout(() => {
        fillblanks(temp);
        setArr([...temp]);
      }, 1000);
      setBurstLeft(burstLeft - 1);
      if (score + count >= target) {
        alert("Hurray!! you won the Game!! \n Press Ok to start new Game");
        setGameWon(gameWon + 1);
        filldashboard();
      } else if (burstLeft <= 1 && score + count < target) {
        alert("Sorry!! you Lose the Game \n Press Ok to start new Game");
        setGameLoss(gameLoss + 1);
        filldashboard();
      }
    }
  }
  function fillblanks(temp) {
    const row = temp.length,
      col = temp[0].length;
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        if (temp[j][i] === "w") {
          temp[j][i] = randomRGB();
        }
      }
    }
  }
  function candydown(temp) {
    const row = temp.length,
      col = temp[0].length;
    for (let k = 0; k < row; k++) {
      for (let i = 0; i < row; i++) {
        for (let j = 0; j < col - 1; j++) {
          if (temp[j + 1][i] === "w") {
            temp[j + 1][i] = temp[j][i];
            temp[j][i] = "w";
          }
        }
      }
    }
  }
  function burstThem(x, y, temp, count) {
    count++;
    temp[x][y] = "w";
    if (y < 9 && temp[x][y + 1] !== "w" && arr[x][y] === arr[x][y + 1]) {
      count = burstThem(x, y + 1, temp, count);
    }
    if (y > 0 && temp[x][y - 1] !== "w" && arr[x][y] === arr[x][y - 1]) {
      count = burstThem(x, y - 1, temp, count);
    }
    if (x < 9 && temp[x + 1][y] !== "w" && arr[x][y] === arr[x + 1][y]) {
      count = burstThem(x + 1, y, temp, count);
    }
    if (x > 0 && temp[x - 1][y] !== "w" && arr[x][y] === arr[x - 1][y]) {
      count = burstThem(x - 1, y, temp, count);
    }
    return count;
  }
  function willBurst(x, y) {
    if (y < 8 && arr[x][y] === arr[x][y + 1] && arr[x][y] === arr[x][y + 2])
      return true;
    else if (
      y < 9 &&
      y > 0 &&
      arr[x][y] === arr[x][y + 1] &&
      arr[x][y] === arr[x][y - 1]
    )
      return true;
    else if (
      y > 1 &&
      arr[x][y] === arr[x][y - 1] &&
      arr[x][y] === arr[x][y - 2]
    )
      return true;
    else if (
      x < 8 &&
      arr[x][y] === arr[x + 1][y] &&
      arr[x][y] === arr[x + 2][y]
    )
      return true;
    else if (
      x < 9 &&
      x > 0 &&
      arr[x][y] === arr[x + 1][y] &&
      arr[x][y] === arr[x - 1][y]
    )
      return true;
    else if (
      x > 1 &&
      arr[x][y] === arr[x - 1][y] &&
      arr[x][y] === arr[x - 2][y]
    )
      return true;
    return false;
  }
  return (
    <div className="outer">
      <div className="gamedetail">
        <div>
          <div> Game Played: {totalgame}</div>
          <div> Game Won: {gameWon}</div>
          <div> Game Lose: {gameLoss}</div>
        </div>
        <div>
          <div>
            <h5 style={{ margin: "0px" }}>Target: {target}</h5>
          </div>
          <div>
            <h2 style={{ margin: "0px" }}>Score: {score}</h2>
          </div>
          <div onClick={handleRestart} className="restart">
            RESTART
          </div>
        </div>
        <div className="timer">
          <div>Burst Left: {burstLeft}</div>
        </div>
      </div>
      <div className="playarea">
        {arr?.map((row, x) => {
          return (
            <div className="box" key={x}>
              {row?.map((color, y) => {
                return (
                  <div
                    key={y}
                    id={x + "" + y}
                    onClick={handleClick}
                    className={"square " + color}
                  >
                    {color === "w" ? `` : `${x},${y},${color}`}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
