import * as React from 'react';

import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';
import RadioGroup from '@mui/material/RadioGroup';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Divider from '@mui/material/Divider';

import Button from '@mui/material/Button';
import { QuestionTypes } from '../utils/alllongtext';

import ErrorPage from './error';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';


export default function SingleQuestion(props) {
  // props = param
  // props.size ......

  const question_info = props.questioninfo
  const question_options = question_info.options
  const question_type = question_info.question_type

  const page_num = props.pagenum
  const all_page_num = props.allpagenum

  // res that user choose or input before
  // const user_input = props.userinput

  const handleChangePage = (x) => {
    props.changepage(x)
  }



  let content;
  // multi-type state
  const [userres, setUserres] = React.useState([])

  const change_son_res = (x) => {
    setUserres(x)
  }

  if (question_type === QuestionTypes[0]) {
    content = <RadioQuestion uploadres={change_son_res} questionid={question_info.question_id} questionoptions={question_options} question_description={question_info.question_description} />
  } else if (question_type === QuestionTypes[1]) {
    content = <CheckboxQuestion uploadres={change_son_res} questionid={question_info.question_id} questionoptions={question_options} question_description={question_info.question_description} />
  } else if (question_type === QuestionTypes[2]) {
    content = <BlankQuestion uploadres={change_son_res} questionid={question_info.question_id} question_description={question_info.question_description} />
  } else if (question_type === QuestionTypes[3]) {
    content = <MatrixRadioQuestion uploadres={change_son_res} questionid={question_info.question_id} questionoptions={question_options} question_description={question_info.question_description} />
  } else if (question_type === QuestionTypes[4]) {
    content = <MatrixTextQuestion uploadres={change_son_res} questionid={question_info.question_id} questionoptions={question_options} question_description={question_info.question_description} />
  }



  const handleSubmit = (event) => {
    event.preventDefault()

    let info = question_info
    info["userres"] = userres

    props.choosedata(info)
    handleChangePage(page_num + 1)
  }

  // last question
  const handleSubmitandchange = (event) => {
    event.preventDefault()

    let info = question_info

    info["userres"] = userres

    props.choosedata(info)
    props.changestage()
  }

  // todo
  const cansubmit = canGoNextQuestion(question_type, question_type === QuestionTypes[3] || question_type === QuestionTypes[4] ? question_options['sub_question_description'].length : question_options.length, userres)

  return (
    <>
      {
        page_num > all_page_num ? <ErrorPage reason={"page_num > all_page_num"} /> : (
          <Paper elevation={0}>
            {/* {question_info.question_description} */}

            <Grid container direction={'column'} sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: 400 }}>

              <Grid>
                <form sx={{ maxWidth: '70%' }} onSubmit={page_num === all_page_num - 1 ? handleSubmitandchange : handleSubmit}>

                  <Paper elevation={0} sx={{ p: 3 }}>
                    {content}
                  </Paper>
                  <Paper elevation={0} sx={{ p: 3 }}>

                    <Button variant="contained" type="submit" disabled={false}>Submit</Button>
                  </Paper>

                </form>
              </Grid>
              <Grid sx={{ width: '100%' }}>
                <Divider variant='middle' orientation="middle" flexItem>{page_num + 1}</Divider>

                <Paper elevation={0} sx={{ p: 3 }}>
                  {/* <Button disabled={page_num === 0 ? true : false} onClick={() => handleChangePage(page_num - 1)}>Previous Page</Button> */}
                  <Button disabled={true} onClick={() => handleChangePage(page_num - 1)}>Previous Page</Button>

                  {/* only turn pages after submit */}
                  {/* <Button disabled={page_num === all_page_num - 1 ? true : false} onClick={() => handleChangePage(page_num + 1)}>Next Page</Button> */}
                </Paper>
              </Grid>

            </Grid>

          </Paper>

        )
      }

    </>
  );
}

function RadioQuestion(props) {
  // props: question_options,question_description
  let options_keys = Object.keys(props.questionoptions)
  const handleChange = (event) => {
    // setUserinput(event.target.value)
    props.uploadres(event.target.value)
  }
  // const [userinput, setUserinput] = React.useState(props.userinput)

  // console.log(props.userinput)
  return (
    <Paper elevation={0} sx={{ height: '100%', p: 5 }}>
      <FormControl>

        <Grid container direction='column' sx={{ justifyContent: 'center' }} spacing={1.5}>
          <Grid>
            <FormLabel id="row-radio-buttons-group-label" >
              {getQuestionId(props.questionid)}
            </FormLabel>
          </Grid>

          <Grid>
            <Typography variant='h6'>
              {props.question_description}
            </Typography>
          </Grid>

          <Grid container direction='row' sx={{ justifyContent: 'center' }} size={'auto'}>
            <RadioGroup
              // value={userinput}
              row
              aria-labelledby="label-changed-diy"
              name="row-radio-buttons-group"
              onChange={handleChange}
            >
              {options_keys.map((key, index) => {
                return (
                  <Grid>
                    <FormControlLabel value={key} control={<Radio />} label={props.questionoptions[key]} key={key} />
                  </Grid>
                )
              })}
              {/* <FormControlLabel value="test" control={<Radio />} label="test" /> */}
            </RadioGroup>
          </Grid>

        </Grid>

      </FormControl>
    </Paper>
  );

}

