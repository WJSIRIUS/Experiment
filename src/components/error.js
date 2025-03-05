import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function ErrorPage(props){
    return (
        <Box>
            <Typography variant="h5">错误</Typography>
            <Typography variant="subtitle1">{props.reason}</Typography>
        </Box>
    )
}
