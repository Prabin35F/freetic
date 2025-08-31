import React from 'react';

const testimonials = [
    {
        quote: "I built this platform to give people the right books, not the popular ones. This is for the 1% who want clarity, not noise.",
        author: "Prabesh (Founder)"
    },
    {
        quote: "This app is not just a reading platform. It's an awakening machine.",
        author: "Namraj"
    },
    {
        quote: "Freetic feels like Netflix for your brain. Addictive in a good way.",
        author: "Kamal"
    },
    {
        quote: "Every book on Freetic hits harder than motivational videos.",
        author: "Arun"
    },
    {
        quote: "Beautiful UI, real psychology, no fluff. This is how learning should feel.",
        author: "Sandeep"
    },
    {
        quote: "It's like having a mentor who only speaks truth. Thank you Freetic.",
        author: "Sudarsan"
    },
    {
        quote: "Freetic made me rethink everything I knew about success. Brilliant work.",
        author: "David, USA"
    },
    {
        quote: "Sleek, brutal, intelligent. This is how digital libraries should look.",
        author: "Elena, Germany"
    },
    {
        quote: "No ads, no login, just knowledge. Pure gold.",
        author: "Joshua, Canada"
    },
    {
        quote: "The interface feels alive, but the content hits even harder.",
        author: "Mei Lin, Singapore"
    }
];


export const TestimonialCarousel: React.FC = () => {
    
    const singleSetOfCards = testimonials.map((testimonial, index) => (
        <div className="testimonial-card-v2" key={`testimonial-${index}`}>
            <div className="testimonial-content-wrapper">
                <blockquote className="quote-text-v2">
                    “{testimonial.quote}”
                </blockquote>
            </div>
            <footer className="author-badge">
                — {testimonial.author}
            </footer>
        </div>
    ));

    return (
        <section
            className="testimonial-section-v2"
            aria-roledescription="testimonial carousel"
            aria-live="off" // Marquee is decorative, turning off live announcements
        >
            <div className="testimonial-marquee-content">
                {[...singleSetOfCards, ...singleSetOfCards].map((card, index) => 
                    React.cloneElement(card, { key: `card-clone-${index}` })
                )}
            </div>
        </section>
    );
};