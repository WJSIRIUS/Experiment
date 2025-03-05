import * as React from 'react';

import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Carousel from './carousel';

import FormLabel from '@mui/material/FormLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FilledInput from '@mui/material/FilledInput';


import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';

import { SingleResDisplaySmall } from '../utils/tool';



export default function Page2Table(props) {
    const groupnum = props.groupnum
    const calculated_res = props.tableres
    const updatetableinfo = props.updatetableinfo

    const change_content = () => {
        if (groupnum === 3 || groupnum === 4) {
            props.changecontent(2)

        } else {
            props.changecontent(3)
        }
    }

    const [tabledata, setTabledata] = React.useState({
        'elec_used': 0, 'pub_trans_rate': 0,
        'garb_days': 0,
    })

    const handleElectricityChange = (event) => {
        const value = parseInt(event.target.value);
        setTabledata({ ...tabledata, 'elec_used':parseInt(value) }); // change state
    };

    const handleElectricityBlur = () => {
        const max = 400;
        const min = 90;
        let value = tabledata['elec_used']
        if (isNaN(value)) {
            value = min;
        } else if (value > max) {
            value = max;
        } else if (value < min) {
            value = min;
        }
        const tmp_tabledata = { ...tabledata, 'elec_used':parseInt(value) };
        setTabledata(tmp_tabledata);
        updateTableinfo(tmp_tabledata);
    };

    const handleTransportRateChange = (event) => {
        const value = parseInt(event.target.value);
        setTabledata({ ...tabledata, 'pub_trans_rate':parseInt(value) });
    };

    const handleTransportRateBlur = () => {
        const max = 100;
        const min = 0;
        let value = tabledata['pub_trans_rate']
        if (isNaN(value)) {
            value = min;
        } else if (value > max) {
            value = max;
        } else if (value < min) {
            value = min;
        }
        const tmp_tabledata = { ...tabledata, 'pub_trans_rate':parseInt(value) };
        setTabledata(tmp_tabledata);
        updateTableinfo(tmp_tabledata);
    };

    // 处理垃圾分类天数输入
    const handleGarbageDaysChange = (event) => {
        const value = parseInt(event.target.value);
        setTabledata({ ...tabledata, 'garb_days':parseInt(value) });
    };

    const handleGarbageDaysBlur = () => {
        const max = 30;
        const min = 0;
        let value = tabledata['garb_days']
        if (isNaN(value)) {
            value = min;
        } else if (value > max) {
            value = max;
        } else if (value < min) {
            value = min;
        }
        const tmp_tabledata = { ...tabledata, 'garb_days':parseInt(value) };
        setTabledata(tmp_tabledata);
        updateTableinfo(tmp_tabledata);
    };



    const updateTableinfo = (newData) => {
        const updatedTableinfo = {
            ...props.tableinfo, // preserve
            ...newData, // change
        };

        updatetableinfo(updatedTableinfo); // 调用父组件的函数
    };

    return (
        <form>
            <Grid container spacing={2}>
                {/* <Grid size={5} /> */}
                <Grid size={3} height={400}>
                    {/* <Skeleton height={400} /> */}
                    <Paper elevation={0} variant='outlined' sx={{ p: 2, height: '100%', width: '100%', borderWidth: '2px' }}>
                        <Grid container direction={'column'} sx={{ justifyContent: 'space-evenly', alignItems: 'center', height: "100%" }}>
                            <Typography variant="h5">用电策略</Typography>

                            <Grid>
                                <FormLabel id="label-changed-diy" >
                                    本月用电(90-400)：
                                </FormLabel>
                            </Grid>
                            <Grid>

                                <TextField type='number'
                                    size='small' id="filled-basic-changed-input" variant="filled" value={tabledata['elec_used']} onBlur={handleElectricityBlur} onChange={handleElectricityChange} />
                            </Grid>
                        </Grid>
                        {/* <Button variant="contained" onClick={change_phrase}>确定</Button> */}
                    </Paper>

                </Grid>
                <Grid size={9} height={400}>
                    <Paper elevation={0} variant='outlined' sx={{ p: 2, height: '100%', borderWidth: '2px' }}>
                        <Carousel />
                    </Paper>

                </Grid>
                <Grid size={6} height={350} >
                    {/* <Skeleton height={600} /> */}
                    <Paper elevation={0} variant='outlined' sx={{ p: 2, height: '100%', width: '100%', borderWidth: '2px' }}>
                        <Grid container spacing={2} direction={"column"} sx={{
                            justifyContent: "space-around",
                            alignItems: "center",
                        }}>
                            <Typography variant="h5">低碳策略</Typography>

                            <FormLabel id="label-changed-diy">
                                使用公共交通工具的比例(0-100%)：
                            </FormLabel>


                            <FilledInput
                                type='number'
                                onBlur={handleTransportRateBlur}
                                onChange={handleTransportRateChange}
                                value={tabledata['pub_trans_rate']}
                                id="filled-basic-changed-input"
                                endAdornment={<InputAdornment position="end">%</InputAdornment>}

                            />
                            {/* <TextField id="filled-basic" label={"比例(0-100)"} variant="filled" endAdornment={<InputAdornment position="end" >%</InputAdornment>} /> */}

                            <FormLabel id="label-changed-diy">
                                进行垃圾分类的天数(0-30天)：
                            </FormLabel>
                            <FilledInput
                                type='number'
                                onBlur={handleGarbageDaysBlur}
                                onChange={handleGarbageDaysChange}
                                value={tabledata['garb_days']}
                                id="filled-basic-changed-input"
                                endAdornment={<InputAdornment position="end">天</InputAdornment>}

                            />
                            {/* <TextField id="filled-basic" label={"天数(0-30)"} variant="filled" endAdornment={<InputAdornment position="end">天</InputAdornment>} type="int" /> */}

                            {/* <TextField id="filled-basic" label={"比例"} variant="filled" />
                        <TextField id="filled-basic" label={"天数"} variant="filled" /> */}


                            {/* <Button variant="contained" onClick={change_phrase}>确定</Button> */}
                        </Grid>
                    </Paper>
                </Grid>
                <Grid size={6} height={350}>
                    {/* <Skeleton height={600} /> */}
                    {/* todo */}
                    <TableResDisplay groupnum={groupnum} calculatedres={calculated_res} changecontent={change_content} />

                </Grid>

            </Grid>
        </form>

    );
}

