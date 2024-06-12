"use client";
import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackwardStep, faRotateLeft, faInfoCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export default function DrawingModule() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [markerSize, setMarkerSize] = useState(10);
    const [markerColor, setMarkerColor] = useState("#000000");
    const [undoStack, setUndoStack] = useState<ImageData[]>([]);
    const [showInfo, setShowInfo] = useState(false);

    const startDrawing = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx) {
            const rect = canvas.getBoundingClientRect();
            if (undoStack.length === 0) {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                setUndoStack([imageData]);
            }
            ctx.beginPath();
            ctx.arc(e.clientX - rect.left, e.clientY - rect.top, markerSize / 2, 0, Math.PI * 2);
            ctx.fillStyle = markerColor;
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
            setIsDrawing(true);
        }
    };

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx) {
            const rect = canvas.getBoundingClientRect();
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.strokeStyle = markerColor;
            ctx.lineWidth = markerSize;
            ctx.lineCap = "round";
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        }
    };

    const stopDrawing = () => {
        if (isDrawing) {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (ctx) {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                setUndoStack((prevUndoStack) => [...prevUndoStack, imageData]);
            }
        }
        setIsDrawing(false);
    };

    const handleCopy = () => {
        const canvas = canvasRef.current;
        canvas?.toBlob((blob) => {
            const item = new ClipboardItem({ "image/png": blob });
            navigator.clipboard.write([item]);
            alert("Drawing copied to clipboard!");
        });
    };

    const handleShare = () => {
        const canvas = canvasRef.current;
        canvas?.toBlob((blob) => {
            const file = new File([blob], "drawing.png", { type: "image/png" });
            const shareData = {
                files: [file],
                title: "My Drawing",
                text: "Check out my drawing!",
            };
            navigator.share(shareData).catch(console.error);
        });
    };

    const handleReset = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            setUndoStack([imageData]);
        }
    };

    const handleUndo = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx && undoStack.length > 1) {
            const previousState = undoStack[undoStack.length - 2];
            ctx.putImageData(previousState, 0, 0);
            setUndoStack((prevUndoStack) => prevUndoStack.slice(0, -1));
        }
    };

    const handleBrushSizeChange = (size: number) => {
        setMarkerSize(size);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${markerSize}" height="${markerSize}" viewBox="0 0 ${markerSize} ${markerSize}"><circle cx="${markerSize / 2}" cy="${markerSize / 2}" r="${markerSize / 2}" fill="${encodeURIComponent(markerColor)}" /></svg>') ${markerSize / 2} ${markerSize / 2}, auto`;
        }
    }, [markerSize, markerColor]);

    return (
        <div className="drawing-module">
            <div className="machine-top-container">
                <div className="machine-header-box">
                    <h1>DRAW</h1>
                </div>
                <div className="machine-info-icon-box">
                    <div className="machine-info-icon" onClick={() => setShowInfo(true)}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                    </div>
                </div>
            </div>
            <h2>Be Creative. Be Bold!</h2>
            <h4>GM. Doodle to start the day.</h4>
            <div className="controls">
                <div className="brush-size-picker-container">
                    <div className="brush-size-picker">
                        {[10, 20].map((size) => (
                            <button
                                key={size}
                                onClick={() => handleBrushSizeChange(size)}
                                className={`brush-button ${markerSize === size ? "selected-generate" : ""}`}
                            >
                                <div
                                    className={`brush-size-icon brush-size-${size}`}
                                    style={{
                                        backgroundColor: markerColor,
                                    }}
                                ></div>
                            </button>
                        ))}
                    </div>
                </div>
                <button onClick={handleUndo} className="draw-action-button">
                    <FontAwesomeIcon icon={faBackwardStep} />
                </button>
                <button onClick={handleReset} className="draw-action-button">
                    <FontAwesomeIcon icon={faRotateLeft} />
                </button>
                <div className="color-picker-container">
                    <input
                        type="color"
                        value={markerColor}
                        onChange={(e) => setMarkerColor(e.target.value)}
                    />
                </div>
            </div>

            <canvas
                ref={canvasRef}
                width={375}
                height={375}
                className="drawing-canvas"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
            ></canvas>

            <div className="button-container">
                <button onClick={handleCopy} className="action-button">
                    Copy
                </button>
                <button onClick={handleCopy} className="action-button">
                    Mint
                </button>
                <button onClick={handleShare} className="action-button">
                    Share
                </button>
            </div>
            {showInfo && (
                <div className="machine-info-screen show">
                    <div className="machine-info-content">
                        <FontAwesomeIcon icon={faCircleXmark} className="machine-info-close" onClick={() => setShowInfo(false)} />
                        <h2>Information</h2>
                        <p>This is the information screen for the Drawing module.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
