import React, {useState, useEffect} from 'react';
import { doc, getDoc, collection, addDoc, updateDoc } from "firebase/firestore";
import {db} from './firebase/firebase';
import logo from './logo.jpg';
import delivery from './delivery.png';
import transfer from './transfer.png';
import cash from './cash.png';
import agreement from './agreement.png';
import Marquee from "react-fast-marquee";
import './App.css';

function App() {
  const [AED_RUB, setAED_RUB] = useState("");
  const [AED_USDT, setAED_USDT] = useState("");
  const [RUB_AED, setRUB_AED] = useState("");
  const [RUB_USD, setRUB_USD] = useState("");
  const [USDT_AED, setUSDT_AED] = useState("");
  const [USDT_USD, setUSDT_USD] = useState("");
  const [USD_AED, setUSD_AED] = useState("");
  const [USD_RUB, setUSD_RUB] = useState("");
  const [USD_USDT, setUSD_USDT] = useState("");
  const [selected, setSelected] = useState('RUB');
  const [selected2, setSelected2] = useState('AED');
  const [inputAmount, setInputAmount] = useState('AED');
  const [totalExchangeAmount, settotalExchangeAmount] = useState(0);
  const [initialAmount, setinitialAmount] = useState(0);
  const [contactNumber, setcontactNumber] = useState("");
  const [hideSubmitButton, sethideSubmitButton] = useState(true);
  const [docReferenceID, setdocReferenceID] = useState('');
  const [cancelAlert, setcancelAlert] = useState(false);
  const [applicationNumber_, setapplicationNumber_] = useState("");
  const handleChange = event => {
    console.log('Label 👉️', event.target.selectedOptions[0].label);
    console.log(event.target.value);
    setSelected(event.target.value);
  };

  const handleChange2 = event => {
    console.log('Label2 👉️', event.target.selectedOptions[0].label);
    console.log(event.target.value);
    setSelected2(event.target.value);
  };
  
  useEffect(()=> {
    if(selected == "RUB") {
      setSelected2("AED");
    } else if (selected == "AED") {
      setSelected2("RUB");
    } else if (selected == "USD") {
      setSelected2("AED");
    } else if (selected == "USDT") {
      setSelected2("AED");
    }
    console.log("selected 2: "+selected2);
  },[selected]);

  useEffect(() => {
    console.log("new: "+selected2);
  }, [selected2]);

  useEffect(() => {
    const combineCurrency = selected + "_" + selected2;
    
    if(combineCurrency == "AED_RUB") {
      settotalExchangeAmount(inputAmount * AED_RUB);
      setinitialAmount(AED_RUB);
    } else if(combineCurrency == "AED_USDT") {
      settotalExchangeAmount(inputAmount * AED_USDT);
      setinitialAmount(AED_USDT);
    } else if(combineCurrency == "RUB_AED") {
      settotalExchangeAmount(inputAmount * RUB_AED);
      setinitialAmount(RUB_AED);
    } else if(combineCurrency == "RUB_USD") {
      settotalExchangeAmount(inputAmount * RUB_USD);
      setinitialAmount(RUB_USD);
    } else if(combineCurrency == "USDT_AED") {
      settotalExchangeAmount(inputAmount * USDT_AED);
      setinitialAmount(USDT_AED);
    } else if(combineCurrency == "USDT_USD") {
      settotalExchangeAmount(inputAmount * USDT_USD);
      setinitialAmount(USDT_USD);
    } else if(combineCurrency == "USD_AED") {
      settotalExchangeAmount(inputAmount * USD_AED);
      setinitialAmount(USD_AED);
    } else if(combineCurrency == "USD_RUB") {
      settotalExchangeAmount(inputAmount * USD_RUB);
      setinitialAmount(USD_RUB);
    } else if(combineCurrency == "USD_USDT") {
      settotalExchangeAmount(inputAmount * USD_USDT);
      setinitialAmount(USD_USDT);
    } else {
      totalExchangeAmount = 0;
    }
    console.log("Total Exchange Amount: "+ totalExchangeAmount);
  }, [inputAmount, selected2])
  
  const fetchClass = async () => {
    const classRef = doc(db, "currencyExchange", "aGEOJJERvVOFQXJ4Ws3l");
    const classSnap = await getDoc(classRef);
    setAED_RUB(classSnap.data().AED_RUB);
    setAED_USDT(classSnap.data().AED_USDT);
    setRUB_AED(classSnap.data().RUB_AED);
    setRUB_USD(classSnap.data().RUB_USD);
    setUSDT_AED(classSnap.data().USDT_AED);
    setUSDT_USD(classSnap.data().USDT_USD);
    setUSD_AED(classSnap.data().USD_AED);
    setUSD_RUB(classSnap.data().USD_RUB);
    setUSD_USDT(classSnap.data().USD_USDT);
  }

  useEffect(() => {
      fetchClass();
  }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Sending Amount: "+ inputAmount + selected);
    console.log("Receive Amount: "+totalExchangeAmount + selected2);
    console.log("Contact Number: "+contactNumber);
    
    try {
      // get counter 
      const classRef_ = doc(db, "applicationCounter", "counter");
      const classSnap_ = await getDoc(classRef_);
      const counter_convert = parseInt(classSnap_.data().counter + 1);
      setapplicationNumber_(counter_convert);

      // update counter
      console.log("ap: "+counter_convert);
      // Set the "capital" field of the city 'DC'
      await updateDoc(classRef_, {
          counter: counter_convert,
      });

      const docRef = await addDoc(collection(db, "formData"), {
        contactNumber: contactNumber,
        receiveAmount: totalExchangeAmount + ' ' + selected2,
        sendAmount : inputAmount + ' ' + selected,
        applicationNumber : counter_convert,
        status: 'submit',
      });
      setdocReferenceID(docRef.id);
      console.log("Document written with ID: ", docRef.id);
    
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setInputAmount("");
    settotalExchangeAmount("");
    setcontactNumber("");
    sethideSubmitButton(false);
  }

  const updateData = async() => {
    const user = doc(db, "formData", docReferenceID);

        // Set the "capital" field of the city 'DC'
        await updateDoc(user, {
            status: 'Cancel',
        });
        sethideSubmitButton(true);
        setcancelAlert(true);
  }

  return (
    <div className='bg-black'>
      
      <div className="grid md:grid-cols-6 gap-4 text-white p-4">
      <div className="md:col-start-1 md:col-end-2"><img className='w-[150px]' src={logo}/></div>
      <div className="md:col-start-2 md:col-end-5 bg-[#FFC726] py-4 rounded">
        <Marquee>
          <div className='mx-3'>RUB/AED {RUB_AED}</div>
          <div className='mx-3'>RUB/USD {RUB_USD}</div>
          <div className='mx-3'>AED/RUB {AED_RUB}</div>
          <div className='mx-3'>AED/USDT {AED_USDT}</div>
          <div className='mx-3'>USD/RUB {USD_RUB}</div>
          <div className='mx-3'>USD/AED {USD_AED}</div>
          <div className='mx-3'>USD/USDT {USD_USDT}</div>
          <div className='mx-3'>USDT/AED {USDT_AED}</div>
          <div className='mx-3'>USDT/USD {USDT_USD}</div>
        </Marquee>
      </div>
      <div className="md:col-start-5 md:col-end-7 text-[13px] text-white font-medium"><div className='text-[20px] text-[#FFC726] font-medium'>exchange@rub-aed.ru</div>We work daily from <span className='text-[#FFC726]'>9:00 to 21:00 Moscow time</span></div>
      </div>
    <div className="grid grid-cols-6 gap-4">
    <div className="col-start-2 col-span-4 pb-8">
    <div className='md:text-7xl text-5xl font-semibold text-white md:mb-10 mb-5 text-center'>Currency exchange in Dubai with delivery</div>
<div className='flex flex-col items-center justify-center'>
<form className="w-full md:border-8 md:border-[#FFC726] md:rounded-2xl md:p-10 pb-3" onSubmit={handleSubmit}>
  <div className="flex flex-wrap justify-between -mx-3 mb-6">
    <div className="md:w-1/3 px-3 md:mb-6 flex">
    <div>
      <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2">
        sending
      </label>
      <input required className="appearance-none block w-full bg-black border text-[#FFC726] border-r-0 border-[#FFC726] rounded rounded-tr-none rounded-br-none py-3 px-4 mb-3 leading-tight focus:outline-none" 
            type="number" 
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)} />
      <p className="text-gray-600 text-xs">{initialAmount > 0 ? '1 '+selected +' = '+ initialAmount + ' '+ selected2: ''} </p>
      </div>
      <div>
      <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2 text-center">
      {selected}
      </label>
      <div className="relative">
        <select value={selected} onChange={handleChange} className="block appearance-none w-full bg-black border border-l-0 border-[#FFC726] text-[#FFC726] py-3 px-4 pr-8 rounded rounded-tl-none rounded-bl-none leading-tight focus:outline-none" id="grid-state">
          <option value="RUB">RUB</option>
          <option value="AED">AED</option>
          <option value="USD">USD</option>
          <option value="USDT">USDT</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#FFC726]">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
      <p className="text-red-500 text-xs italic invisible">Please fill out this field.</p>
      </div>
    </div>
    <div className='mb-[20px] w-full md:w-1/3 md:mt-[20px]'>
      <center><img src={transfer} className='w-[40px]' /></center>
    </div>
    <div className="md:w-1/3 px-3">
      <div className='flex'>
        <div>
        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2">
        you receive
      </label>
      <input readOnly className="appearance-none block w-full bg-black border text-[#FFC726] border-r-0 border-[#FFC726] rounded rounded-tr-none rounded-br-none py-3 px-4 mb-3 leading-tight focus:outline-none" 
            type="text"
            value={totalExchangeAmount > 0 ? totalExchangeAmount : ''} />
      <p className="text-gray-600 text-xs italic invisible">Some tips - as long as needed</p>
        </div>
        <div>
        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2 text-center">
      {selected2}
      </label>
      <div className="relative">
        {
          selected == "RUB" ? (
            <select value={selected2} onChange={handleChange2} className="block appearance-none w-full bg-black border border-l-0 border-[#FFC726] text-[#FFC726] py-3 px-4 pr-8 rounded rounded-tl-none rounded-bl-none leading-tight focus:outline-none" id="grid-state">
            <option value="AED">AED</option>
            <option value="USD">USD</option>
          </select>
          ) : (
            ''
          )
        }
        {
          selected == "AED" ? (
            <select value={selected2} onChange={handleChange2} className="block appearance-none w-full bg-black border border-l-0 border-[#FFC726] text-[#FFC726] py-3 px-4 pr-8 rounded rounded-tl-none rounded-bl-none leading-tight focus:outline-none" id="grid-state">
            <option value="RUB">RUB</option>
            <option value="USDT">USDT</option>
          </select>
          ) : (
            ''
          )
        }
        {
          selected == "USD" ? (
            <select value={selected2} onChange={handleChange2} className="block appearance-none w-full bg-black border border-l-0 border-[#FFC726] text-[#FFC726] py-3 px-4 pr-8 rounded rounded-tl-none rounded-bl-none leading-tight focus:outline-none" id="grid-state">
            <option value="RUB">RUB</option>
            <option value="AED">AED</option>
            <option value="USDT">USDT</option>
          </select>
          ) : (
            ''
          )
        }
        {
          selected == "USDT" ? (
            <select value={selected2} onChange={handleChange2} className="block appearance-none w-full bg-black border border-l-0 border-[#FFC726] text-[#FFC726] py-3 px-4 pr-8 rounded rounded-tl-none rounded-bl-none leading-tight focus:outline-none" id="grid-state">
            <option value="AED">AED</option>
            <option value="USD">USD</option>
          </select>
          ) : (
            ''
          )
        }
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#FFC726]">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
      <p className="text-red-500 text-xs italic invisible">Please fill out this field.</p>
        </div>
      </div>
    </div>
  </div>
  <div className="flex flex-wrap -mx-3 mb-6">
    <div className="w-full px-3">
      <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2">
        How to contact you
      </label>
      <input required placeholder="Specify phone or telegram login" value={contactNumber} onChange={(e) => setcontactNumber(e.target.value)} className="appearance-none block w-full bg-black text-[#FFC726] border border-[#FFC726] rounded py-3 px-4 mb-3 leading-tight focus:outline-none" id="contactNumber" type="text" />
    </div>
  </div>
  <div className="flex flex-wrap -mx-3 mb-6">
      {
        hideSubmitButton ? (
          <button type="submit" className='w-full mx-3 text-center shadow bg-[#FFC726] hover:bg-[#FFC726] focus:shadow-outline focus:outline-none text-white font-bold py-2 rounded'>
        EXCHANGE CURRENCY
      </button>
        ) : (
          ''
        )
      }
    <div className="md:w-2/3"></div>
  </div>
  <div>
  {
  hideSubmitButton ? (
    ''
  ) : (
    <div className='bg-[#222222] rounded-xl text-center p-8'>
      <p className='text-[#FFC726] text-center text-3xl font-medium'>Application sent</p>
      <p className='text-center text-white mt-4'>Within 5 minutes you will be contacted by the manager on the specified contact. If the manager has not contacted you, then write us the number of your application in telegram.</p>
    <div className='flex flex-col md:justify-between md:flex-row mt-6 items-center'>
      <div className='bg-[#383838] p-3 rounded-lg'><p className='text-[#FFC726] text-xl font-medium'>{applicationNumber_}</p><p className='text-white'>Application number</p><p className='text-[#FFC726] cursor-pointer' onClick={updateData}>cancel application</p></div>
      <div><p className='text-white border-2 border-solid rounded-lg p-2 border-[#FFC726] mt-5 md:mt-0'>write to telegram</p></div>
    </div>
    </div>
  )
}
{
  cancelAlert ? (
    <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400">
      <span className="font-medium">Application canceled successfully</span>
    </div>
  ) : (
    ''
  )
}
  </div>
</form>
</div>
    </div>
    <div className="col-start-2 col-span-4 bg-[#222222] rounded-xl text-center text-4xl font-semibold py-8">
      <div className='text-white'>How to exchange currency</div>
      <div className="text-sm flex mt-8">
          <div className='ml-5 text-[#FFC726] text-2xl font-medium'>#1</div>
          <div className='ml-5 text-white text-left'>
            Choose the currency to exchange and what you will exchange for. Specify the amount to exchange.
            <div className='text-left'>
              <div className='mt-1 mb-3 text-[#808080]'>Accept:</div>
              <button className='m-2 rounded-3xl border-2 border-[#FFC726] px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:border-primary-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-primary-600 focus:border-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10'>BANK TRANSFER RUB</button>
              <button className='m-2 rounded-3xl border-2 border-[#FFC726] px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:border-primary-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-primary-600 focus:border-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10'>CASH DIRHAM</button>
              <button className='m-2 rounded-3xl border-2 border-[#FFC726] px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:border-primary-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-primary-600 focus:border-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10'>CASH DOLLAR</button>
              <button className='m-2 rounded-3xl border-2 border-[#FFC726] px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:border-primary-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-primary-600 focus:border-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10'>USDT</button>
              <div className='mt-2 mb-3 text-[#808080]'>Change to:</div>
              <button className='m-2 rounded-3xl border-2 border-[#FFC726] px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:border-primary-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-primary-600 focus:border-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10'>CASH DIRHAM</button>
              <button className='m-2 rounded-3xl border-2 border-[#FFC726] px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:border-primary-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-primary-600 focus:border-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10'>CASH DOLLAR</button>
              <button className='m-2 rounded-3xl border-2 border-[#FFC726] px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:border-primary-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-primary-600 focus:border-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10'>BANK TRANSFER RUB</button>
              <button className='m-2 rounded-3xl border-2 border-[#FFC726] px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:border-primary-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-primary-600 focus:border-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10'>USDT</button>
            </div>
          </div>
      </div>
      <div className="text-sm flex mt-5">
          <div className='ml-5 text-[#FFC726] text-2xl font-medium'>#2</div>
          <div className='ml-5 text-left text-white'>Leave an application.
            <div className='text-[#808080]'>We will then contact you to clarify the details.</div>
          </div>
      </div>
      <div className="text-sm flex mt-5">
          <div className='ml-5 text-[#FFC726] text-2xl font-medium'>#3</div>
          <div className='ml-5 text-left text-white'>The courier leaves for you or we meet at the office.
            <div className='text-[#808080]'>Within an hour we will deliver cash in Dubai or Moscow</div>
          </div>
      </div>
    </div>
    <div className="col-start-2 col-span-4 text-center py-8 text-white">
      <div className='grid md:grid-cols-2 gap-4 text-left'>
        <div className='md:mx-16'>
          <div className='flex'>
            <div className='flex items-center justify-center rounded-[50%] bg-[#FFC726] w-[44px] h-[44px] text-[#232325] text-[20px]'>%</div>
            <div className='ml-5 text-[16px] font-medium'>Favorable exchange rate</div>
          </div>
        </div>
        <div className='md:mx-16'>
          <div className='flex'>
            <div className='flex items-center justify-center rounded-[50%] bg-[#FFC726] w-[44px] h-[44px] text-[#232325]'><img src={agreement} /></div>
            <div className='ml-5 text-[16px] font-medium'>A personal meeting</div>
          </div>
        </div>
        <div className='md:mx-16'>
          <div className='flex'>
            <div className='flex items-center justify-center rounded-[50%] bg-[#FFC726] w-[44px] h-[44px] text-[#232325]'><img src={delivery} /></div>
            <div className='ml-5 text-[16px] font-medium'>Cash delivery in Dubai, Sharjah
            <div className='text-[12px] font-normal text-[#808080]'>Free shipping on exchanges over 5000 AED.<br></br> Otherwise, the shipping cost will be 50 AED.</div></div>
          </div>
        </div>
        <div className='md:mx-16'>
          <div className='flex'>
            <div className='flex items-center justify-center rounded-[50%] bg-[#FFC726] w-[44px] h-[44px] text-[#232325]'><img src={cash} /></div>
            <div className='ml-5 text-[16px] font-medium'>Cashback from each transaction</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
  );
}

export default App;