function TableResDisplay(props) {
    const groupnum = props.groupnum
    const calculated_res = props.calculatedres


    if (groupnum < 1 || groupnum > 4) {
        return (<Typography variant="body2" sx={{ color: red[800] }}>Error!</Typography>)
    }

    return (<>
        <Paper elevation={0} variant='outlined' sx={{ p: 1, height: '100%', width: '100%', borderWidth: '2px' }}>


            <Grid container direction={"row"} sx={{
                alignItems: 'center',
                justifyContent: 'space-evenly',
                height: '100%'
            }} spacing={1}>
                <Grid size={12}><Typography variant="h5">结果</Typography></Grid>

                {/* addition */}
                {groupnum === 2 || groupnum === 3 ?
                    <><Grid size={12}>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                            {/* {convertstr2html("1度电电费=1个币\n结算时虚拟币不够支付电费，实验中止")} */}
                            {"1度电电费=1个币\n结算时虚拟币不够支付电费，实验中止"}
                        </Typography>
                    </Grid>
                        <Grid size={6}>
                            <SingleResDisplaySmall resname={"虚拟币"} res={calculated_res['vir_curr']} />
                        </Grid></> : groupnum === 4 ?

                        <><Grid size={12}>
                            <Typography variant="caption" sx={{ whiteSpace: 'pre-line' }}>
                                {/* {convertstr2html("限额内：1度电=1个币\n限额1到2倍内：1度电=1.5个币\n达到限额的两倍，实验中止\n结算时虚拟币不够支付电费，实验中止")} */}
                                {"限额内：1度电=1个币，限额1到2倍内：1度电=1.5个币。\n达到限额的两倍或结算时虚拟币不够支付电费，实验中止。\n"}
                            </Typography>
                        </Grid>
                            <Grid size={6}>
                                <SingleResDisplaySmall resname={"碳配额"} res={calculated_res['carb_quota']} />
                            </Grid>
                            <Grid size={6}>
                                <SingleResDisplaySmall resname={"虚拟币"} res={calculated_res['vir_curr']} />
                            </Grid></> : <></>}


                <Grid size={6}>
                    <SingleResDisplaySmall resname={"用电量"} res={calculated_res['elec_cons']} />
                </Grid>

                <Grid size={6}>
                    <SingleResDisplaySmall resname={"碳积分量"} res={calculated_res['carb_cred']} />
                </Grid>
                <Grid size={12}>
                    <Button variant="contained" onClick={() => { props.changecontent() }}>确定</Button>
                </Grid>
            </Grid>
        </Paper>
    </>)
}



