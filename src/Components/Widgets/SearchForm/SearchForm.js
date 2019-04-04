import React from 'react';
import {Form, Text, Select} from 'react-form';

class SearchForm extends React.Component{

    custIdData = [
        {
            label:"UserGroupId",
            value:"UserGroupId"
        },

        {
        label:"UserGroupCode",
        value:"UserGroupCode"

        }
    ]

    render(){
        return(
            <div>
                <Form onSubmit={(submittedValues)=>{ this.props.handleSubmit(submittedValues) }}>
                    {
                        formApi=> (
                            <form id="searchForm1" onSubmit={formApi.submitForm}>
                                <Select field="custId" id="custId" options={this.custIdData} className=""/>
                                <Text field="searchBox" id="searchBox" className=""/>
                                <button type="submit">Search</button>
                            </form>
                        )
                    }
                </Form>
            </div>
        )
    }
}

export default SearchForm