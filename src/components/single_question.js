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
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

import Button from '@mui/material/Button';


import ErrorPage from './error';


export default function SingleQuestion(props) {
  // props = param
  // props.size ......

  let question_types = ["radio", "checkbox", "blank"]
  let question_info = props.questioninfo
  let question_options = question_info.options
  let question_type = question_info.question_type

  let page_num = props.pagenum
  let all_page_num = props.allpagenum

  const handleChangePage = (x) => {
    props.changepage(x)
  }



  let content;
  // multi-type state
  const [res, setRes] = React.useState([])

  const change_son_res = (x) => {
    setRes(x)
  }

  if (question_type === question_types[0]) {
    content = <RadioQuestion upload_res={change_son_res} question_id={question_info.question_id} question_options={question_options} question_description={question_info.question_description} />
  } else if (question_type === question_types[1]) {
    content = <CheckboxQuestion upload_res={change_son_res} question_id={question_info.question_id} question_options={question_options} question_description={question_info.question_description} />
  } else if (question_type === question_types[2]) {
    content = <BlankQuestion upload_res={change_son_res} question_id={question_info.question_id} question_description={question_info.question_description} />
  }



  const handleSubmit = (event) => {
    event.preventDefault()

    let info = question_info

    info["res"] = res

    props.choosedata(info)

    // turn page
    handleChangePage(page_num+1)

    // alert(res)
    
  }

  // last question
  const handleSubmitandchange = (event) => {
    event.preventDefault()

    let info = question_info

    info["res"] = res

    props.choosedata(info)

    // turn page
    // alert(res)
    props.changestage()

  }
  
  // console.log(page_num)
  // console.log(all_page_num)
  

  return (
    <>
    {
      page_num >=all_page_num? <ErrorPage/>:(<Paper elevation={2} variant="outlined">
      {/* {question_info.question_description} */}
      <form onSubmit={page_num === all_page_num - 1 ?handleSubmitandchange:handleSubmit}>
        {content}
        <Button variant="contained" type="submit">Submit</Button>
      </form>
      <Divider orientation="middle" flexItem>{page_num + 1}</Divider>

      <Button disabled={page_num === 0 ? true : false} onClick={() => handleChangePage(page_num - 1)}>Previous Page</Button>
      {/* only turn pages after submit */}
      {/* <Button disabled={page_num === all_page_num - 1 ? true : false} onClick={() => handleChangePage(page_num + 1)}>Next Page</Button> */}

    </Paper>)
    }
      
    </>
  );
}

function RadioQuestion(props) {
  // props: question_options,question_description
  let options_keys = Object.keys(props.question_options)
  const handleChange = (event) => {
    props.upload_res(event.target.value)
  }

  return (
    <Box >
      <FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label">
        {QuestionId(props.question_id)}{props.question_description}

        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          onChange={handleChange}
        >

          {options_keys.map((key, index) => {
            return (
              <FormControlLabel value={key} control={<Radio />} label={props.question_options[key]} key={index} />
            )
          })}

          {/* <FormControlLabel value="test" control={<Radio />} label="test" /> */}

        </RadioGroup>
      </FormControl>
    </Box>
  );

}

function CheckboxQuestion(props) {
  // props: question_options,question_description
  let options_keys = Object.keys(props.question_options)

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
    props.upload_res(selectedValues)}, [selectedValues]);



  // const handleChange = (event)=>{
  //   props.upload_res(event.target.value)
  // }

  return (
    <Box >
      <FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label">
        {QuestionId(props.question_id)}{props.question_description}

        </FormLabel>
        <FormGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
        >

          {options_keys.map((key, index) => {
            return (
              <FormControlLabel value={key} control={<Checkbox
                value={key} 
                onChange={handleChange} 
                checked={selectedValues.includes(key)} 
              />} 
              label={props.question_options[key]} key={index} />
            )
          })}

          {/* <FormControlLabel value="test" control={<Checkbox />} label="test" /> */}

        </FormGroup>
      </FormControl>
    </Box>
  );

}

function BlankQuestion(props) {
  const handleChange = (event) => {
    props.upload_res(event.target.value)
  }

  return (
    <Box>
      <FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label">
          {QuestionId(props.question_id)}{props.question_description}
        </FormLabel>
        <TextField onChange={handleChange} id="filled-basic" label={props.question_description} variant="filled" />
      </FormControl>
    </Box>
  );

}

function QuestionId(x){
  return "第"+x+"题："
}
  