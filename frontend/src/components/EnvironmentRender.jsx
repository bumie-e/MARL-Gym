import { useEffect, useRef, useState } from 'react';

export default function EnvironmentRenderer({ jobId, isTraining, env }) {
  const canvasRef = useRef(null);
  const wsRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [frameCount, setFrameCount] = useState(0);
  const [fps, setFps] = useState(0);
  const [lastFrameTime, setLastFrameTime] = useState(Date.now());
  const [debugInfo, setDebugInfo] = useState('');
  
  // Frame buffering
  const frameBufferRef = useRef(null);
  const fpsCounterRef = useRef({ count: 0, lastTime: Date.now() });
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const addDebugLog = (msg) => {
    console.log(`[ENV-RENDER] ${msg}`);
    setDebugInfo(prev => {
      const lines = prev.split('\n').slice(-9); // Keep last 10 lines
      return [...lines, `[${new Date().toLocaleTimeString()}] ${msg}`].join('\n');
    });
  };

  const connectWebSocket = () => {
    if (!jobId) {
      addDebugLog('❌ No jobId provided!');
      console.warn('[WS] No jobId provided to EnvironmentRenderer');
      return;
    }

    addDebugLog(`🔌 Attempting connection (${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);
    console.log(`[WS] Attempting to connect to HuggingFace Space (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);

    // Connect directly to HuggingFace Space backend
    const huggingfaceSpaceUrl = 'https://bumie-e-marl-gym.hf.space';
    
    addDebugLog(`📍 Space URL: ${huggingfaceSpaceUrl}`);
    console.log(`[WS] Space URL: ${huggingfaceSpaceUrl}`);
    console.log(`[WS] Job ID: ${jobId}`);

    const wsProtocol = huggingfaceSpaceUrl.startsWith('https') ? 'wss' : 'ws';
    const cleanUrl = huggingfaceSpaceUrl.replace(/^https?:\/\//, '');
    const wsUrl = `${wsProtocol}://${cleanUrl}/ws/render/${jobId}`;

    addDebugLog(`🌐 WebSocket URL: ${wsUrl}`);
    console.log(`[WS] Connecting to: ${wsUrl}`);

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        addDebugLog('✅ Connected to HuggingFace Space!');
        console.log('[WS] Connected to HuggingFace Space successfully');
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === 'frame' && message.data) {
            // addDebugLog(`📸 Frame received (${(message.data.length / 1024).toFixed(1)}KB)`);
            // console.log(`[WS] Frame received: ${(message.data.length / 1024).toFixed(1)}KB`);
            // Store frame in buffer - will be rendered on next animation frame
            frameBufferRef.current = message.data;
            setLastFrameTime(Date.now());
          } else if (message.type === 'pong') {
            console.debug('[WS] Received pong');
          } else {
            addDebugLog(`❓ Unknown message type: ${message.type}`);
          }
        } catch (error) {
          addDebugLog(`❌ Error parsing message: ${error.message}`);
          console.error('[WS] Error parsing message:', error);
        }
      };

      ws.onerror = (error) => {
        addDebugLog(`❌ WebSocket error: ${error.message || 'Unknown error'}`);
        console.error('[WS] WebSocket error:', error);
        setConnectionStatus('error');
      };

      ws.onclose = (event) => {
        addDebugLog(`🔌 Connection closed (Code: ${event.code})`);
        console.log('[WS] Connection closed');
        setConnectionStatus('disconnected');
        wsRef.current = null;

        // Attempt to reconnect if training is still active
        if (isTraining && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          const backoffTime = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
          addDebugLog(`⏳ Reconnecting in ${backoffTime}ms...`);
          console.log(`[WS] Reconnecting in ${backoffTime}ms...`);
          setTimeout(connectWebSocket, backoffTime);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      addDebugLog(`❌ Failed to create WebSocket: ${error.message}`);
      console.error('[WS] Failed to create WebSocket:', error);
      setConnectionStatus('error');
    }
  };

  // Animation frame loop for rendering
  const renderFrame = () => {
    if (frameBufferRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: false });

      if (!ctx) {
        addDebugLog('❌ Failed to get canvas context');
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        addDebugLog(`✏️ Drawing frame (${img.width}x${img.height})`);
        
        // Get canvas dimensions
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const imgWidth = img.width;
        const imgHeight = img.height;

        // Calculate scale to fit image in canvas while maintaining aspect ratio
        const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;

        // Center the image
        const x = (canvasWidth - scaledWidth) / 2;
        const y = (canvasHeight - scaledHeight) / 2;

        // Clear canvas with dark background
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Draw border to confirm canvas is working
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvasWidth, canvasHeight);

        // Draw image
        try {
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        } catch (e) {
          addDebugLog(`❌ Draw image error: ${e.message}`);
          console.error('Draw image error:', e);
        }

        // Update FPS counter
        fpsCounterRef.current.count++;
        const now = Date.now();
        if (now - fpsCounterRef.current.lastTime >= 1000) {
          setFps(fpsCounterRef.current.count);
          fpsCounterRef.current.count = 0;
          fpsCounterRef.current.lastTime = now;
        }

        setFrameCount((prev) => prev + 1);
      };

      img.onerror = (e) => {
        addDebugLog(`❌ Failed to load frame image: ${e}`);
        console.error('[RENDER] Failed to load frame image:', e);
        
        // Draw error state
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Frame Error', canvas.width / 2, canvas.height / 2);
      };

      // Set image source
      try {
        img.src = `data:image/jpeg;base64,${frameBufferRef.current}`;
      } catch (e) {
        addDebugLog(`❌ Error setting image src: ${e.message}`);
      }
    }

    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(renderFrame);
  };

  // Main effect hook
  useEffect(() => {
    addDebugLog(`🎬 Training: ${isTraining}, JobId: ${jobId || 'NOT PROVIDED'}`);
    
    // Reference to store the interval ID so we can clear it later
    let requestInterval = null;

    if (!isTraining || !jobId) {
      addDebugLog('⏹️ Stopping render loop');
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      return;
    }

    addDebugLog('▶️ Starting WebSocket connection and render loop');
    
    // Connect to WebSocket
    connectWebSocket();

    // 1. START ANIMATION LOOP (Handles drawing to canvas)
    animationFrameRef.current = requestAnimationFrame(renderFrame);

    // 2. START REQUEST LOOP (Handles asking backend for data)
    // Request a new frame every 50ms (approx 20 FPS) to balance load
    requestInterval = setInterval(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send("request_frame");
        }
    }, 50);

    // Cleanup
    return () => {
      addDebugLog('🧹 Cleaning up');
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (requestInterval) {
        clearInterval(requestInterval);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [jobId, isTraining]);

  const statusColor = {
    connected: 'from-green-400 to-emerald-500',
    error: 'from-red-400 to-pink-500',
    disconnected: 'from-gray-400 to-slate-500',
  }[connectionStatus];

  const statusIcon = {
    connected: '✅',
    error: '❌',
    disconnected: '⏳',
  }[connectionStatus];

  const statusMessage = {
    connected: 'Streaming live frames from HuggingFace Space',
    error: 'Connection error - check if HuggingFace Space is running',
    disconnected: 'Connecting to HuggingFace Space...',
  }[connectionStatus];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 overflow-hidden">
        {/* Header with status */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Live Environment Rendering</h3>
          <div className="flex items-center space-x-6">
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full bg-gradient-to-r ${statusColor} ${
                  connectionStatus === 'connected' ? 'animate-pulse' : ''
                }`}
              ></div>
              <span className="text-sm font-medium text-gray-700 capitalize">
                {connectionStatus}
              </span>
            </div>

            {/* FPS Counter */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-lg">
              <span className="text-xs font-bold text-gray-600">FPS:</span>
              <span className="text-sm font-bold text-gray-800">{fps}</span>
            </div>

            {/* Frame Counter */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-lg">
              <span className="text-xs font-bold text-gray-600">Frames:</span>
              <span className="text-sm font-bold text-gray-800">{frameCount}</span>
            </div>
          </div>
        </div>

        {/* Canvas container */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border-4 border-gray-300 shadow-inner relative">
          <canvas
            ref={canvasRef}
            width={1024}
            height={768}
            className="w-full h-auto bg-black block"
          />

          {/* Overlay status when not training */}
          {!isTraining && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="text-5xl mb-4">▶️</div>
                <p className="text-white text-lg font-semibold">
                  Start training to see live rendering
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Status message */}
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <p className={`text-center text-sm font-medium ${
            connectionStatus === 'connected'
              ? 'text-green-600'
              : connectionStatus === 'error'
              ? 'text-red-600'
              : 'text-gray-600'
          }`}>
            {statusIcon} {statusMessage}
          </p>
          
          {connectionStatus === 'error' && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              <p className="font-semibold mb-1">Troubleshooting:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Ensure HuggingFace Space is running</li>
                <li>Check browser console for detailed error messages</li>
                <li>Verify job ID: {jobId || 'NOT PROVIDED'}</li>
                <li>Check REACT_APP_HUGGINGFACE_SPACE_URL environment variable</li>
              </ul>
            </div>
          )}
        </div>

        {/* Debug logs */}
        <div className="mt-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
          <p className="text-xs font-bold text-gray-400 mb-2">Debug Logs:</p>
          <div className="bg-black rounded p-2 font-mono text-xs text-green-400 h-40 overflow-y-auto whitespace-pre-wrap break-words">
            {debugInfo || 'Waiting for logs...'}
          </div>
        </div>

        {/* Frame timing info */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-gray-600 font-semibold mb-1">Connection</p>
            <p className="text-gray-800">{connectionStatus}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-gray-600 font-semibold mb-1">Total Frames</p>
            <p className="text-gray-800">{frameCount.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-gray-600 font-semibold mb-1">Last Frame</p>
            <p className="text-gray-800">
              {Math.round(Date.now() - lastFrameTime)}ms ago
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}