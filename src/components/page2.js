import * as React from 'react';

import { TipPage } from './notice';
import Box from '@mui/material/Box';
import Page2Table from './table';
import RankDisplay from './rankdisplay';
import { CarbonCreditExchangeSystem, CarbonQuotaTradingSystem } from './system';
import ErrorPage from './error';
import { saveEveryRoundData, group4electricitybill, roundupfloat } from '../utils/tool';
import { MonthlyDays, RoundRateInterval } from '../utils/alllongtext';
import Alert from '@mui/material/Alert';

import Snackbar from '@mui/material/Snackbar';
import { getRoundRank, postSubmitResult } from '../utils/api';
import IfBackDrop from './ifbackdrop';
import { getStage2exp, loadData } from '../utils/tool';


export default function Page2(props) {


    const starttime = props.starttime
    const stage1data = props.stage1data
    const groupid = props.groupid
    const userid = props.userid
    const round = props.round

    const [openalert, setOpenalert] = React.useState({
        'openalert': groupid === 1 ? false : true,
        'round_vir_curr': 0,
    });

    const [randomrate, setRandomrate] = React.useState({
        'vir_curr_rate': 0,
        'carb_cred_exchange_rate': 0,
        'carb_quota_rate': 0,
        'carb_quota_trade_rate': 0
    })
    // const [everyroundinfo, setEveryroundinfo] = React.useState({})
    // 0-tip 1-table 3(4)-res
    const [contentnum, setContentnum] = React.useState(0)
    const [tableinfo, setTableinfo] = React.useState({
        'elec_used': 0,
        'pub_trans_rate': 0,
        'garb_days': 0,
    });
    const [tableres, setTableres] = React.useState({
        'elec_cons': 0,
        'carb_cred': 0,
        'vir_curr': 0,
        'carb_quota': 0,
    });

    const [userrank, setUserrank] = React.useState({
        'elec_cons_rank': 0,
        'carb_cred_rank': 0,
    });


    // content = 1, just start this round
    React.useEffect(() => {
        if (contentnum === 1) {
            // rate 
            const rate = page2roundrate()
            // round quota & currency
            // must use rate, using randomrate will get original state of randomrate, because of the asynchronous
            const [round_vir_curr, round_carb_quota] = page2rounddata(rate, stage1data)

            setRandomrate(rate)
            setTableres({ ...tableres, 'carb_quota': round_carb_quota, 'vir_curr': round_vir_curr + tableres['vir_curr'] })

            // alert
            setOpenalert({
                'openalert': true,
                'round_vir_curr': round_vir_curr
            })

        }
    }, [contentnum]);


    const [unloadstatus, setUnloadstatus] = React.useState(false)
    // stage2 close:
    React.useEffect(() => {
        const listener = (e) => {
            setUnloadstatus(true)
            e.preventDefault()
        }
        window.addEventListener('beforeunload', listener)
        return () => {
            window.removeEventListener('beforeunload', listener)
        }
    }, [])
    React.useEffect(() => {
        // send stage2
        const postsubmit = async () => {
            // console.log("DEBUG:", userdata)
            const endtime = new Date()
            const stage1data = loadData('stage1')['savestage1answer']
            const stage2data = loadData('stage2')['savestage2exp']

            const data = {
                userid: userid,
                groupid: groupid,
                starttime: starttime,
                finishtime: endtime.toISOString(),
                progress: 'onstage2',
                answer: {
                    stage1: stage1data,
                    stage2: stage2data,
                }
            }
            const res = await postSubmitResult(data)
            console.log(res)
        }
        postsubmit().then((res) => {
            console.log(res)
        })
    }, [unloadstatus])


    const change_from_sys = (tmp) => {
        setTableres({ ...tmp })
    }

    const [isbackdrop, setIsbackdrop] = React.useState(false)
    // API: get roundly rank
    const calculate_rank = (x = 0) => {

        setIsbackdrop(true)
        // get ranking
        // data: {
        //     userid: Schema.Types.ObjectId,
        //     groupid: { type: Number, enum: [1, 2, 3, 4] },
        //     roundid: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
        //     electricityconsumption: Number,
        //     carboncredit: Number,}
        const data = {
            userid: userid,
            groupid: groupid,
            rounid: round,
            electricityconsumption: tableres["elec_cons"],
            carboncredit: ['carb_cred'],
        }
        getRoundRank(data).then((res) => {
            if (res) {
                // if (res['userid'] === userid && res['groupid'] === groupid && res['roundid'] === round) {
                const { total_count, elec_cons_count, carb_cred_count } = res
                // total count including it self
                // count > $gt
                // 100%
                const ecrank = ((elec_cons_count + 1) / total_count) * 100
                const ccrank = ((carb_cred_count + 1) / total_count) * 100

                // console.log(res)
                setUserrank({
                    'elec_cons_rank': ecrank,
                    'carb_cred_rank': ccrank,
                })
                // }
                // else {
                //     throw console.error("Wrong user or group or round !!");
                // }

                setIsbackdrop(false)

                if (x === 3) {
                    setContentnum(3)
                }
            }
        }).catch((error) => {
            console.log("Error in getting rank:", error);
        });

    }

    const updateTableinfo = (newTableinfo) => {
        const [elec_cons, carb_cred, vir_curr] = page2roundres(newTableinfo, tableres, stage1data, groupid)
        setTableres({
            ...tableres,
            'elec_cons': elec_cons,
            'carb_cred': carb_cred,
            'vir_curr': vir_curr,
        })
        setTableinfo(newTableinfo);

    };

    // round
    const nextround = (round) => {
        const stage2exp = getStage2exp(tableinfo, tableres, userrank, randomrate, round)
        const rounddata = {
            'user_inp': tableinfo,
            'user_res': tableres,
            'user_rank': userrank,
            'round_rate': randomrate,
        }
        // savedata
        saveEveryRoundData("stage2", rounddata, stage2exp, round)
        // cleardata, setState to original
        setTableinfo({
            'elec_used': 0,
            'pub_trans_rate': 0,
            'garb_days': 0,
        })
        setTableres({
            'elec_cons': 0,
            'carb_cred': 0,
            'vir_curr': tableres['vir_curr'],
            'carb_quota': 0,
        });
        setUserrank({
            'elec_cons_rank': 0,
            'carb_cred_rank': 0,
        });
        setRandomrate({
            'vir_curr_rate': 0,
            'carb_cred_exchange_rate': 0,
            'carb_quota_rate': 0,
            'carb_quota_trade_rate': 0
        })


        // nextround, the original fun won't + 1
        props.changeround(round + 1)

        // back to content 1
        setContentnum(1)

    }
    if (round > 0 && contentnum === 0) {
        return (<ErrorPage reason={'round > 0  while on tip page '} />)
    };

    // alert

    // content
    const change_content = (x) => {
        setContentnum(x)
    }


    //  tippage -> table -> res (-> system)
    let content
    switch (contentnum) {
        case 0:
            // round 0->1 starting stage2
            content = <TipPage changecontent={change_content} groupid={groupid} changeround={props.changeround} />
            break;
        case 1:
            content = (
                <>
                    <Snackbar open={openalert} onClose={() => {
                        setOpenalert({ ...openalert, 'openalert': false })
                    }} >
                        <Alert
                            onClose={() => { setOpenalert({ ...openalert, 'openalert': false }) }}
                            severity="info"
                        >
                            {`本轮发放${openalert['round_vir_curr']}个虚拟货币。`}
                        </Alert>
                    </Snackbar >

                    <Page2Table
                        groupid={groupid}
                        tableres={tableres}
                        tableinfo={tableinfo}
                        updatetableinfo={updateTableinfo}
                        changecontent={change_content}
                        calculaterank={calculate_rank}
                    />
                </>
            )
            break;
        case 2:
            // res
            if (groupid === 3) {
                content = <CarbonCreditExchangeSystem randomrate={randomrate} tableres={tableres} changetableres={change_from_sys} changecontent={change_content} calculaterank={calculate_rank} />
            } else if (groupid === 4) {
                content = <CarbonQuotaTradingSystem randomrate={randomrate} tableres={tableres} changetableres={change_from_sys} changecontent={change_content} calculaterank={calculate_rank} />
            }
            break;

        case 3:
            // res
            content = <RankDisplay userrank={userrank} calculatedres={tableres} groupid={groupid} nextround={nextround} round={round} changecontroler={props.changecontroler} />
            break;
        default:
            break;
    }

    return (
        <Box>
            {content}
            <IfBackDrop open={isbackdrop} />
        </Box>
    );
}

