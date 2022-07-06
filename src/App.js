
import React, { useEffect, useState } from 'react';
import './App.css';
import { savePDF } from '@progress/kendo-react-pdf';
import moment from 'moment-timezone';
import 'moment/locale/fr';
import jwt_decode from "jwt-decode";
import { Avatar, List, ListItem, ListItemAvatar, ImageIcon, ListItemText,Divider, Typography } from '@mui/material';



 const rank = (number) => {
    switch(number){
      case number < 20:
        return {"value":"lache", "color" : "red"};
    } 
 }


function App() {
  moment.locale('fr');


  const [delationList, setDelationList] = useState([]);
  const [name, setName] = useState("");
  const [action, setAction] = useState("");
  const [pdfData, setPdfData] = useState(null);
  const [activeButton, setActiveButton] = useState("disabled");
  const [acttiveExport, setActiveExport] = useState("disabled");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("delation_user")))
  const [userList, setUserList] = useState(null)

  useEffect(()=> {
    fetch(process.env.REACT_APP_API_URL)
    .then((response) => response.json())
    .then(
      (delations) => {
        if(Object.keys(delations.delations).length > 0){
          setDelationList(delations.delations)
          setActiveExport(" ")
        } 
      else{
        setActiveExport("disabled")
      }
    }
    )   
    fetch(process.env.REACT_APP_API_URL+ "/account")
      .then((response) => response.json())
      .then(
        (users) => {
          console.log(users)
          if(Object.keys(users.users).length > 0){
            setUserList(users.users)
          } 
      }
      )   
    

    window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: hrandleCallback
    });
    window.google.accounts.id.renderButton(
        document.getElementById("signInButton"), {theme: "outline", size: "large"}
    )
  }, [])
  useEffect(() => {
    if(action !== null && name !== null && action !== undefined && name !== undefined && action !== "" && name  !== "")
    {
      setActiveButton(" ")
    }
  }, [name, action])

useEffect(() => {
  
  fetch(process.env.REACT_APP_API_URL+"/account", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Accept: "*/*",
    },
    body: JSON.stringify({
      "email": user?.email,
      "name" : user?.name,
      "picture" : user?.picture,
      "aud" : user?.aud
    }),
  })

}, [user])
useEffect(() => {refreshUser();}, [delationList])

useEffect(() => {
  setPdfData(document.getElementById("delationbs"))
}, [delationList])

const logout = () =>{
  localStorage.removeItem("delation_user")
  window.location.href = "/"
}

const hrandleCallback = (response)  => {
  var userGoogle = jwt_decode(response.credential)
  setUser(userGoogle)
  localStorage.setItem("delation_user", JSON.stringify(userGoogle))
}



  const exportPDFWithMethod = () => {
    
    if(delationList.length > 0 && acttiveExport === " "){
      savePDF(pdfData, {
        creator: localStorage.getItem("delation_user"),
        paperSize: "auto",
        margin: 40,
        fileName: `Report for ${moment.tz(new Date(), "Europe/berlin")}`,
      });
    }
    
  };

  let itemList = delationList.map((item,index)=>{
    const isUser = user && user !== null && user?.email === item.author;
    return <li key={index} id={item.id} className="k-pdf-export">
              <p className='nom'>{item.name}</p><p>.</p>
              <p className='action'>{item.actionname}</p><p>.</p>
              <p className='date'>{moment.tz(item.date_delation, "Europe/Paris").locale("fr").format("LLL")}</p><p>.</p>
              <p>{ isUser ? <i className=" bi bi-person creator"></i> : ""}</p>
    </li>
  })

  let mappedUserList = userList?.map((item,index)=>{
      
    return <ListItem key={index} alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt={item.name} src={item.picture} />
      </ListItemAvatar>
      <ListItemText
        primary={item.name}
        secondary={
          <React.Fragment>
            <Typography
              sx={{ display: 'inline', color:"red" }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {"Lache"}
            </Typography>
            {" — "+ item.points}
          </React.Fragment>
          }
        />
        <Divider variant="inset" component="p" />
      </ListItem>
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
        "date_delation" : moment.tz(new Date(), "Europe/Paris"),
        "author" : user?.email
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
          setActiveExport(" ")
        }
        else
          setActiveExport("disabled")
        
      
      
    }
    )   
    refreshUser();  
  }
  const refreshUser = () => {
    fetch(process.env.REACT_APP_API_URL + "/account")
    .then((response) => response.json())
    .then(
      (users) => {
        if(Object.keys(users.users).length > 0){
          setUserList(users.users)
        }
    }
    )    
  }
  const clearFields = () => {
    setAction("");
    setName("");
  };
  

  

    return(
      <section className='section'>
      {user !== null ? <h1 style={{display:"flex", alignItems: "center", justifyContent: "spaceBetween"}}>Délation.io <Avatar alt="Remy Sharp" src={user?.picture} /></h1> : <h1>Délation.io</h1>}
      <h4>Déclares toutes les actions de tes collègues et gagne un capital sympathie auprès de ton chef.</h4>
      <div className="page-content page-container d-flex " id="page-content">
      {userList === null || user === null ? "" : <List sx={{ width: '25%', maxWidth: 360, bgcolor: 'background.paper', marginTop: "5%" }}>{mappedUserList}</List>
                    
                      }
        <div className="padding">
            <div className="row container d-flex justify-content-center">
                <div className="col-md-12">
                    <div className="card px-3">
                      
                        <div className="card-body">
                        {user === null ? <div id="signInButton">Barre toi</div>  :  <>
                            <div className="add-items d-flex"> 
                           
                              <input type='text' onChange={(e) => setName(e.target.value)}className="form-control todo-list-input name" value={name} placeholder="Qui c'est encore ?"/> 
                              <input type="text" value={action} onChange={(e) => setAction(e.target.value)} className="form-control todo-list-input" placeholder="Qu'a t-il.elle encore fait ?"/> 
                              <button onClick={() => {if(activeButton !== "disabled") declare()}}className={"add btn btn-primary font-weight-bold todo-list-add-btn "+ activeButton}>Déclarer</button> 
                              <button onClick={() => exportPDFWithMethod()} className={"add btn btn-warning font-weight-bold todo-list-add-btn "+ acttiveExport} >Export</button> 
                              <button onClick={() => refresh()} className={"add btn btn-primary font-weight-bold todo-list-add-btn "} ><i className='bi bi-arrow-clockwise refresh'></i></button> 
                              <button className=" add btn btn-primary font-weight-bold todo-list-add-btn "onClick={logout}>Logout</button>
                            </div>
                            <div className="list-wrapper">
                                <ul id="delationbs" className=" delationbs d-flex flex-column-reverse todo-list">
                                    {itemList !== null ? itemList : ""}
                                </ul>
                            </div>
                            </>}
                         
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
