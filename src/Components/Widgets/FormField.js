import React from 'react';

const FormField = (props)=>{
    
    switch(props.formData.element){
        case "input": return <input {...props.formData.config} value={props.formData.value} onChange={e=> {props.change(e,props.id)}}/>

        default: return null
    }
}

export default FormField;