import * as React from 'react';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';


import { stage2_tippages } from '../utils/alllongtext';

export function NoticePage(props) {
    const stage = props.stage
    const change_phrase = () => {
        // from 0 to 1
        let x = 1
        props.changephrase(x)
    }
    let notice

    if (stage === 1) {
        notice = (
            <Paper elevation={0}>
                <Grid direction={'column'} container sx={{ p: 3, height: '100%', justifyContent: 'center', alignItems: 'center' }} spacing={3}>
                    <Grid ><Typography variant="h4">（一）问卷</Typography></Grid>
                    <Grid size={8}>
                        <Typography variant="subtitle1" gutterBottom>
                            <p>欢迎参与本实验！</p></Typography>
                        <Typography variant="subtitle1" gutterBottom sx={{ textIndent: '2em', textAlign: 'left' }}>
                            <p>在接下来的任务中，请您设想自己处于实验所设定的政策环境中。在该环境下，您将基于实际情况做出与电力消耗和低碳行动相关的决策。我们希望您能够真实地反映出，在这样的情境下，您的选择会如何影响您的能源使用和环保行为。您的参与将帮助我们更好地理解人们在不同政策环境中的行为反应。
                            </p><p>每轮实验模拟现实生活中一个月的时间。涉及到的电量使用数据为您一个人的数据（若您与多人共同生活，则是人均是用电量数据）本实验将最多持续十二轮。</p>
                        </Typography>
                    </Grid>
                    <Grid>
                        <Button variant="contained" onClick={change_phrase}>确定</Button>
                    </Grid>
                </Grid>

            </Paper>
        )

    } else if (stage === 2) {
        notice = (
            <Paper elevation={0}>
                <Grid direction={'column'} container sx={{ p: 3, height: '100%', justifyContent: 'center', alignItems: 'center' }} spacing={3}>
                    <Grid ><Typography variant="h4">（二）实验</Typography></Grid>
                    <Grid size={8}>
                        <Typography variant="subtitle1" >
                            <p>欢迎参与本实验！</p></Typography>
                        <Typography variant="subtitle1" sx={{ textIndent: '2em', textAlign: 'left' }}>
                            <p>在接下来的任务中，请您设想自己处于实验所设定的政策环境中。在该环境下，您将基于实际情况做出与电力消耗和低碳行动相关的决策。我们希望您能够真实地反映出，在这样的情境下，您的选择会如何影响您的能源使用和环保行为。您的参与将帮助我们更好地理解人们在不同政策环境中的行为反应。</p><p>每轮实验模拟现实生活中一个月的时间，涉及到的电量使用数据为您一个人的数据（若您与多人共同生活，则是人均是用电量数据）本实验将最多持续十二轮。</p>
                        </Typography>
                    </Grid>
                    <Grid>
                        <Button variant="contained" onClick={change_phrase}>确定</Button>
                    </Grid>
                </Grid>
            </Paper>
        )
    } else if (stage === 3) {
        notice = (
            <Paper elevation={0}>
                <Grid direction={'column'} container sx={{ p: 3, height: '100%', justifyContent: 'center', alignItems: 'center' }} spacing={3}>
                    <Grid ><Typography variant="h4">结束</Typography></Grid>
                    <Grid size={8}>
                        <Typography variant="subtitle1" >
                            <p>恭喜您！您完成了问卷和所有的实验！</p><p>  您的贡献对我们的研究至关重要，您的耐心和专注让我们深感钦佩！</p>
                            <p> 感谢您的耐心参与和宝贵时间！ </p></Typography>
                    </Grid>
                    <Grid>
                        <Button variant="contained" onClick={() => { console.log("end") }}>退出</Button>
                    </Grid>
                </Grid>
            </Paper>
        )
    }

    return (
        notice
    )

}

export function TipPage(props) {
    const groupid = props.groupid
    const change_content = () => {
        // 0 1 2 3 three or four pages
        let x = 1
        props.changecontent(x)

        // nextround, the original fun won't + 1
        // round 1 start
        props.changeround(1)
        // than the round turn to 1

    }
    const tip = stage2_tippages[groupid - 1].split('\n').map((val, ind) => (<p key={ind}>{val}</p>))



    return (
        <Box>
            <Paper elevation={0} sx={{ height: '100%' }}>
                <Grid direction={'column'} container sx={{ p: 3, height: '100%', justifyContent: 'center', alignItems: 'center' }} spacing={3}>
                    <Grid>
                        <Typography variant="h4">第{groupid}组的实验内容</Typography>
                    </Grid>
                    <Grid size={6}>
                        <Typography variant="subtitle2" sx={{ textIndent: '2em', textAlign: 'left', whiteSpace: 'pre-line' }}>
                            {tip}
                        </Typography>
                    </Grid>
                    <Grid>
                        <Button variant="contained" onClick={change_content}>确定</Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    )

}