function CheckboxQuestion(props) {
  // props: questionoptions,question_description
  let options_keys = Object.keys(props.questionoptions)

  const [selectedValues, setSelectedValues] = React.useState([]);
  const handleChange = (event) => {
    const value = event.target.value;

    let selectedvalues_b
    const isChecked = event.target.checked;

    // uodate
    if (isChecked) {
      // add
      selectedvalues_b = ([...selectedValues, value]);
    } else {
      // del
      selectedvalues_b = (selectedValues.filter((item) => item !== value));
    }

    selectedvalues_b.sort()

    setSelectedValues(selectedvalues_b)
  };
  // when selectedValues change, call this fun 
  React.useEffect(() => {
    props.uploadres(selectedValues)
  }, [selectedValues])

  // const handleChange = (event)=>{
  //   props.uploadres(event.target.value)
  // }

  return (
    <Paper elevation={0} sx={{ height: '100%', p: 5 }}>

      <Grid container direction='column' sx={{ justifyContent: 'center' }} spacing={1.5}>
        <Grid>
          <FormLabel id="row-radio-buttons-group-label" >
            {getQuestionId(props.questionid)}
          </FormLabel>
        </Grid>

        <Grid>
          <Typography variant='h6'>
            {props.question_description}
          </Typography>
        </Grid>

        <Grid container direction='row' sx={{ justifyContent: 'center' }} size={'auto'}>
          <FormGroup
            row
            aria-labelledby="label-changed-diy"
            name="row-radio-buttons-group"
            onChange={handleChange}
          >
            {options_keys.map((key, index) => {
              return (
                <Grid>
                  <FormControlLabel value={key} control={<Checkbox
                    key={key}
                    onChange={handleChange}
                    checked={selectedValues.includes(key)}
                  />}
                    label={props.questionoptions[key]} key={index} />
                </Grid>
              )
            })}
            {/* <FormControlLabel value="test" control={<Radio />} label="test" /> */}
          </FormGroup>
        </Grid>

      </Grid>
    </Paper >
  );

}

function BlankQuestion(props) {
  const handleChange = (event) => {
    props.uploadres([event.target.value])
  }

  return (
    <Paper elevation={0} sx={{ height: '100%', p: 5 }}>


      <Grid container direction='column' sx={{ justifyContent: 'center' }} spacing={1.5}>
        <Grid>
          <FormLabel id="row-radio-buttons-group-label" >
            {getQuestionId(props.questionid)}
          </FormLabel>
        </Grid>

        <Grid>
          <Typography variant='h6'>
            {props.question_description}
          </Typography>
        </Grid>

        <TextField onChange={handleChange} id="filled-basic" label={props.question_description} variant="filled" />
      </Grid>
    </Paper>
  );

}

