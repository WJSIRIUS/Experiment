import * as React from 'react';
import test_data from '../test_json/stage1_test.json'
import { TipPage } from './notice';
import Box from '@mui/material/Box';
import Page2Table from './table';
import RankDisplay from './rankdisplay';
import { CarbonCreditExchangeSystem, CarbonQuotaTradingSystem } from './system';
import ErrorPage from './error';
import { saveEveryRoundData, group4electricitybill, roundupfloat } from '../utils/tool';
import { MonthlyDays, RoundRateInterval } from '../utils/alllongtext';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';

export default function Page2(props) {

    const [openalert, setOpenalert] = React.useState({
        'openalert': true,
        'round_vir_curr': 0,
    });
    const stage1data = props.stage1data
    const groupnum = props.groupnum

    const [randomrate, setRandomrate] = React.useState({
        'vir_curr_rate': 0,
        'carb_cred_exchange_rate': 0,
        'carb_quota_rate': 0,
        'carb_quota_trade_rate': 0
    })
    const [everyroundinfo, setEveryroundinfo] = React.useState({})
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

    const change_from_sys = (tmp, x) => {
        setTableres({ ...tmp })
        setContentnum(x)

    }

    const couculate_rank = () => {
        // get ranking

        setUserrank({
            'elec_cons_rank': 20,
            'carb_cred_rank': 50,
        })
    }

    const updateTableinfo = (newTableinfo) => {
        const [elec_cons, carb_cred, vir_curr] = page2roundres(newTableinfo, tableres, stage1data, groupnum)
        setTableres({
            ...tableres,
            'elec_cons': elec_cons,
            'carb_cred': carb_cred,
            'vir_curr': vir_curr,
        })
        setTableinfo(newTableinfo);

    };

    // round
    const round = props.round
    const nextround = (round) => {
        const rounddata = {
            'user_inp': tableinfo,
            'user_res': tableres,
            'user_rank': userrank,
            'round_rate': randomrate,
        }
        // savedata
        saveEveryRoundData("stage2", rounddata, round)


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
            content = <TipPage changecontent={change_content} groupnum={groupnum} changeround={props.changeround} />
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
                        groupnum={groupnum}
                        tableres={tableres}
                        tableinfo={tableinfo}
                        updatetableinfo={updateTableinfo}
                        changecontent={change_content}
                    />
                </>
            )
            break;
        case 2:
            // res
            if (groupnum === 3) {
                content = <CarbonCreditExchangeSystem randomrate={randomrate} tableres={tableres} changetableres={change_from_sys} changecontent={change_content} />
            } else if (groupnum === 4) {
                content = <CarbonQuotaTradingSystem randomrate={randomrate} tableres={tableres} changetableres={change_from_sys} changecontent={change_content} />
            }
            break;

        case 3:
            // res
            content = <RankDisplay userrank={userrank} calculatedres={tableres} groupnum={groupnum} nextround={nextround} round={round} changecontroler={props.changecontroler}/>
            break;
        default:
            break;
    }

    return (
        <Box>
            {content}
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

function page2roundres(tableinfo, tableres, stage1data, groupnum = 0) {
    // elec_used right now
    const elec_cons = tableinfo['elec_used']
    const carb_cred = stage1data['commute_km'] * (tableinfo['pub_trans_rate'] / 100) * 0.15 * stage1data['monthly_freq_trip'] + tableinfo['garb_days'] / MonthlyDays * 0.5 * 20.8
    // curr + elec_cons before - elec_cons now
    // debug console.log([tableinfo,tableres,stage1data])

    // + elec_used before - right now
    let vir_curr = tableres['vir_curr'] + tableres['elec_cons'] - elec_cons
    // alert(`debug: rightnow${elec_cons},before${tableres['elec_cons']},final:${vir_curr}`)
    if (groupnum === 4) {
        vir_curr = tableres['vir_curr'] + group4electricitybill(tableres['elec_cons'], tableres['carb_quota']) - group4electricitybill(elec_cons, tableres['carb_quota'])
        // alert(`debug: rightnow${group4electricitybill(elec_cons, tableres['carb_quota'])},before${group4electricitybill(tableres['elec_cons'], tableres['carb_quota'])},final:${vir_curr}`)

    }
    return [elec_cons, carb_cred, vir_curr]
}

