import React, {useEffect, useState} from 'react';
import { makeApiRequest, respStatus, showMessage, url } from '../helper/api_helper';


export default function EntryForm(){
    const [categories, setCategories] = useState([]);
    const [budget, setBudget] = useState([]);
    const [form, setForm] = useState({category_id: '', amount: '', note: '', date: ''});


    useEffect(()=>{
        fetchCategory()
    }, []);
    
    const fetchCategory = async () => {
        const response = await makeApiRequest(url.USER_API.getBudgets, {}, url.API_EXTENSION)
        if(response.status !== respStatus['SUCCESS']) {
            showMessage(response)
            return
        }
        setBudget(response?.data);
    }


    function handleChange(e){
        const {name, value} = e.target;
        setForm(f => ({...f, [name]: value}));
    }
    async function submit(e){
        e.preventDefault();
        setForm({category_id: '', amount: '', note: '', date: ''});
    }


    return (
        <form onSubmit={submit}>
            <select name="category_id" value={form?.category_id} onChange={handleChange} required>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c?.id}>{c?.name} ({c?.type})</option>)}
            </select>
            <input name="amount" value={form.amount} placeholder="Amount" onChange={handleChange} required />
            <input name="date" value={form.date} placeholder="YYYY-MM-DD" onChange={handleChange} />
            <input name="note" value={form.note} placeholder="Note" onChange={handleChange} />
            <button type="submit">Add</button>
        </form>
    );
}