import { createRef, useEffect, useRef, useState } from 'react'
import styles from './App.module.css'
import axios from 'axios'

type validState = 'valid' | 'invalid' | 'notSet'

const App = () => {
  const nameData = useRef<HTMLInputElement>(null)
  const emailData = useRef<HTMLInputElement>(null)
  const daysData = useRef<HTMLInputElement>(null)
  const [monthRef, setMonthRef] = useState<React.RefObject<HTMLInputElement>[]>([])

  const [validMail, setValidMail] = useState<validState>('notSet')

  const months = ['januar', 'märz', 'juni', 'september', 'november', 'dezember']

  useEffect(() => {
    setMonthRef((monthRef) => Array(months.length).fill(0).map((_, i) => monthRef[i] || createRef()));
  }, [months.length])


  const handleSubmit = () => {

    if (checkMail(emailData.current?.value)) {
      setValidMail('valid')
    } else {
      setValidMail('invalid')
      return
    }

    const data = {
      name: nameData.current?.value,
      email: emailData.current?.value,
      months: [...monthRef.map((month) => month.current?.checked ? month.current?.name : null).filter((month) => month !== null)],
      days: daysData.current?.value
    }

    axios.post('https://localhost/user/create', data)
      .then((res) => {
        console.log(res)
      }
      )
      .catch((err) => {
        console.error(err)
      }
      )

  }

  const checkMail = (mail: string | undefined) => {
    if ( mail?.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) ) {
      return true
    }
    else {
      return false
    }
  }

  const handleReset = () => {
    nameData.current!.value = ''
    emailData.current!.value = ''
    daysData.current!.value = ''
    monthRef.forEach((month) => month.current!.checked = false)
    setValidMail('notSet')
  }
  

  return (
    <>
      <form className={styles.form}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" ref={nameData} />
        <div className={styles.mail}>
          {validMail === 'invalid' ? <div className={styles.error}>Keine gültige E-Mail</div> : null}
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" ref={emailData} />
        </div>
        <div className={styles.month}>
          <label htmlFor="months">Verfügbarkeit:</label>
          {months.map((month, index) => (
            <div key={index}>
              <input type="checkbox" id={month} name={month} ref={monthRef[index]} />
              <label htmlFor={month}>{month}</label>
            </div>
          ))}
        </div>
        <label htmlFor="days">Tage Anwesenheit:</label>
        {/* check if number is positiv */}
        <input type="number" id="days" name="days" min="1" ref={daysData} onChange={
          (e) => {
            if (parseInt(e.target.value) < 1) {
              e.target.value = '1'
            }
          }
        } />
        <div className='buttons'>
          <button type='button' onClick={() => handleSubmit()}>Abschicken</button>
          {/* <button type="reset">zurücksetzen</button> // easy way */}
          <button type="button" onClick={() => handleReset()}>Zurücksetzen</button>
        </div>
      </form>
    </>
  )
}

export default App