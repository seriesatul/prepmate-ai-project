import React from 'react'
import Feature from './Feature'

const FeatureSection = () => {
    var products =[
        {
            title:"Instant AI-Powered Curriculum Design",
            image:"/images/image1.png",
            description:"Stop staring at a blank page. Simply provide a topic, category, and difficulty, and our advanced AI will instantly generate a comprehensive, well-structured course outline. From beginner fundamentals to advanced professional topics, create a complete learning roadmap in seconds, not hours.",
            live:true,
            case:false,
        },
          {
            title:" On-Demand Chapter Content Generation",
            image:"/images/image2.png",
            description:"Transform your chapter titles into rich, detailed lesson content. For any chapter in your outline, our AI will write comprehensive material, including key concepts, practical examples, and clear explanations. Build out your entire course without writing a single line of text yourself.",
            live:true,
            case:false,
        },
         {
            title:" Automated Video Discovery",
            image:"/images/image3.png",
            description:"Enhance your text-based content with relevant video material. For each chapter, our system intelligently searches and embeds a high-quality, relevant tutorial from YouTube. This enriches the learning experience by providing both text and visual explanations, all without manual searching.",
            live:true,
            case:false,
        },
         {
            title:"Interactive, Gamified Learning Path",
            image:"/images/image4.png",
            description:"Ensure true understanding and engagement. Our AI can automatically generate quizzes for each chapter based on the content it created. By enabling progress locking, you can require users to pass a quiz before unlocking the next chapter, creating a gamified and effective learning experience.",
            live:true,
            case:false,
        },
         {
            title:"AI-Generated Mock Exams",
            image:"/images/image5.png",
            description:"Put your knowledge to the ultimate test. After you've completed a course, PrepMate AI can generate a comprehensive, timed 'Mock Exam' that pulls challenging questions from all chapters. This simulates a final exam environment, allowing you to assess your readiness and build confidence before a real-world test or interview..",
            live:true,
            case:false,
        },
    ]
  return (
    <div>
        {products.map((val,index)=><Feature key={index} val ={val}/>) }
    </div>
  )
}

export default FeatureSection