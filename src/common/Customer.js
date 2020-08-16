import React, {useState} from "react";

import rest from './Rest'
import {CustomerView} from '../components/customer/CustomerView'


export const Customer = props => {

  const [isRequesting, setRequesting] = useState(false)
  const [serverCustomer, setServerCustomer] = useState({})
  const [customer, setCustomer] = useState({})

  const initial = customer => {

    console.log('customer', customer)

    setServerCustomer({...customer})
    setCustomer({...customer})
  }

  const create = () => {
    setRequesting(true)
    rest('customers',
      'POST',
      customer
    )
      .then(res => {
        setRequesting(false)
      })
  }

  const update = () => {
    setRequesting(true)
    rest('customers/' + customer.id,
      'PUT',
      customer
    )
      .then(res => {
        if (res.ok) initial(res.body.customers[0])
        setRequesting(false)
      })
  }

  const reset = () => {
    setCustomer({...serverCustomer})
  }

  const handleChange = (name, value) => {
    let newCustomer = {...customer}
    newCustomer[name] = value
    setCustomer(newCustomer)
  }

  let id = props.id || 0;

  if (!isRequesting && id > 0 && customer.id === undefined) {

    setRequesting(true)
    rest('customers/' + id)
      .then(res => {
        if (res.ok) initial(res.body)
        setRequesting(false)
      })

  }

  let isEqual = JSON.stringify(serverCustomer) === JSON.stringify(customer)

  return <CustomerView
    customer={customer}
    disabled={isRequesting || isEqual}
    handleChange={handleChange}
    create={create}
    update={update}
    reset={reset}
  />

}

