import React, { useState, useEffect, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { RefreshCw, User, Cpu } from 'lucide-react';

const PLAYER = 'X';
const AI = 'O';
type Difficulty = 'Easy' | 'Medium' | 'Hard';

const winningCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

const motivationalMessages = {
    playerWin: ["A rare victory! Well played.", "You found a way. Impressive!", "Victory is yours!"],
    aiWin: ["Outsmarted by the machine.", "A calculated victory.", "Flawless execution... by the AI."],
    draw: ["A battle of wits ends in a stalemate.", "Perfectly matched. A draw.", "Close one! It's a tie."],
    thinking: ["Calculating possibilities...", "Analyzing your move...", "Hmm, interesting..."],
    playerTurn: ["The challenge awaits. Your move.", "Your turn. Make your mark.", "Think ahead. It's on you."]
};

const getRandomMessage = (type: keyof typeof motivationalMessages) => {
    const messages = motivationalMessages[type];
    return messages[Math.floor(Math.random() * messages.length)];
};

const XIcon = () => (
    <svg className="w-1/2 h-1/2" viewBox="0 0 52 52" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.5))' }}>
        <path strokeLinecap="round" strokeWidth="6" stroke="cyan" d="M10 10 L 42 42 M 42 10 L 10 42"/>
    </svg>
);

const OIcon = () => (
    <svg className="w-1/2 h-1/2" viewBox="0 0 52 52" style={{ filter: 'drop-shadow(0 0 8px rgba(255, 191, 0, 0.5))' }}>
        <circle cx="26" cy="26" r="20" stroke="gold" strokeWidth="6" fill="none" />
    </svg>
);

