import { useState } from 'react';
import './App.css';

function App() {

  let currentVoca;
  let currentEngVoca;
  
  const [value, setValue] =useState(false);
  const [text, clearText] = useState('');
  const [vocalist, pushVoca] = useState([]);
  const [voca, changeVoca] = useState(undefined);
  const [engText, clearEngText] = useState('');
  const [engVocalist, pushEngVoca] = useState([]);
  const [engVoca, changeEngVoca] = useState(undefined);
  const [testVoca2, changeTest] = useState([]);
  const [inputs, setInputs] = useState({});
  const [matchInputs, setMatchInputs] = useState({});
  const [conclusion, setConclusion] = useState([]); 

  const startTest = () => {

    var testVoca = vocalist.slice();
    var testEngVoca = engVocalist.slice();
    var currentIndex = testVoca.length, randomIndex;
    
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [testVoca[currentIndex], testVoca[randomIndex]] = [
      testVoca[randomIndex], testVoca[currentIndex]];
      [testEngVoca[currentIndex], testEngVoca[randomIndex]] = [
      testEngVoca[randomIndex], testEngVoca[currentIndex]];
    }
    changeTest(testVoca);
    var testObj = {};
    for (let i = 0; i < testVoca.length; i += 1) {
      console.log(testVoca[i]);
      console.log(testEngVoca[i]);
      testObj = {
        ...testObj,
        [testVoca[i]]: testEngVoca[i],
      }
    }
    setInputs(testObj);
    setValue(true);
  }
  
  const onChange = (e) => {
    const { value, name } = e.target; // 우선 e.target 에서 name 과 value 를 추출
    setMatchInputs({
      ...matchInputs, // 기존의 input 객체를 복사한 뒤
      [name]: value // name 키를 가진 값을 value 로 설정
    });
    console.log(matchInputs);
  };
  
  const finishTest = () => {
    const inputsArr = Object.keys(inputs);
    const matchInputsArr = Object.keys(matchInputs);
    let conclusionAnswer;
    const groupConclusion = [];

    console.log(inputsArr.length);
    console.log(inputsArr);
    console.log(matchInputsArr);

    for (let i = 0; i < inputsArr.length; i += 1) {
      if ( inputs[inputsArr[i]] ===  matchInputs[matchInputsArr[i]] ) {
        conclusionAnswer = (i + 1) + '번 정답';
        groupConclusion.push(conclusionAnswer);
        console.log(groupConclusion);
      } else {
        conclusionAnswer = (i + 1) + '번 오답';
        groupConclusion.push(conclusionAnswer);
        console.log(groupConclusion);
      }
    }
    console.log(groupConclusion);
    setConclusion(groupConclusion);
    setValue(false);
  }

  return (
    <div id="container">
      <div id="logo">voca test</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          currentVoca = vocalist;
          currentVoca.push(voca);
          pushVoca(currentVoca);
          currentEngVoca = engVocalist;
          currentEngVoca.push(engVoca);
          pushEngVoca(currentEngVoca);
          clearText('');
          clearEngText('');
        }}
      >
        <div className="voca-input">
          <div>한글 :</div>
          <input
            className="input-style"
            value={text}
            onChange={(e) => {
              changeVoca(e.target.value);
              clearText(e.target.value);
            }}
          />
        </div>
        <div className="voca-input">
          <div>영어 :</div>
          <input
            className="input-style"
            value={engText}
            onChange={(e) => {
              changeEngVoca(e.target.value);
              clearEngText(e.target.value);
            }}
          />
        </div>
        <button
          type='submit'
          id='Jbutton'
        >
          저장
        </button>
      </form>
      <div id="vocabulary">
        <div id="vocabulary-intro">
            <div className='row-vocalist'>
                <div className="voca-element">번호</div>
                <div className="voca-element">한글</div>
                <div className="voca-element">영어</div>
              </div>
              <hr className="driver" />
        </div>
        {
          !value ?
          vocalist.map((data, i) => (
            <div>
              <div className='row-vocalist'>
                <div className="voca-element">{i + 1}</div>
                <div className="voca-element" key={i}>{data}</div>
                <div className="voca-element" key={i + 'en'}>{engVocalist[i]}</div>
              </div>
              <hr className="driver" />
            </div>
          ))
            :
          <div></div>
        }
      </div>
      <button
        className="test-button"
        onClick={startTest}
      >
        테스트 시작
      </button>
      <div>
        {
          !value ?
          <div>
            <div>{conclusion}</div>
          </div> 
            :
          <div id="test-container">
            {
              testVoca2.map((data, i) => (
                <div>
                  <div className='row-vocalist'>
                    <div className="voca-element">{i + 1}.</div>
                    <div className="voca-element" key={i}>{data}</div>
                    <input className="voca-element" class="test-inputs" name={data} onChange={onChange}/>
                  </div>
                    <hr className="driver" />
                </div>
              ))
            }
            <button className="test-button" onClick= {finishTest}>시험종료</button>
          </div>
        }
      </div>
    </div>
  );
}

export default App;
