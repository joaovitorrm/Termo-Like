import Card from "./Card"
import { useState, MouseEvent, useEffect } from "react"

interface GameBoardProps {
    selected: HTMLDivElement | null;
    setSelected: (event: HTMLDivElement) => void;
    word: string;
}

interface CardProps {
    inputting: boolean;
    selected: boolean;
    setSelected: (event: HTMLDivElement) => void;
    onClick: (event: MouseEvent<HTMLDivElement>) => void;
    id: string;
}

export default function GameBoard(props: GameBoardProps) {
    let columns: number = props.word.length;
    let rows: number = columns + 1;
    let actualRow: number = 0;
    const [cards, setCards] = useState<CardProps[] | null>([]);

    function handleKeyClick(event: MouseEvent<HTMLDivElement>) {
        if (event.currentTarget.classList.contains("inputting")) {
            props.setSelected(event.currentTarget);
        }
    }

    // Every time the word changes, it resets the grid
    useEffect(() => {
        if (props.word.length > 0) {
            setCards(null);
        }
    }, [props.word]);

    useEffect(() => {
        // If the cards are null, it creates them
        if (cards === null) {
            // Creates the grid with the cards
            let i: number = 0;
            for (let x = 0; x < rows; x++) {
                for (let letter = 0; letter < props.word.length; letter++) {
                    setCards(prev => {
                        i++
                        return [...prev? prev : [], {
                            id: i.toString(),
                            inputting: x == actualRow ? true : false,
                            selected: (x === 0 && letter == 0) ? true : false,
                            setSelected: props.setSelected,
                            onClick: handleKeyClick
                        }]
                    });
                }
            }
        }
    }, [cards]);

    return (
        <div style={{ gridTemplateColumns: `repeat(${columns}, 8vh)`, gridTemplateRows: `repeat(${rows}, 8vh)` }} className="game-board">
            {cards?.map((x) => <Card key={x.id} id={x.id} setSelected={x.setSelected} selected={x.selected} inputting={x.inputting} onClick={x.onClick} />)}
        </div>
    )
}