import React from 'react';
import UsersTable from './UsersTable/UsersTable';
import CustomerTable from './CustomerTable/CustomerTable';
import MyAccounts from './MyAccounts/MyAccounts';
import SearchForm from '../Components/Widgets/SearchForm/SearchForm';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import getData from '../api/getData';

class App extends React.Component{
    
     state = {data:[], data1:[], searchTerm:{}}

    componentDidMount(){
        //this.fetchData({searchBox:'rootData'});
    }

    fetchAfterUpdate = ()=>{
        this.fetchData(this.state.searchTerm);
    }

    fetchData = (resource)=>{
        let URL = resource.searchBox;
        // let URL1 = resource.custId;
        // getData.get(`/${URL}/${URL1}`)
        getData.get(`/${URL}`)
        .then(response=> {
            if(URL==="*")
            {
                this.setState({data1:response.data})
            }
            else{
                this.setState({data:response.data})
            }
        })
        .catch(err => console.log(err))
    }
    
    handleSearchSubmit = (submittedValues)=>{
        // console.log(submittedValues)
        this.setState({searchTerm:submittedValues})
        this.fetchData(submittedValues);
    }

    render(){

        return(
            <>
            <Tabs defaultActiveKey="tables" id="tables-tabs">
                <Tab eventKey="tab1" title="Tab 1">
                    <SearchForm handleSubmit={this.handleSearchSubmit}/>
                    <h3 className="my-4">Customer Table</h3>
                    <CustomerTable data={this.state.data}/>
                    <h3 className="my-4">MyAccounts Table</h3>
                    <MyAccounts data={this.state.data}/>
                    <h3 className="my-4">My Users</h3>
                    <UsersTable data={this.state.data} fetchAfterUpdate={this.fetchAfterUpdate}/>
                </Tab>
                <Tab eventKey="tab2" title="Tab 2">
                <p>This is tab 2</p>
                </Tab>
                <Tab eventKey="tab3" title="Tab 3">
                <SearchForm handleSubmit={this.handleSearchSubmit}/>
                <CustomerTable data={this.state.data1}/>
                </Tab>
            </Tabs>
            </>
        )
    }
}
export default App;


{/* <h3 className="my-4">Customer Table</h3>
                <CustomerTable data={this.state.data}/>
                <h3 className="my-4">MyAccounts Table</h3>
                <MyAccounts data={this.state.data}/>
                <h3 className="my-4">My Users</h3>
                <UsersTable data={this.state.data}/> */}

//npm install --save react-bootstrap-table-next react-bootstrap-table2-editor
// npm install --save react-form
// npm install --save react-bootstrap
//"react": "^16.8.0"
//"react-dom": "^16.8.0",