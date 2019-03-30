import React from 'react';
import UsersTable from './UsersTable/UsersTable';
import CustomerTable from './CustomerTable/CustomerTable';
import MyAccounts from './MyAccounts/MyAccounts';
class App extends React.Component{
    
    render(){
        return(
            <div className="container-fluid" >
                <h3 className="my-4">Customer Table</h3>
                <CustomerTable />
                <h3 className="my-4">MyAccounts Table</h3>
                <MyAccounts />
                <h3 className="my-4">My Users</h3>
                <UsersTable />
                
            </div>
        )
    }
}
export default App;


//npm install --save react-bootstrap-table-next react-bootstrap-table2-editor