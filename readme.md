Private node chat client/server application.

Usage:
Use node to run staticServer.js on any private or public server.
If your server is private, (behind your firewall), be sure to port-forward port #81 . 
Launch two or more client apps   -->>     http:your-server-IP:81
The client application prompts for both a user name and a passcode.
The passcode is used as a private encription key. It must match on each
client. 
If the clients passcodes don't match, the application works but will only show mangled text.
Click the Help-link for a help screen.  The list does not scroll. To trim the list size, 
click on any list item to delete it.
