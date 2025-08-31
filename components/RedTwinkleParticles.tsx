import React, { useRef, useEffect } from 'react';

const RedTwinkleParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particlesArray: Particle[] = [];
    
    // Set canvas size to its container's size
    const setupCanvas = () => {
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.offsetWidth;
            canvas.height = parent.offsetHeight;
        }
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
        this.size = Math.random() * 1.5 + 0.2; // very small
        this.speedX = (Math.random() - 0.5) * 0.2; // slow drift
        this.speedY = (Math.random() - 0.5) * 0.2; // slow drift
        this.color = 'rgba(229, 9, 20, 1)'; // netflix red
        this.opacity = Math.random() * 0.3 + 0.1; // Start with low opacity
        this.opacitySpeed = (Math.random() * 0.01) + 0.005; // How fast it fades in/out
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Twinkle logic
        this.opacity += this.opacitySpeed;
        if (this.opacity <= 0.1 || this.opacity >= 0.7) {
            this.opacitySpeed *= -1; // Reverse fade direction
        }

        // Reset particle when it goes off screen
        if (this.y < -this.size || this.y > canvas.height + this.size || this.x < -this.size || this.x > canvas.width + this.size) {
            this.y = Math.random() * canvas.height;
            this.x = Math.random() * canvas.width;
            this.opacity = 0.1; // Reset opacity
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.shadowBlur = 4;
        ctx.shadowColor = this.color;
        
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    function init() {
      if (!canvas) return;
      particlesArray = [];
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 20000);
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    const resizeObserver = new ResizeObserver(() => {
        setupCanvas();
        init();
    });

    if(canvas.parentElement){
        resizeObserver.observe(canvas.parentElement);
    }
    
    setupCanvas();
    init();
    animate();

    return () => {
      if(canvas.parentElement) resizeObserver.unobserve(canvas.parentElement);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 0,
      pointerEvents: 'none'
  }} />;
};

export default RedTwinkleParticles;