import { useEffect, useState } from "react";


export default function FakeAuth({children})
{
    const [user, setUser]= useState(null);
    const [isAuth, setIsAuth] = useState(false);
    useEffect(() => {
        let auth = localStorage.getItem("delation_user")
        if(auth !== null)
            setIsAuth(true)
    }, [])
    const handlesubmit = () => {
        localStorage.setItem("delation_user", user);
        setIsAuth(true)
    }

    if(!isAuth)
        return(<section className='section'>
        <h1>Délation.io</h1>
        <h4>Déclares toutes les actions de tes collègues et gagne un capital sympathie auprès de ton chef.</h4>
        <div className="page-content page-container" id="page-content">
          <div className="padding">
              <div className="row container d-flex justify-content-center">
                  <div className="col-md-12">
                      <div className="card px-3">
                          <div className="card-body">
                              <div className="add-items d-flex">
                                <input type='text'onChange={(e) => setUser(e.target.value)} className="form-control todo-list-input name" placeholder="Ton nom"/>
                                <button onClick={() => handlesubmit()} className="add btn btn-primary font-weight-bold todo-list-add-btn " ><i className="bi bi-caret-right"></i></button> 
                              </div>
                             
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </section>)
    else{
        return(
            children
    );
    }
    
}