'use client';
import { useRouter } from 'next/navigation';

import { useContext, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

import { postWithAxios } from '@/helpers/https';
import { UserContext } from '@/contexts/UserContext';

export default function Home() {
  const router = useRouter();

  /**
   * Refs to html elements to set / get data
   */
  const formRef = useRef<HTMLFormElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setUserData } = useContext(UserContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /**
     * Good practice for 'pseudo-debounce' effect
     * Prevents too many submissions
     */
    if (submitBtnRef.current) {
      submitBtnRef.current.style.backgroundColor = '#999';
      submitBtnRef.current.disabled = true;
    }
      

    const form = formRef.current;
    const fileInput = fileInputRef.current;

    if (!form || !fileInput || !fileInput.files?.[0]) {
      return;
    }

    /**
     * Prepare to post user data and file data
     */
    const formData = new FormData();
    formData.append('first-name', form['first-name'].value);
    formData.append('last-name', form['last-name'].value);
    formData.append('date-of-birth', form['date-of-birth'].value);
    formData.append('pdf-file', fileInput.files[0]);

    try {
      /**
       * Send a POST request to express.js server
       */
      const res = await postWithAxios('/api/upload', formData);

      /**
       * When successful, set data in a context for later retrieval
       */
      if (res.successful) {
        setUserData({
          fullName: res.fullName,
          age: res.age,
          text: res.text
        })
        
        /**
         * Navigate to results page
         */
        router.push('/results')
      }

      /**
       * Return button to normal state
       */
      if (submitBtnRef.current) {
        submitBtnRef.current.style.backgroundColor = '#A10046';
        submitBtnRef.current.disabled = false;
      }
    } catch (err) {
    }
  };

  return (
    <div className="m-register flex">
      <div className="m-register__form flex-1">
        <h1 className="text-7xl">OneWay Inc.</h1>
        <p className="text-2xl">Welcome to our platform</p>
        <p><small className="text-gray-500">Powered by pdf parse</small></p>

        <form method='post' ref={formRef} className="register__form__main mt-10" onSubmit={handleSubmit}>
          <div className="twin-inputs justify-between">
            <div className="input">
              <label htmlFor="first-name">First name</label>
              <input type="text" id="first-name" name="first-name" placeholder="e.g. John" required />
            </div>

            <div className="input">
              <label htmlFor="last-name">Last name</label>
              <input type="text" id="last-name" name="last-name" placeholder="e.g. Doe" required />
            </div>
          </div>

          <div className="twin-inputs mt-5 justify-between items-center">
            <div className="input">
              <label htmlFor="date-of-birth">Date of birth</label>
              <input type="date" id="date-of-birth" name="date-of-birth" required />
            </div>

            <div className="m-register__form__main__fileupload">
              <label className="flex items-center gap-2 cursor-pointer" htmlFor='pdf-file'>
                <FontAwesomeIcon icon={faFilePdf} className="text-2xl" />
                Click to upload file
              </label>
              <input
                ref={fileInputRef}
                type="file"
                id='pdf-file'
                name="pdf-file"
                accept="application/pdf"
                hidden
                required
              />
            </div>
          </div>

          <button type='submit' ref={submitBtnRef} id='submit-btn' className='btn mt-9'>Confirm</button>
        </form>
      </div>

      <div className="m-register__caption flex-1 relative">
        <div className="m-register__caption__grid absolute" />
        <div className="m-register__caption__msg absolute">
          <h1 className='text-6xl'>Welcome to OneWay Inc creativity centre.</h1>
          <p className='text-3xl'>Where Innovation meets vision.</p>
          <p>Sign up.</p>
        </div>
      </div>
    </div>
  );
}