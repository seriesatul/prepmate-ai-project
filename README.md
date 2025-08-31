<div align="center">
  <img src="https://raw.githubusercontent.com/user/repo/main/public/logo.png" alt="EduGenius AI Logo" width="150" height="150">
  <!-- Replace the src with a link to your actual logo file -->

  <h1 align="center">PrepMate AI: AI Course Generator</h1>

  <p align="center">
    An intelligent web application that uses AI to generate comprehensive learning course structures on any user-provided topic.
    <br />
    <a href="https://prepmate-ai-project-6hun.vercel.app/"><strong>View Demo »</strong></a>
    <br />
    <br />
    <a href="https://github.com/your-username/EduGenius-AI/issues">Report Bug</a>
    ·
    <a href="https://github.com/your-username/EduGenius-AI/issues">Request Feature</a>
  </p>
</div>

<!-- SHIELDS/BADGES -->
<div align="center">
  <a href="https://github.com/your-username/EduGenius-AI/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/your-username/EduGenius-AI?style=for-the-badge" alt="License">
  </a>
  <a href="https://www.linkedin.com/in/your-linkedin-profile/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
  </a>
  <a href="https://github.com/your-username/EduGenius-AI/issues">
    <img src="https://img.shields.io/github/issues/your-username/EduGenius-AI?style=for-the-badge" alt="Issues">
  </a>
  <a href="https://github.com/your-username/EduGenius-AI/stargazers">
    <img src="https://img.shields.io/github/stars/your-username/EduGenius-AI?style=for-the-badge" alt="Stars">
  </a>
</div>

<br>

<!-- TABLE OF CONTENTS -->
## 📋 Table of Contents
* [About The Project](#-about-the-project)
* [✨ Features](#-features)
* [📸 Screenshots](#-screenshots)
* [🛠️ Built With](#️-built-with)
* [🚀 Getting Started](#-getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [📖 Usage](#-usage)
* [🗺️ Roadmap](#️-roadmap)
* [🤝 Contributing](#-contributing)
* [📄 License](#-license)
* [🙏 Acknowledgements](#-acknowledgements)

---

## 🧐 About The Project

**EduGenius AI** is an innovative tool designed to streamline the creation of educational content. By leveraging the power of Large Language Models (LLMs), this application takes a simple topic from a user and generates a complete, structured course outline.

The output includes a course name, detailed description, category, level, number of chapters, and a breakdown of each chapter with its duration and specific topics. It even generates a creative prompt for a 3D course banner image. The final output is provided in a clean JSON format, making it easy to integrate with other platforms or content management systems.

This project was built to help educators, content creators, and learners rapidly prototype and visualize educational paths on virtually any subject.

<br>

## ✨ Features

*   **🤖 AI-Powered Content:** Utilizes a powerful AI backend to generate relevant and coherent course structures.
*   **📝 Customizable Inputs:** Users can specify the course name, description, number of chapters, level, and category.
*   **🖼️ Banner Prompt Generation:** Automatically creates a detailed DALL-E or Midjourney prompt for a visually appealing course banner.
*   **📋 Structured JSON Output:** Delivers the entire course plan in a well-formatted JSON object, ready for API use.
*   **🎨 Modern UI:** A clean, intuitive, and responsive user interface built with React and Tailwind CSS.
*   **🚀 Fast and Efficient:** Generates a full course outline in seconds.

<br>

## 📸 Screenshots

Here is a look at the main user interface of EduGenius AI.

![Project Screenshot](https://raw.githubusercontent.com/user/repo/main/public/screenshot.png)
*The main dashboard where users can input their course details and view the generated JSON output.*

<br>

## 🛠️ Built With

This project was built using a modern, full-stack JavaScript architecture.

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

*   **Frontend:** React.js, Vite
*   **Backend:** Node.js, Express.js
*   **AI Integration:** OpenAI API
*   **Styling:** Tailwind CSS
*   **Deployment:** Vercel (Frontend), Heroku (Backend)

<br>

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm installed on your system.
*   **Node.js** (v18 or later recommended)
*   **npm** or **yarn**

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/your-username/EduGenius-AI.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd EduGenius-AI
    ```
3.  **Install Backend Dependencies:**
    ```sh
    cd server
    npm install
    ```
4.  **Install Frontend Dependencies:**
    ```sh
    cd ../client
    npm install
    ```
5.  Set up your environment variables. Create a `.env` file in the `server` directory and add your OpenAI API key:
    ```env
    OPENAI_API_KEY = 'YOUR_API_KEY'
    PORT = 8080
    ```

<br>

## 📖 Usage

After installation, you can run the project by starting both the backend and frontend servers.

1.  **Start the Backend Server** (from the `server` directory):
    ```sh
    npm run start
    ```
    The server will be running on `http://localhost:8080`.

2.  **Start the Frontend Development Server** (from the `client` directory):
    ```sh
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) (or the port specified by Vite) to view the application in your browser.

Now you can fill out the form and generate your first AI-powered course!

<br>

## 🗺️ Roadmap

See the [open issues](https://github.com/your-username/EduGenius-AI/issues) for a list of proposed features and known issues.

- [x] Core AI prompt engineering for course generation.
- [x] Frontend UI with input forms and JSON display.
- [ ] **User Accounts:** Allow users to save and manage their generated courses.
- [ ] **Export Options:** Add functionality to export courses as PDF or Markdown files.
- [ ] **Quiz Generation:** Implement a feature to automatically generate a quiz for each chapter.
- [ ] **Multi-language Support**
    - [ ] Spanish
    - [ ] French

<br>

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

<br>

## 📄 License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<br>

## 🙏 Acknowledgements

*   [Awesome Readme Templates](https://awesome-readme.vercel.app/)
*   [Shields.io](https://shields.io/)
*   [Vite Documentation](https://vitejs.dev/)
*   [Tailwind CSS](https://tailwindcss.com/)

---

<p align="center">
  Developed by <a href="https://github.com/seriesatul">[Atul Singh Chauhan]</a> with ❤️
</p>
