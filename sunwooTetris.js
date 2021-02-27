const unit = 35;
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
function play() {
  const board = new Board();
  board.play();
}
// listen for the "keypress" event
// process.stdin.on("keypress", function (ch, key) {
//   console.log('got "keypress"', key);
//   if (key && key.ctrl && key.name == "c") {
//     process.stdin.pause();
//   }
// });

function Point(x, y) {
  this.getX = () => x;
  this.getY = () => y;
  this.show = () => {
    const ctx = document.getElementById("board").getContext("2d");
    ctx.fillRect(unit * x, unit * y, unit, unit);
  };
  this.hide = () => {
    const ctx = document.getElementById("board").getContext("2d");
    ctx.clearRect(unit * x, unit * y, unit, unit);
  };
  this.shiftDown = () => new Point(x, y + 1);
}

function Block(type, pivot) {
  const x = pivot[0];
  const y = pivot[1];
  let points = new Array(4);
  for (let i = 0; i < 4; i++) {
    points[i] = i;
  }

  const blockGenerator = {
    I1: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(x - 1, y),
          1: () => new Point(x, y),
          2: () => new Point(x + 1, y),
          3: () => new Point(x + 2, y),
        };
        return mappingTo[p]();
      }),
    I2: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(x, y - 1),
          1: () => new Point(x, y),
          2: () => new Point(x, y + 1),
          3: () => new Point(x, y + 2),
        };
        return mappingTo[p]();
      }),
  };

  points = blockGenerator[type]();
  this.getPoints = () => points;
  this.shiftLeft = () => new Block(type, [x - 1, y]);
  this.shiftRight = () => new Block(type, [x + 1, y]);
  this.shiftDown = () => new Block(type, [x, y + 1]);
  this.rotate = () => {
    const getNextShape = {
      I1: () => new Block("I2", pivot),
      I2: () => new Block("I1", pivot),
    };
    return getNextShape[type]();
  };

  this.moving = true;
}

