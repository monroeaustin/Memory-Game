import { useState, useEffect } from "react";

function generateRandomCharacterIDs(count = 12, max = 183) {
  const ids = new Set();
  while (ids.size < count) {
    const randomId = Math.floor(Math.random() * max) + 1;
    ids.add(randomId);
  }
  return Array.from(ids).join(",");
}

function cleanCharacterData(data) {
  return data.map(({ name, image, id }) => ({
    name,
    image,
    clicked: false,
    id,
  }));
}

function shuffleArray(array) {
  for (let i = array.length - 1; i >= 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function Game() {
  const [score, changeScore] = useState(0);
  const [clickedCards, setClickedCards] = useState([]);
  const [highScore, setHighScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const isGameWon = score === clickedCards.length && clickedCards.length > 0;

  function updateBestScore(score) {
    if (score > highScore) setHighScore(score);
  }

  const fetchCharacters = async () => {
    setLoading(true);
    setProgress(0);

    const idString = generateRandomCharacterIDs();
    const url = `https://rickandmortyapi.com/api/character/${idString}`;

    const simulateProgress = () => {
      let current = 0;
      const interval = setInterval(() => {
        current += Math.floor(Math.random() * 15);
        setProgress(Math.min(current, 100));
        if (current >= 100) clearInterval(interval);
      }, 100);
    };

    simulateProgress();

    try {
      const res = await fetch(url);
      const data = await res.json();
      const cleanedCharacters = cleanCharacterData(data);
      setClickedCards(cleanedCharacters);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
    setTimeout(() => {
    setProgress(100);      // ✅ Force it to fill up
    setTimeout(() => setLoading(false), 200); // ✅ Give it a short moment to animate
  }, 1000); // Give simulateProgress some time to run
}}

  function addScore() {
    changeScore((prev) => prev + 1);
    updateBestScore(score + 1);
  }

  function resetScore() {
    changeScore(0);
    fetchCharacters();
  }

  function checkForClick(id) {
    return clickedCards.some((card) => card.id === id && card.clicked);
  }

  function processClick(id) {
    setClickedCards((prev) => {
      const updated = prev.map((card) =>
        card.id === id ? { ...card, clicked: true } : card
      );
      return shuffleArray([...updated]);
    });
    addScore();
  }

  function handleCardClick(id) {
    checkForClick(id) ? resetScore() : processClick(id);
  }

  useEffect(() => {
    fetchCharacters();
  }, []);

  return (
    <>
      {loading ? (
        <div className="loader-screen">
          <div className="loader-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
          <p>Initializing Portal Gun...</p>
        </div>
      ) : (
        <>
          <div className="score">
            <p>Score: {score}</p>
            <p>Best Score: {highScore}</p>
          </div>

          <div className="grid">
            {clickedCards.map((character) => (
              <div
                key={character.id}
                className={`card`}
              >
                <button onClick={() => handleCardClick(character.id)}>
                  <img src={character.image} alt={character.name} />
                </button>
                <p>{character.name}</p>
              </div>
            ))}
          </div>

          {isGameWon && (
            <div className="win-modal">
              <div className="modal-card">
                <h2>You Win!</h2>
                <p>You’ve clicked all cards correctly!</p>
                <button onClick={resetScore}>Play Again</button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
