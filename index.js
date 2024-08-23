import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 8888;




const MONGO_URL = process.env.DATABASE_URL



const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to the database');
    return mongoose.connection;  // Return the mongoose connection object
  } catch (error) {
    console.log('Database connection error:', error);
    throw error;  // Rethrow the error to handle it in the calling function
  }
};

const db = await connectToDatabase();





app.get('/api/data',async (req, res) => {
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename=data.zip');


  // // Select a collection to work with
  // const collection = db.collection('niplates');
  // console.log("🚀 ~ app.get ~ collection:", collection)

  // // Perform a sample operation (e.g., find all documents)
  // const data = await collection.find()

  // // Send the data as a response
  // res.status(200).json({ data });

  let payload= req.query.search
  const db = mongoose.connection.db;
    
  // Check if the database connection is available
  if (!db) {
    throw new Error('Database connection is not available');
  }
  

  const collection = db.collection('newplates'); 
  
  // // console.log('Using collection:', collection.collectionName);

  // const regexPattern = 'ABDUL';
  // const query = {
  //   $or: [
  //     // { prefix: { $regex: regexPattern, $options: 'i' } }, // Case-insensitive search for prefix
  //     { numbers: { $regex: regexPattern, $options: 'i' } }, // Case-insensitive search for numbers
  //     { letters: { $regex: regexPattern, $options: 'i' } }, // Case-insensitive search for letters
  //   ]
  // };

  // // Perform the query
  // const data = await collection.find(query).limit(20).toArray();

   // Create indexes on the 'numbers' and 'letters' fields
   await collection.createIndex({ numbers: 1 });
   await collection.createIndex({ letters: 1 });
   await collection.createIndex({ prefix: 1 });

   // Define the regex pattern and the query
   const regexPattern = payload
   const query = {
     $or: [
       { numbers: { $regex: regexPattern, $options: 'i' } }, // Case-insensitive search for numbers
       { letters: { $regex: regexPattern, $options: 'i' } }, // Case-insensitive search for letters
       { prefix: { $regex: regexPattern, $options: 'i' } }, // Case-insensitive search for letters
      ]
   };

  //  // Perform the query and limit the results to 20
  //  const data = await collection.find(query).limit(20).toArray();
  // const payload = 'RIXIC123';
  // const nonDigitPayload = payload.replace(/\d/g, '');

  // // Create arrays of regex patterns for each field
  // const prefixPatterns = [];
  // const lettersPatterns = [];
  // const numbersPatterns = [];
  
  // // Generate regex patterns for prefixes (2 characters)
  // for (let i = 0; i <= nonDigitPayload.length - 2; i++) {
  //   prefixPatterns.push(nonDigitPayload.slice(i, i + 2));
  // }

  // // Generate regex patterns for letters (3 characters)
  // for (let i = 0; i <= nonDigitPayload.length - 3; i++) {
  //   lettersPatterns.push(nonDigitPayload.slice(i, i + 3));
  // }
  
  // // Generate regex patterns for numbers (2 digits)
  // const numbersMatches = payload.match(/\d+/g);
  // if (numbersMatches) {
  //   for (let match of numbersMatches) {
  //     for (let i = 0; i <= match.length - 2; i++) {
  //       numbersPatterns.push(match.slice(i, i + 2));
  //     }
  //   }
  // }
  
  // // Build the query using all combinations of patterns
  // const query = {
  //   $or: [
  //     ...prefixPatterns.map(pattern => ({ prefix: { $regex: `^${pattern}`, $options: 'i' } })),
  //     ...lettersPatterns.map(pattern => ({ letters: { $regex: `^${pattern}`, $options: 'i' } })),
  //     ...numbersPatterns.map(pattern => ({ numbers: { $regex: `^${pattern}`, $options: 'i' } }))
  //   ]
  // };
  // console.log("🚀 ~ app.get ~ prefixPatterns:", prefixPatterns)
  
  // console.log("🚀 ~ app.get ~ lettersPatterns:", lettersPatterns)
  // console.log("🚀 ~ app.get ~ query:", query)
  // console.log("🚀 ~ app.get ~ numbersPatterns:", numbersPatterns)
  // Perform the query and limit the results to 20
  const data = await collection.find(query).limit(20).toArray();

  console.log('found in the collection.',data.length);
  if (data.length === 0) {
    console.log('No documents found in the collection.');
  }

  // Send the data as a JSON response
  res.status(200).json({ data });

});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
