import React from 'react';
import UsersTable from './UsersTable/UsersTable';
import CustomerTable from './CustomerTable/CustomerTable';
import MyAccounts from './MyAccounts/MyAccounts';
import FormField from '../Components/Widgets/FormField';
import getData from '../api/getData';
class App extends React.Component{
    
     state = {data:[],
            formData:{
                search:{
                    element:"input",
                    value:"",
                    config:{
                        type:"text",
                        placeholder:"Search box"
                    }
                }
            }
    }

    componentDidMount(){
        getData.get("/rootData")
        .then(response=> this.setState({data:response.data}))
        .catch(err => console.log(err))
    }

    onChangeHandler = (e, id)=>{
        let newFormData = this.state.formData;
        let newElement = this.state.formData[id];
        newElement = {...newElement, value:e.target.value}
        newFormData = {...newFormData, [id]:newElement}
        // console.log(newFormData)
        this.setState({formData:{...newFormData}})
    }
    
    render(){

        return(
            <div className="">
                <form>
                    <FormField id="search" formData={this.state.formData.search} change={this.onChangeHandler}/>

                    <button type="submit" className="btn btn-primary">Go..</button>
                </form>

                <h3 className="my-4">Customer Table</h3>
                <CustomerTable data={this.state.data}/>
                <h3 className="my-4">MyAccounts Table</h3>
                <MyAccounts data={this.state.data}/>
                <h3 className="my-4">My Users</h3>
                <UsersTable data={this.state.data}/>
                
            </div>
        )
    }
}
export default App;


//npm install --save react-bootstrap-table-next react-bootstrap-table2-editor