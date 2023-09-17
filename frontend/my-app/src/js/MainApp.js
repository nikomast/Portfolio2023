import React, { useState } from 'react';
import axios from 'axios';
//import '../css/MainApp.css';
import { Link } from 'react-router-dom';

function App() {
  const [loans, setLoans] = useState([
    { owner: '', amount: '', interest: '', minimum_payment: '', cost: '0', fine: '' }
  ]);

  const [monthlyPayment, setMonthlyPayment] = useState('');

  const addLoan = () => {
    const newLoan = { owner: '', amount: '', interest: '', minimum_payment: '',cost: '0', fine: '' };
    setLoans([...loans, newLoan]);
  };

  const removeLoan = (indexToRemove) => {
    const filteredLoans = loans.filter((_, idx) => idx !== indexToRemove);
    setLoans(filteredLoans);
  };

  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState(null);
  const handleSubmit = () => {
    for (let loan of loans) {
      if (!loan.owner || !loan.amount || !loan.interest || !loan.minimum_payment || !loan.fine) {
          alert("Please fill in all the fields before submitting.");
          return;
      }
      axios.post('http://localhost:8000/api/calculate', { loans, monthlyPayment })
      .then(response => {
        const imageUrlWithTimestamp = `${response.data.imageUrl}?timestamp=${new Date().getTime()}`;
        setImageUrl(imageUrlWithTimestamp);
        setError(null); // Reset any previous errors if the request is successful
      })
      .catch(err => {
        setError(err); // Set the error if the API call fails
      });
  }

  // Check if the monthlyPayment field is empty
  if (!monthlyPayment) {
      alert("Please fill in the monthly payment before submitting.");
      return;
  }
    axios.post('http://localhost:8000/api/calculate', { loans, monthlyPayment })
      .then(response => {
        const imageUrlWithTimestamp = `${response.data.imageUrl}?timestamp=${new Date().getTime()}`;
        setImageUrl(imageUrlWithTimestamp);
        //window.open(response.data.imageUrl, "_blank");
      });
  };

  return (
    <div className="container loan-calculator-container">
      <h2 className="center-text loan-title">Loan_Calculator</h2>
      {loans.map((_, idx) => (
        <div key={idx} className="loan-entry single-loan">
          <input
            type="text"
            className="owner-input"
            placeholder="Owner"
            onChange={e => {
              const newList = [...loans];
              newList[idx].owner = e.target.value;
              setLoans(newList);
            }}
            required
          />
          <input
            type="text"
            className="amount-input"
            placeholder="Amount"
            onChange={e => {
              const newList = [...loans];
              newList[idx].amount = e.target.value;
              setLoans(newList);
            }}
            required
          />
          <input
            type="text"
            className="interest-input"
            placeholder="Interest"
            onChange={e => {
              const newList = [...loans];
              newList[idx].interest = e.target.value;
              setLoans(newList);
            }}
            required
          />
          <input
            type="text"
            className="min-payment-input"
            placeholder="Minimum payment"
            onChange={e => {
              const newList = [...loans];
              newList[idx].minimum_payment = e.target.value;
              setLoans(newList);
            }}
            required
          />
          <input
            type="text"
            className="fine-input"
            placeholder="Fine"
            onChange={e => {
              const newList = [...loans];
              newList[idx].fine = e.target.value;
              setLoans(newList);
            }}
            required
          />
          <button className="remove-btn" onClick={() => removeLoan(idx)}>Remove</button>
        </div>
      ))}
      <button className="add-loan-btn" onClick={addLoan}>Add Loan</button>
      <div className="center-container payment-container">
        <label className="Payment-Text"> (Monthly budget) </label>
        <input
          type="number"
          className="budget-input monthly-payment-input"
          placeholder=""
          value={monthlyPayment}
          onChange={e => setMonthlyPayment(e.target.value)}
        />
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      </div>
      <div className='frame image-frame'>
        {imageUrl ? <img className="calculated-graph" src={imageUrl} alt="Calculated graph" /> : ""}
        {error && <div className="error-message">An error occurred: {error.message}, please re-enter the correct information.</div>}
      </div>
              <ul>
              <li> Where is the loan from</li>
              <li> How much is the amount left</li>
              <li> Whats the total yearly interest</li>
              <li> How much is the monthly minimum payment</li>
              <li> If your not able to pay whats the fine</li>
              <li> Your monthly budget for these loans</li>
              </ul>
    </div>
);

}

export default App;
