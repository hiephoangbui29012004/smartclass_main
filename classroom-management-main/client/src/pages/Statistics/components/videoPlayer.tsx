import React, { useEffect, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Paper, IconButton } from '@material-ui/core';
import { PlayArrow, Pause, SkipNext, SkipPrevious } from '@material-ui/icons';

interface Props {
  frames: string[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing(2),
    },
    videoContainer: {
      position: 'relative',
      width: '70%',
      maxWidth: '1280px',
      marginBottom: theme.spacing(2),
    },
    frame: {
      width: '70%',
      height: 'auto',
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(2),
    },
    progress: {
      marginTop: theme.spacing(1),
      width: '100%',
      maxWidth: '1280px',
    },
  })
);

const VideoPlayer: React.FC<Props> = ({ frames }) => {
  const classes = useStyles();
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fps] = useState(20); // Frames per second

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && frames.length > 0) {
      interval = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % frames.length);
      }, 1000 / fps);
    }
    return () => clearInterval(interval);
  }, [isPlaying, frames, fps]);

  useEffect(() => {
    console.log("Frame đang hiển thị:", frames[currentFrame]);
  }, [currentFrame, frames]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentFrame((prev) => (prev + 1) % frames.length);
  };

  const handlePrevious = () => {
    setCurrentFrame((prev) => (prev - 1 + frames.length) % frames.length);
  };
    const BACKEND_URL = "http://localhost:8012";

  return (
    <div className={classes.root}>
      <Paper className={classes.videoContainer}>
        {frames.length > 0 && (
          <img
            src={BACKEND_URL + frames[currentFrame]}
            alt={`Frame ${currentFrame + 1}`}
            className={classes.frame}
            style={{
              maxWidth: 1280,
              maxHeight: 720,
              width: "100%",
              height: "auto",
              objectFit: "contain",
              background: "#000"
            }}
          />
        )}
      </Paper>
      <div className={classes.controls}>
        <IconButton onClick={handlePrevious}>
          <SkipPrevious />
        </IconButton>
        <IconButton onClick={handlePlayPause}>
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>
        <IconButton onClick={handleNext}>
          <SkipNext />
        </IconButton>
      </div>
      <div className={classes.progress}>
        {currentFrame + 1} / {frames.length}
      </div>
    </div>
  );
};

export default VideoPlayer;