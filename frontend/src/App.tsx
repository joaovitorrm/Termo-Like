import { useState, useEffect } from "react";
import GameBoard from "./components/GameBoard";
import Keyboard from "./components/Keyboard";
import Title from "./components/Title";
import * as myModule from "./index.ts";

export default function App() {

  const [selected, setSelected] = useState<HTMLDivElement | null>(null);
  const [isCheckingWord, setIsCheckingWord] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [word, setWord] = useState<string>("");
  const [letter, setLetter] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Function that is sent to the keyboard component and is called when a letter is clicked with the mouse
  // Then depending on the letter it sets the action variable
  function getLetter(newLetter: HTMLDivElement) {
    if (newLetter.classList.contains("lenter"))
      setAction("Enter");
    else if (newLetter.classList.contains("lbackspace"))
      setAction("Backspace");
    else
      setAction(newLetter.innerHTML);
  }

  // Function that deal with the selected div setting its class
  function handleSetSelected(newSelected: HTMLDivElement | null) {       
    const selectedDiv = document.querySelector(".selected");
    if (selectedDiv) {
      selectedDiv.classList.remove("selected");
    }
    setSelected(newSelected);
    newSelected?.classList.add("selected");
  }

  // Recursive function that adds the flip animation and calls itself when the animation ends
  function addFlipAnimation(div : HTMLDivElement) {
    div.classList.add("flip");
    div.addEventListener("animationend", () => {
      const nextElement = div.nextElementSibling;
      if (nextElement && (nextElement.classList.contains("wrong") || nextElement.classList.contains("correct") || nextElement.classList.contains("place"))) {
        addFlipAnimation(nextElement as HTMLDivElement);
      };
    });
  }

  // Function that checks if the word exists on the server and returns a boolean
  async function checkWordExists(word: string) {
    setIsCheckingWord(true);
    let wordExists = await myModule.checkWordExists(word);
    setIsCheckingWord(false);
    if (wordExists) {
      return true;
    }
    setErrorMessage("essa palavra não é aceita");
    return false;    
  }

  // Function that generates a random word from the server and filters it
  // returning only one valid word
  async function getRandomWord() {
    setErrorMessage("gerando palavra...")
    let words = await myModule.getRandomWord();
    // Check if the word is valid
    let filteredWords = words.filter((w: any) => w.word.length > 3 && w.word.length < 8 && /^[a-zA-Z]+$/.test(w.word));
    // Keep doing requests until we get a valid word
    while (!filteredWords[0]) {
      words = await myModule.getRandomWord();
      filteredWords = words.filter((w: any) => w.word.length > 3 && w.word.length < 8 && /^[a-zA-Z]+$/.test(w.word));
    }
    setErrorMessage("");
    return filteredWords[0].word;
  }

  // Function that generates a new word and resets the keyboard colors/classes
  async function generateNewWord() {
    setWord(await getRandomWord());
    const lettersKeyboard = document.querySelectorAll(".letter");
    for (const key of lettersKeyboard) {
      key.classList.remove("wrong","correct", "place");
    }

  }

  async function getWord() {
    setWord(await getRandomWord());
  }

  // Function that shows the word on the console every time it changes
  useEffect(() => { console.log(word) }, [word]);

  // Function that run only once when the component is mounted
  // It calls the function that generates a new word and adds an event listener to the keyboard
  useEffect(() => {
    getWord();
    const handleKeyDown = (event: KeyboardEvent) => {        
        setAction(event.key);
    };
    document.addEventListener("keyup", handleKeyDown);
    return () => {
      document.removeEventListener("keyup", handleKeyDown);
    };
  }, []);

  // Function that runs every time the action variable changes
  // It sets the selected variable or sets the letter variable
  useEffect(() => {
    if (!isCheckingWord && action != "") {
      switch (action) {
        case "ArrowLeft":          
          if (selected?.previousElementSibling && selected.previousElementSibling.classList.contains("inputting"))
            handleSetSelected(selected?.previousElementSibling as HTMLDivElement);
          break;
        case "ArrowRight":
          if (selected?.nextElementSibling && selected.nextElementSibling.classList.contains("inputting"))
            handleSetSelected(selected?.nextElementSibling as HTMLDivElement);
          break;
        case "Enter":
          setLetter("enter");
          break;
        case "Backspace":
          setLetter("backspace");
          break;
        default:
          if (/^[a-z]$/.test(action.toLowerCase()))
            setLetter(action);
          break;
      }
      setAction("");
    }
  }, [action])

  // Function that checks if the word is correct
  useEffect(() => {
    if (selected && letter != "") {
      let sibling: HTMLDivElement | null = null;
      if (letter === "enter") {
        // Gets all the divs with the class inputting which are the typed letters
        const inputs = document.querySelectorAll(".inputting");
        let wordCopy: string;
        let foundIndex: number;
        // Check if all the inputs are filled
        if (Array.from(inputs).every((x) => x.innerHTML != "")) {
          async function checkWord() {
            // Returns a single string with all the typed letters
            let typedWord = Array.from(inputs).map((x) => x.innerHTML).join("");
            // Check if the word exists in a dictionary API            
            if (await checkWordExists(typedWord)) {
              // Creates a copy of the actual word
              wordCopy = word;
              for (let i of inputs.keys()) {
                // Remove the inputting class from all inputs
                inputs[i].classList.remove("inputting");
                // Saves the index of the letter if it appears in word
                foundIndex = wordCopy.indexOf(inputs[i].innerHTML);
                // If the index is -1 it means the letter is not in the word
                if (foundIndex === -1) {
                  continue;
                }
                // If the letter is in the word, check if it's in the right place
                if (inputs[i].innerHTML !== word[i]) {
                  continue;
                }
                
                // If the letter is in the right place, add the class correct
                inputs[i].classList.add("correct");
                // Sets the key in the keyboard to correct
                const keyDiv = document.querySelector(`.l${inputs[i].innerHTML}`);
                // Removes the place class if it exists
                if (keyDiv?.classList.contains("place")) {
                  keyDiv?.classList.remove("place");
                }
                keyDiv?.classList.add("correct");
                // Updates the word copy removing the letter found
                wordCopy = `${wordCopy.slice(0, foundIndex)}${wordCopy.slice(foundIndex + 1)}`;
              };

              // Checking the wrong letters and the letters at wrong places
              // If wordCopy has any value it means that the some letters might be in the wrong place
              if (wordCopy.length > 0) {
                for (let i of inputs.keys()) {
                  // If the word has multiple instances of the same letter some of them might be in the wrong place
                  if (inputs[i].classList.contains("correct")) {
                    continue;
                  }
                  // If the wordCopy has any letter that was not removed check if it was typed and
                  // add the class place that indicates that is at the wrong place
                  if (wordCopy.includes(inputs[i].innerHTML)) {
                    inputs[i].classList.add("place");
                    foundIndex = wordCopy.indexOf(inputs[i].innerHTML);
                    const keyDiv = document.querySelector(`.l${inputs[i].innerHTML}`);
                    // If the keyboard div has the class correct it doesn't need to add the place class
                    if (!keyDiv?.classList.contains("correct")) {
                      keyDiv?.classList.add("place");
                    }
                    wordCopy = `${wordCopy.slice(0, foundIndex)}${wordCopy.slice(foundIndex + 1)}`;
                  } else {
                    inputs[i].classList.add("wrong");
                    const keyDiv = document.querySelector(`.l${inputs[i].innerHTML}`);
                    if (!keyDiv?.classList.contains("correct") && !keyDiv?.classList.contains("place")) {
                      keyDiv?.classList.add("wrong");
                    }
                  }
                }
                // Sets the next row to have the inputting class which can be typed in
                if (inputs[inputs.length - 1].nextSibling) {
                  let actualDiv: HTMLDivElement = inputs[inputs.length - 1].nextSibling as HTMLDivElement;
                  for (let y = 0; y < word.length; y++) {
                    if (y === 0) {
                      handleSetSelected(actualDiv);
                    }
                    actualDiv.classList.add("inputting");
                    actualDiv = actualDiv.nextSibling as HTMLDivElement;
                  }
                }
              } else {
                // If wordCopy has no value it means that the word is correct and the game is won
                handleSetSelected(null);
              }
              // Adds the flip animation to the first letter typed and uses a recursive call for the next letter
              addFlipAnimation(inputs[0] as HTMLDivElement);
            }
          }
          // It calls the async function created above
          checkWord();
        }
      } else if (letter === "backspace") {
        setErrorMessage("");
        // If the selected div is empty then the previous one is selected and the letter is removed otherwise the letter is removed
        if (selected.innerHTML === "") {
          if (selected.previousElementSibling && selected.previousElementSibling.classList.contains("inputting")) {
            sibling = selected.previousSibling as HTMLDivElement;
            sibling.innerHTML = "";
          }
        } else {
          selected.innerHTML = "";
        }
      } else {
        // If it was just a letter typed, the letter is added to the selected div
        setErrorMessage("");
        selected.innerHTML = letter;
        if (selected.nextElementSibling && selected.nextElementSibling.classList.contains("inputting"))
          sibling = selected.nextSibling as HTMLDivElement;        
      }

      // If sibling is not null then the sibling is selected
      if (sibling) {
        handleSetSelected(sibling);
      }
      
      setLetter("");
    }
  }, [letter]);

  return (
    <>

      <Title message={errorMessage} generateNewWord={generateNewWord}/>
      <GameBoard selected={selected} setSelected={handleSetSelected} word={word} />
      <Keyboard handleClick={getLetter} />

    </>
  )
}
