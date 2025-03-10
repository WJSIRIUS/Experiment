import * as React from 'react';
// import test_data from '../test_json/stage1_test.json'

import { NoticePage } from './notice';
import ErrorPage from './error';
import Page1 from './page1';
import Page2 from './page2';


import { styled, useTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import {
    PageContainer,
    PageHeader,
    PageHeaderToolbar,
} from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import { maxround, que11CommuteKilometers, MonthlyDays, que10TripsFrequency } from '../utils/alllongtext';
import { loadData } from '../utils/tool';
import { getGroupId, getSurvey, postSubmitResult } from '../utils/api';
import IfBackDrop from './ifbackdrop';

const NAVIGATION = [
    { segment: 'experiment', title: 'Experiment' },
    {
        segment: 'experiment/stage1',
        title: 'Stage1',
    },
    {
        segment: 'experiment/stage2',
        title: 'Stage2',
    },
];



function CustomPageToolbar(props) {

    let breadcrumbs = [
        <Button variant="text" key={'group'}>{`Group ${props.groupid}`}</Button>
    ]
    if (props.round > 0) {
        breadcrumbs.push(<Button variant="text" key={'group'}>{`Round ${props.round}`}</Button>)
    }
    return (
        <PageHeaderToolbar>
            <Stack direction="row" spacing={1} alignItems="center">
                <Breadcrumbs separator="-" aria-label="breadcrumb">
                    {breadcrumbs}
                </Breadcrumbs>
                <Avatar>HY</Avatar>
            </Stack>
        </PageHeaderToolbar>
    );
}

function CustomPageHeader(props) {
    return <PageHeader slots={{ toolbar: CustomPageToolbar }} slotProps={{ toolbar: { round: props.round, groupid: props.groupid } }} />;
}


export default function PageContainerBasic(props) {
    const { window } = props;
    const theme = useTheme();
    // Remove this const when copying and pasting into your project.
    const demoWindow = window ? window() : undefined;
    const [isbackdrop, setIsbackdrop] = React.useState(true)
    const [starttime, setStartime] = React.useState()


    // stage router
    const [routertxt, setRoutertxt] = React.useState('/experiment/stage1');
    const change_stage = (x) => {
        setRoutertxt(`/experiment/stage${x}`)
    }

    // stage
    const [controler, setControler] = React.useState({
        "stage": 1,
        "phrase": 0,
    });
    const change_phrase = (x) => {
        // // this is refer
        // let tmpc = controler 
        // // x = 1 0
        // tmpc["phrase"] = x
        // setControler(tmpc)
        setControler({ ...controler, phrase: x })
    }
    const change_controler = (x) => {
        setControler(x)
    }

    const [groupid, setGroupid] = React.useState(0)
    const [userid, setUserid] = React.useState(0)
    const [surveydata, setSurveydata] = React.useState([])
    // API : get groupid
    // API : get survey
    React.useEffect(() => {
        const initComponent = () => {
            const promise1 = getGroupId().then((res) => {
                if (res) {
                    const { user_id, group_id } = res
                    // console.log(res)
                    setGroupid(group_id)
                    setUserid(user_id)
                }

            }).catch((error) => {
                console.log("Error in getting group id:", error);
                throw error;
            });

            const promise2 = getSurvey().then((res) => {
                if (res) {
                    const survey = res
                    setSurveydata(survey)
                }

            }).catch((error) => {
                console.log("Error in getting survey:", error);
                throw error;
            });

            Promise.allSettled([promise1, promise2]).then((results) => {
                console.log(results)

                const starttime = new Date()
                setStartime(starttime.toISOString())

                setIsbackdrop(false)
            })


        }
        initComponent()
    }, [])

    // submit data
    // API : submit all data

    React.useEffect(() => {
        const submitData = () => {
            if (controler['stage'] === 3) {

                setIsbackdrop(true)

                const endtime = new Date()
                const stage1data = loadData('stage1')['savestage1answer']
                const stage2data = loadData('stage2')['savestage2exp']

                const data = {
                    userid: userid,
                    groupid: groupid,
                    starttime: starttime,
                    finishtime: endtime.toISOString(),
                    progress: 'finishedall',
                    answer: {
                        stage1: stage1data,
                        stage2: stage2data,
                    }
                }
                postSubmitResult(data).then((res) => {
                    if (res) {
                        console.log(res)
                    }
                    setIsbackdrop(false)
                }).catch((error) => {
                    console.log("Error posting submit data:", error);
                    throw error;
                });

            }
        }
        submitData()
    }, [controler['stage']])


    // round
    const [s2round, setS2round] = React.useState(0)
    const change_round = (x) => {
        if (x <= maxround) {
            // already + 1
            setS2round(x)
        }
    }

    return (
        <AppProvider
            navigation={NAVIGATION}
            router={{
                pathname: routertxt,
                searchParams: new URLSearchParams(),
                navigate: (path) => { },
            }}
            theme={theme}
            window={demoWindow}
            branding={{
                title: 'Lab.',
            }}
        >

            <Grid container sx={{ justifyContent: 'center' }}>
                <Paper elevation={0} sx={{ p: 3, width: '90%', height: '100%', m: 3, minHeight: 500 }}>
                    <PageContainer
                        slots={{
                            header: CustomPageHeader,
                        }}
                        slotProps={{
                            header: {
                                round: s2round, groupid: groupid
                            }
                        }}
                    >
                        <PageControler survey={surveydata} starttime={starttime} changestage={change_stage} groupid={groupid} userid={userid} s2round={s2round} changeround={change_round} changephrase={change_phrase} changecontroler={change_controler} controler={controler} />
                    </PageContainer >
                </Paper>
            </Grid>

            <IfBackDrop open={isbackdrop} />

        </AppProvider >
    );
}

export function PageControler(props) {

    // let questions = test_data;
    const questions = props.survey
    const question_length = questions.length

    // stage 1 2
    // phrase: 0 notice, 1 question


    // no such situation
    // const change_stage = (x) => {
    //     let tmpc = controler
    //     // x = 2
    //     tmpc['stage'] = x
    //     setControler(tmpc)
    // }


    const userid = props.userid
    const groupid = props.groupid
    const s2round = props.s2round
    const controler = props.controler
    const starttime = props.starttime



    // useeffect to rerender father component
    React.useEffect(() => {
        if (controler["stage"] === 2) {
            //  useEffect while changestage to update father component
            props.changestage(2);
        }
        if (controler["stage"] === 3) {
            //  useEffect while changestage to update father component
            props.changestage(3);
        }
        // when controler["stage"] change 
    }, [controler["stage"]]);

    let page
    if (controler["phrase"] === 0) {
        page = <NoticePage changephrase={props.changephrase} stage={controler["stage"]} />

        // important! can't update father component wihle rendering, use effect to motoring the changes of controler
        // if (controler["stage"] === 2) { props.changestage() }
    } else if (controler["phrase"] === 1) {

        if (controler["stage"] === 1) {
            page = <Page1 changestage={props.changecontroler} groupid={groupid} userid={userid} questions={questions} starttime={starttime} />

        } else if (controler["stage"] === 2) {
            // stage 1 param
            const stage1data = getStage1data()
            // console.log("DEBUG:",stage1data)
            page = <Page2 stage1data={stage1data} changeround={props.changeround} groupid={groupid} userid={userid} round={s2round} changecontroler={props.changecontroler} starttime={starttime} />

        } else {

            page = <ErrorPage reason={"phrase 1, but stage unkown"} />
        }
    }
    else {
        page = <ErrorPage reason={"phrase unkown"} />
    }

    // don't return object: {page}
    // return (

    //     { page }
    // );
    return (page)
}

function getStage1data() {

    const stage1data = loadData('stage1')
    // console.log("DEBUG:",stage1data)
    // 10. 您每月的外出频率（往返记为一次） [单选题] *
    // INT MonthlyTrip frequency per mounth
    const que10ans = stage1data['answer']['10']
    const MonthlyFrequencyTrip = parseInt(MonthlyDays / que10TripsFrequency[que10ans])

    // 11. 您的单次通勤距离（往返总和） [单选题]
    const que11ans = stage1data['answer']['11']
    const CommuteKilometer = que11CommuteKilometers[que11ans]

    // 26. 上个月用电量（单位：千瓦时/度） [填空题]
    const que26ans = stage1data['answer']['26']
    const ElectricityConsumption = que26ans

    // return ({
    //     'monthly_freq_trip': MonthlyFrequencyTrip, // 每月出行频率
    //     'commute_km': CommuteKilometer,               // 单次通勤距离（往返总和）
    //     'elec_consumption': ElectricityConsumption    // 上个月用电量
    // })
    return ({
        'monthly_freq_trip': MonthlyFrequencyTrip, // 每月出行频率
        'commute_km': CommuteKilometer,               // 单次通勤距离（往返总和）
        'elec_consumption': ElectricityConsumption    // 上个月用电量
    })
}