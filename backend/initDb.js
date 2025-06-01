const mongoose = require('mongoose');
const Course = require('./models/Course');

const sampleCourses = [
  {
    title: "Basic Sign Language",
    description: "Learn the fundamentals of sign language communication",
    lessons: [
      {
        title: "Introduction to Sign Language",
        description: "Basic concepts and importance of sign language",
        contents: [
          {
            title: "What is Sign Language?",
            type: "text",
            content: "Sign language is a visual language that uses hand gestures, facial expressions, and body movements to communicate."
          },
          {
            title: "History of Sign Language",
            type: "text",
            content: "Learn about the origins and evolution of sign language across different cultures."
          },
          {
            title: "Introduction Video",
            type: "video",
            duration: 5,
            content: "https://example.com/intro-video"
          }
        ]
      },
      {
        title: "Basic Hand Signs",
        description: "Learn essential hand signs for everyday communication",
        contents: [
          {
            title: "Alphabet Signs",
            type: "text",
            content: "Learn how to sign each letter of the alphabet."
          },
          {
            title: "Numbers 1-10",
            type: "text",
            content: "Master the signs for numbers one through ten."
          },
          {
            title: "Basic Signs Tutorial",
            type: "video",
            duration: 8,
            content: "https://example.com/basic-signs"
          }
        ]
      }
    ]
  },
  {
    title: "Advanced Sign Language",
    description: "Take your sign language skills to the next level",
    lessons: [
      {
        title: "Complex Expressions",
        description: "Learn to express complex ideas and emotions",
        contents: [
          {
            title: "Emotional Expressions",
            type: "text",
            content: "Understanding how to convey emotions through sign language."
          },
          {
            title: "Facial Expressions",
            type: "text",
            content: "The importance of facial expressions in sign language communication."
          },
          {
            title: "Advanced Expressions Tutorial",
            type: "video",
            duration: 10,
            content: "https://example.com/advanced-expressions"
          }
        ]
      },
      {
        title: "Professional Communication",
        description: "Sign language for professional settings",
        contents: [
          {
            title: "Business Signs",
            type: "text",
            content: "Essential signs for professional and business communication."
          },
          {
            title: "Workplace Communication",
            type: "text",
            content: "Effective sign language communication in workplace settings."
          },
          {
            title: "Professional Signs Video",
            type: "video",
            duration: 12,
            content: "https://example.com/professional-signs"
          }
        ]
      }
    ]
  },
  {
    title: "Sign Language for Kids",
    description: "Fun and engaging sign language lessons for children",
    lessons: [
      {
        title: "Fun with Signs",
        description: "Making sign language learning enjoyable for children",
        contents: [
          {
            title: "Animal Signs",
            type: "text",
            content: "Learn to sign different animals in a fun way."
          },
          {
            title: "Color Signs",
            type: "text",
            content: "Sign language for different colors."
          },
          {
            title: "Fun Signs Video",
            type: "video",
            duration: 6,
            content: "https://example.com/fun-signs"
          }
        ]
      },
      {
        title: "Story Time Signs",
        description: "Learn signs through storytelling",
        contents: [
          {
            title: "Story Signs",
            type: "text",
            content: "Common signs used in children's stories."
          },
          {
            title: "Interactive Story",
            type: "text",
            content: "An interactive story using sign language."
          },
          {
            title: "Story Time Video",
            type: "video",
            duration: 8,
            content: "https://example.com/story-time"
          }
        ]
      }
    ]
  }
];

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/signsetu');
    console.log('Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Insert sample courses
    const courses = await Course.insertMany(sampleCourses);
    console.log('Sample courses inserted successfully');

    // Log course IDs for reference
    console.log('\nCourse IDs:');
    courses.forEach(course => {
      console.log(`${course.title}: ${course._id}`);
    });

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\nDatabase initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase(); 