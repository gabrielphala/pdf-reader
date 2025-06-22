'use client';
import { useRouter } from 'next/navigation';
import { useContext, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

import { postWithAxios } from '@/helpers/https';
import { UserContext } from '@/contexts/UserContext';

const showError = (errorContainer: HTMLParagraphElement, errorMsg: string) : void => {
  errorContainer.style.display = 'block';
  errorContainer.innerText = errorMsg;
}


const hideError = (errorContainer: HTMLParagraphElement): void => {
  errorContainer.style.display = 'none';
}

export default function Home() {
  const router = useRouter();

  // Refs to html elements
  const formRef = useRef<HTMLFormElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  /**
   * Hide errors on load, for seamless user experience (UX)
   */
  if (errorRef.current) hideError(errorRef.current);

  // Context
  const { setUserData } = useContext(UserContext);

  // Local state for selected file label
  const [selectedFileName, setSelectedFileName] = useState('Click to upload file');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Disable submit button to prevent rapid submits
    if (submitBtnRef.current) {
      submitBtnRef.current.style.backgroundColor = '#999';
      submitBtnRef.current.disabled = true;
    }

    const form = formRef.current;
    const fileInput = fileInputRef.current;

    try {
      if (!form || !fileInput || !fileInput.files?.[0]) {
        /**
         * If form is not filled out
         */
        throw 'Please fill out the form and select pdf';
      }

      /**
       * Manually create form and (append pdf for multipart data)
       */
      const formData = new FormData();
      formData.append('first-name', form['first-name'].value);
      formData.append('last-name', form['last-name'].value);
      formData.append('date-of-birth', form['date-of-birth'].value);
      formData.append('pdf-file', fileInput.files[0]);

      /**
       * Send form with POST request via Axios
       */
      const res = await postWithAxios('/api/upload', formData);

      if (res.successful) {
        setUserData({
          fullName: res.fullName,
          age: res.age,
          text: res.text
        });

        return router.push('/results');
      }

      throw res.error;
    } catch (e) {
      /**
       * Show all / any erros at this point
       */
      if (errorRef.current) {
        showError(errorRef.current, typeof e == 'object' ? 'Something went wrong, please try again later!' : e as string)
      }
    }

    if (submitBtnRef.current) {
      submitBtnRef.current.style.backgroundColor = '#A10046';
      submitBtnRef.current.disabled = false;
    }
  };

  return (
    <div className="m-register flex">
      <div className="m-register__form flex-1">
        <h1 className="text-7xl">OneWay Inc.</h1>
        <p className="text-2xl">Welcome to our platform</p>
        <p><small className="text-gray-500">Powered by pdf parse</small></p>

        <form method='post' ref={formRef} className="register__form__main mt-10" onSubmit={handleSubmit}>
          <p ref={errorRef} className='text-red-800' style={{ display: 'none' }}></p>

          <div className="twin-inputs justify-between mt-2">
            <div className="input">
              <label htmlFor="first-name">First name</label>
              <input type="text" id="first-name" name="first-name" placeholder="e.g. John" />
            </div>

            <div className="input">
              <label htmlFor="last-name">Last name</label>
              <input type="text" id="last-name" name="last-name" placeholder="e.g. Doe" />
            </div>
          </div>

          <div className="twin-inputs mt-5 justify-between items-center">
            <div className="input">
              <label htmlFor="date-of-birth">Date of birth</label>
              <input type="date" id="date-of-birth" name="date-of-birth"  />
            </div>

            <div className="m-register__form__main__fileupload">
              <label className="flex items-center gap-2 cursor-pointer" htmlFor='pdf-file'>
                <FontAwesomeIcon icon={faFilePdf} className="text-2xl" />
                {selectedFileName}
              </label>
              <input
                ref={fileInputRef}
                style={{ display: 'none' }}
                type="file"
                id='pdf-file'
                name="pdf-file"
                accept="application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setSelectedFileName(file ? file.name : 'Click to upload file');
                }}
              />
            </div>
          </div>

          <button type='submit' ref={submitBtnRef} id='submit-btn' className='btn mt-9'>
            Confirm
          </button>
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
