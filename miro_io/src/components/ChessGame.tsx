"use client";
import { useEffect, useContext, useState } from "react";
import { ChessContext } from "../providers/ChessProvider";

export default function Chess_Game() {
    const chessContext = useContext(ChessContext);
    if (!chessContext) {
        throw new Error("ChessContext must be used within ChessProvider");
    }

    const {
            checkIsValidMove,
            isValidMove,
            setGameBoard, 
            playerWithCurrentTurn,
            changePlayer } = chessContext;

    // const [ playerWithCurrentTurn, setPlayerWithCurrentTurn ] = useState('white');
    // const [ isValidMove, setIsValidMove ] = useState(true);

    const width = 8;

    useEffect(() => {
        const document = window.document;
        const gameBoard = document.getElementById("gameboard");
        const player = document.getElementById("player");
        const infoDisplay = document.getElementById("info-display");
        player.textContent = 'white';

        if (!gameBoard) {
            return;
        }
        // gameBoard.innerHTML = "";

        // setup of the chess board and pieces
        setGameBoard(gameBoard);

        // add event listeners to all squares for moves
        const allSquares = document.querySelectorAll("#gameboard .square");
        allSquares.forEach((square) => {
            square.addEventListener('dragstart', dragStart)
            square.addEventListener('dragover', dragOver)
            square.addEventListener('drop', dragDrop)
        });

        // gets the square id from the square that the piece was dragged from
        let startingSquareId: string | null = null;
        let draggedElement: EventTarget | null = null;
        function dragStart(e) {
            draggedElement = e.target;
            startingSquareId = ((draggedElement as HTMLElement)?.parentNode as HTMLElement)?.getAttribute('square-id');
        }

        function dragOver(e) {
            e.preventDefault(); // prevents it from scanning while it's hovering and hasn't been dropped yet
        }

        function dragDrop(e) {
            e.stopPropagation();

            const finalSquareId = e.currentTarget.getAttribute('square-id');
            console.log(startingSquareId, finalSquareId);
            console.log(isValidMove, 'isValidMoveb4');
            checkIsValidMove(startingSquareId, finalSquareId);
            console.log(isValidMove, 'isValidMoveaftr');

            const correctPlayersTurn = (draggedElement as HTMLElement).classList.contains(playerWithCurrentTurn);
            const captureHasOccured = e.target.classList.contains("piece");
            const opponentMove = playerWithCurrentTurn === 'white' ? 'black' : 'white';
            const takenByOpponent = e.target.classList.contains(opponentMove);

            if (correctPlayersTurn) {
                if (takenByOpponent && isValidMove) {
                    e.currentTarget.firstChild?.remove();
                    e.currentTarget.append(draggedElement);
                    changePlayer(document, playerWithCurrentTurn);
                    return;
                }

                if (captureHasOccured && !takenByOpponent) {
                    let priorDisplay = infoDisplay.textContent;
                    infoDisplay.textContent = "you can't take your own piece!";
                    setTimeout(() => infoDisplay.textContent = priorDisplay, 2000);
                    // return;
                }

                if (isValidMove) {
                    e.currentTarget.firstChild?.remove();
                    e.currentTarget.append(draggedElement);
                    changePlayer(document, playerWithCurrentTurn);
                    return;
                }
            }
        }

    }, []);

    return (
        <div>
            <button
                id="info-display"
                className="text-black border border-gray-300 bg-gray-100 px-4 rounded-md hover:translate-y-0.5 transition-transform"
                onClick={() => setGameBoard(document.getElementById('gameboard'))}
            >
                It is <span id="player"></span>&apos;s turn. Click here to reset the board.
            </button>
            <div id="gameboard" className="chess-game"></div>
        </div>
    );
}