function Board() {
  const width = 10;
  const height = 20;
  const startPos = [5, 1];
  const generateBoard = () => {
    const row = new Array(width);
    for (let i = 0; i < row.length; i++) {
      row[i] = " ";
    }

    const board = new Array(height);
    for (let i = 0; i < board.length; i++) {
      board[i] = row.map((x) => x);
    }

    // console.log("board: ", board);

    return board;
  };
  let occupiedPosition = [];
  let backgroundBoard = generateBoard();
  let currentBlock;

  //Todo: pick the current block randomly.

  const moveBlock = (block, nextBlock) => {
    let points;
    if (block && block.moving) {
      points = block.getPoints();
      points.forEach((p) => {
        p.hide();
      });
      points.forEach((p) => (backgroundBoard[p.getY()][p.getX()] = " "));
    }
    points = nextBlock.getPoints();
    // console.log(nextBlock.getPoints());

    points.forEach((p) => {
      backgroundBoard[p.getY()][p.getX()] = p;
      p.show();
    });
    console.log(nextBlock);
    currentBlock = nextBlock;

    // console.log(backgroundBoard);
  };

  const removeRow = () => {
    let rowsThatWillBeRemoved = [];
    let rowIdxTrack = 0;
    backgroundBoard.forEach((row) => {
      if (!row.reduce((acc, el) => acc || el === " ", false)) {
        rowsThatWillBeRemoved.push(rowIdxTrack);
      }
      rowIdxTrack++;
    });

    //update occupiedPostion array
    if (rowsThatWillBeRemoved.length !== 0) {
      const pointsOnTheBoardThatWillBeRemoved = [];
      rowsThatWillBeRemoved.forEach((row) =>
        pointsOnTheBoardThatWillBeRemoved.push(backgroundBoard[row])
      );
      occupiedPosition = occupiedPosition.filter((occPoint) => {
        if (
          pointsOnTheBoardThatWillBeRemoved.reduce(
            (acc, row) =>
              acc ||
              row.reduce(
                (acc2, curPoint) => acc2 || occPoint === curPoint,
                false
              ),
            false
          )
        ) {
          return false;
        } else {
          return true;
        }
      });
    }

    if (rowsThatWillBeRemoved.length !== 0) {
      backgroundBoard.forEach((row) =>
        row.forEach((pt) => {
          if (pt !== " ") {
            pt.hide();
          }
        })
      );
    }
    //update board and gui
    while (rowsThatWillBeRemoved.length !== 0) {
      console.log(backgroundBoard);
      let rowWillbeRemoved = rowsThatWillBeRemoved.shift();
      backgroundBoard[rowWillbeRemoved].forEach((p) => p.hide());
      for (let i = rowWillbeRemoved; i > 0; i--) {
        backgroundBoard[i - 1] = backgroundBoard[i - 1].map((pt) =>
          pt === " " ? " " : pt.shiftDown()
        );
        backgroundBoard[i] = backgroundBoard[i - 1];
      }
      backgroundBoard[0] = backgroundBoard[0].map((_) => " ");

      if (rowsThatWillBeRemoved.length === 0) {
        backgroundBoard.forEach((row) =>
          row.forEach((pt) => {
            if (pt !== " ") {
              pt.show();
            }
          })
        );
      }
      // if (rowsThatWillBeRemoved.length === 0) {
      // }
    }
  };

  const placeBlock = () => {
    const isPlacable = (points) =>
      points.reduce(
        (acc, p) =>
          acc ||
          p.getY() === height - 1 ||
          occupiedPosition.reduce((acc, occupiedPoint) => {
            // let a = p.getX();
            // let b = p.getY();
            return (
              acc ||
              (p.getX() === occupiedPoint.getX() &&
                p.getY() + 1 === occupiedPoint.getY())
            );
          }, false),
        false
      );

    if (isPlacable(currentBlock.getPoints())) {
      // console.log("hi");
      currentBlock.moving = false;
      currentBlock.getPoints().forEach((p) => {
        p.show();
        occupiedPosition.push(p);
      });
      currentBlock = undefined;
      removeRow();
      // moveBlock(undefined, new Block("I1", startPos));
    }
  };

  const isMovable = (nextPoints) =>
    nextPoints.reduce(
      (acc, p) =>
        acc &&
        p.getX() >= 0 &&
        p.getX() < width &&
        p.getY() <= height &&
        occupiedPosition.reduce(
          (acc, occupiedPoint) =>
            acc &&
            (occupiedPoint.getX() !== p.getX() ||
              occupiedPoint.getY() !== p.getY()),
          true
        ),
      true
    );

  const isGameOver = () =>
    occupiedPosition.reduce(
      (acc, occupiedPoint) => acc || occupiedPoint.getY() === 0,
      false
    );

  this.play = async () => {
    const canvas = document.getElementById("board");
    canvas.width = unit * 10;
    canvas.height = unit * 20;
    canvas.tabIndex = "1";

    const shiftBlockWithKeyboard = {
      ArrowLeft: () => {
        if (!isMovable(currentBlock.shiftLeft().getPoints())) return;
        moveBlock(currentBlock, currentBlock.shiftLeft());
        placeBlock();
      },
      ArrowRight: () => {
        if (!isMovable(currentBlock.shiftRight().getPoints())) return;
        moveBlock(currentBlock, currentBlock.shiftRight());
        placeBlock();
      },
      ArrowDown: () => {
        if (!isMovable(currentBlock.shiftDown().getPoints())) return;
        moveBlock(currentBlock, currentBlock.shiftDown());
        placeBlock();
      },
      ArrowUp: () => {
        if (!isMovable(currentBlock.rotate().getPoints())) return;
        moveBlock(currentBlock, currentBlock.rotate());
        placeBlock();
      },
    };

    document.addEventListener("keydown", function (event) {
      shiftBlockWithKeyboard[event.key]();
    });

    let count = 0;
    let blockMoveDownCount = 10;
    while (true) {
      await sleep(1000 / blockMoveDownCount);
      count++;
      if (isGameOver()) break;
      if (currentBlock === undefined) {
        moveBlock(undefined, new Block("I1", startPos));
        continue;
      }
      if (count === blockMoveDownCount) {
        count = 0;
        shiftBlockWithKeyboard["ArrowDown"]();
        placeBlock();
        continue;
      }
      // shiftBlockWithKeyboard[key.name]();
    }
  };
}

//current Bug: invisible block, maybe because of the occupied blokc
//lets try to remove it btw, it seems redundant now that we got all info from board
