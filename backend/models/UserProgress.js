const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedContents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course.lessons.contents'
  }],
  unlockedLessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course.lessons'
  }]
}, {
  timestamps: true
});

// Compound index to ensure unique user progress per course
userProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema); 