// CALCULATE RANDOM RATE
function page2roundrate() {
    const roundratekey = Object.keys(RoundRateInterval)
    let roundrate = {}
    for (let i = 0; i < roundratekey.length; i++) {
        const roundkey = roundratekey[i]
        const { max, min } = RoundRateInterval[roundkey]
        roundrate[roundkey] = roundupfloat(Math.random() * (max - min) + min)
    }
    return roundrate
}
// CALCULATE ROUND DATA
function page2rounddata(rate, stage1data) {
    const round_vir_curr = stage1data['elec_consumption'] * rate['vir_curr_rate']
    const round_carb_quota = stage1data['elec_consumption'] * rate['carb_quota_rate']
    // alert(`debug: 本轮新增${round_vir_curr}币`)
    return [round_vir_curr, round_carb_quota]
}

function page2roundres(tableinfo, tableres, stage1data, groupid = 0) {
    // elec_used right now
    const elec_cons = tableinfo['elec_used']
    const carb_cred = stage1data['commute_km'] * (tableinfo['pub_trans_rate'] / 100) * 0.15 * stage1data['monthly_freq_trip'] + tableinfo['garb_days'] / MonthlyDays * 0.5 * 20.8
    // curr + elec_cons before - elec_cons now
    // debug console.log([tableinfo,tableres,stage1data])

    // + elec_used before - right now
    let vir_curr = tableres['vir_curr'] + tableres['elec_cons'] - elec_cons
    // alert(`debug: rightnow${elec_cons},before${tableres['elec_cons']},final:${vir_curr}`)
    if (groupid === 4) {
        vir_curr = tableres['vir_curr'] + group4electricitybill(tableres['elec_cons'], tableres['carb_quota']) - group4electricitybill(elec_cons, tableres['carb_quota'])
        // alert(`debug: rightnow${group4electricitybill(elec_cons, tableres['carb_quota'])},before${group4electricitybill(tableres['elec_cons'], tableres['carb_quota'])},final:${vir_curr}`)

    }
    return [elec_cons, carb_cred, vir_curr]
}

