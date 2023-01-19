# Validation Endpoint

## Stories covered
- [171. Add basic validation endpoints](https://github.com/icipe-official/vectoratlas-software-code/issues/171)


# Prior to demo
1. Ensure your test data can pass validation with no errors 
1. Save your postman/insomnia post calls so they can quickly be demoed.
1. http://localhost:3001/validation/validateUploadOccurrence
1. http://localhost:3001/validation/validateUploadBionomics

## Demo
1. Check out the `main` branch.
1. Visit your preprepared postman/insomnia calls
1. Outline the importance of validation. Handling of unwieldy errors from data upload attempt and improved user experience
1. Show the test data and send it off for validation
1. It should return with no error arrays
1. Now, edit test data adding numbers where they shouldn't be and vice versa.
1. With bool columns, insert something other than true, false, yes or no.
1. Send off for validation
1. Should return a number of errors
1. Explain how this is handled on the frontend

