import React, { useState, useEffect } from 'react';

const TodaySummary = () => {
  const [entry, setEntry] = useState('');
  const [todayEntry, setTodayEntry] = useState(null);

  useEffect(() => {
    fetchTodayEntry();
  }, []);

  const fetchTodayEntry = async () => {
    // Fetch today's entry from the database or API
    const response = await fetch('/api/entries/today');
    const data = await response.json();
    setTodayEntry(data.entry);
    setEntry(data.entry || '');
  };

  const handleChange = (e) => {
    setEntry(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add or replace entry
    await fetch('/api/entries/today', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ entry }),
    });
    fetchTodayEntry(); // Refetch entry after submission
  };

  return (
    <div>
      <h3>Today's Summary</h3>
      <p>{todayEntry || 'No entry for today.'}</p>
      <form onSubmit={handleSubmit}>
        <textarea value={entry} onChange={handleChange} />
        <button type="submit">Save Entry</button>
      </form>
    </div>
  );
};

export default TodaySummary;