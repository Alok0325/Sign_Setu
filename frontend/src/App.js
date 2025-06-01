import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CourseList from './components/CourseList';
import Course from './components/Course';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <h1>SignSetu Learning Platform</h1>
          <p>Master Sign Language at Your Own Pace</p>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<CourseList />} />
            <Route path="/course/:courseId" element={<Course />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
