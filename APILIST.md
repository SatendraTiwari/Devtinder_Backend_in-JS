# API LIST 

 # authRouter 
- POST  /signup
- POST /login
- POST /logout

# profile Router
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

# connectionReaquestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/send/accepted/:requestId
- POST /request/send/rejected/:requestId   

# authRouter

- GET /user/connection
- GET /user/requests

- GET /user/feed -  Get you  the profile other users on platform

stutes ignored , interected, rejected, accepted;
