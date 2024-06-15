import Key from "./Key"

interface KeyboardProps {
    handleClick: (newLetter : HTMLDivElement) => void;
}
export default function Keyboard(props: KeyboardProps) {
    const letters = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"];

    return (
        <div className="keyboard">
            {letters.map((letter) => (
                <Key key={letter} letter={letter} classValue={`l${letter} letter`} handleClick={props.handleClick}/>
            ))}
            <Key letter="" classValue="lbackspace" handleClick={props.handleClick}/>
            <Key letter="enter" classValue="lenter" handleClick={props.handleClick}/>
        </div>
    )
}