import React, { useContext, useRef, useEffect } from 'react'

import ContactContext from '../../context/contact/contactContext'

const ContactFilter = () => {
    const contactContext = useContext(ContactContext)
    const text = useRef('')
    const {filterContacts, clearFilters, filtered} = contactContext;
    useEffect(() => {
        if(filtered === null) {
            text.current.value = ''
        }
    })
    const onChange = e => {
        if(text.current.value !== '') {
            filterContacts(e.target.value)
        }else{
            clearFilters()
        }
    }
    return (
        <form>
            <input type="text" ref={text} placeholder="Filter Contacts..." onChange={onChange}/>
           {filtered && <div>
                    <button className="btn btn-light btn-block" onClick={clearFilters}>Clear</button>
                </div>} 
        </form>
    )
}

export default ContactFilter;