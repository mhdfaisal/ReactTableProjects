import React from 'react';
import _ from 'lodash';
import '../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';

import getData from '../../api/getData';

class UsersTable extends React.Component{

    state = {columns:[], users:[], columnIds:[]}

    componentDidMount(){
        this.setUsersData();
    }

    componentDidUpdate(prevProps){
        if(prevProps.data!==this.props.data){
            this.setUsersData();
            console.log(prevProps.data, this.props.data)
        }
    }

    fetchUsersData = ()=>{
        getData.get("/rootData")
        .then(response =>{
            let localUsers =[];
            response.data[0].myAccounts.forEach((account)=>{
                account.myUsers.forEach((user)=>{
                    localUsers = [...localUsers, user]
                })
            })
            return _.uniqBy(localUsers, "id");
            
        })
        .then(localUsers =>{
            this.setState({users:localUsers, columnIds:Object.keys(localUsers[0])}, 
            ()=> this.setColumns())
        })
    }

    setUsersData = ()=>{
        if(this.props.data.length>0)
        {
            let localUsers =[];
            this.props.data[0].myAccounts.forEach((account)=>{
                account.myUsers.forEach((user)=>{
                    localUsers = [...localUsers, user]
                })
            })
            this.setState({users:_.uniqBy(localUsers, "id"), columnIds:Object.keys(localUsers[0])}, 
            ()=> this.setColumns())
        }
    }


    setColumns = ()=>{
        const localColumns = this.state.columnIds.map((item)=>{
            return {dataField:item, text:item, filter:textFilter()}
        })
        this.setState({columns:localColumns});
    }

    renderSpinner = ()=>{
       return(
           <div className="text-center mt-5">
                <div className="spinner-border text-primary " role="status">
                <span className="sr-only">Loading...</span>
                </div>
           </div>
       )
    }

    renderTable = ()=>{
        return(
            <BootstrapTable keyField = "id"
            columns={this.state.columns}
            data={this.state.users}
            striped
            hover
            cellEdit = {cellEditFactory({mode:"dbclick",blurToSave:true})}
            filter = {filterFactory()}
            /> /*--Filtering --*/
        )
    }


    render(){
       return this.state.columns.length > 0 ? (
           <div>
               {this.renderTable()}
           </div>
       ) : (
           <div>{this.renderSpinner()}</div>
       )
    }
}

export default UsersTable;

//npm install --save axios

//npm install --save lodash


// npm install --save react-bootstrap-table2-filter