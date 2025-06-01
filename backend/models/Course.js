const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'video'],
    required: true
  },
  duration: {
    type: Number,
    required: function() {
      return this.type === 'video';
    }
  },
  content: {
    type: String,
    required: true
  }
});

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  contents: [contentSchema]
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  lessons: [lessonSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema); 