"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

// A separate component for the form itself to keep the page clean
const QuizForm = ({ quizQuestions, courseId, chapterIndex }) => {
    const router = useRouter();
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null); // To show the result after submission

    const handleAnswerChange = (questionIndex, value) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setResult(null); // Clear previous results
        try {
            const response = await axios.post('/api/submit-quiz', {
                courseId,
                chapterIndex,
                answers,
            });

            setResult(response.data); // Store the result from the API

            if (response.data.passed) {
                // If passed, wait a couple of seconds then redirect
                setTimeout(() => {
                    const nextChapterIndex = chapterIndex + 1;
                    router.push(`/workspace/content/${courseId}?chapter=${nextChapterIndex}`);
                }, 2000);
            }
        } catch (error) {
            console.error("Failed to submit quiz:", error);
            alert("There was an error submitting your quiz.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-6">Chapter Quiz</h2>
            <div className="space-y-8">
                {quizQuestions.map((q, index) => (
                    <div key={index}>
                        <p className="font-semibold mb-2">{index + 1}. {q.question}</p>
                        {q.type === 'multiple-choice' ? (
                            <div className="space-y-2">
                                {q.options.map((option, i) => (
                                    <label key={i} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                        <input type="radio" name={`question-${index}`} value={option} onChange={(e) => handleAnswerChange(index, e.target.value)} required className="mr-3" />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <textarea
                                rows="3"
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-500"
                            />
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-8">
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex justify-center items-center px-6 py-3 font-semibold text-white bg-zinc-700 rounded-md hover:bg-zinc-400 disabled:bg-zinc-300"
                >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Answers'}
                </button>
            </div>
            {result && (
                <div className={`mt-6 p-4 rounded-md text-center font-semibold ${result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {result.passed ? 
                        `Congratulations! You passed with a score of ${result.score}%. Redirecting...` :
                        `You scored ${result.score}%. A score of 80% is required to pass. Please review the material and try again.`
                    }
                </div>
            )}
        </form>
    );
};


const QuizPage = () => {
  const { courseId, chapterIndex } = useParams();
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [courseName, setCourseName] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');


  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`/api/courses?courseId=${courseId}`);
        let courseData = response.data;
        if (courseData && typeof courseData.courseJson === 'string') {
          courseData.courseJson = JSON.parse(courseData.courseJson);
        }
        
        const chapter = courseData.courseJson.courseList[parseInt(chapterIndex, 10)];
        if (chapter && chapter.quiz) {
          setQuizData(chapter.quiz);
          setCourseName(courseData.courseName);
          setChapterTitle(chapter.title);
        }
      } catch (error) {
        console.error("Failed to fetch quiz data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId && chapterIndex) {
      fetchQuizData();
    }
  }, [courseId, chapterIndex]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-12 h-12 animate-spin text-zinc-900" /></div>;
  }

  if (!quizData) {
    return <div className="text-center mt-20">Quiz not found or not yet generated for this chapter.</div>;
  }
  
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4 sm:p-8">
        <div className="w-full max-w-2xl text-center mb-8">
            <p className="text-zinc-900 font-semibold">{courseName}</p>
            <h1 className="text-3xl font-bold">Quiz for: {chapterTitle}</h1>
        </div>
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
            <QuizForm 
                quizQuestions={quizData}
                courseId={courseId}
                chapterIndex={parseInt(chapterIndex, 10)}
            />
        </div>
    </div>
  );
};

export default QuizPage;