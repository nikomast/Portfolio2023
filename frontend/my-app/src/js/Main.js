import React, { useState, useRef, useEffect } from 'react';
import spaceshipImage from '../css/photos/abstrakti.jpg';

const Main = () => {
    const [slideIndex, setSlideIndex] = useState(1);
    const slides = useRef([]);

    useEffect(() => {
        showSlides(slideIndex);
    }, [slideIndex]);

    const plusSlides = (n) => {
        setSlideIndex(prevSlideIndex => prevSlideIndex + n);
    };

    const currentSlide = (n) => {
        setSlideIndex(n);
    };

    const showSlides = (n) => {
        if (!slides.current.length) return;
        
        let i;
        if (n > slides.current.length) { setSlideIndex(1); return; }
        if (n < 1) { setSlideIndex(slides.current.length); return; }
    
        for (i = 0; i < slides.current.length; i++) {
            slides.current[i].style.display = "none";
        }

        slides.current[slideIndex - 1].style.display = "block";
    };
    

    return (
        <div className="container">
            <div className="photo">
                <img src={spaceshipImage} alt="spaceship" /> 
            </div>           
            <div className="slideshow-container">
            <div ref={el => slides.current[0] = el} className="mySlides fade">
                <div className="textContent">
           This site is a programming project. The creator of this project got bitten by a programming bug over a decade ago when he jailbroke his iPhone 3g.  
            Since then, he has been on a relentless pursuit to devise algorithmic solutions to challenges. Today, he's an ardent developer, striving to harness cutting-edge technology to address real-world issues.
            He pursued his studies in Software Development at Satakunta University of Applied Sciences and has embarked on a diverse range of projects. Here are some highlights from his journey:
                </div>
            </div>

            {/* Slide 2 */}
            <div ref={el => slides.current[1] = el} className="mySlides fade">
                <div className='textContent'>Pong Game with a React Frontend and Asap Core Web API Backend. This project amalgamates both frontend and backend development, demonstrating his versatile expertise in crafting web applications (This site has an example called "Game"). 
                    A dynamic web application designed to calculate and visualize loan payments. This project is a testament to his comprehensive skill set, encompassing frontend development with React, backend integration with Flask, containerization using Docker, and cloud deployment through Azure. 
                    By providing a seamless user experience and a responsive interface, it exemplifies he's commitment to creating robust, scalable, and user-centric solutions. 
                    With a focus on modular design, it integrates state-of-the-art technologies, ensuring scalability and maintainability. Thats not all.</div>
            </div>

            {/* Slide 3 */}
            <div ref={el => slides.current[2] = el} className="mySlides fade">
            <div className='textContent'>Static Website Deployment in Google Cloud. This project was launched 2020. It was a cloud-based solution that underscores proficiency in web hosting and cloud technologies.
            Thesis Project - The Traveling Salesman Problem. This endeavor showcased analytical mindset and ability to grapple with intricate algorithmic challenges. All the algorithms were written with C++. </div>
            </div>
            <a className="prev" onClick={() => plusSlides(-1)}>&#10094;</a>
            <a className="next" onClick={() => plusSlides(1)}>&#10095;</a>
            </div>
            </div>
    );
}

export default Main;


