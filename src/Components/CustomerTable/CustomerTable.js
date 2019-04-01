import React from 'react';
import _ from 'lodash';
import '../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';

import getData from '../../api/getData';

class CustomerTable extends React.Component{

    state = {columns:[], customerData:[], columnIds:[]}

    componentDidMount(){
        this.setUsersData();
    }

    componentDidUpdate(nextProps){
        if(nextProps.data!== this.props.data){
            this.setUsersData();
        }
    }

    setUsersData =()=>{
        let localCustdata = _.omit(this.props.data[0], "myExecPolicy", "myAccounts")
        this.setState({customerData:localCustdata, columnIds:Object.keys(localCustdata)}, 
            ()=> {
                // console.log(this.state.customerData)
                this.setColumns()})
    }

    fetchUsersData = ()=>{
        getData.get("/rootData")
        .then(response =>{

            let localCustdata = _.omit(response.data[0], "myExecPolicy", "myAccounts")
            // console.log(localCustdata)
            return localCustdata;
        })
        .then(localCustdata =>{
            this.setState({customerData:localCustdata, columnIds:Object.keys(localCustdata)}, 
            ()=> {
                // console.log(this.state.customerData)
                this.setColumns()})
        })
    }

    setColumns = ()=>{
        const localColumns = this.state.columnIds.map((item)=>{
            return {dataField:item, text:item, filter:textFilter(),
            headerStyle: (column, columnIndex)=>{
                return {width:"180px", textAlign:"center"}
            }
        }
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
            data={[this.state.customerData]}
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

export default CustomerTable;