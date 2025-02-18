import * as React from 'react';
import test_data from '../test_json/stage1_test.json'
import SingleQuestion from './single_question'
import { saveData } from './savetool'

export default function Page1(props) {

    let questions = test_data;
    const question_length = questions.length
    const [pagenum, setPagenum] = React.useState(0);
    const [badpages, setBadpages] = React.useState(0);

    const [userques, setUserques] = React.useState({});
    const [userdata, setUserdata] = React.useState([]);

    const change_stage = () => {

        // save data
        // answer = {id :ans}
        // quetion = detail information
        // const data = {
        //     "answer":userques,
        //     "question":userdata
        // }
        const data = {
            answer: userques,
            question: userdata,
        }
        saveData("stage1", data)

        // change stage
        props.changestage({
            "stage": 2,
            "phrase": 0,
        })
    }


    const change_page_number = (x) => {
        const xp = x

        let badpagesb = badpages
        while (true) {
            if (x >= question_length){
                // console.log(x)
                break
            }

            // console.log(x)
            // console.log(questions[x])

            if ("has_dependency" in questions[x]) {

                if (questions[x]["has_dependency"]) {

                    // question_num, question_option
                    let dependency = [questions[x]["dependency"]["dependent_question_id"], questions[x]["dependency"]["dependent_option"]]


                    if (dependency[0] in userques) {

                        // todo: if multi options?
                        if (dependency[1] !== userques[dependency[0]]) {

                            // choosen but not right
                            x = x + 1
                            badpagesb=badpagesb+1
                            continue
                        }

                        break

                    } else {
                        // not yet or havn"t choosen


                        // 0 - (question_length - 1)
                        x = x + 1
                        badpagesb=badpagesb+1

                        continue
                    }



                }
                // no has_dependency 

                break
            }
            // no has_dependency 
            break
        }


        setBadpages(badpagesb)

        if (x >= question_length){
            setPagenum(xp)
            change_stage()
        }else{
            setPagenum(x)
        }

    }
    const choosen_data = (info) => {

        // "question_id":"res"
        // userques={}
        // [{},{}...]
        // userdata=[{}]


        let data = [...userdata]

        if (info.question_id in userques) {
            const target_object = data.find((item) => item.question_id === info.question_id)
            if (target_object) {
                target_object.res = info.res;
            }
        } else {
            data.push(info)
        }
        setUserdata(data)

        let ques = {...userques}
        ques[info.question_id] = info.res
        setUserques(ques)

    }



    return (
        <>
            <SingleQuestion key={pagenum} allpagenum={question_length - badpages} changepage={change_page_number} choosedata={choosen_data} pagenum={pagenum} questioninfo={questions[pagenum]} changestage={change_stage}></SingleQuestion>
        </>

    );
}

