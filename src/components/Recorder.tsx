import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { useElapsedTime } from 'use-elapsed-time'

function Recorder() {
  const [recording, setRecording] = useState(false);
  const [discard, setDiscard] = useState(false);

  const { elapsedTime, reset } = useElapsedTime(recording);

  const [minutes, setMinutes] = useState<number>(0);

  useEffect(() => {
    if (+elapsedTime.toFixed(0) && +elapsedTime.toFixed(0) % 60 === 0) {
      setMinutes(+(elapsedTime / 60).toFixed(0));
      reset(0);
    }
  }, [elapsedTime]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [canvasCtxState, setCanvasCtx] = useState<CanvasRenderingContext2D | null>(null);

  const [mediaRecorderState, setMediaRecorderState] = useState<{ recorder: MediaRecorder, chunks: any } | null>(null);

  useEffect(() => {
    const canvasNode = canvasRef.current;

    let animationFrameID: number;

    if (!!navigator.mediaDevices?.getUserMedia && recording && canvasNode) {
      navigator.mediaDevices?.getUserMedia(
          {
            audio: true
          }
      )
          .then(stream => {
            const canvasCtx = canvasCtxState || (() => {
              const ctx = canvasNode!.getContext('2d')!;

              setCanvasCtx(ctx);

              return ctx;
            })();

            canvasCtx.clearRect(0, 0, canvasNode.width, canvasNode.height);

            const mediaRecorder = new MediaRecorder(stream);
            setMediaRecorderState({ recorder: mediaRecorder, chunks: [] });

            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = audioCtx.createAnalyser();

            const source = audioCtx.createMediaStreamSource(stream);

            source.connect(analyser);

            analyser.fftSize = 2048;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            analyser.getByteTimeDomainData(dataArray);

            const draw = () => {
              animationFrameID = requestAnimationFrame(draw);

              analyser.getByteTimeDomainData(dataArray);

              canvasCtx.fillStyle = 'white';
              canvasCtx.fillRect(0, 0, 100, 100);

              canvasCtx.lineWidth = 2;
              canvasCtx.strokeStyle = '#457B9D';
              canvasCtx.beginPath();

              /*
                Determine the width of each line by dividing canvas width / bufferLength
               */
              const sliceWidth = canvasNode.width / bufferLength;
              let x = 0;

              for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * canvasNode.height / 2;

                i === 0 ? canvasCtx.moveTo(x, y) : canvasCtx.lineTo(x, y);

                // move x coordinate to the next position
                x += sliceWidth;
              }

              canvasCtx.lineTo(canvasNode.width, canvasNode.height / 2);
              canvasCtx.stroke();
            }

            draw();

            mediaRecorder.ondataavailable = (e: any) => {
              setMediaRecorderState(prev => ({
                ...prev!,
                chunks: [...prev!.chunks, e.data]
              }))
            }
          })
          .catch(err => console.error(err));
    }

    return () => {
      cancelAnimationFrame(animationFrameID || 0);
    }
  }, [recording, canvasRef]);

  useEffect(() => {
    if (mediaRecorderState?.recorder && mediaRecorderState.recorder.state !== 'recording') {
      if (recording) {
        mediaRecorderState.recorder.start();
      } else {
        mediaRecorderState.recorder.stop();
      }
    }

    return () => {
    };
  }, [recording, mediaRecorderState?.recorder]);

  const handleStop = (e: MouseEvent<HTMLButtonElement>) => {
    setDiscard(true);
    setRecording(false);
  };

  const handleRecord = (e: MouseEvent<HTMLButtonElement>) => {
    setRecording(true);
  };

  const handleDiscard = (e: MouseEvent<HTMLImageElement>) => {
    setDiscard(false);
    setRecording(false);

    reset(0);
  };

  const handlePlayback = (e: MouseEvent<HTMLImageElement>) => {

  };

  return (
      <div className='w-3/4 ml-2 rounded-full h-9'>
        <div className={`w-7 flex items-center ${discard ? 'block' : 'hidden'}`}>
          <img className='w-7 flex cursor-pointer' onClick={handleDiscard} src="/icons/binIcon.svg" alt="Bin"/>
          <img className='w-7 flex cursor-pointer' onClick={handlePlayback} src="/icons/playIcon.svg" alt="Play"/>
          <p className='mr-3 ml-2 font-light text-secondary'>
            {`${minutes ? `${minutes}` : '00'}:${elapsedTime.toFixed(0)}`}
          </p>
          {new Array(12).fill(0).map((_, i) => <img key={i} src="/waveform.png" alt="Waveform" className='hidden md:block'/>)}
        </div>
        <div className={`flex flex-col lg:flex-row  ${discard ? 'hidden' : 'block'}`}>
          <div className={`flex w-full h-8 items-center rounded-full bg-primary ${!recording && 'hidden'}`}>
            <button className='w-12 m-1' onClick={handleStop}>
              <img className='h-8' src="/icons/stopIcon.svg" alt="Stop"/>
            </button>
            <p className='w-10 font-light text-secondary mr-4'>
              {`${minutes ? `${minutes}` : '00'}:${elapsedTime.toFixed(0)}`}
            </p>
            <canvas className='h-8 w-full rounded-full' width={100} height={100} ref={canvasRef}>
            </canvas>
          </div>
          <div className={`flex ${recording && 'hidden'}`}>
            <button className='w-7 outline-none mr-2' onClick={handleRecord}>
              <img className='rounded-full' src="/icons/recordIcon.svg" alt="Stop"/>
            </button>
          </div>
        </div>
      </div>
  );
}

export default Recorder;
