import React from 'react';
import Paper from '@mui/material/Paper';
import { Box, Divider } from '@mui/material';
import Typography from '@mui/material/Typography';

// SAVING
export function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function loadData(key) {
  const storedData = JSON.parse(localStorage.getItem(key))
  return storedData
}

export function clearData(key) {
  localStorage.removeItem(key)
}

export function saveEveryRoundData(key, round_data, savestage2exp, round) {

  let storedData = {}
  if (round > 1) {
    storedData = JSON.parse(localStorage.getItem(key))
  }
  storedData = { ...storedData }
  storedData[round] = round_data
  localStorage.setItem(key, JSON.stringify(storedData))


  let storedDataexp = []
  if (round > 1) {
    storedDataexp = JSON.parse(localStorage.getItem('savestage2exp'))
  }
  let storedDataexptmp = [...storedDataexp, savestage2exp]
  localStorage.setItem('savestage2exp', JSON.stringify(storedDataexptmp))
}



// TEXT
function TextDisplay({ text }) {
  const lines = text.split('\n');

  return (
    <div>
      {lines.map((line, index) => (
        <div key={index}>
          {/* 每行开头缩进两个中文空格 */}
          &emsp;&emsp;{line}
          {/* 如果不是最后一行，添加 <br /> 换行 */}
          {index !== lines.length - 1 && <br />}
        </div>
      ))}
    </div>
  );
}


function convertstr2html(text) {
  return text.split('\n').map((val) => (<p>{val}</p>))
}


// DISPLY
export function roundupfloat(float_num, decimal_place = 4) {
  // is not number ? ture : false
  // console.log(float_num)
  return isNaN(float_num) ? float_num : parseFloat(float_num.toFixed(decimal_place))
}

export function SingleResDisplaySmall(props) {
  return (
    <Box sx={{ p: 1 }}>
      <Paper variant='outlined' sx={{ p: 1 }}>
        <Typography variant="subtitle2" component="div" color='primary' textAlign='center'>
          {props.resname}：
          <b>{roundupfloat(props.res)}</b>
        </Typography>
      </Paper>
    </Box>
  )
}
export function SingleResDisplayBig(props) {
  const isrank = props.isrank
  return (
    <Box sx={{ p: 1 }}>
      <Paper variant='outlined' sx={{ p: 1 }}>
        <Box sx={{ p: 1 }}>
          <Typography variant="body" component="div" color='primary' textAlign='center'>
            {props.resname}：
            <b>{roundupfloat(props.res)}</b>
          </Typography>
        </Box>
        {isrank ? (
          <>
            <Divider />
            <Box sx={{ p: 1 }}>
              <Typography variant="body" component="div" color='primary' textAlign='center'>
                {props.resrankname}：
                <b>{props.resrank}</b>
              </Typography>
            </Box></>
        ) : (<></>)}
      </Paper>
    </Box>
  )
}


// CALCULATE 
export function group4electricitybill(elec_cons, carb_quota) {
  const currency_rate = [1, 1.5, 2]
  let elec_bill
  if (elec_cons >= 2 * carb_quota) {
    elec_bill = carb_quota * currency_rate[0] + carb_quota * currency_rate[1] + (elec_cons - 2 * carb_quota) * currency_rate[2]
  } else if (elec_cons < 2 * carb_quota && elec_cons > carb_quota) {
    elec_bill = carb_quota * currency_rate[0] + (elec_cons - carb_quota) * currency_rate[1]
  } else if (elec_cons <= carb_quota) {
    // woc csb not carb_quota!!!
    // elec_bill = carb_quota * currency_rate[0]
    elec_bill = elec_cons * currency_rate[0]

  }
  return elec_bill
}

export function getStage1answer(questions) {
  const stage1answer = questions.map((question, index) => {
    // console.log(question)
    // 选择范围 比如count = 1，那就只能选A，
    let optionscount = 1
    if (question['question_type'].includes('matrix')) {
      if (question['question_type'].includes('text')) {
        optionscount = question['options']['sub_question_description'].length
      } else {
        optionscount = question['options']['sub_options'].length
      }
    } else if (question['question_type'] === 'checkbox' || question['question_type'] === 'radio') {
      optionscount = Object.keys(question['options']).length
    }
    const answer = {
      questionid: question['question_id'],
      questiontype: question['question_type'],
      optionscount: optionscount,
      optionschoice: question['userres'],
    }
    return answer
  })
  return stage1answer
}

export function getStage2exp(tableinfo, tableres, userrank, randomrate, round) {

  const stage2exp = {
    roundid: round,
    state: true,
    userinput: {
      electricityused: tableinfo['elec_used'],
      transportratio: tableinfo['pub_trans_rate'],
      garbagedays: tableinfo['garb_days'],
    },
    roundresult: {
      electricityconsumption: tableres['elec_cons'],
      carboncredit: tableres['carb_cred'],
      roundvirtualcurrency: tableres['vir_curr'],
      endvirtualcurrency: tableres['elec_cons'],
      carbonquota: tableres['carb_quota'],
    },
    roundrate: {
      virtualcurrencyrate: randomrate['vir_curr_rate'],
      carboncreditexchangerate: randomrate['carb_cred_exchange_rate'],
      carbonquotarate: randomrate['carb_quota_rate'],
      carbonquotatraderate: randomrate['carb_quota_trade_rate'],
    },
    roundrank: {
      electricityconsumptionrank: userrank['elec_cons_rank'],
      carboncreditrank: userrank['carb_cred_rank'],
    }

  }

  return stage2exp
}