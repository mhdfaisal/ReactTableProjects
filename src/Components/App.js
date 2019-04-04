import React from 'react';
import UsersTable from './UsersTable/UsersTable';
import CustomerTable from './CustomerTable/CustomerTable';
import MyAccounts from './MyAccounts/MyAccounts';
import SearchForm from '../Components/Widgets/SearchForm/SearchForm';

import getData from '../api/getData';
class App extends React.Component{
    
     state = {data:[]}

    componentDidMount(){
        //this.fetchData({searchBox:'rootData'});
    }

    fetchData = (resource)=>{
        let URL = resource.searchBox;
        // let URL1 = resource.custId;
        // getData.get(`/${URL}/${URL1}`)
        getData.get(`/${URL}`)
        .then(response=> this.setState({data:response.data}))
        .catch(err => console.log(err))
    }
    
    handleSearchSubmit = (submittedValues)=>{
        // console.log(submittedValues)
        this.fetchData(submittedValues);
    }

    render(){

        return(
            <div className="">
                <SearchForm handleSubmit={this.handleSearchSubmit}/>
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
// npm install --save react-form