import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CourseList.css';

const API_BASE_URL = 'http://localhost:5000/api';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/courses`);
      setCourses(response.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading courses...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="course-list-container">
      <h1>Available Courses</h1>
      <div className="courses-grid">
        {courses.map(course => (
          <Link 
            to={`/course/${course._id}`} 
            key={course._id} 
            className="course-card"
          >
            <div className="course-content">
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <div className="course-stats">
                <span>{course.lessons.length} Lessons</span>
                <span>{course.lessons.reduce((acc, lesson) => acc + lesson.contents.length, 0)} Contents</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CourseList; 