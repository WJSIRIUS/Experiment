import * as React from 'react';
import Paper from '@mui/material/Paper';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

export default function NoticePage(props) {
    const stage = props.stage
    const change_phrase = () => {
        // from 0 to 1
        let x = 1
        props.changephrase(x)
    }
    let notice

    if (stage === 1) {
        notice = (
                <Paper>
                    <DialogTitle>（一）问卷</DialogTitle>
                    欢迎参与本实验！在接下来的任务中，请您设想自己处于实验所设定的政策环境中。在该环境下，您将基于实际情况做出与电力消耗和低碳行动相关的决策。我们希望您能够真实地反映出，在这样的情境下，您的选择会如何影响您的能源使用和环保行为。您的参与将帮助我们更好地理解人们在不同政策环境中的行为反应。
                    每轮实验模拟现实生活中一个月的时间，涉及到的电量使用数据为您一个人的数据（若您与多人共同生活，则是人均是用电量数据）本实验将最多持续十二轮。
                    <Button variant="contained" onClick={change_phrase}>确定</Button>
                </Paper>
            )
        
    } else if (stage === 2) {
        notice = (
            <Paper>
                <DialogTitle>（二）实验</DialogTitle>

                欢迎参与本实验！在接下来的任务中，请您设想自己处于实验所设定的政策环境中。在该环境下，您将基于实际情况做出与电力消耗和低碳行动相关的决策。我们希望您能够真实地反映出，在这样的情境下，您的选择会如何影响您的能源使用和环保行为。您的参与将帮助我们更好地理解人们在不同政策环境中的行为反应。
                每轮实验模拟现实生活中一个月的时间，涉及到的电量使用数据为您一个人的数据（若您与多人共同生活，则是人均是用电量数据）本实验将最多持续十二轮。
                <Button variant="contained" onClick={change_phrase}>确定</Button>
            </Paper>
        )
    }

    return (
        notice
    )

}