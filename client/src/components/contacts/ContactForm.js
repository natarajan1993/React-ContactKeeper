import React, {useState, useContext, useEffect} from 'react'
import ContactContext from '../../context/contact/contactContext'


const ContactForm = () => {
    const [contact, setContact] = useState({
        name:'',
        email:'',
        phone:'',
        type:'personal'
    });

    const contactContext = useContext(ContactContext)
    const {addContact, current, clearCurrentContact, updateCurrentContact} = contactContext;
    useEffect(() => {
        if(current !== null){
            setContact(current); //setContact is what actually fills the form
        }else{
            setContact({
                name:'',
                email:'',
                phone:'',
                type:'personal'
            })
        }
    }, [contactContext, current])

    const onChange = (e) => setContact({...contact, [e.target.name]:e.target.value});
    const onSubmit = (e) => {
        e.preventDefault();
        if(current === null){
            addContact(contact)
            clearCurrentContact()
        }else{
            updateCurrentContact(contact)
            clearCurrentContact();
        }
        setContact({
            name:'',
            email:'',
            phone:'',
            type:'personal'
        })
    }
    const clearAll = () => {
        clearCurrentContact();
    }
    const {name, email, phone, type} = contact;
    /**React knows to fill the form with the values of the current contact
     *      - We set the value of the fields as name, email, etc which is destructured from the contact object
     *      - contact object is coming from useState hook which indicates to React that it's a state object
     *      - We can work directly with this state object through the context which we have bought in through the useContext hook
     *      - contactContext connects to the ContactState.js file and will bring in the methods inside the ContactState.js file
     *          - Inside ContactState we've linked the current state with the reducer using useReducer()
     *          - useReducer returns the current state and the dispatcher which signals the reducer to change the state
     *      - The reducer is what actually changes the current state
     *      - We dispatch signals to the reducer from the ContactState file when we want to change the state
     *      - Inside the reducer we return a copy of the current state along with parts of it that we want changed
     *      - Component
     *          - uses useContext to get the current state of the app/component
     *          - Also get the state changing methods through the current context object
     *          - On component change
     *              - Call a local method
     *                  - Local method calls the state changing method accessed through the context
     *                  - State changing method takes any arguments and sends a dispatch signal to the reducer
     *                  - Reducer changes state and returns copy of original state along with changed state variables
     *              - Reducer(changed state) => State => Component => UI changes + state changes
     */
    return (
        <form onSubmit={onSubmit}>
            <h2 className="text-primary">{current ? "Edit Contact": "Add Contact"}</h2>   
            <input type="text" name="name" value={name} placeholder="name" onChange={onChange}/>
            <input type="text" name="email" value={email} placeholder="email" onChange={onChange}/>
            <input type="text" name="phone" value={phone} placeholder="phone" onChange={onChange}/>
            <h5>Contact Type</h5>
            <input type="radio" name="type" value="personal" checked={type==="personal"} onChange={onChange}/>Personal {' '}
            <input type="radio" name="type" value="professional" checked={type==="professional"} onChange={onChange}/>Professional
            <div>
                <input type="submit" value={current ? "Update Contact": "Add Contact"} className="btn btn-primary btn-block"/>
            </div>
            {current && <div>
                    <button className="btn btn-light btn-block" onClick={clearAll}>Clear</button>
                </div>}
        </form>
    )
}

export default ContactForm;