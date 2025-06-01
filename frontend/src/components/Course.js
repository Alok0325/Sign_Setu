import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Course.css';

// Make sure to use the full URL with http://
const API_BASE_URL = 'http://localhost:5000/api';

const Course = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId) {
      setError('No course ID provided');
      setLoading(false);
      return;
    }
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate courseId format (should be a MongoDB ObjectId)
      if (!/^[0-9a-fA-F]{24}$/.test(courseId)) {
        setError('Invalid course ID format');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/courses/${courseId}?userId=user123`);
      if (response.data) {
        setCourse(response.data);
      } else {
        setError('No course data received');
      }
    } catch (err) {
      console.error('Error fetching course:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load course. Please try again later.';
      setError(errorMessage);
      
      // Handle specific error cases
      if (err.response?.status === 404) {
        setError('Course not found. Please check the course ID.');
      } else if (err.response?.status === 400) {
        setError('Invalid course ID format. Please check the URL.');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (lessons, userProgress) => {
    if (!userProgress) return 0;

    let totalUnlockedContents = 0;
    let completedContents = 0;

    lessons.forEach(lesson => {
      if (userProgress.unlockedLessons.includes(lesson._id)) {
        totalUnlockedContents += lesson.contents.length;
        completedContents += lesson.contents.filter(content => 
          userProgress.completedContents.includes(content._id)
        ).length;
      }
    });

    return totalUnlockedContents > 0 
      ? Math.round((completedContents / totalUnlockedContents) * 100)
      : 0;
  };

  const toggleContentCompletion = async (lessonId, contentId) => {
    try {
      setError(null);
      // In production, userId would come from authentication
      const response = await axios.post(
        `${API_BASE_URL}/courses/${courseId}/content/${contentId}/complete`,
        { userId: 'user123' },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Update course with new progress
      setCourse(prevCourse => ({
        ...prevCourse,
        userProgress: response.data,
        progress: calculateProgress(prevCourse.lessons, response.data)
      }));
    } catch (err) {
      console.error('Error updating progress:', err);
      setError(err.response?.data?.message || 'Failed to update progress. Please try again.');
    }
  };

  const toggleContentDropdown = (lessonId) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  if (loading) {
    return <div className="loading">Loading course...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!course) {
    return <div className="error-message">Course not found</div>;
  }

  const isLessonLocked = (lessonId) => {
    return !course.userProgress.unlockedLessons.includes(lessonId);
  };

  const isContentCompleted = (contentId) => {
    return course.userProgress.completedContents.includes(contentId);
  };

  return (
    <div className="course-detail-container">
      <div className="course-header">
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <div className="course-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
          <span>{course.progress}% Complete</span>
        </div>
      </div>

      <div className="lessons-container">
        <h2>Course Content</h2>
        {course.lessons.map((lesson, index) => (
          <div 
            key={lesson._id}
            className={`lesson-item ${isLessonLocked(lesson._id) ? 'locked' : ''}`}
          >
            <div className="lesson-header">
              <div className="lesson-info">
                <span className="lesson-number">Lesson {index + 1}</span>
                <h3>{lesson.title}</h3>
                <p>{lesson.description}</p>
                {isLessonLocked(lesson._id) && (
                  <div className="lesson-locked-message">
                    Complete previous lesson to unlock
                  </div>
                )}
              </div>
              <div className="lesson-controls">
                <button 
                  className="content-toggle-btn"
                  onClick={() => !isLessonLocked(lesson._id) && toggleContentDropdown(lesson._id)}
                  disabled={isLessonLocked(lesson._id)}
                >
                  {expandedLesson === lesson._id ? 'Hide Content' : 'Show Content'}
                </button>
              </div>
            </div>
            
            {expandedLesson === lesson._id && !isLessonLocked(lesson._id) && (
              <div className="lesson-content-preview">
                <div className="content-type-section">
                  <h4>Reading Materials</h4>
                  {lesson.contents
                    .filter(content => content.type === 'text')
                    .map((content) => (
                      <div 
                        key={content._id} 
                        className={`content-item ${isContentCompleted(content._id) ? 'completed' : ''}`}
                      >
                        <span className="content-type text">📖</span>
                        <span className="content-title">{content.title}</span>
                        <label className="completion-checkbox">
                          <input
                            type="checkbox"
                            checked={isContentCompleted(content._id)}
                            onChange={() => toggleContentCompletion(lesson._id, content._id)}
                            disabled={isContentCompleted(content._id)}
                          />
                          <span className="checkmark"></span>
                          <span className="status-text">
                            {isContentCompleted(content._id) ? 'Completed' : 'Mark as Complete'}
                          </span>
                        </label>
                      </div>
                    ))}
                </div>
                <div className="content-type-section">
                  <h4>Video Lessons</h4>
                  {lesson.contents
                    .filter(content => content.type === 'video')
                    .map((content) => (
                      <div 
                        key={content._id} 
                        className={`content-item ${isContentCompleted(content._id) ? 'completed' : ''}`}
                      >
                        <span className="content-type video">🎥</span>
                        <span className="content-title">{content.title}</span>
                        <span className="content-duration">{content.duration} min</span>
                        <label className="completion-checkbox">
                          <input
                            type="checkbox"
                            checked={isContentCompleted(content._id)}
                            onChange={() => toggleContentCompletion(lesson._id, content._id)}
                            disabled={isContentCompleted(content._id)}
                          />
                          <span className="checkmark"></span>
                          <span className="status-text">
                            {isContentCompleted(content._id) ? 'Completed' : 'Mark as Complete'}
                          </span>
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Course; 