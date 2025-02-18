import * as React from 'react';
import test_data from '../test_json/stage1_test.json'

import NoticePage from './notice';
import ErrorPage from './error';
import Page1 from './page1';
import Page2 from './page2';

export default function PageControler() {

    let questions = test_data;
    const question_length = questions.length

    // stage 1 2
    // phrase: 0 notice, 1 question
    const [controler, setControler] = React.useState({
        "stage": 1,
        "phrase": 0,
    });


    // no such situation
    // const change_stage = (x) => {
    //     let tmpc = controler
    //     // x = 2
    //     tmpc['stage'] = x
    //     setControler(tmpc)
    // }
    const change_phrase = (x) => {

        // // this is refer
        // let tmpc = controler 
        // // x = 1 0
        // tmpc["phrase"] = x
        // setControler(tmpc)

        setControler({...controler,phrase:x})

    }
    const change_controler = (x) => {
        setControler(x)
    }


    console.log(controler)
    let page
    if (controler["phrase"] === 0) {
        page = <NoticePage changephrase={change_phrase} stage={controler["stage"]} />

    } else if (controler["phrase"] === 1) {
        
        if (controler["stage"] === 1) {
            page = <Page1 changestage={change_controler} />
        } else if (controler["stage"] === 2) {
            page = <Page2 />
        } else {
            page = <ErrorPage />
        }
    }
    else {
        page = <ErrorPage />
    }

    // don't return object: {page}
    // return (

    //     { page }
    // );
    return (page)
}

