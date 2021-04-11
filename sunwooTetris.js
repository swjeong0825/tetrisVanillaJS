const unit = 35;
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
function play() {
  const board = new Board();
  board.play();
}

function Point(x, y, move = true) {
  let moving = move;
  this.isMoving = () => moving;
  this.placePoint = () => {
    moving = false;
  };
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
  this.shiftDown = () => new Point(x, y + 1, false);
}

function Block(type, pivotX, pivotY) {
  let points = new Array(4);
  for (let i = 0; i < 4; i++) {
    points[i] = i;
  }

  const blockGenerator = {
    I1: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(pivotX - 1, pivotY),
          1: () => new Point(pivotX, pivotY),
          2: () => new Point(pivotX + 1, pivotY),
          3: () => new Point(pivotX + 2, pivotY),
        };
        return mappingTo[p]();
      }),
    I2: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(pivotX, pivotY - 1),
          1: () => new Point(pivotX, pivotY),
          2: () => new Point(pivotX, pivotY + 1),
          3: () => new Point(pivotX, pivotY + 2),
        };
        return mappingTo[p]();
      }),
    O: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(pivotX - 1, pivotY),
          1: () => new Point(pivotX, pivotY),
          2: () => new Point(pivotX, pivotY + 1),
          3: () => new Point(pivotX - 1, pivotY + 1),
        };
        return mappingTo[p]();
      }),

    J1: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(pivotX - 1, pivotY - 1),
          1: () => new Point(pivotX - 1, pivotY),
          2: () => new Point(pivotX, pivotY),
          3: () => new Point(pivotX + 1, pivotY),
        };

        return mappingTo[p]();
      }),

    J2: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(pivotX + 1, pivotY - 1),
          1: () => new Point(pivotX, pivotY - 1),
          2: () => new Point(pivotX, pivotY),
          3: () => new Point(pivotX, pivotY + 1),
        };

        return mappingTo[p]();
      }),
    J3: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(pivotX + 1, pivotY),
          1: () => new Point(pivotX, pivotY),
          2: () => new Point(pivotX + 1, pivotY),
          3: () => new Point(pivotX + 1, pivotY - 1),
        };

        return mappingTo[p]();
      }),
    J4: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(pivotX - 1, pivotY - 1),
          1: () => new Point(pivotX, pivotY - 1),
          2: () => new Point(pivotX, pivotY),
          3: () => new Point(pivotX, pivotY + 1),
        };

        return mappingTo[p]();
      }),
    L1: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(pivotX - 1, pivotY),
          1: () => new Point(pivotX, pivotY),
          2: () => new Point(pivotX + 1, pivotY),
          3: () => new Point(pivotX + 1, pivotY - 1),
        };

        return mappingTo[p]();
      }),
    L2: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(pivotX, pivotY - 1),
          1: () => new Point(pivotX, pivotY),
          2: () => new Point(pivotX, pivotY + 1),
          3: () => new Point(pivotX + 1, pivotY + 1),
        };

        return mappingTo[p]();
      }),
    L3: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(pivotX - 1, pivotY + 1),
          1: () => new Point(pivotX - 1, pivotY),
          2: () => new Point(pivotX, pivotY),
          3: () => new Point(pivotX + 1, pivotY),
        };

        return mappingTo[p]();
      }),
    L4: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(pivotX - 1, pivotY - 1),
          1: () => new Point(pivotX, pivotY - 1),
          2: () => new Point(pivotX, pivotY),
          3: () => new Point(pivotX, pivotY + 1),
        };

        return mappingTo[p]();
      }),
    S1: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(pivotX - 1, pivotY),
          1: () => new Point(pivotX, pivotY),
          2: () => new Point(pivotX, pivotY - 1),
          3: () => new Point(pivotX + 1, pivotY - 1),
        };

        return mappingTo[p]();
      }),
    S2: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(pivotX, pivotY - 1),
          1: () => new Point(pivotX, pivotY),
          2: () => new Point(pivotX + 1, pivotY),
          3: () => new Point(pivotX + 1, pivotY + 1),
        };

        return mappingTo[p]();
      }),
    S3: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(pivotX - 1, pivotY + 1),
          1: () => new Point(pivotX, pivotY + 1),
          2: () => new Point(pivotX, pivotY),
          3: () => new Point(pivotX + 1, pivotY),
        };

        return mappingTo[p]();
      }),
    S4: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(pivotX - 1, pivotY - 1),
          1: () => new Point(pivotX - 1, pivotY),
          2: () => new Point(pivotX, pivotY),
          3: () => new Point(pivotX, pivotY + 1),
        };

        return mappingTo[p]();
      }),
    T1: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(pivotX - 1, pivotY),
          1: () => new Point(pivotX, pivotY),
          2: () => new Point(pivotX, pivotY - 1),
          3: () => new Point(pivotX + 1, pivotY),
        };

        return mappingTo[p]();
      }),
    T2: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(pivotX, pivotY - 1),
          1: () => new Point(pivotX, pivotY),
          2: () => new Point(pivotX + 1, pivotY),
          3: () => new Point(pivotX, pivotY + 1),
        };

        return mappingTo[p]();
      }),
    T3: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(pivotX - 1, pivotY),
          1: () => new Point(pivotX, pivotY),
          2: () => new Point(pivotX, pivotY + 1),
          3: () => new Point(pivotX + 1, pivotY),
        };

        return mappingTo[p]();
      }),
    T4: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(pivotX, pivotY - 1),
          1: () => new Point(pivotX, pivotY),
          2: () => new Point(pivotX - 1, pivotY),
          3: () => new Point(pivotX, pivotY + 1),
        };

        return mappingTo[p]();
      }),
    Z1: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(pivotX - 1, pivotY - 1),
          1: () => new Point(pivotX, pivotY - 1),
          2: () => new Point(pivotX, pivotY),
          3: () => new Point(pivotX + 1, pivotY),
        };

        return mappingTo[p]();
      }),
    Z2: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(pivotX, pivotY + 1),
          1: () => new Point(pivotX, pivotY),
          2: () => new Point(pivotX + 1, pivotY),
          3: () => new Point(pivotX + 1, pivotY - 1),
        };

        return mappingTo[p]();
      }),
    Z3: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(pivotX - 1, pivotY),
          1: () => new Point(pivotX, pivotY),
          2: () => new Point(pivotX, pivotY + 1),
          3: () => new Point(pivotX + 1, pivotY + 1),
        };

        return mappingTo[p]();
      }),
    Z4: () =>
      points.map((p) => {
        const mappingTo = {
          0: () => new Point(pivotX - 1, pivotY + 1),
          1: () => new Point(pivotX - 1, pivotY),
          2: () => new Point(pivotX, pivotY),
          3: () => new Point(pivotX, pivotY - 1),
        };

        return mappingTo[p]();
      }),
  };

  points = blockGenerator[type]();
  this.getPoints = () => points;
  // this.mapPoints = (f) => points.map((p) => f(p));
  this.shiftLeft = () => new Block(type, pivotX - 1, pivotY);
  this.shiftRight = () => new Block(type, pivotX + 1, pivotY);
  this.shiftDown = () => new Block(type, pivotX, pivotY + 1);
  this.rotate = () => {
    const getNextShape = {
      I1: () => new Block("I2", pivotX, pivotY),
      I2: () => new Block("I1", pivotX, pivotY),
      O: () => new Block("O", pivotX, pivotY),
      J1: () => new Block("J2", pivotX, pivotY),
      J2: () => new Block("J3", pivotX, pivotY),
      J3: () => new Block("J4", pivotX, pivotY),
      J4: () => new Block("J1", pivotX, pivotY),
      L1: () => new Block("L2", pivotX, pivotY),
      L2: () => new Block("L3", pivotX, pivotY),
      L3: () => new Block("L4", pivotX, pivotY),
      L4: () => new Block("L1", pivotX, pivotY),
      S1: () => new Block("S2", pivotX, pivotY),
      S2: () => new Block("S3", pivotX, pivotY),
      S3: () => new Block("S4", pivotX, pivotY),
      S4: () => new Block("S1", pivotX, pivotY),
      T1: () => new Block("T2", pivotX, pivotY),
      T2: () => new Block("T3", pivotX, pivotY),
      T3: () => new Block("T4", pivotX, pivotY),
      T4: () => new Block("T1", pivotX, pivotY),
      Z1: () => new Block("Z2", pivotX, pivotY),
      Z2: () => new Block("Z3", pivotX, pivotY),
      Z3: () => new Block("Z4", pivotX, pivotY),
      Z4: () => new Block("Z1", pivotX, pivotY),
    };
    return getNextShape[type]();
  };
  this.place = () => points.forEach((p) => p.placePoint());
  this.isMoving = () => points[0].isMoving();
  this.show = () => points.forEach((p) => p.show());
  this.hide = () => points.forEach((p) => p.hide());
}
function Board() {
  const height = 20;
  const width = 10;
  let currentBlock = undefined;
  let board = [];
  this.getBoard = () => board;
  const initializeBoard = () => {
    let row = new Array(width);
    for (let i = 0; i < width; i++) {
      row[i] = undefined;
    }
    for (let i = 0; i < height; i++) {
      board.push(row.slice(0));
    }
  };
  initializeBoard();

  const addToBoard = (point, a = true) => {
    board[point.getY()][point.getX()] = point;
  };
  const removeFromBoard = (point) => {
    board[point.getY()][point.getX()] = undefined;
  };

  const createBlock = () => {
    const initialBlockList = ["I1", "L1", "J1", "O", "Z1", "S1", "T1"];
    currentBlock = new Block(
      initialBlockList[Math.floor(Math.random() * 7)],
      4,
      1
    );
    currentBlock.show();
    currentBlock.getPoints().forEach((p) => addToBoard(p, false));
  };

  const shiftBlockWithKeyboard = {
    ArrowLeft: () => currentBlock.shiftLeft(),
    ArrowRight: () => currentBlock.shiftRight(),
    ArrowDown: () => currentBlock.shiftDown(),
    ArrowUp: () => currentBlock.rotate(),
  };

  const isValidBlock = (block) => {
    const isValidPoint = (point) => {
      const isOccupied = () => {
        for (let i = 0; i < height; i++) {
          for (let j = 0; j < width; j++) {
            if (board[i][j] === undefined) continue;
            if (board[i][j].isMoving()) continue;
            if (
              board[i][j].getX() === point.getX() &&
              board[i][j].getY() === point.getY()
            )
              return true;
          }
        }

        return false;
      };

      // if (board[19][4] !== undefined) {
      //   console.log(board[19][4].isMoving());
      //   console.log(board[19][4].getX(), block.getPoints()[0].getX());
      //   console.log(board[19][4].getY(), block.getPoints()[0].getY());
      // }

      // console.log(isOccupied());
      return (
        point.getX() >= 0 &&
        point.getX() < width &&
        point.getY() >= 0 &&
        point.getY() < height &&
        !isOccupied()
      );
    };

    return block
      .getPoints()
      .reduce((acc, point) => acc && isValidPoint(point), true);
  };

  const removeRow = () => {
    board = board.map((row) => {
      if (
        row.reduce((acc, p) => acc && p !== undefined && !p.isMoving(), true)
      ) {
        return row.map((p) => {
          p.hide();
          return undefined;
        });
      } else {
        return row;
      }
    });
  };

  const repositionBoard = () => {
    for (let i = 0; i < height; i++) {
      if (board[i].reduce((acc, el) => acc && el === undefined, true)) {
        for (let j = i; j > 0; j--) {
          board[j - 1] = board[j - 1].map((point) => {
            if (point !== undefined) {
              point.hide();
              point = point.shiftDown();
              point.show();
              return point;
            } else {
              return undefined;
            }
          });
          board[j] = board[j - 1].map((p) => {
            if (p === undefined) return undefined;
            return new Point(p.getX(), p.getY(), false);
          });
        }
      }
    }
  };

  this.play = async () => {
    const canvas = document.getElementById("board");
    canvas.width = width * unit;
    canvas.height = height * unit;
    document.addEventListener("keydown", function (event) {
      if (isValidBlock(shiftBlockWithKeyboard[event.key]())) {
        currentBlock.getPoints().forEach((p) => removeFromBoard(p));
        currentBlock.hide();
        currentBlock = shiftBlockWithKeyboard[event.key]();
        currentBlock.getPoints().forEach((p) => addToBoard(p));
        currentBlock.show();
      }
    });
    let count = 0;
    while (true) {
      if (currentBlock === undefined) {
        createBlock();
      }

      await sleep(200);
      count++;
      if (count === 5) {
        console.log(board);

        count = 0;
        // console.log(isValidBlock(currentBlock.shiftDown()));
        if (isValidBlock(currentBlock.shiftDown())) {
          currentBlock.getPoints().forEach((p) => removeFromBoard(p));
          currentBlock.hide();
          currentBlock = currentBlock.shiftDown();
          currentBlock.getPoints().forEach((p) => addToBoard(p));
          currentBlock.show();
        } else {
          currentBlock.place();
          if (
            currentBlock
              .getPoints()
              .reduce((acc, p) => acc || p.getY() === 0, false)
          ) {
            break;
          }
          currentBlock = undefined;
          removeRow();
          repositionBoard();
        }
      }
    }
  };
}

let a;

function play() {
  const board = new Board();
  a = board.getBoard();
  board.play();
}

/*
1. initialize board
-------------------------
2. create a block
3. move blocks
4. place blocks
5. check gameover
6. remove points
6-1. reposition points


*/
