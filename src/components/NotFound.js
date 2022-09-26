import React, {useEffect, useState} from 'react';
import * as Icon from 'react-bootstrap-icons';


function NotFound(props) {

    const[classname,setClassname]=useState("")

    const popupActive = () =>{
        if(props.error){
            setClassname("not-found-active")
            setTimeout(()=>{
                setClassname("")
                props.setError(false)
            },3000)
        }
    }

    useEffect(()=>{
        popupActive()
    },[props.error])

    return (
        <div className={`not-found ${classname}`}>
            <div className="content">
                <div className="icon">
                    <Icon.ExclamationSquare/>
                </div>
                <div className="text">
                    <h2>{props.location} not found!</h2>
                    <p>Please enter correct location name</p>
                </div>

            </div>
        </div>
    );
}

export default NotFound;
