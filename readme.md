Private node chat client/server application.

Usage:
Use node to run staticServer.js on any private or public server.
If your server if private (behind your firewall), be sure to port-forward port #81
Launch two or more client apps   -->>     http:<your-server-IP>:81
The client application propmts for both a user name and a passcode.
The passcode is used as a private encription key. It must match on each
client. 
If the clients passcode does not match, the application works but will on show
