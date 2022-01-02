# Record retriever
This repo is a case study for Getir, which is an API endpoint that fetches data in the sample MongoDB collection and returns the results in the requested format.

## Endpoint
The endpoint is available publicly at `https://ams-getir.herokuapp.com/records`, and you can clone this repo and check it locally by executing the command `npm start` or `npm run live` and send the request to `http://localhost:3000/records/`

To run tests, execute `npm run test`.

## Request
You have to perform a POST request with described payload as below:
```
{
    "startDate": <The start date in YYYY-MM-DD format>,
    "endDate": <The end date in YYYY-MM-DD format>,
    "minCount": <An integer representing minimum count>,
    "maxCount": <An integer representing maximum count>
}
```

And what you will get in JSON response:

**code:** This will be zero if everything goes fine, and a negative number if any errors happened.

**msg:** This will be *Success* if everything goes well, and a message describing the error if anything happened.

**records:** This entity will hold the results. Each array member contains the record's *key*, *createdAt* and *totalCount*.

## Errors:

| Code | Msg | More |
|----|----|----|
| 0 | Success | Everything went well! Check the *records* array. |
| -101 | Request payload should contain startDate, endDate, minCount and maxCount. | You have missed at least a member of request payload. |
| -111 | startDate is invalid. It should be in YYYY-MM-DD format. | Check startDate value |
| -112 | endDate is invalid. It should be in YYYY-MM-DD format. | Check endDate value |
| -113 | startDate should be less than or equal to endDate. | Check startDate and endDate values |
| -121 | minCount is invalid. It should be a number greater or equal to 0. | Check minCount value. You cannot send a non-numeric or negative value. |
| -122 | maxCount is invalid. It should be a number greater or equal to 0. | Check maxCount value. You cannot send a non-numeric or negative value. |
| -123 | minCount should be less than or equal to maxCount. | Check minCount and maxCount values. |
| -500 | An internal error has been occured (code *{A number}*) | An internal (DB-related) server error has been occured |
| -503 | An unexpected error has been occured. | In a rare occasion, An internal server error has been occured and the website may be down |
