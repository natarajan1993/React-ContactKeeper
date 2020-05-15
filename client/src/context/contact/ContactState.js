import React, {useReducer} from 'react';
import {v4 as uuid} from 'uuid';

import ContactContext from './contactContext'
import contactReducer from './contactReducer'
import {
    ADD_CONTACT,
    DELETE_CONTACT,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_CONTACT,
    FILTER_CONTACTS,
    CLEAR_FILTER
} from '../types'

const ContactState = (props) => {
   const initialState = {
       contacts: [
            {
                "id":1,
                "type": "personal",
                "name": "Lena",
                "email": "test2@test.com",
                "phone": "2234567890"
            },
            {
                "id":2,
                "type": "professional",
                "name": "Nate",
                "email": "test@test.com",
                "phone": "1234567890"
            },
            {
                "id":3,
                "type": "personal",
                "name": "Tom",
                "email": "test3@test.com",
                "phone": "4234567890"
            }
       ],
       current:null,
       filtered:null
   } 

   const [state, dispatch] = useReducer(contactReducer,initialState) 

   //Add Contact
   const addContact = contact => {
       contact.id = uuid()
       dispatch({type:ADD_CONTACT, payload: contact})
   }

   //Delete contact
   const deleteContact = id => {
       dispatch({type:DELETE_CONTACT, payload: id})
   }

   //Set current contact
   const setCurrentContact = contact => {
       dispatch({type:SET_CURRENT, payload: contact})
   }

   //Clear current contact
   const clearCurrentContact = () => {
       dispatch({type:CLEAR_CURRENT})
   }

   //Update contact
   const updateCurrentContact = contact => {
       dispatch({type:UPDATE_CONTACT, payload: contact})
   }
   //Filter Contact
   const filterContacts = (text) => {
       dispatch({type:FILTER_CONTACTS, payload:text})
   }
   //Clear Filter
   const clearFilters = () => {
       dispatch({type:CLEAR_FILTER})
   }

   return (
       <ContactContext.Provider
           value={{
               contacts:state.contacts,
               current:state.current,
               filtered:state.filtered,
               addContact,
               deleteContact,
               updateCurrentContact,
               setCurrentContact,
               clearCurrentContact,
               filterContacts,
               clearFilters
           }}>
               {props.children}
       </ContactContext.Provider>
   )
}

export default ContactState;