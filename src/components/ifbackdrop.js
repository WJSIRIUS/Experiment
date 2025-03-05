import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';

export default function IfBackDrop(props) {
    const open = props.open
    return (<Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={open}>
        <CircularProgress color="inherit" />
        <Typography variant='h3'>LOADING...</Typography>
    </Backdrop>)
}