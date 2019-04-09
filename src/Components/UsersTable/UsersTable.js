import React from 'react';
import _ from 'lodash';
import '../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';

import axios from 'axios';

import getData from '../../api/getData';
import { reject } from 'q';

class UsersTable extends React.Component{

    state = {columns:[], users:[], columnIds:[], newlyAddedUsers:[], deletedRows:[]}

    componentDidMount(){
        this.setUsersData();
    }

    componentDidUpdate(prevProps){
        if(prevProps.data!==this.props.data){
            this.setUsersData();
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

    renderAddDelete = (user)=>{
        return(
            <>
            <button className="btn btn-primary badge mr-2" onClick={(e)=>{this.addRow(e,user)}}>Add</button>
            <button className="btn btn-danger badge" onClick={(e)=>{this.removeRow(e,user)}}>Delete</button>
            </>
        )
    }

    removeRow = (e, user)=>{
        let usersCopy = [...this.state.users];
        let newlyAddedFlag = false;
        let newUsers = usersCopy.filter((item, index)=>{
            return item.id!==user.id
        })
        let newlyAdded = this.state.newlyAddedUsers.filter((item,index)=>{
            if(user.id===item.id){
                newlyAddedFlag = true;
            }
            return item.id!== user.id
        })

        if(newlyAddedFlag){
            this.setState({users:[...newUsers], newlyAddedUsers:[...newlyAdded]})
        }
        else{
            this.setState({users:[...newUsers], deletedRows:[...this.state.deletedRows, user]})
        }
        //If newly added

    }
    
    addRow = (e,user)=>{
        let usersCopy = this.state.users;
        let clickedRowIndex = null;
        usersCopy.forEach((item, index)=>{
            if(item.id === user.id){
                clickedRowIndex = index;
            }
        })
        let newUsers1 = usersCopy.slice(0,clickedRowIndex + 1);
        let newUsers2 = usersCopy.slice(clickedRowIndex+1, usersCopy.length);
        let newRow = {};
        newRow ={...usersCopy[clickedRowIndex]}

        let newRowId = prompt("Please enter a temporary ID", "000")
        newRow = {...newRow, id:newRowId}
        newUsers2 = [{...newRow, config:this.renderAddDelete(newRow)}, ...newUsers2];
        
        let finalUsers = newUsers1.concat(newUsers2);
        this.setState({users:finalUsers});
        this.setState({newlyAddedUsers:[...this.state.newlyAddedUsers,newRow]})
    }

    setUsersData = ()=>{
        if(this.props.data.length>0)
        {
            let localUsers =[];
            this.props.data[0].myAccounts.forEach((account)=>{
                account.myUsers.forEach((user)=>{
                    localUsers = [...localUsers, {config:this.renderAddDelete(user),...user}]
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

    handleDataSubmit = ()=>{
        // this.state.newlyAddedUsers.forEach((item)=>{
        // axios.post('http://localhost:3001/rootData/', item)
        // .then(res=> console.log(res))
        // .catch(err => console.log(err));
        // })
        let networkRequests = this.state.newlyAddedUsers.map((item)=>{
            return new Promise((resolve, reject)=>{
                axios.post('http://localhost:3001/rootData/', item)
                .then(res=> resolve(res))
                .catch(err => reject(err));
                })
            })
        Promise.all(networkRequests)
        .then(res => console.log(res))
        .catch(res=> console.log(res))
        
        }
        //modify
        //color change
        //tabs
   


    render(){
        console.log(this.state.deletedRows)
       return this.state.columns.length > 0 ? (
           <div>
               <button className="btn btn-success ml-3 mt-3" onClick={this.handleDataSubmit}>Save</button>
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