import React, { useRef, useEffect } from 'react';

const FireflyParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particlesArray: Particle[] = [];
    
    const setupCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      opacitySpeed: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.5; // Varying size for embers
        this.speedX = (Math.random() - 0.5) * 0.5; // Slow horizontal drift
        this.speedY = (Math.random() - 0.5) * 0.5 - 0.5; // Slow upward drift
        const colors = ['#E50914', '#FFA500', '#FF4500', '#FFD700']; // Deep Red, Orange, OrangeRed, Amber/Gold
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.2; // Start with some opacity
        this.opacitySpeed = (Math.random() - 0.5) * 0.01; // How fast it fades in/out
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Fade in/out logic to create a pulsing "glow"
        this.opacity += this.opacitySpeed;
        if (this.opacity <= 0.1 || this.opacity >= 0.8) {
            this.opacitySpeed *= -1; // Reverse fade direction
        }

        // Reset particle when it goes off screen to create a continuous loop
        if (this.y < -this.size) {
            this.y = canvas.height + this.size;
            this.x = Math.random() * canvas.width;
        }
        if (this.x < -this.size) {
            this.x = canvas.width + this.size;
        } else if (this.x > canvas.width + this.size) {
            this.x = -this.size;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    function init() {
      particlesArray = [];
      // Adjust particle density based on screen area for responsiveness
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    const handleResize = () => {
      setupCanvas();
      init();
    };

    setupCanvas();
    init();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0,
      pointerEvents: 'none'
  }} />;
};

export default FireflyParticles;
