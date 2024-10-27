import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export function Preloader() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        width: '100%',
        height: '100%',
        bgcolor: 'rgba(255, 255, 255, 0.8)',
      }}
    >
      <CircularProgress />
    </Box>
  );
}
