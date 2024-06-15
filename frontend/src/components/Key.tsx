type KeyProps = {
    letter: string;
    classValue: string;
    handleClick: (newLetter: HTMLDivElement) => void;
}

export default function Key(props: KeyProps) {
    const letter: string = props.letter;
    const classValue: string = props.classValue;
    return (
        <div className={`key ${classValue}`} onClick={(e) => props.handleClick(e.currentTarget)}>{letter}</div>
    )
}