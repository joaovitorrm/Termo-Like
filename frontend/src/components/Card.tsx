import { MouseEvent, useEffect, useRef } from "react"

interface CardProps {
    inputting: boolean;
    selected: boolean;
    setSelected: (event: HTMLDivElement) => void;
    onClick: (event: MouseEvent<HTMLDivElement>) => void;
    id: string;
}

export default function Card(props: CardProps) {

    const elementRef = useRef(null);

    // When the grid is created it sets the selected card
    // If the card is selected, it sets the selected variable
    useEffect(() => {
      if (elementRef.current && props.selected) {        
        props.setSelected(elementRef.current);
      }
    }, []);

    return (
        <div className={`card ${props.inputting ? "inputting" : ""} ${props.selected ? "selected" : ""}`} ref={elementRef} onClick={(e) => props.onClick(e)} id={props.id}>
        </div>
    )
}