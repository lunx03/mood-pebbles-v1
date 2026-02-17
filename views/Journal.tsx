import React from 'react';
import './Journal.css';

const Journal = () => {
    const [moodSignature, setMoodSignature] = React.useState('');
    const [journalEntry, setJournalEntry] = React.useState('');

    const handleMoodChange = (event) => {
        setMoodSignature(event.target.value);
    };

    const handleEntryChange = (event) => {
        setJournalEntry(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Add logic to save the journal entry
        console.log(`Mood: ${moodSignature}, Entry: ${journalEntry}`);
    };

    return (
        <div className="journal-container">
            <h2>Journal Entry</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="mood">Your Mood:</label>
                <input
                    type="text"
                    id="mood"
                    value={moodSignature}
                    onChange={handleMoodChange}
                    placeholder="Enter your mood signature"
                    required
                />
                <label htmlFor="entry">Journal Entry:</label>
                <textarea
                    id="entry"
                    value={journalEntry}
                    onChange={handleEntryChange}
                    placeholder="Write your thoughts here..."
                    required
                />
                <button type="submit">Save Entry</button>
            </form>
        </div>
    );
};

export default Journal;