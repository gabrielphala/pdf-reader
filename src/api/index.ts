import fs from 'fs';
import path from "path";
import express, { Request, Response } from "express";
import next from "next";

import { anyFiles } from "../helpers/multer";
import v, {Validator} from '../helpers/Validator';

const pdfParse = require('pdf-parse');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

/**
 * @var saveSavePath
 * Where file will be saved
 */
const saveSavePath = path.join(process.cwd(), 'public', 'uploads');

/**
 * calculates age from birth date and today's date
 * @param date 
 * @returns number
 */
function calculateAge(date: string | Date): number {
  const dob = new Date(date);
  const now = new Date();

  let age = now.getFullYear() - dob.getFullYear();

  return age;
}

app.prepare().then(() => {
  const server = express();

  /**
   * Body type configuration
   */
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  /**
   * POST Request for form upload
   */
  server.post('/api/upload', anyFiles(saveSavePath), async (req: Request, res: Response) : Promise<any> => {
    const { 'first-name': firstName, 'last-name': lastName, 'date-of-birth': dob } = req.body;
    let files = (req.files as Array<any>);
    let file = files.length > 0 ? files[0] : 0;

    /**
     * Response object to be send to client
     */
    let response: Record<string, string | null | boolean | number> = {
      error: null,
      success: false,
      fullName: '',
      age: null,
      text: ''
    }

    /**
     * Catch error if any
     */
    try {
      /**
       * If no file is detected throw below error
       */
      if (!file) throw 'Please upload file'

      /**
       * Validate input
       */
      v.validate({
        'First name': { value: firstName, min: 3, max: 50, type: Validator.NAME },
        'Last name': { value: lastName, min: 3, max: 50, type: Validator.NAME },
      })

      response.fullName = `${firstName} ${lastName}`;
      
      /**
       * Calcuate age from todaye
       */
      response.age = calculateAge(dob);

      /**
       * Validate age
       */
      if (response.age < 18) throw 'You must be at least 18 years old'
      
      const dataBuffer = fs.readFileSync(file.path);

      /**
       * Parse pdf for metadata and text but get only text
       * Provide fallback text just in case
       */
      response.text = (await pdfParse(dataBuffer)).text || 'Could not read file';
      response.successful = true;

    } catch (e: any) {
      response.error = typeof e == 'object' ? 'Something went wrong, please try again later!' : e;
    }

    res.status(200).json(response);
  });

  // catch all
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  /**
   * Next Port
   */
  const PORT = 3000;
  
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
