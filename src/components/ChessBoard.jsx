import React, { useState } from 'react';
import '../styles/ChessBoard.css';
import soundEffects from '../utils/SoundEffects';

const ChessBoard = ({ gameMode: initialGameMode, theme: initialTheme, difficulty: initialDifficulty, onReturnToMenu }) => {
  const [board, setBoard] = useState(Array(10).fill().map(() => Array(9).fill(null)));
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('red');
  const [validMoves, setValidMoves] = useState([]);
  const [gameMode, setGameMode] = useState(initialGameMode);
  const [theme, setTheme] = useState(initialTheme);
  const [difficulty] = useState(initialDifficulty);
  const [showCheckAlert, setShowCheckAlert] = useState(false);
  const [checkedSide, setCheckedSide] = useState(null);
  const [isFlipMode, setIsFlipMode] = useState(initialGameMode.startsWith('flip'));
  const [flippedPieces, setFlippedPieces] = useState(new Set());
  const [protectedPieces, setProtectedPieces] = useState(new Map());
  const [turnCount, setTurnCount] = useState(0);
  const [lastFlippedPiece, setLastFlippedPiece] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [flippedHistory, setFlippedHistory] = useState([]);

  // 初始化标准象棋棋盘
  const initializeBoard = () => {
    const newBoard = Array(10).fill().map(() => Array(9).fill(null));

    // 初始化红方棋子
    newBoard[9][0] = { type: 'che', side: 'red' };
    newBoard[9][1] = { type: 'ma', side: 'red' };
    newBoard[9][2] = { type: 'xiang', side: 'red' };
    newBoard[9][3] = { type: 'shi', side: 'red' };
    newBoard[9][4] = { type: 'jiang', side: 'red' };
    newBoard[9][5] = { type: 'shi', side: 'red' };
    newBoard[9][6] = { type: 'xiang', side: 'red' };
    newBoard[9][7] = { type: 'ma', side: 'red' };
    newBoard[9][8] = { type: 'che', side: 'red' };
    newBoard[7][1] = { type: 'pao', side: 'red' };
    newBoard[7][7] = { type: 'pao', side: 'red' };
    newBoard[6][0] = { type: 'bing', side: 'red' };
    newBoard[6][2] = { type: 'bing', side: 'red' };
    newBoard[6][4] = { type: 'bing', side: 'red' };
    newBoard[6][6] = { type: 'bing', side: 'red' };
    newBoard[6][8] = { type: 'bing', side: 'red' };

    // 初始化黑方棋子
    newBoard[0][0] = { type: 'che', side: 'black' };
    newBoard[0][1] = { type: 'ma', side: 'black' };
    newBoard[0][2] = { type: 'xiang', side: 'black' };
    newBoard[0][3] = { type: 'shi', side: 'black' };
    newBoard[0][4] = { type: 'jiang', side: 'black' };
    newBoard[0][5] = { type: 'shi', side: 'black' };
    newBoard[0][6] = { type: 'xiang', side: 'black' };
    newBoard[0][7] = { type: 'ma', side: 'black' };
    newBoard[0][8] = { type: 'che', side: 'black' };
    newBoard[2][1] = { type: 'pao', side: 'black' };
    newBoard[2][7] = { type: 'pao', side: 'black' };
    newBoard[3][0] = { type: 'bing', side: 'black' };
    newBoard[3][2] = { type: 'bing', side: 'black' };
    newBoard[3][4] = { type: 'bing', side: 'black' };
    newBoard[3][6] = { type: 'bing', side: 'black' };
    newBoard[3][8] = { type: 'bing', side: 'black' };

    setBoard(newBoard);
    setCurrentPlayer('red');
    setSelectedPiece(null);
    setValidMoves([]);
  };

  // 初始化翻棋模式的棋盘
  const initializeFlipBoard = () => {
    const pieces = [
      { type: 'jiang', side: 'red', isFlipped: false },
      { type: 'shi', side: 'red', isFlipped: false }, { type: 'shi', side: 'red', isFlipped: false },
      { type: 'xiang', side: 'red', isFlipped: false }, { type: 'xiang', side: 'red', isFlipped: false },
      { type: 'ma', side: 'red', isFlipped: false }, { type: 'ma', side: 'red', isFlipped: false },
      { type: 'che', side: 'red', isFlipped: false }, { type: 'che', side: 'red', isFlipped: false },
      { type: 'pao', side: 'red', isFlipped: false }, { type: 'pao', side: 'red', isFlipped: false },
      { type: 'bing', side: 'red', isFlipped: false }, { type: 'bing', side: 'red', isFlipped: false },
      { type: 'bing', side: 'red', isFlipped: false }, { type: 'bing', side: 'red', isFlipped: false },
      { type: 'bing', side: 'red', isFlipped: false },
      { type: 'jiang', side: 'black', isFlipped: false },
      { type: 'shi', side: 'black', isFlipped: false }, { type: 'shi', side: 'black', isFlipped: false },
      { type: 'xiang', side: 'black', isFlipped: false }, { type: 'xiang', side: 'black', isFlipped: false },
      { type: 'ma', side: 'black', isFlipped: false }, { type: 'ma', side: 'black', isFlipped: false },
      { type: 'che', side: 'black', isFlipped: false }, { type: 'che', side: 'black', isFlipped: false },
      { type: 'pao', side: 'black', isFlipped: false }, { type: 'pao', side: 'black', isFlipped: false },
      { type: 'bing', side: 'black', isFlipped: false }, { type: 'bing', side: 'black', isFlipped: false },
      { type: 'bing', side: 'black', isFlipped: false }, { type: 'bing', side: 'black', isFlipped: false },
      { type: 'bing', side: 'black', isFlipped: false }
    ];

    // 随机打乱棋子
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }

    const newBoard = Array(10).fill().map(() => Array(9).fill(null));
    let pieceIndex = 0;

    // 放置棋子
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 9; j++) {
        if (pieceIndex < pieces.length) {
          newBoard[i][j] = pieces[pieceIndex];
          pieceIndex++;
        }
      }
    }

    setBoard(newBoard);
  };

  // 获取棋子的有效移动位置
  const getValidMoves = (row, col, currentBoard = board) => {
    const piece = currentBoard[row][col];
    if (!piece) return [];

    console.log(`Getting valid moves for ${piece.type} at [${row}, ${col}]`);
    const moves = [];
    const side = piece.side;

    switch (piece.type) {
      case 'jiang':
        // 将/帅的移动规则：在九宫格内上下左右移动一格
        const startRow = side === 'red' ? 7 : 0;
        const moves1 = [
          [row - 1, col], [row + 1, col],
          [row, col - 1], [row, col + 1]
        ];
        moves1.forEach(([r, c]) => {
          if (r >= startRow && r < startRow + 3 && c >= 3 && c <= 5) {
            if (!currentBoard[r][c] || currentBoard[r][c].side !== side) {
              moves.push([r, c]);
            }
          }
        });
        break;

      case 'shi':
        // 士/仕的移动规则：在九宫格内斜线移动一格
        const startRow2 = side === 'red' ? 7 : 0;
        const moves2 = [
          [row - 1, col - 1], [row - 1, col + 1],
          [row + 1, col - 1], [row + 1, col + 1]
        ];
        moves2.forEach(([r, c]) => {
          if (r >= startRow2 && r < startRow2 + 3 && c >= 3 && c <= 5) {
            if (!currentBoard[r][c] || currentBoard[r][c].side !== side) {
              moves.push([r, c]);
            }
          }
        });
        break;

      case 'xiang':
        // 相/象的移动规则：走田字，不能过河
        const moves3 = [
          [row - 2, col - 2], [row - 2, col + 2],
          [row + 2, col - 2], [row + 2, col + 2]
        ];
        moves3.forEach(([r, c]) => {
          if (r >= 0 && r < 10 && c >= 0 && c < 9) {
            // 检查象眼是否被塞住
            const eyeRow = (row + r) / 2;
            const eyeCol = (col + c) / 2;
            if (!currentBoard[eyeRow][eyeCol]) {
              // 确保不过河
              if ((side === 'red' && r >= 5) || (side === 'black' && r <= 4)) {
                if (!currentBoard[r][c] || currentBoard[r][c].side !== side) {
                  moves.push([r, c]);
                }
              }
            }
          }
        });
        break;

      case 'ma':
        // 马的移动规则：走日字，检查蹩马腿
        const moves4 = [
          [row - 2, col - 1], [row - 2, col + 1],
          [row + 2, col - 1], [row + 2, col + 1],
          [row - 1, col - 2], [row - 1, col + 2],
          [row + 1, col - 2], [row + 1, col + 2]
        ];
        moves4.forEach(([r, c]) => {
          if (r >= 0 && r < 10 && c >= 0 && c < 9) {
            // 检查蹩马腿
            let legRow = row;
            let legCol = col;
            
            // 根据目标位置确定马腿位置
            if (Math.abs(r - row) === 2) {
              legRow = row + Math.sign(r - row);
              legCol = col;
            } else {
              legRow = row;
              legCol = col + Math.sign(c - col);
            }
            
            // 只有当马腿位置没有棋子时，才能移动
            if (!currentBoard[legRow][legCol]) {
              if (!currentBoard[r][c] || currentBoard[r][c].side !== side) {
                moves.push([r, c]);
              }
            }
          }
        });
        break;

      case 'che':
        // 车的移动规则：直线移动
        // 向上移动
        for (let r = row - 1; r >= 0; r--) {
          if (!currentBoard[r][col]) {
            moves.push([r, col]);
          } else {
            if (currentBoard[r][col].side !== side) {
              moves.push([r, col]);
            }
            break;
          }
        }
        // 向下移动
        for (let r = row + 1; r < 10; r++) {
          if (!currentBoard[r][col]) {
            moves.push([r, col]);
          } else {
            if (currentBoard[r][col].side !== side) {
              moves.push([r, col]);
            }
            break;
          }
        }
        // 向左移动
        for (let c = col - 1; c >= 0; c--) {
          if (!currentBoard[row][c]) {
            moves.push([row, c]);
          } else {
            if (currentBoard[row][c].side !== side) {
              moves.push([row, c]);
            }
            break;
          }
        }
        // 向右移动
        for (let c = col + 1; c < 9; c++) {
          if (!currentBoard[row][c]) {
            moves.push([row, c]);
          } else {
            if (currentBoard[row][c].side !== side) {
              moves.push([row, c]);
            }
            break;
          }
        }
        break;

      case 'pao':
        // 炮的移动规则：直线移动，吃子时需要炮台
        let hasPlat = false;
        // 向上移动
        for (let r = row - 1; r >= 0; r--) {
          if (!currentBoard[r][col]) {
            if (!hasPlat) moves.push([r, col]);
          } else {
            if (!hasPlat) {
              hasPlat = true;
            } else {
              if (currentBoard[r][col].side !== side) {
                moves.push([r, col]);
              }
              break;
            }
          }
        }
        // 向下移动
        hasPlat = false;
        for (let r = row + 1; r < 10; r++) {
          if (!currentBoard[r][col]) {
            if (!hasPlat) moves.push([r, col]);
          } else {
            if (!hasPlat) {
              hasPlat = true;
            } else {
              if (currentBoard[r][col].side !== side) {
                moves.push([r, col]);
              }
              break;
            }
          }
        }
        // 向左移动
        hasPlat = false;
        for (let c = col - 1; c >= 0; c--) {
          if (!currentBoard[row][c]) {
            if (!hasPlat) moves.push([row, c]);
          } else {
            if (!hasPlat) {
              hasPlat = true;
            } else {
              if (currentBoard[row][c].side !== side) {
                moves.push([row, c]);
              }
              break;
            }
          }
        }
        // 向右移动
        hasPlat = false;
        for (let c = col + 1; c < 9; c++) {
          if (!currentBoard[row][c]) {
            if (!hasPlat) moves.push([row, c]);
          } else {
            if (!hasPlat) {
              hasPlat = true;
            } else {
              if (currentBoard[row][c].side !== side) {
                moves.push([row, c]);
              }
              break;
            }
          }
        }
        break;

      case 'bing':
        // 兵/卒的移动规则
        if (side === 'red') {
          // 红方兵
          if (row > 4) {
            // 未过河，只能向上
            if (row - 1 >= 0 && (!currentBoard[row - 1][col] || currentBoard[row - 1][col].side !== side)) {
              moves.push([row - 1, col]);
            }
          } else {
            // 过河后，可以左右移动
            const moves5 = [
              [row - 1, col], // 向上
              [row, col - 1], // 向左
              [row, col + 1]  // 向右
            ];
            moves5.forEach(([r, c]) => {
              if (r >= 0 && r < 10 && c >= 0 && c < 9) {
                if (!currentBoard[r][c] || currentBoard[r][c].side !== side) {
                  moves.push([r, c]);
                }
              }
            });
          }
        } else {
          // 黑方卒
          if (row < 5) {
            // 未过河，只能向下
            if (row + 1 < 10 && (!currentBoard[row + 1][col] || currentBoard[row + 1][col].side !== side)) {
              moves.push([row + 1, col]);
            }
          } else {
            // 过河后，可以左右移动
            const moves5 = [
              [row + 1, col], // 向下
              [row, col - 1], // 向左
              [row, col + 1]  // 向右
            ];
            moves5.forEach(([r, c]) => {
              if (r >= 0 && r < 10 && c >= 0 && c < 9) {
                if (!currentBoard[r][c] || currentBoard[r][c].side !== side) {
                  moves.push([r, c]);
                }
              }
            });
          }
        }
        break;
    }

    console.log(`Valid moves:`, moves);
    return moves;
  };

  // 验证移动是否合法
  const isValidMove = (piece, fromRow, fromCol, toRow, toCol) => {
    if (!piece) return false;

    // 获取所有有效移动
    const validMoves = getValidMoves(fromRow, fromCol);

    // 检查目标位置是否在有效移动列表中
    return validMoves.some(([r, c]) => r === toRow && c === toCol);
  };

  // 处理翻棋
  const handleFlipPiece = (row, col) => {
    if (!board[row][col] || board[row][col].isFlipped) return;

    const newBoard = board.map(r => [...r]);
    const piece = newBoard[row][col];
    piece.isFlipped = true;

    // 记录翻棋历史
    setFlippedHistory([...flippedHistory, { row, col, piece }]);
    
    // 更新翻开的棋子集合
    setFlippedPieces(new Set([...flippedPieces, `${row}-${col}`]));
    
    // 设置翻转保护
    const newProtectedPieces = new Map(protectedPieces);
    newProtectedPieces.set(`${row}-${col}`, turnCount + 2);
    setProtectedPieces(newProtectedPieces);

    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'red' ? 'black' : 'red');
    setTurnCount(turnCount + 1);
  };

  // 初始化棋盘
  React.useEffect(() => {
    if (isFlipMode) {
      initializeFlipBoard();
    } else {
      initializeBoard();
    }
  }, [isFlipMode]);

  // 修改 makeAIMove 函数，优先处理将军情况
  const makeAIMove = (currentBoardState) => {
    if (gameMode !== 'pve') return;

    // 首先检查是否被将军
    const isBlackInCheck = isCheck(currentBoardState, 'black');
    
    // 获取所有可能的移动
    const allPossibleMoves = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 9; j++) {
        const piece = currentBoardState[i][j];
        if (piece && piece.side === 'black') {
          const moves = getValidMoves(i, j, currentBoardState);
          moves.forEach(([toRow, toCol]) => {
            // 模拟移动
            const simulatedBoard = currentBoardState.map(r => [...r]);
            simulatedBoard[toRow][toCol] = piece;
            simulatedBoard[i][j] = null;
            
            let score = evaluateMove(i, j, toRow, toCol, currentBoardState);
            
            // 如果当前被将军，大幅提高能解除将军的移动的分数
            if (isBlackInCheck && !isCheck(simulatedBoard, 'black')) {
              score += 10000; // 解除将军的最高优先级
            }
            
            // 如果这个移动能将对方将军
            if (isCheck(simulatedBoard, 'red')) {
              score += 500;
            }

            // 保护自己的重要棋子
            if (piece.type === 'jiang') {
              score -= 1000; // 降低将帅自己移动的倾向
            }

            // 增加战术考虑
            if (difficulty === 'hard') {
              // 控制中心
              if (toRow >= 3 && toRow <= 6 && toCol >= 3 && toCol <= 5) {
                score += 100;
              }
              // 保护重要棋子
              if (isProtectingImportantPiece(toRow, toCol, simulatedBoard)) {
                score += 200;
              }
            }
            
            allPossibleMoves.push({
              from: { row: i, col: j },
              to: { row: toRow, col: toCol },
              score,
              resolvesCheck: isBlackInCheck && !isCheck(simulatedBoard, 'black')
            });
          });
        }
      }
    }

    // 如果被将军，只考虑能解除将军的移动
    let possibleMoves = isBlackInCheck 
      ? allPossibleMoves.filter(move => move.resolvesCheck)
      : allPossibleMoves;

    // 如果没有解除将军的移动，说明被将死了
    if (isBlackInCheck && possibleMoves.length === 0) {
      alert('红方胜利！(将死)');
      return;
    }

    // 确保有可能的移动
    if (possibleMoves.length === 0) {
      possibleMoves = allPossibleMoves; // 如果没有最优移动，使用所有可能的移动
    }

    // 根据难度选择移动
    let selectedMove;
    switch (difficulty) {
      case 'hard':
        // 选择分数最高的移动
        selectedMove = possibleMoves.reduce((best, current) => 
          current.score > best.score ? current : best
        , possibleMoves[0]);
        break;
      case 'medium':
        // 从前 50% 的最佳移动中随机选择
        possibleMoves.sort((a, b) => b.score - a.score);
        const mediumMoves = possibleMoves.slice(0, Math.max(1, Math.ceil(possibleMoves.length * 0.5)));
        selectedMove = mediumMoves[Math.floor(Math.random() * mediumMoves.length)];
        break;
      default: // easy
        // 随机选择一个移动，但给高分移动更多权重
        possibleMoves.sort((a, b) => b.score - a.score);
        const weightedMoves = [];
        possibleMoves.forEach((move, index) => {
          // 根据移动的排名添加不同数量的副本
          const copies = Math.max(1, Math.floor((possibleMoves.length - index) / 2));
          for (let i = 0; i < copies; i++) {
            weightedMoves.push(move);
          }
        });
        selectedMove = weightedMoves[Math.floor(Math.random() * weightedMoves.length)];
    }

    if (selectedMove) {
      const newBoard = currentBoardState.map(r => [...r]);
      const piece = newBoard[selectedMove.from.row][selectedMove.from.col];
      
      newBoard[selectedMove.to.row][selectedMove.to.col] = piece;
      newBoard[selectedMove.from.row][selectedMove.from.col] = null;

      // 更新棋盘状态
      setBoard(newBoard);
      setCurrentPlayer('red');

      // 检查是否将军
      if (isCheck(newBoard, 'red')) {
        soundEffects.playSound('check');
        setShowCheckAlert(true);
        setCheckedSide('red');
        setTimeout(() => {
          setShowCheckAlert(false);
          setCheckedSide(null);
        }, 3000);
      }
    }
  };

  // 判断是否在保护重要棋子
  const isProtectingImportantPiece = (row, col, board) => {
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1], // 上下左右
      [-1, -1], [-1, 1], [1, -1], [1, 1] // 斜向
    ];

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 9) {
        const piece = board[newRow][newCol];
        if (piece && piece.side === 'black' && 
            (piece.type === 'jiang' || piece.type === 'che' || piece.type === 'ma')) {
          return true;
        }
      }
    }
    return false;
  };

  // 修改评分函数，增加更多策略考虑
  const evaluateMove = (fromRow, fromCol, toRow, toCol, currentBoard) => {
    let score = 0;
    const piece = currentBoard[fromRow][fromCol];
    const targetPiece = currentBoard[toRow][toCol];

    // 基础分值
    const pieceValues = {
      jiang: 10000,
      shi: 200,
      xiang: 200,
      ma: 450,  // 提高马的价值
      che: 1000, // 提高车的价值
      pao: 500,  // 提高炮的价值
      bing: 100
    };

    // 如果可以吃子
    if (targetPiece) {
      score += pieceValues[targetPiece.type] * 1.2; // 提高吃子的权重
    }

    // 位置评分
    const positionScore = getPositionScore(piece.type, toRow, toCol);
    score += positionScore;

    // 战略位置评分
    score += getStrategyScore(piece.type, toRow, toCol, currentBoard);

    // 棋子机动性评分
    score += getMobilityScore(toRow, toCol, currentBoard);

    // 控制中心评分
    score += getCenterControlScore(toRow, toCol);

    return score;
  };

  // 添加战略位置评分
  const getStrategyScore = (pieceType, row, col, board) => {
    let score = 0;

    switch (pieceType) {
      case 'che':
        // 车在开放线上加分
        if (isOpenFile(col, board)) score += 100;
        // 车在七路或八路加分
        if (row === 1 || row === 2) score += 80;
        break;
      case 'ma':
        // 马在中心位置加分
        if (row >= 2 && row <= 7 && col >= 2 && col <= 6) score += 50;
        // 马靠近对方将帅加分
        const distToKing = getDistanceToKing(row, col, board, 'red');
        score += (14 - distToKing) * 10;
        break;
      case 'pao':
        // 炮在中路加分
        if (col === 4) score += 40;
        // 炮在二三路或六七路加分
        if ((col === 1 || col === 2 || col === 6 || col === 7) && row <= 4) score += 30;
        break;
      case 'bing':
        // 过河卒价值提高
        if (row < 5) score += 50;
        // 双兵或三兵连线加分
        if (hasPawnConnection(row, col, board)) score += 30;
        break;
    }

    return score;
  };

  // 检查是否是开放线
  const isOpenFile = (col, board) => {
    let pawns = 0;
    for (let row = 0; row < 10; row++) {
      if (board[row][col] && board[row][col].type === 'bing') {
        pawns++;
      }
    }
    return pawns === 0;
  };

  // 计算到对方将帅的距离
  const getDistanceToKing = (row, col, board, targetSide) => {
    let kingRow = -1, kingCol = -1;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 9; j++) {
        const piece = board[i][j];
        if (piece && piece.type === 'jiang' && piece.side === targetSide) {
          kingRow = i;
          kingCol = j;
          break;
        }
      }
      if (kingRow !== -1) break;
    }
    return Math.abs(row - kingRow) + Math.abs(col - kingCol);
  };

  // 检查兵(卒)的连接
  const hasPawnConnection = (row, col, board) => {
    const directions = [[0, 1], [0, -1]];
    let connections = 0;
    
    for (const [dx, dy] of directions) {
      const newCol = col + dy;
      if (newCol >= 0 && newCol < 9 && 
          board[row][newCol] && 
          board[row][newCol].type === 'bing' &&
          board[row][newCol].side === 'black') {
        connections++;
      }
    }
    return connections;
  };

  // 计算机动性分数
  const getMobilityScore = (row, col, board) => {
    let score = 0;
    const moves = getValidMoves(row, col, board);
    score += moves.length * 10; // 每个可能的移动加10分
    return score;
  };

  // 计算中心控制分数
  const getCenterControlScore = (row, col) => {
    // 定义中心区域 (3-6行, 3-5列)
    const centerRows = [3, 4, 5, 6];
    const centerCols = [3, 4, 5];
    
    if (centerRows.includes(row) && centerCols.includes(col)) {
      // 正中心位置给予最高分
      if (row === 4 && col === 4) return 60;
      // 其他中心位置给予较高分
      return 40;
    }
    
    // 次中心位置给予较低分
    if ((row >= 2 && row <= 7) && (col >= 2 && col <= 6)) {
      return 20;
    }
    
    return 0;
  };

  // 添加位置评分函数
  const getPositionScore = (pieceType, row, col) => {
    // 根据不同棋子类型返回不同的位置分数
    switch (pieceType) {
      case 'bing':
        return row < 5 ? 10 : 20; // 过河的兵价值更高
      case 'pao':
        return Math.abs(4 - col) * 10; // 炮在中间位置更有价值
      case 'ma':
        return (Math.abs(4 - col) < 2 ? 20 : 10); // 马在中间位置更有价值
      default:
        return 0;
    }
  };

  // 修改 handlePieceClick 函数，在玩家移动后触发 AI 移动
  const handlePieceClick = (row, col) => {
    // 如果是 AI 回合，不允许玩家移动
    if (gameMode === 'pve' && currentPlayer === 'black') {
      console.log('AI 回合，玩家不能移动');
      return;
    }

    const piece = board[row][col];

    // 如果点击的不是当前玩家的棋子，并且没有选中的棋子，直接返回
    if (!selectedPiece && (!piece || piece.side !== currentPlayer)) {
      return;
    }

    // 如果已经选中了棋子，尝试移动
    if (selectedPiece) {
      const fromPiece = board[selectedPiece.row][selectedPiece.col];
      
      // 如果点击的是同一个位置，取消选择
      if (selectedPiece.row === row && selectedPiece.col === col) {
        setSelectedPiece(null);
        setValidMoves([]);
        return;
      }

      // 如果是有效移动位置
      if (isValidMove(fromPiece, selectedPiece.row, selectedPiece.col, row, col)) {
        const newBoard = board.map(r => [...r]);
        
        // 执行移动
        newBoard[row][col] = fromPiece;
        newBoard[selectedPiece.row][selectedPiece.col] = null;

        // 记录移动历史
        const newMove = {
          from: { row: selectedPiece.row, col: selectedPiece.col, piece: fromPiece },
          to: { row, col, piece: board[row][col] }
        };
        setMoveHistory(prevHistory => [...prevHistory, newMove]);

        if (board[row][col]) {
          soundEffects.playSound('capture');
        }

        // 检查游戏是否结束
        if (checkGameOver(newBoard)) {
          setBoard(newBoard);
          return;
        }

        // 更新棋盘状态
        setBoard(newBoard);
        setSelectedPiece(null);
        setValidMoves([]);

        // 如果是人机模式
        if (gameMode === 'pve') {
          setCurrentPlayer('black');
          setTimeout(() => {
            makeAIMove(newBoard);
          }, 500);
        } else {
          setCurrentPlayer(currentPlayer === 'red' ? 'black' : 'red');
        }
      }
    } else {
      // 选择新棋子
      if (piece && piece.side === currentPlayer) {
        setSelectedPiece({ row, col });
        const moves = getValidMoves(row, col);
        setValidMoves(moves);
      }
    }
  };

  // 预设残局数据
  const presetLayouts = {
    '马前炮': {
      description: '红方需要用马和炮配合将军',
      board: Array(10).fill().map(() => Array(9).fill(null))
    },
    '双车将死': {
      description: '红方需要用双车将死黑方',
      board: Array(10).fill().map(() => Array(9).fill(null))
    },
    '仙人指路': {
      description: '红方需要利用马和相的配合取胜',
      board: Array(10).fill().map(() => Array(9).fill(null))
    }
  };

  // 处理拖拽开始
  const handleDragStart = (e, piece) => {
    e.dataTransfer.setData('piece', JSON.stringify(piece));
  };

  // 处理拖拽结束
  const handleDrop = (e, row, col) => {
    e.preventDefault();
    const piece = JSON.parse(e.dataTransfer.getData('piece'));
    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = piece;
    setBoard(newBoard);
  };

  // 处理拖拽悬停
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // 检查游戏是否结束
  const checkGameOver = (newBoard) => {
    let redJiangExists = false;
    let blackJiangExists = false;

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 9; j++) {
        const piece = newBoard[i][j];
        if (piece && piece.type === 'jiang') {
          if (piece.side === 'red') redJiangExists = true;
          if (piece.side === 'black') blackJiangExists = true;
        }
      }
    }

    if (!redJiangExists) {
      if (gameMode === 'pve') {
        soundEffects.playSound('defeat');
      } else {
        soundEffects.playSound('victory');
      }
      alert('黑方胜利！');
      return true;
    }
    if (!blackJiangExists) {
      if (gameMode === 'pve') {
        soundEffects.playSound('victory');
      } else {
        soundEffects.playSound('victory');
      }
      alert('红方胜利！');
      return true;
    }
    return false;
  };

  // 检查是否将军
  const isCheck = (board, side) => {
    // 找到将/帅的位置
    let jiangRow = -1, jiangCol = -1;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 9; j++) {
        const piece = board[i][j];
        if (piece && piece.type === 'jiang' && piece.side === side) {
          jiangRow = i;
          jiangCol = j;
          break;
        }
      }
      if (jiangRow !== -1) break;
    }

    // 检查对方所有棋子是否可以吃掉将/帅
    const oppositeSide = side === 'red' ? 'black' : 'red';
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 9; j++) {
        const piece = board[i][j];
        if (piece && piece.side === oppositeSide) {
          if (isValidMove(piece, i, j, jiangRow, jiangCol)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // 加载预设残局
  const loadPresetLayout = (layoutName) => {
    const layout = presetLayouts[layoutName];
    if (layout) {
      const newBoard = Array(10).fill().map(() => Array(9).fill(null));
      // 根据布局名称设置相应的残局
      if (layoutName === '马前炮') {
        newBoard[1][4] = { type: 'jiang', side: 'black' }; // 修正黑将位置到九宫格内
        newBoard[6][4] = { type: 'pao', side: 'red' };
        newBoard[7][3] = { type: 'ma', side: 'red' };
        newBoard[9][4] = { type: 'jiang', side: 'red' };
      } else if (layoutName === '双车将死') {
        newBoard[0][4] = { type: 'jiang', side: 'black' };
        newBoard[7][0] = { type: 'che', side: 'red' };
        newBoard[7][8] = { type: 'che', side: 'red' };
        newBoard[9][4] = { type: 'jiang', side: 'red' };
      } else if (layoutName === '仙人指路') {
        newBoard[0][4] = { type: 'jiang', side: 'black' };
        newBoard[2][4] = { type: 'ma', side: 'red' };
        newBoard[4][3] = { type: 'xiang', side: 'red' };
        newBoard[9][4] = { type: 'jiang', side: 'red' };
      }
      setBoard(newBoard);
    }
  };

  // 渲染自定义残局模式的界面
  const renderCustomMode = () => {
    if (gameMode !== 'custom') return null;

    return (
      <div className="custom-mode">
        <h3>自定义残局模式</h3>
        <div className="preset-layouts">
          {Object.keys(presetLayouts).map(layoutName => (
            <button
              key={layoutName}
              className="preset-layout"
              onClick={() => loadPresetLayout(layoutName)}
            >
              {layoutName}
            </button>
          ))}
        </div>
        <div className="piece-palette">
          {['red', 'black'].map(side => (
            <div key={side} className={`${side}-pieces`}>
              {Object.entries(pieceMap).map(([type, char]) => (
                <div
                  key={`${side}-${type}`}
                  className={`piece ${side}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, { type, side })}
                >
                  {char}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 修改渲染棋盘格子的函数，支持拖拽
  const renderSquare = (row, col) => {
    const piece = board[row][col];
    const isSelected = selectedPiece && selectedPiece.row === row && selectedPiece.col === col;
    const isValidMove = validMoves.some(([r, c]) => r === row && c === col);
    const isInCheck = piece && piece.type === 'jiang' && isCheck(board, piece.side);

    return (
      <div 
        className={`square ${isSelected ? 'selected' : ''} ${isValidMove ? 'valid-move' : ''}`}
        key={`${row}-${col}`}
        onClick={() => handlePieceClick(row, col)}
        onDrop={(e) => handleDrop(e, row, col)}
        onDragOver={handleDragOver}
      >
        {piece && (
          <div 
            className={`piece ${piece.side} ${isInCheck ? 'in-check' : ''}`}
            draggable={gameMode === 'custom'}
            onDragStart={(e) => handleDragStart(e, piece)}
          >
            {getPieceDisplay(piece)}
          </div>
        )}
      </div>
    );
  };

  // 添加一个新的函数来处理棋子显示
  const getPieceDisplay = (piece) => {
    const pieceType = pieceMap[piece.type];
    if (typeof pieceType === 'object') {
      return piece.side === 'red' ? pieceType.red : pieceType.black;
    }
    return pieceType;
  };

  // 渲染棋盘函数
  const renderBoard = () => {
    return (
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((_, colIndex) => renderSquare(rowIndex, colIndex))}
          </div>
        ))}
      </div>
    );
  };

  // 将 getThemeStyles 移动到组件内部，这样它就能访问到 theme 状态
  const getThemeStyles = () => {
    switch (theme) {
      case 'modern':
        return {
          '--board-color': '#f0f0f0',
          '--border-color': '#2c3e50',
          '--square-border-color': '#95a5a6',
          '--red-piece-color': '#e74c3c',
          '--red-piece-border': '#c0392b',
          '--black-piece-color': '#34495e',
          '--black-piece-border': '#2c3e50',
          '--text-color': '#fff'
        };
      case 'ink':
        return {
          '--board-color': '#fff',
          '--border-color': '#000',
          '--square-border-color': '#333',
          '--red-piece-color': '#fff',
          '--red-piece-border': '#f00',
          '--black-piece-color': '#fff',
          '--black-piece-border': '#000',
          '--text-color': '#000'
        };
      case 'retro':
        return {
          '--board-color': '#d2b48c',
          '--border-color': '#8b4513',
          '--square-border-color': '#a0522d',
          '--red-piece-color': '#cd5c5c',
          '--red-piece-border': '#8b0000',
          '--black-piece-color': '#2f4f4f',
          '--black-piece-border': '#000',
          '--text-color': '#fff'
        };
      case 'neon':
        return {
          '--board-color': '#000',
          '--border-color': '#0ff',
          '--square-border-color': '#0f0',
          '--red-piece-color': '#f0f',
          '--red-piece-border': '#f00',
          '--black-piece-color': '#00f',
          '--black-piece-border': '#0ff',
          '--text-color': '#fff'
        };
      default: // classic
        return {
          '--board-color': '#f5d6a7',
          '--border-color': '#8b4513',
          '--square-border-color': '#d2691e',
          '--red-piece-color': '#ff4d4d',
          '--red-piece-border': '#cc0000',
          '--black-piece-color': '#333',
          '--black-piece-border': '#000',
          '--text-color': '#fff'
        };
    }
  };

  // 修改悔棋函数
  const handleUndo = () => {
    if (moveHistory.length === 0) return;

    const lastMove = moveHistory[moveHistory.length - 1];
    const newBoard = board.map(r => [...r]);

    // 恢复棋子位置
    newBoard[lastMove.from.row][lastMove.from.col] = lastMove.from.piece;
    newBoard[lastMove.to.row][lastMove.to.col] = lastMove.to.piece;

    // 更新状态
    setBoard(newBoard);
    setMoveHistory(prev => prev.slice(0, -1));
    setCurrentPlayer(currentPlayer === 'red' ? 'black' : 'red');
    setSelectedPiece(null);
    setValidMoves([]);
  };

  // 添加将军提示组件
  const CheckAlert = ({ side }) => (
    <div className="check-alert">
      {side === 'red' ? '红方' : '黑方'}被将军！
    </div>
  );

  // 在组件挂载时初始化音效和背景音乐
  React.useEffect(() => {
    soundEffects.initSounds().then(() => {
      soundEffects.playBgMusic();
    });
    return () => {
      soundEffects.stopBgMusic();
    };
  }, []);

  return (
    <div className="chess-board" style={getThemeStyles()}>
      <div className="controls">
        <button onClick={onReturnToMenu} className="return-button">返回菜单</button>
        <button onClick={initializeBoard}>开始新游戏</button>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="classic">经典主题</option>
          <option value="modern">现代主题</option>
          <option value="ink">水墨主题</option>
          <option value="retro">复古主题</option>
          <option value="neon">霓虹主题</option>
        </select>
        <button 
          onClick={handleUndo} 
          disabled={moveHistory.length === 0}
          className="undo-button"
        >
          悔棋
        </button>
      </div>
      {renderBoard()}
      {gameMode === 'custom' && renderCustomMode()}
      <div className="game-info">
        <p className={`current-turn ${currentPlayer}-turn`}>
          当前回合: {currentPlayer === 'red' ? '红方' : '黑方'}
        </p>
        <p>游戏模式: {
          gameMode === 'pvp' ? '双人对战' : 
          gameMode === 'pve' ? '人机对战' : 
          gameMode === 'custom' ? '自定义残局' :
          '维护中'
        }</p>
      </div>
      {showCheckAlert && <CheckAlert side={checkedSide} />}
    </div>
  );
};

// 棋子拼音到汉字的映射保持在组件外部
const pieceMap = {
  che: '车',
  ma: '马',
  xiang: {
    red: '相',
    black: '象'
  },
  shi: {
    red: '仕',
    black: '士'
  },
  jiang: {
    red: '帅',
    black: '将'
  },
  pao: '炮',
  bing: {
    red: '兵',
    black: '卒'
  }
};

export default ChessBoard;