
import React, { useEffect, useState } from 'react';
import './App.css';
import { savePDF } from '@progress/kendo-react-pdf';

function App() {
  
  const [delationList, setDelationList] = useState([]);
  const [name, setName] = useState("");
  const [action, setAction] = useState("");
  const [pdfData, setPdfData] = useState(null);
  const [activeButton, setActiveButton] = useState("disabled");
  const [acttiveExport, setActiveExport] = useState("disabled");
  useEffect(() => {
    if(action != null && name != null && action != undefined && name != undefined && action != "" && name  != "")
    {
      setActiveButton(" ")
    }
  }, [name, action])

useEffect(() => {
  setPdfData(document.getElementById("delationbs"))
}, [delationList])

  useEffect(()=> {
      fetch(process.env.REACT_APP_API_URL)
      .then((response) => response.json())
      .then(
        (delations) => {
          if(Object.keys(delations.delations).length > 0){
            setDelationList(delations.delations)
          }
          
        if(Object.keys(delations.delations).length == 0){
          setActiveExport("disabled")
          
        }
        else{
          setActiveExport(" ")
        }
      }
      )    
  }, []);



  const exportPDFWithMethod = () => {
    
    if(delationList.length > 0 && acttiveExport === " "){
      savePDF(pdfData, {
        paperSize: "auto",
        margin: 40,
        fileName: `Report for ${new Date().getDate()}`,
      });
    }
    
  };

  let itemList= delationList.map((item,index)=>{
    return <li key={index} id={item.id}>
              <p className='nom'>{item.name}</p><p>.</p>
              <p className='action'>{item.actionname}</p><p>.</p>
              <p className='date'>{new Date(item.date_delation).getUTCDate() +"/"+ new Date(item.date_delation).getUTCMonth()+"/"+new Date(item.date_delation).getUTCFullYear()}</p><p>.</p>
  </li>
  })



  const getIdHash = () => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 25; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
    charactersLength));
   }
   return result;
  }


  const sendDelation = (del) => {
    
        fetch(process.env.REACT_APP_API_URL,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Accept: "*/*",
        },
        body: JSON.stringify(del),
      })
      .then((data) => data.json()).then(()=> {
        
      });
    
  }
  
  const declare = () => {
    if( activeButton === " "){
      let toCreate = {
        "id" : getIdHash(),
        "name" : name,
        "actionname" : action,
        "date_delation" : new Date()
      };
      setActiveButton("disabled")
      sendDelation(toCreate)
      const newList = [...delationList, toCreate];
      setDelationList(newList);
      clearFields();
    }  
  };
  const refresh = () => {
    setActiveButton("disabled")
    setActiveExport("disabled")
    fetch(process.env.REACT_APP_API_URL)
    .then((response) => response.json())
    .then(
      (delations) => {
        if(Object.keys(delations.delations).length > 0){
          setDelationList(delations.delations)
          console.log(delations.delations)
        }
        
      if(Object.keys(delations.delations).length == 0){
        setActiveExport("disabled")
        
      }
      else{
        setActiveExport(" ")
      }
    }
    )    
    
  }
  const clearFields = () => {
    setAction("");
    setName("");
  };

  return (
    <section className='section'>
      <h1>Délation.io</h1>
      <h4>Déclares toutes les actions de tes collègues et gagne un capital sympathie auprès de ton chef.</h4>
      <div className="page-content page-container" id="page-content">
        <div className="padding">
            <div className="row container d-flex justify-content-center">
                <div className="col-md-12">
                    <div className="card px-3">
                        <div className="card-body">
                            <div className="add-items d-flex">
                              <input type='text' onChange={(e) => setName(e.target.value)}className="form-control todo-list-input name" value={name} placeholder="Qui c'est encore ?"/> 
                              <input type="text" value={action} onChange={(e) => setAction(e.target.value)} className="form-control todo-list-input" placeholder="Qu'a t-il.elle encore fait ?"/> 
                              <button onClick={() => {if(activeButton !== "disabled") declare()}}className={"add btn btn-primary font-weight-bold todo-list-add-btn "+ activeButton}>Déclarer</button> 
                              <button onClick={() => exportPDFWithMethod()} className={"add btn btn-warning font-weight-bold todo-list-add-btn "+ acttiveExport} >Export</button> 
                              <button onClick={() => refresh()} className={"add btn btn-primary font-weight-bold todo-list-add-btn "} ><i className='bi bi-arrow-clockwise refresh'></i></button> 
                            </div>
                            <div className="list-wrapper">
                                <ul id="delationbs" className=" delationbs d-flex flex-column-reverse todo-list">
                                    {itemList !== null ? itemList : ""}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}

export default App;
