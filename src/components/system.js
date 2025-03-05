import * as React from 'react';

import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import FormLabel from '@mui/material/FormLabel';

import Typography from '@mui/material/Typography';

import { SingleResDisplaySmall } from '../utils/tool';
// 3
export function CarbonCreditExchangeSystem(props) {
    const tableres = props.tableres
    const credit = tableres['carb_cred']
    const vir_curr = tableres['vir_curr']
    const exchange_rate = props.randomrate['carb_cred_exchange_rate']

    const change_content = () => {
        props.changecontent(3)
    }
    const exchange = () => {
        // alert(`${exchange_rate}*${credit}+${vir_curr}`)
        const vircurr_tmp = exchange_rate * credit + vir_curr
        // don't change credit, because it will be used when display
        props.changetableres({...tableres,'vir_curr':vircurr_tmp},3)
    }

    return (
        <Grid container sx={{
            justifyContent: "center",
        }}>
            <Paper variant='outlined' sx={{ height: '100%', p: 3, width: '50%', borderWidth: '2px' }}>
                <Grid container direction={"column"} sx={{
                    alignItems: "center",
                }} spacing={3}>
                    <Grid>
                        <Typography variant="h5">
                            碳积分兑换系统
                        </Typography>

                    </Grid>

                    <Grid >
                        <Typography gutterBottom variant="body" component="div">
                            目前，系统给出的碳积分兑换价格为：1积分={exchange_rate}代币 <br />
                            您是否选择全部兑换？
                            <br />
                        </Typography>

                        <Typography variant="caption">
                            （请注意，碳积分不保留到下一轮）
                        </Typography>
                    </Grid>
                    <Grid>
                        <SingleResDisplaySmall resname={'您目前剩余碳积分为'} res={credit} />
                        <SingleResDisplaySmall resname={'您目前剩余虚拟币为'} res={vir_curr} />
                    </Grid>

                    <Grid container sx={{
                        justifyContent: 'space-evenly'
                    }} spacing={3} size={12}>
                        <Grid size={4}>
                            <Button variant="contained" onClick={exchange}>是</Button>
                        </Grid>
                        <Grid size={4}>
                            <Button variant="contained" onClick={change_content}>否</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    )
}

// 4
export function CarbonQuotaTradingSystem(props) {
    const tableres = props.tableres
    const elec_cons = tableres['elec_cons']
    const vir_curr = tableres['vir_curr']
    const quota = tableres['carb_quota']
    const trade_rate = props.randomrate['carb_quota_trade_rate']

    const [tradequota, setTradequota] = React.useState(0)
    const typeoftrade = quota > 0 ? 0 : 1

    const change_content = () => {
        props.changecontent(3)
    }
    const trade = () => {
        // typeoftrade:  0 sell and 1 buy 
        const vircurr_tmp = !typeoftrade ? vir_curr - trade_rate * tradequota : vir_curr + trade_rate * tradequota
        const quota_tmp = !typeoftrade ? quota + tradequota : quota - tradequota
        props.changetableres({...tableres,'vir_curr':vircurr_tmp,'carb_quota':quota_tmp},3)
    }

    const handleChange = (e) => {
        const value = parseInt(e.target.value);
        setTradequota(value)
    }

    return (
        <Grid container sx={{
            justifyContent: "center",
        }}>

            <Paper variant='outlined' sx={{ height: '100%', p: 3, width: '50%', borderWidth: '2px' }}>
                <Grid container direction={"column"} sx={{
                    alignItems: "center",
                }} spacing={3}>
                    <Grid>
                        <Typography variant="h5">
                            碳配额交易系统
                        </Typography>

                    </Grid>
                    <Grid >
                        <Typography gutterBottom variant="body" component="div">
                            目前，市场上的碳配额价格为：1配额={trade_rate}代币
                        </Typography>
                        <Typography variant="caption">
                            （请注意，碳配额不保留到下一轮）
                        </Typography>
                    </Grid>
                    <Grid >

                        <Typography gutterBottom variant="body2" component="div">
                            <SingleResDisplaySmall resname={'您目前剩余碳配额为'} res={quota - elec_cons} />
                            <SingleResDisplaySmall resname={'您目前剩余虚拟币为'} res={vir_curr} />
                            {/* 买家,typeoftrade=0,vir-,quota+ */}
                            <SingleResDisplaySmall resname={'您是'} res={!typeoftrade ? '买家' : '卖家'} />

                            {/* 您目前剩余碳配额为：{quota} <br />
                        您目前剩余虚拟币为：{vir_curr}<br />
                        您是{typeoftrade ? '买' : '卖'}家 */}
                        </Typography>
                    </Grid>

                    <Grid>
                        <FormLabel id="label-changed-diy">
                            您选择交易的数量：
                        </FormLabel>
                        <TextField size='small' id="filled-basic-changed-input" variant="filled" value={tradequota} onChange={handleChange} type='number'/>
                    </Grid>

                    <Grid container sx={{
                        justifyContent: 'space-evenly'
                    }} spacing={3} size={12}>
                        <Grid size={4}>
                            <Button variant="contained" onClick={trade}>是</Button>
                        </Grid>
                        <Grid size={4}>
                            <Button variant="contained" onClick={change_content}>否</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    )
}
