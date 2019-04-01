import React from 'react';
import _ from 'lodash';
import '../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';

import getData from '../../api/getData';

class MyAccounts extends React.Component{

    state = {columns:[], myAccounts:[], columnIds:[]}

    componentDidMount(){
        this.setUsersData();
    }

    componentDidUpdate(nextProps){
        if(nextProps.data!== this.props.data){
            this.setUsersData();
        }
    }


    setUsersData = ()=>{
        if(this.props.data.length>0){
            let localAccounts =[];
            this.props.data[0].myAccounts.forEach((account)=>{
               localAccounts = [...localAccounts, _.omit(account, "myUsers")]
            })
            this.setState({myAccounts:localAccounts, columnIds:Object.keys(localAccounts[0])}, 
            ()=> this.setColumns())
        }
    }

    fetchUsersData = ()=>{
        getData.get("/rootData")
        .then(response =>{
            let localAccounts =[];
            response.data[0].myAccounts.forEach((account)=>{
               localAccounts = [...localAccounts, _.omit(account, "myUsers")]
            })
            return localAccounts
            
        })
        .then(localAccounts =>{
            this.setState({myAccounts:localAccounts, columnIds:Object.keys(localAccounts[0])}, 
            ()=> this.setColumns())
        })
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
            data={this.state.myAccounts}
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

export default MyAccounts;