export const TicTacToeGame: React.FC = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [scores, setScores] = useLocalStorage('tic-tac-toe-scores', { player: 0, ai: 0, draws: 0 });
    const [gameOver, setGameOver] = useState(false);
    const [winnerInfo, setWinnerInfo] = useState<{ winner: string | null, line: number[] | null } | null>(null);
    const [statusMessage, setStatusMessage] = useState(getRandomMessage('playerTurn'));
    const [difficulty, setDifficulty] = useLocalStorage<Difficulty>('tic-tac-toe-difficulty', 'Hard');

    const calculateWinner = useCallback((currentBoard: (string | null)[]) => {
        for (let i = 0; i < winningCombos.length; i++) {
            const [a, b, c] = winningCombos[i];
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                return { winner: currentBoard[a], line: winningCombos[i] };
            }
        }
        if (currentBoard.every(cell => cell !== null)) {
            return { winner: 'draw', line: null };
        }
        return null;
    }, []);

    const minimax = useCallback((newBoard: (string | null)[], depth: number, isMaximizing: boolean): number => {
        const winnerResult = calculateWinner(newBoard);
        if (winnerResult) {
            if (winnerResult.winner === AI) return 10 - depth;
            if (winnerResult.winner === PLAYER) return depth - 10;
            if (winnerResult.winner === 'draw') return 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (newBoard[i] === null) {
                    newBoard[i] = AI;
                    let score = minimax(newBoard, depth + 1, false);
                    newBoard[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (newBoard[i] === null) {
                    newBoard[i] = PLAYER;
                    let score = minimax(newBoard, depth + 1, true);
                    newBoard[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }, [calculateWinner]);

    const getAIMove = useCallback((currentBoard: (string|null)[], level: Difficulty): number => {
        const emptyCells = currentBoard.map((c, i) => c === null ? i : null).filter(i => i !== null) as number[];
        
        if (level === 'Easy') {
            return emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }

        if (level === 'Medium') {
            // 1. Check if AI can win
            for (const i of emptyCells) {
                const tempBoard = [...currentBoard];
                tempBoard[i] = AI;
                if (calculateWinner(tempBoard)?.winner === AI) return i;
            }
            // 2. Check if Player can win and block
            for (const i of emptyCells) {
                const tempBoard = [...currentBoard];
                tempBoard[i] = PLAYER;
                if (calculateWinner(tempBoard)?.winner === PLAYER) return i;
            }
            // 3. Otherwise, make a random move
            return emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
        
        // Hard difficulty (minimax)
        let bestScore = -Infinity;
        let move = -1;
        for (const i of emptyCells) {
            const newBoard = [...currentBoard];
            newBoard[i] = AI;
            let score = minimax(newBoard, 0, false);
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
        return move;
    }, [calculateWinner, minimax]);

    const handlePlayerMove = (index: number) => {
        if (board[index] || gameOver || !isPlayerTurn) return;
        const newBoard = [...board];
        newBoard[index] = PLAYER;
        setBoard(newBoard);
        setIsPlayerTurn(false);
    };

    const handleRestart = useCallback(() => {
        setBoard(Array(9).fill(null));
        setIsPlayerTurn(true);
        setGameOver(false);
        setWinnerInfo(null);
        setStatusMessage(getRandomMessage('playerTurn'));
    }, []);

    const handleDifficultyChange = (level: Difficulty) => {
        setDifficulty(level);
        handleRestart();
    };

    useEffect(() => {
        const winnerCheck = calculateWinner(board);
        if (winnerCheck) {
            setGameOver(true);
            setWinnerInfo(winnerCheck);
            if (winnerCheck.winner === PLAYER) {
                setScores(s => ({ ...s, player: s.player + 1 }));
                setStatusMessage(getRandomMessage('playerWin'));
            } else if (winnerCheck.winner === AI) {
                setScores(s => ({ ...s, ai: s.ai + 1 }));
                setStatusMessage(getRandomMessage('aiWin'));
            } else {
                setScores(s => ({ ...s, draws: s.draws + 1 }));
                setStatusMessage(getRandomMessage('draw'));
            }
        } else if (!isPlayerTurn && !gameOver) {
            setStatusMessage(getRandomMessage('thinking'));
            const timer = setTimeout(() => {
                const move = getAIMove(board, difficulty);
                if (move !== -1) {
                    const newBoard = [...board];
                    newBoard[move] = AI;
                    setBoard(newBoard);
                }
                setIsPlayerTurn(true);
                setStatusMessage(getRandomMessage('playerTurn'));
            }, 600 + Math.random() * 400);
            return () => clearTimeout(timer);
        }
    }, [board, isPlayerTurn, gameOver, setScores, calculateWinner, difficulty, getAIMove]);
    
    const getWinningLineCoords = (line: number[] | null) => {
        if (!line) return null;
        const [a, b] = [line[0], line[2]];
        const getCenter = (index: number) => ({
            x: (index % 3) * 33.33 + 16.66,
            y: Math.floor(index / 3) * 33.33 + 16.66
        });
        const start = getCenter(a);
        const end = getCenter(b);
        return { x1: `${start.x}%`, y1: `${start.y}%`, x2: `${end.x}%`, y2: `${end.y}%` };
    };

    const winningLineCoords = getWinningLineCoords(winnerInfo?.line);

    return (
        <div className="animate-reveal-3d">
            <div className="bg-gradient-to-br from-neutral-900/80 to-black/80 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-md mx-auto">
                <h3 className="text-2xl sm:text-3xl text-center mb-1 premium-title-red">Feeling Bored? Challenge Our AI.</h3>
                <p className="text-sm text-neutral-400 text-center mb-4 sm:mb-6">A classic game of Tic-Tac-Toe against a clever opponent.</p>
                
                <div className="flex justify-center gap-2 mb-4">
                    {(['Easy', 'Medium', 'Hard'] as const).map((level) => (
                        <button
                            key={level}
                            onClick={() => handleDifficultyChange(level)}
                            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 shadow-sm
                                ${difficulty === level 
                                    ? 'bg-white/90 text-black ring-2 ring-white' 
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>

                <div className="flex justify-around items-center mb-4 sm:mb-6 text-center text-white bg-black/20 p-3 rounded-lg">
                    <div className="flex flex-col items-center gap-1">
                        <User className="w-5 h-5 text-cyan-400"/>
                        <span className="font-bold text-xl sm:text-2xl">{scores.player}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <p className="text-xs text-neutral-400">DRAW</p>
                        <span className="font-bold text-xl sm:text-2xl">{scores.draws}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Cpu className="w-5 h-5 text-amber-400"/>
                        <span className="font-bold text-xl sm:text-2xl">{scores.ai}</span>
                    </div>
                </div>

                <div className="relative aspect-square">
                    <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full h-full">
                        {board.map((value, index) => (
                            <button
                                key={index}
                                onClick={() => handlePlayerMove(index)}
                                className={`rounded-lg bg-white/5 backdrop-blur-sm flex items-center justify-center transition duration-200 ease-in-out
                                            ${!value && !gameOver ? 'cursor-pointer hover:bg-white/10' : 'cursor-not-allowed'}
                                            ${winnerInfo?.line && !winnerInfo.line.includes(index) ? 'opacity-50' : ''}`}
                                aria-label={`Cell ${index + 1}, currently ${value || 'empty'}`}
                            >
                                {value && <div className="animate-pop-in">{value === 'X' ? <XIcon /> : <OIcon />}</div>}
                            </button>
                        ))}
                    </div>
                    
                    {gameOver && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4 fade-in-overlay rounded-lg">
                            <p className={`text-3xl font-bold transition-opacity duration-300 text-center
                                ${winnerInfo?.winner === PLAYER ? 'text-cyan-400' : winnerInfo?.winner === AI ? 'text-amber-400' : 'text-neutral-300'}`}>
                                {statusMessage}
                            </p>
                            <button
                                onClick={handleRestart}
                                className="bg-white/90 hover:bg-white text-black font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-colors duration-200"
                            >
                                <RefreshCw className="w-4 h-4"/>
                                Play Again
                            </button>
                        </div>
                    )}

                    {winningLineCoords && (
                        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                            <line 
                                {...winningLineCoords}
                                stroke={winnerInfo?.winner === PLAYER ? "cyan" : "gold"}
                                strokeWidth="3"
                                strokeLinecap="round"
                                style={{
                                    strokeDasharray: 200,
                                    strokeDashoffset: 200,
                                    animation: 'draw-line 0.5s ease-out 0.2s forwards'
                                }}
                            />
                        </svg>
                    )}
                </div>
            </div>
        </div>
    );
};
