import * as React from 'react';
import SingleQuestion from './singlequestion'
import { saveData, getStage1answer } from '../utils/tool'
import {
    postSubmitResult
} from '../utils/api';
export default function Page1(props) {

    const starttime = props.starttime
    const questions = props.questions;
    const userid = props.userid
    const groupid = props.groupid
    const question_length = questions.length
    const [pagenum, setPagenum] = React.useState(0);
    const [badpages, setBadpages] = React.useState(0);
    // ques : res
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
        const stage1answer = getStage1answer(userdata)
        const data = {
            question: userdata,
            answer: userques,
            savestage1answer: stage1answer,
        }
        saveData("stage1", data)
        // change stage
        props.changestage({
            "stage": 2,
            "phrase": 0,
        })
    }

    const change_page_number = (x) => {
        let nextPage = x;
        let newBadPages = badpages;

        // 检查依赖关系
        const checkDependency = (question) => {
            if (!question.has_dependency) return true; // 没有依赖关系，直接显示

            const { dependent_question_id, dependent_option } = question.dependency;

            // 检查依赖的题目是否已回答，并且答案是否匹配
            if (dependent_question_id in userques) {
                return userques[dependent_question_id] === dependent_option;
            }

            return false; // 依赖的题目未回答，不显示当前题目
        };

        // 查找下一个满足条件的题目
        while (nextPage < question_length) {
            const currentQuestion = questions[nextPage];

            if (checkDependency(currentQuestion)) {
                break; // 找到满足条件的题目
            }

            // 不满足条件，跳过该题
            nextPage++;
            newBadPages++;
        }

        // 更新状态
        setBadpages(newBadPages);

        if (nextPage >= question_length) {
            // 超出题目范围，结束当前阶段
            change_stage();
        } else {
            // 更新当前页码
            setPagenum(nextPage);
        }
    };


    const choosen_data = (info) => {

        // "question_id":"res"
        // userques={}
        // [{},{}...]
        // userdata=[{}]


        // question + res
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

        // only res
        let ques = { ...userques }
        ques[info.question_id] = info.userres
        // console.log('DEBUG:', ques)
        setUserques(ques)

    }

    const ques_info = questions[pagenum]
    let userinput = null
    if (ques_info.question_id in userques) {
        userinput = userques[ques_info.question_id]
    }


    const [unloadstatus, setUnloadstatus] = React.useState(false)
    // stage1 close:
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
        // send stage1
        const postsubmit = async () => {
            // console.log("DEBUG:", userdata)

            const endtime = new Date()
            const stage1data = getStage1answer(userdata)

            const data = {
                userid: userid,
                groupid: groupid,
                starttime: starttime,
                finishtime: endtime.toISOString(),
                progress: 'onstage1',
                answer: {
                    stage1: stage1data,
                    stage2: [],
                }
            }
            const res = await postSubmitResult(data)
            console.log(res)
        }
        postsubmit().then((res) => {
            console.log(res)
        })
    }, [unloadstatus])



    return (
        <SingleQuestion userinput={userinput} key={pagenum} questionslength={question_length} allpagenum={question_length - badpages} changepage={change_page_number} choosedata={choosen_data} pagenum={pagenum} questioninfo={ques_info} changestage={change_stage}></SingleQuestion>
    );
}

