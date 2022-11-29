# Sources Bug fixes

## Stories covered
- [240. "403" page displayed to users without uploader role has some errors](https://github.com/icipe-official/vectoratlas-software-code/issues/240)
- [244. Backslash "\" character not escaped when adding a source](https://github.com/icipe-official/vectoratlas-software-code/issues/244)
- [242. Add a new reference source form not being fully reset](https://github.com/icipe-official/vectoratlas-software-code/issues/242)

# Prior to demo
1. Ensure pgAdmin (or equivalent) is open and roles have been assigned for the demo user.
1. Give demo user all roles except uploader.

## Demo
1. Check out the `feature/download-toast-notifications-#250` branch (if not merged)
1. Visit the Add Source Page. 403 should appear. Discuss the updates to prefix and MUI components (standard components for our system)
1. Return to pgAdmin and set all roles to true. 
1. Discuss that we encountered a bug where a backslash count not be used in the fields as behind the scenes from the user this is typically an escape character. But it is possible that our
users wish to enter titles with a backlash. So, we are now handling this appropriately so as to allow this behaviour.
1. Fill in the fields with a variety of backslah permutations. Start, end, within word, before space, after space etc - And submit
1. View in pgAdmin to verify it has been handled correctly.
1. Finally, discuss the form reset. Previously it would all reset to default except for the switches for Vector Data and Published. But now that behaviour has been corrected and it will all reset in a manner consistent with the other fields.

