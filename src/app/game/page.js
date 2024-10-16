'use client';
import { useEffect, useRef } from 'react';

export default function GamePage() {
    const canvasRef = useRef(null);
    const player = {
        x: 50,
        y: 50,
        size: 20,
        speed: 2,
        color: 'red'
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        function draw() {
            // Clear the canvas
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Draw player
            context.fillStyle = player.color;
            context.fillRect(player.x, player.y, player.size, player.size);
        }

        function update() {
            draw();
            requestAnimationFrame(update);
        }

        update();

        // Handle key presses for movement
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    player.y -= player.speed;
                    break;
                case 'ArrowDown':
                    player.y += player.speed;
                    break;
                case 'ArrowLeft':
                    player.x -= player.speed;
                    break;
                case 'ArrowRight':
                    player.x += player.speed;
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="border border-black"
                style={{ imageRendering: 'pixelated' }}
            />
        </div>
    );
}
