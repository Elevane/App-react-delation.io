
import React, { useEffect, useState } from 'react';
import './App.css';
import { savePDF } from '@progress/kendo-react-pdf';
import { renderToStaticMarkup } from "react-dom/server"
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


function App() {
  
  const [delationList, setDelationList] = useState([]);
  const [name, setName] = useState("");
  const [action, setAction] = useState("");
  const [pdfData, setPdfData] = useState(null);


  useEffect(()=> {
      fetch("https://localhost:7158/api/delations")
      .then((response) => response.json())
      .then(
        (delations) => {
          if(Object.keys(delations).length > 0)
            setDelationList(delations)
        }
      )
  }, []);

  useEffect(() => {
    setPdfData(document.getElementById('delationbs'));
  }, [delationList])

  const exportPDFWithMethod = () => {
    if(delationList.length > 0){
      savePDF(pdfData, {
        paperSize: "auto",
        margin: 40,
        fileName: `Report for ${new Date().getDate()}`,
      });
    }
    else{
      alert("aucune delation a reporter")
    }
     
   
  };



  let itemList= delationList.map((item,index)=>{
    return <li key={index} id={item.id}>
              <p className='nom'>{item.name}</p><p>.</p>
              <p className='action'>{item.action}</p><p>.</p>
              <p className='date'>{new Date(item.date).getUTCDate() +"/"+ new Date(item.date).getUTCMonth()+"/"+new Date(item.date).getUTCFullYear()}</p><p>.</p>
              <p className='action'>{new Date(item.date).toLocaleString("fr", { hour: '2-digit', minute:'2-digit'}) +":"+ new Date(item.date).getUTCMinutes()}</p>
              {/*<p className='del_but' onClick={(e) => delDel(e.target.parentNode.id)}>X</p>*/}

  </li>
  })

  const delDel = (id) => {
    fetch(process.env.REACT_APP_API_URL+ "/"+ id  , {
     method: "DELETE",
     headers: {
       "Content-Type": "application/json",
       "Access-Control-Allow-Origin": "*",
       Accept: "*/*",
     }
      
   })
    const newDel = delationList.filter(x => parseInt(x.id) !== parseInt(id));
    setDelationList(newDel);
  }

  const sendDelation = (del) => {
      fetch(process.env.REACT_APP_API_URL  , {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Accept: "*/*",
      },
      body: JSON.stringify(del),
    })
    .then((data) => data.json());
  }
  
  const declare = () => {
    if(action === null || name === null || action === undefined || name === undefined)
      alert("un des chamsp est null")
    let delation = {
      "name" : name,
      "action" : action,
      "date" : new Date()
    };
    sendDelation(delation)
    const newList = [...delationList, delation];
    setDelationList(newList);
    clearFields();
  };
  const exportDel = () => {

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
                          <button onClick={() => declare()}className="add btn btn-primary font-weight-bold todo-list-add-btn">Déclarer</button> 
                          <button onClick={() => exportPDFWithMethod()} className="add btn btn-warning font-weight-bold todo-list-add-btn">Export</button> 
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
