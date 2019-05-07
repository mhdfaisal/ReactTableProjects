import React from 'react';
import _ from 'lodash';
import '../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';

import axios from 'axios';

import getData from '../../api/getData';

class UsersTable extends React.Component{

    state = {columns:[], users:[], columnIds:[], newlyAddedUsers:[], deletedRows:[], modifiedRows:{}, successMsgs:[], errorMsgs:[]}

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

    renderAddDelete = (user,flag)=>{
        return(
            <>
            <button className="btn btn-primary badge mr-2" onClick={(e)=>{this.addRow(e,user)}}>Add</button>
            <button className="btn btn-danger badge" onClick={(e)=>{this.removeRow(e,user)}}>Delete</button>
            {flag ? <input type="checkbox" checked className="d-block mx-2 my-2"/> : null}
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
        //If newly added.
        // Post after getting a successful post. -1st priority
        // properties reader.
        // Error messages for request failures and success. - 2 nd priority

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

        let newRowId = prompt("Please enter a temporary ID")
        if(newRowId.trim()!==""){
            newRow = {...newRow, id:newRowId}
            newUsers2 = [{...newRow, config:this.renderAddDelete(newRow,true)}, ...newUsers2];
            
            let finalUsers = newUsers1.concat(newUsers2);
            this.setState({users:finalUsers});
            this.setState({newlyAddedUsers:[...this.state.newlyAddedUsers,newRow]})
        }
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
            if(item==="config"){
                return {dataField:item, text:item, filter:textFilter(), editable: ()=>{
                    return false;
                }}
            }
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
            cellEdit = {cellEditFactory({mode:"dbclick",blurToSave:true, afterSaveCell:(oldValue, newValue, row, column)=>{
                if(oldValue!==newValue){
                    this.addModifiedRow(row);
                }
            }
        })}
            filter = {filterFactory()}
            /> /*--Filtering --*/
        )
    }

    addModifiedRow = (row)=>{
        let newlyAddedFlag = false;
        let newlyAddedIndex;
        this.state.newlyAddedUsers.forEach((item,index)=>{
            if(item.id === row.id){
                newlyAddedFlag = true;
                newlyAddedIndex = index;
            }
        });
        if(!newlyAddedFlag){
            this.setState({modifiedRows:{...this.state.modifiedRows, [row.id]: _.omit(row, "config")}})
        }
        else if(newlyAddedFlag){
            let localnewlyAddedUsers = this.state.newlyAddedUsers;
            localnewlyAddedUsers[newlyAddedIndex] = _.omit(row,"config");
            this.setState({newlyAddedUsers: [...localnewlyAddedUsers]});
        }
       
    }
    //newly added


    handleDataSubmit = ()=>{
        let errorResponse;
        let localSuccessMsgs = [];
        let localErrorMsgs = [];
        Promise.all(
            this.state.newlyAddedUsers.map((item)=>
                axios.post('http://localhost:3001/rootData',item).catch(err => {
                    errorResponse = this.handleError(err)
                    return errorResponse;
                })
            ))
        .then((res)=>{
            console.log(res);
            res.forEach((item)=>{
                console.log(item)
                if(item.error){
                    localErrorMsgs = [...localErrorMsgs, item]
                }
                else{
                    localSuccessMsgs = [...localSuccessMsgs, item]
                }
            })
            if(localSuccessMsgs.length > 0){
                this.renderMessages(localSuccessMsgs);
            }
            if(localErrorMsgs.length > 0){
                this.renderMessages(localErrorMsgs, true);
            }
        }).then(()=>{
            this.setState({newlyAddedUsers:[]})
            this.props.fetchAfterUpdate();
        })
        
    }

    renderMessages = (arr, error=false) =>{
        let stringMessage = '';
        arr.forEach((item)=>{
            if(error){
                stringMessage += item.id + ": " + item.statusText+"\n";
            }
            else{
                stringMessage += item.data['id'] + ": " + item.statusText+"\n";
            }
        })
        alert(stringMessage);
    }

    handleError = (err)=>{
        console.log(err)
        let requestData = _.omit(JSON.parse(err.config.data),"config");
        return {statusText:err.response.statusText, ...requestData, error:true}
    }

    render(){
        // console.log(this.state.deletedRows)
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