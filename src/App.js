import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
    const [flashcards, setFlashcards] = useState([]);
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAnswers, setShowAnswers] = useState({}); 


    useEffect(() => {
        const fetchData = async () => {
            try {
                const setsResponse = await axios.get('http://localhost:8000/api/flashcard_sets');
                const cardsResponse = await axios.get('http://localhost:8000/api/flashcards');
                setSets(setsResponse.data);
                setFlashcards(cardsResponse.data);
            } catch (err) {
                setError('Failed to fetch data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleHideCard = async (id) => {
        try {
            await axios.post(`http://localhost:8000/api/flashcards/${id}/hide`);
            setFlashcards(flashcards.filter(card => card.id !== id));
        } catch (err) {
            alert('Failed to hide the flashcard. Please try again.');
        }
    };

    const handleRateSet = async (id, rating) => {
        try {
            await axios.post(`http://localhost:8000/api/flashcard_sets/${id}/rate`, { rating });
            setSets(sets.map(set => (set.id === id ? { ...set, rating } : set)));
        } catch (err) {
            alert('Failed to rate the flashcard set. Please try again.');
        }
    };

    const handleShowAnswer = (id) => {
        setShowAnswers(prevState => ({ ...prevState, [id]: true }));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Flashcard Platform</h1>
                <p>Learn and share knowledge with flashcards!</p>
            </header>

            <section className="sets-section">
                <h2>Flashcard Sets</h2>
                <ul className="sets-list">
                    {sets.map(set => (
                        <li key={set.id} className="set-item">
                            <div>
                                <strong>{set.name}</strong>
                                <span> - Rating: {set.rating}</span>
                            </div>
                            <button
                                className="rate-button"
                                onClick={() => handleRateSet(set.id, set.rating + 1)}
                            >
                                Rate +
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="cards-section">
                <h2>Flashcards</h2>
                <div className="cards-list">
                    {flashcards.map(card => (
                        <div key={card.id} className="card-item">
                            <p><strong>Question:</strong> {card.question}</p>
                            {showAnswers[card.id] ? (
                                <p><strong>Answer:</strong> {card.answer}</p>
                            ) : (
                                <button
                                    className="show-answer-button"
                                    onClick={() => handleShowAnswer(card.id)}
                                >
                                    Show Answer
                                </button>
                            )}
                            <button
                                className="hide-button"
                                onClick={() => handleHideCard(card.id)}
                            >
                                Hide
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default App;
