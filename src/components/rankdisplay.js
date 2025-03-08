import * as React from 'react';

import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import Typography from '@mui/material/Typography';
import { red, green } from '@mui/material/colors';
import { SingleResDisplayBig } from '../utils/tool';
import { maxround } from '../utils/alllongtext';


export default function RankDisplay(props) {
    // rank : electricity and carbon
    const userranking = props.userrank
    //  {
    //     'elec_cons': 0,
    //     'carb_cred': 0,
    //     'vir_curr': 0,
    //     'carb_quota': 0,
    // }
    const calculated_res = props.calculatedres
    const { elec_cons, carb_cred, vir_curr, carb_quota } = calculated_res
    const groupid = props.groupid
    const round = props.round
    const nextround = () => {
        props.nextround(round)
    }
    const nextstage = () => {
        props.changecontroler({
            "stage": 3,
            "phrase": 0,
        })
    }
    const roundstate = vir_curr >= 0 ? (groupid < 4 ? (carb_quota * 2 >= elec_cons ? true : false) : true) : false


    if (groupid < 1 || groupid > 4) {
        return (<Typography variant="body2" sx={{ color: red[800] }}>Error!</Typography>)
    }

    return (<>
        <Grid container sx={{ justifyContent: 'center' }}>
            <Paper variant='outlined' sx={{ height: '100%', p: 3, width: '70%', borderWidth: '2px' }}>

                <Grid container direction={"column"} sx={{
                    alignItems: 'center'
                }} spacing={3}>
                    <Grid size={12}>
                        <Typography variant="h5" textAlign='center'>
                            结果
                        </Typography>

                    </Grid>

                    <Grid size={8}>
                        <SingleResDisplayBig resname={"用电量"} res={elec_cons} isrank={true} resrankname={'用电量排名（低到高）'} resrank={userranking['elec_cons_rank']} />
                        {/* <Typography gutterBottom variant="h7" component="div">
                                用电量：
                            </Typography>
                            <Typography variant="body">
                                {calculated_res['elec_cons']}
                            </Typography>

                            <Typography gutterBottom variant="h7" component="div">
                                用电量排名（低到高）：
                            </Typography>
                            <Typography variant="body">
                                {userranking['elec_cons_rank']}
                            </Typography> */}
                    </Grid>
                    <Grid size={8}>
                        <SingleResDisplayBig resname={"碳积分量"} res={carb_cred} isrank={true} resrankname={'碳积分量排名（低到高）'} resrank={userranking['carb_cred_rank']} />

                        {/* <Typography gutterBottom variant="h7" component="div">
                                碳积分量：
                            </Typography>
                            <Typography variant="body">
                                {calculated_res['carb_cred']}
                            </Typography>
                            <Typography gutterBottom variant="h7" component="div">
                                碳积分量排名（低到高）：
                            </Typography>
                            <Typography variant="body">
                                {userranking['carb_cred_rank']}
                            </Typography> */}
                    </Grid>

                    {/* addition */}
                    {groupid > 1 ?
                        <Grid size={8}>
                            <SingleResDisplayBig resname={"虚拟币"} res={vir_curr} isrank={false} />

                            {/* <Typography gutterBottom variant="h5" component="div">
                                        虚拟币：
                                    </Typography>
                                    <Typography variant="body2">
                                        {calculated_res['vir_curr']}
                                    </Typography> */}

                        </Grid> : <></>}
                    {groupid === 4 ?
                        <Grid size={8}>
                            <SingleResDisplayBig resname={"碳配额"} res={carb_quota} isrank={false} />
                        </Grid> : <></>}
                    <Grid size={8} sx={roundstate ? { color: green[800] } : { color: red[800] }}>
                        <Typography variant="option" component="div" textAlign='center'>
                            {groupid === 4 ? (roundstate ? "虚拟货币（和碳配额）充足，可以进入下一轮" : "虚拟货币不足或碳配额不足，实验终止") : (roundstate ? "虚拟货币充足，可以进入下一轮" : "虚拟货币不足，实验终止")}
                        </Typography>
                    </Grid>

                    <Grid size={8} sx={{ alignItems: 'center' }}>
                        <Button variant="contained" onClick={round === maxround || !roundstate ? nextstage : nextround}>{round === maxround || !roundstate ? "确定" : "下一轮"}</Button>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    </>)
}

// todo : request for server
// todo : couculate_rank
function getrankfromsever() {
    return 0
}