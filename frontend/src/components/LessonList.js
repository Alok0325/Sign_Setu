import React, { useState } from 'react';
import './LessonList.css';

const LessonList = () => {
  // Hardcoded lesson data
  const initialLessons = [
    { id: 1, title: "Introduction to Sign Language", completed: false },
    { id: 2, title: "Basic Hand Gestures", completed: false },
    { id: 3, title: "Common Phrases in Sign Language", completed: false }
  ];

  const [lessons, setLessons] = useState(initialLessons);

  const toggleCompletion = (lessonId) => {
    setLessons(lessons.map(lesson => 
      lesson.id === lessonId 
        ? { ...lesson, completed: !lesson.completed }
        : lesson
    ));
  };

  return (
    <div className="lesson-container">
      <h2>Available Lessons</h2>
      <div className="lesson-list">
        {lessons.map(lesson => (
          <div 
            key={lesson.id} 
            className={`lesson-card ${lesson.completed ? 'completed' : ''}`}
          >
            <div className="lesson-content">
              <h3 className="lesson-title">{lesson.title}</h3>
              <div className="completion-controls">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={lesson.completed}
                    onChange={() => toggleCompletion(lesson.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <span className="status-text">
                  {lesson.completed ? 'Completed' : 'Mark as Complete'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonList; 