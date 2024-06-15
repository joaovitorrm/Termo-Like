interface TitleProps {
    message: string;
    generateNewWord: () => void;
}

export default function Title(props: TitleProps) {

    return (
        <div className="title">
            <div className="interrogation-div box">?</div>
            <div className="title-text">Termoo Like</div>
            <div className="new-word-div box" onClick={props.generateNewWord}>w</div>
            {props.message && <div className="message-div">{props.message}</div>}
        </div>
    )
}