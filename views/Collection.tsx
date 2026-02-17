import React, { useState } from 'react';

const Collection = () => {
  const [moodPebbles, setMoodPebbles] = useState([]);

  const addMoodPebble = () => {
    const newPebble = { id: Date.now(), mood: '😊' } // Example mood
    setMoodPebbles([...moodPebbles, newPebble]);
  };

  const deleteMoodPebble = (id) => {
    setMoodPebbles(moodPebbles.filter(pebble => pebble.id !== id));
  };

  const reorderMoodPebbles = (dragIndex, hoverIndex) => {
    const draggedPebble = moodPebbles[dragIndex];
    const updatedPebbles = [...moodPebbles];
    updatedPebbles.splice(dragIndex, 1);
    updatedPebbles.splice(hoverIndex, 0, draggedPebble);
    setMoodPebbles(updatedPebbles);
  };

  return (
    <div>
      <h2>Mood Pebbles Collection</h2>
      <button onClick={addMoodPebble}>Add Mood Pebble</button>
      <ul>
        {moodPebbles.map((pebble, index) => (
          <li key={pebble.id}>
            {pebble.mood} 
            <button onClick={() => deleteMoodPebble(pebble.id)}>Delete</button>
            {/* Add drag-and-drop functionality here for reordering */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Collection;
