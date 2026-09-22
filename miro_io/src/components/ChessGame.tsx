"use client";
import { useState, useRef } from "react";
import { Chess } from "chess.js";
// import { ChessContext } from "../providers/ChessProvider";
import { Chessboard } from 'react-chessboard';

export default function ChessGame() {

// create a chess game using a ref to always have access to the latest game state within closures and maintain the game state across renders
    const chessGameRef = useRef(new Chess());
    const chessGame = chessGameRef.current;

    // track the current position of the chess game in state to trigger a re-render of the chessboard
    const [chessPosition, setChessPosition] = useState(() => new Chess().fen());
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isWinner, setIsWinner] = useState<string | null>(null);

    // make a random "CPU" move
    function makeRandomMove() {
      // get all possible moves`
      const possibleMoves = chessGame.moves();

      // exit if the game is over
      if (chessGame.isGameOver()) {
        setIsGameOver(true);
        setIsWinner(chessGame.turn() === 'w' ? 'black' : 'white');
        return;
      }

      // pick a random move
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

      // make the move
      chessGame.move(randomMove);

      // update the position state
      setChessPosition(chessGame.fen());
    }

    // handle piece drop
    function onPieceDrop({
      sourceSquare,
      targetSquare
    }: {
      sourceSquare: string;
      targetSquare: string | null;
    }) {
      // type narrow targetSquare potentially being null (e.g. if dropped off board)
      if (!targetSquare) {
        return false;
      }

      // try to make the move according to chess.js logic
      try {
        chessGame.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q' // always promote to a queen for example simplicity
        });

        // update the position state upon successful move to trigger a re-render of the chessboard
        setChessPosition(chessGame.fen());

        // make random cpu move after a short delay
        setTimeout(makeRandomMove, 500);

        // return true as the move was successful
        setIsGameStarted(true);
        return true;
      } catch {
        // return false as the move was not successful
        return false;
      }
    }

    function handleResetBoard() {
      setChessPosition(new Chess().fen());
      chessGameRef.current = new Chess();
      setIsGameStarted(false);
      setIsGameOver(false);
      setIsWinner(null);
    }

    // set the chessboard options
    const chessboardOptions = {
      position: chessPosition,
      onPieceDrop,
      id: 'play-vs-cpu',
      boardStyle: {
        borderRadius: '5px',
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(0, 0, 0, 0.75)',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        position: 'relative',
      }
    };

    return (
     <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
        <div className="w-full max-w-[480px] aspect-square mx-auto">
          <Chessboard options={chessboardOptions} />
        </div>
        { isGameStarted === true && !isGameOver ? (
            <button
                onClick={handleResetBoard}
                className='px-4 py-1 mt-2 border border-black/30 rounded-lg text-black hover:bg-black/20 transition-colors'>
                    Reset Board
            </button>
        ) : null }
        { isGameOver && isWinner ? (
            <button
                onClick={handleResetBoard}
                className='px-4 py-1 mt-2 border border-black/30 rounded-lg text-black hover:bg-black/20 transition-colors'>
                You Won! Click to Reset Board
            </button>
        ) : null }
      </div>
    );
}