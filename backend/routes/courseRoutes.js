const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/Course');
const UserProgress = require('../models/UserProgress');

// Get all courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ 
      message: 'Failed to fetch courses',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get single course with progress
router.get('/courses/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.query.userId || 'user123';

    // Validate courseId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ 
        message: 'Invalid course ID format',
        details: 'Course ID must be a valid MongoDB ObjectId (24 characters)'
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        message: 'Course not found',
        details: `No course found with ID: ${courseId}`
      });
    }

    // Get user progress for this course
    let userProgress = await UserProgress.findOne({
      courseId: courseId,
      userId: userId
    });

    // If no progress exists, create initial progress
    if (!userProgress) {
      try {
        userProgress = new UserProgress({
          courseId: courseId,
          userId: userId,
          completedContents: [],
          unlockedLessons: [course.lessons[0]._id] // First lesson is unlocked by default
        });
        await userProgress.save();
      } catch (error) {
        console.error('Error creating user progress:', error);
        return res.status(500).json({ 
          message: 'Failed to initialize user progress',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    }

    // Calculate progress
    const totalContents = course.lessons.reduce((acc, lesson) => 
      acc + lesson.contents.length, 0);
    const completedContents = userProgress.completedContents.length;
    const progress = Math.round((completedContents / totalContents) * 100);

    // Prepare response
    const response = {
      ...course.toObject(),
      userProgress,
      progress
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ 
      message: 'Failed to fetch course details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update content completion status
router.post('/courses/:courseId/content/:contentId/complete', async (req, res) => {
  try {
    const { courseId, contentId } = req.params;
    const userId = req.body.userId || 'user123';

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(400).json({ message: 'Invalid course or content ID format' });
    }

    let userProgress = await UserProgress.findOne({
      courseId,
      userId
    });

    if (!userProgress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    // Add content to completed list if not already completed
    if (!userProgress.completedContents.includes(contentId)) {
      userProgress.completedContents.push(contentId);
    }

    // Check if lesson is completed and unlock next lesson
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const currentLesson = course.lessons.find(lesson => 
      lesson.contents.some(content => content._id.toString() === contentId)
    );

    if (currentLesson) {
      const isLessonCompleted = currentLesson.contents.every(content => 
        userProgress.completedContents.includes(content._id.toString())
      );

      if (isLessonCompleted) {
        const currentLessonIndex = course.lessons.findIndex(
          lesson => lesson._id.toString() === currentLesson._id.toString()
        );
        
        if (currentLessonIndex < course.lessons.length - 1) {
          const nextLessonId = course.lessons[currentLessonIndex + 1]._id;
          if (!userProgress.unlockedLessons.includes(nextLessonId)) {
            userProgress.unlockedLessons.push(nextLessonId);
          }
        }
      }
    }

    await userProgress.save();

    // Calculate updated progress
    const totalContents = course.lessons.reduce((acc, lesson) => 
      acc + lesson.contents.length, 0);
    const completedContents = userProgress.completedContents.length;
    const progress = Math.round((completedContents / totalContents) * 100);

    res.json({
      ...userProgress.toObject(),
      progress
    });
  } catch (error) {
    console.error('Error updating content completion:', error);
    res.status(500).json({ 
      message: 'Failed to update content completion status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 