function MatrixRadioQuestion(props) {
  // props: questionoptions,question_description
  const { sub_question_description, sub_options } = props.questionoptions

  const [selectedValues, setSelectedValues] = React.useState(new Array(sub_question_description.length).fill(-1));
  const handleChange = (event, id) => {
    let tmp = [...selectedValues]
    tmp[id] = event.target.value
    setSelectedValues(tmp)
  }
  React.useEffect(() => {
    props.uploadres(selectedValues)
  }, [selectedValues])

  const singlerowlength = parseInt(8 / (sub_options.length + 1))
  return (
    <Paper elevation={0} sx={{ height: '100%', p: 5 }}>
      <FormControl>

        <Grid container direction='column' sx={{ justifyContent: 'center' }} spacing={2}>
          <Grid size={12}>
            <FormLabel id="row-radio-buttons-group-label">
              {getQuestionId(props.questionid)}
            </FormLabel>
          </Grid>

          <Grid size={12} >
            <Box paddingBottom={2}>
              <Typography variant='h6' >
                {props.question_description}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid container direction='row' sx={{ justifyContent: 'center', width: '100%' }} size={12} spacing={2}>
          <Grid container direction='row' sx={{ justifyContent: 'center', alignItems: 'center' }} spacing={2} size={12}>
            <Grid size={4}></Grid>
            {/* <Grid size={8} spacing={1} container sx={{ justifyContent: 'center' }} direction='row' > */}
            {
              sub_options.map((opkey, opindex) => (
                <Grid size={singlerowlength}>
                  <Typography variant='caption'>
                    {opkey}
                  </Typography>
                </Grid>))
            }
            {/* </Grid> */}
          </Grid>

          {
            sub_question_description.map((key, index) => (
              // todo :center?
              <Grid size={12} container sx={{ justifyContent: 'center' }} direction='column' >
                <RadioGroup
                  // value={userinput}
                  row
                  id="label-changed-diy"
                  name="row-radio-buttons-group"
                  onChange={(e) => handleChange(e, index)}
                  key={`matrixradio-${props.questionid}-${key}`}
                >
                  <Grid container direction='row' sx={{ justifyContent: 'center', alignItems: 'center' }} spacing={2} size={12}>
                    <Grid size={4}>
                      <FormLabel key={`matrixradio-${props.questionid}-${key}`} >
                        {key}
                      </FormLabel>
                    </Grid>
                    {
                      sub_options.map((opkey, opindex) => (
                        <Grid size={singlerowlength} sx={{ justifyContent: 'center' }} container >
                          {/* <FormControlLabel value={opindex} control={<Radio />} label={opkey} key={`matrixradio-${props.questionid}-${key}-${opindex}`}  /> */}
                          {/* <FormControlLabel value={opindex} control={<Radio />} key={`matrixradio-${props.questionid}-${key}-${opindex}`} className={'matrix-radio-question-no-margin'}/> */}
                          <FormControlLabel value={opindex} control={<Radio />} key={`matrixradio-${props.questionid}-${key}-${opindex}`} sx={{ marginRight: 0, marginLeft: 0 }} />

                        </Grid>))
                    }
                  </Grid>
                </RadioGroup>
              </Grid>
            )
            )
          }


        </Grid>

      </FormControl>
    </Paper>
  );

}

function MatrixTextQuestion(props) {
  // props: questionoptions,question_description
  const sub_question_description = props.questionoptions['sub_question_description']

  const [selectedValues, setSelectedValues] = React.useState(new Array(sub_question_description.length).fill(-1));
  const handleChange = (event, id) => {
    let tmp = [...selectedValues]
    tmp[id] = event.target.value
    setSelectedValues(tmp)
  }
  React.useEffect(() => {
    props.uploadres(selectedValues)
  }, [selectedValues])
  console.log(selectedValues)

  return (
    <Paper elevation={0} sx={{ height: '100%', p: 5 }}>
      <FormControl>
        <Grid container direction='column' sx={{ justifyContent: 'center', width: '100%' }} spacing={2}>
          <Grid>
            <FormLabel id="row-radio-buttons-group-label" >
              {getQuestionId(props.questionid)}
            </FormLabel>
          </Grid>

          <Grid>
            <Typography variant='h6'>
              {props.question_description}
            </Typography>
          </Grid>

          <Grid container direction='column' sx={{ justifyContent: 'center' }} size={12} spacing={2}>
            {sub_question_description.map((key, index) =>
            (
              <Grid container sx={{ justifyContent: 'center', alignItems: 'center' }} direction='row' size={12}>
                <Grid size={7}>
                  <FormLabel id="row-radio-buttons-group-label" >
                    {key}
                  </FormLabel>
                </Grid>
                <Grid size={5}>
                  <TextField onChange={(e) => handleChange(e, index)} id="filled-basic-changed-input" variant="filled" key={`matrixtext-${props.questionid}-${key}`} />
                </Grid>
              </Grid>
            )
            )}
          </Grid>
        </Grid>
      </FormControl>
    </Paper>
  );

}

function getQuestionId(x) {
  return "第" + x + "题:"
}

function canGoNextQuestion(question_type, question_options_len, res) {
  let can = false
  if (question_type === QuestionTypes[0] || question_type === QuestionTypes[1] || question_type === QuestionTypes[2]) {
    if (res.length !== 0) {
      let notnull = true
      for (const sr in res) {
        if (sr === undefined) {
          notnull = false
          break
        }
      }
      if (notnull) {
        can = true
      }
    }

  } else if (question_type === QuestionTypes[3] || question_type === QuestionTypes[4]) {
    if (res.length === question_options_len) {
      let notnull = true
      for (const sr in res) {
        if (sr === undefined) {
          notnull = false
          break
        }
      }
      if (notnull) {
        can = true
      }
    }
  }
  return can
}