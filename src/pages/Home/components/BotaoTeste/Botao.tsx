import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { TaskContext } from '../..';

export default function BotaoTeste({taskStatus = false}) {
  const {handleStatusTask} = React.useContext(TaskContext)
  return (
    <Box sx={{ width: '310px',  position: 'fixed', top: '20px', right: '20px', textAlign: 'center'}}>
      <Collapse in={taskStatus}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                handleStatusTask(false);
              }}
            >
            <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 24 }}
          variant="filled"
          severity="success"
        >
          Tarefa Concluída com sucesso!
        </Alert>
      </Collapse>
    </Box>
  );
}
