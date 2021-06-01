import React, { MouseEvent, useEffect, useState } from 'react';
import { useElapsedTime } from 'use-elapsed-time';

interface RecorderProps {
  onAudioSend({ chunks }: any): void;
}

function Recorder({ onAudioSend }: RecorderProps) {
  const [recording, setRecording] = useState(false);
  const [discard, setDiscard] = useState(false);

  const { elapsedTime, reset } = useElapsedTime(recording);

  const [minutes, setMinutes] = useState<number>(0);

  useEffect(() => {
    if (+elapsedTime.toFixed(0) && +elapsedTime.toFixed(0) % 60 === 0) {
      setMinutes(+(elapsedTime / 60).toFixed(0));
      reset(0);
    }
  }, [elapsedTime, reset]);

  // const canvasRef = useRef<HTMLCanvasElement>(null);

  // const [canvasCtxState, setCanvasCtx] = useState<CanvasRenderingContext2D | null>(null);

  const [mediaRecorderState, setMediaRecorderState] = useState<{ recorder: MediaRecorder, chunks: any } | null>(null);

  useEffect(() => {
    // const canvasNode = canvasRef.current;
    let animationFrameID: number;

    if (!!navigator.mediaDevices?.getUserMedia && recording) {
      navigator.mediaDevices?.getUserMedia(
          {
            audio: true
          }
      )
          .then(stream => {
            // const canvasCtx = canvasCtxState || (() => {
            //   const ctx = canvasNode!.getContext('2d')!;
            //
            //   setCanvasCtx(ctx);
            //
            //   return ctx;
            // })();

            // canvasCtx.clearRect(0, 0, canvasNode.width, canvasNode.height);

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

            // const draw = () => {
            //   animationFrameID = requestAnimationFrame(draw);
            //
            //   analyser.getByteTimeDomainData(dataArray);
            //
            //   canvasCtx.fillStyle = 'white';
            //   canvasCtx.fillRect(0, 0, 100, 100);
            //
            //   canvasCtx.lineWidth = 2;
            //   canvasCtx.strokeStyle = '#457B9D';
            //   canvasCtx.beginPath();
            //
            //   /*
            //     Determine the width of each line by dividing canvas width / bufferLength
            //    */
            //   const sliceWidth = canvasNode.width / bufferLength;
            //   let x = 0;
            //
            //   for (let i = 0; i < bufferLength; i++) {
            //     const v = dataArray[i] / 128.0;
            //     const y = v * canvasNode.height / 2;
            //
            //     i === 0 ? canvasCtx.moveTo(x, y) : canvasCtx.lineTo(x, y);
            //
            //     // move x coordinate to the next position
            //     x += sliceWidth;
            //   }
            //
            //   canvasCtx.lineTo(canvasNode.width, canvasNode.height / 2);
            //   canvasCtx.stroke();
            // }

            // draw();

            mediaRecorder.ondataavailable = (e: any) => {
              if (e.data.size > 0) {
                setMediaRecorderState(prev => ({
                  recorder: prev!.recorder,
                  chunks: [...prev!.chunks, e.data]
                }))
              }
            }
          })
          .catch(err => console.error(err));
    }

    return () => {
      cancelAnimationFrame(animationFrameID || 0);
    }
  }, [recording]);

  useEffect(() => {
    if (mediaRecorderState?.recorder) {
      if (recording) {
        mediaRecorderState.recorder.start();
      } else {
        if (mediaRecorderState.recorder.state === 'recording') {
          mediaRecorderState.recorder.stop();
        }
      }
    }

    return () => {
    };
  }, [recording, mediaRecorderState?.recorder]);

  const handleStop = (e: MouseEvent<HTMLButtonElement>) => {
    setDiscard(true);
    setRecording(false);
  };

  const handleSend = (e: any) => {
    onAudioSend({ chunks: mediaRecorderState?.chunks });

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
      <>
        <div className={`flex items-center space-x-2 ${discard ? 'block' : 'hidden'}`}>
          {/*<div className='flex w-10 hidden lg:flex'>*/}
          {/*  {new Array(1).fill(0).map((_, i) => <img key={i} src="/waveform.png" alt="Waveform"/>)}*/}
          {/*</div>*/}
          <img className='w-8 flex cursor-pointer' onClick={handleDiscard} src="/icons/binIcon.svg" alt="Bin"/>
          <img className='w-8 flex cursor-pointer' onClick={handleSend} src="/icons/playIcon.svg" alt="Play"/>
          <p className='mr-3 xl:mr-0 font-light text-secondary'>
            {`${minutes ? `${minutes}` : '00'}:${elapsedTime.toFixed(0)}`}
          </p>
        </div>
        <div className={`flex flex-col lg:flex-row ${recording ? 'w-full' : ''} ${discard ? 'hidden' : 'block'}`}>
          <div
              className={`flex w-full h-8 items-center justify-center lg:justify-end rounded-full bg-primary ${!recording && 'hidden'}`}>
            <svg className='animate-pulse flex justify-center mr-3' height="12" width="12">
              <circle cx="6" cy="6" r="6" fill="red"/>
            </svg>
            <p className='w-10 font-light text-secondary'>
              {`${minutes ? `${minutes}` : '00'}:${elapsedTime.toFixed(0)}`}
            </p>
            <button className='w-8 ml-3' onClick={handleStop}>
              <img className='h-8' src="/icons/stopIcon.svg" alt="Stop"/>
            </button>
            <button className='w-12 ml-3' onClick={handleSend}>
              <img className='h-8 transform -rotate-90' src="/icons/planeIcon.svg" alt="Stop"/>
            </button>
          </div>
          <div className={`flex ${recording ? 'hidden' : ''}`}>
            <button className='w-8 outline-none' onClick={handleRecord}>
              <img className='rounded-full' src="/icons/recordIcon.svg" alt="Stop"/>
            </button>
          </div>
        </div>
      </>
  );
}

export default Recorder;
