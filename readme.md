Private node chat client/server application.

Usage:  
Use node to run staticServer.js on any private or public server.  
If your server is private, (behind your firewall), be sure to port-forward port #81 .   
Launch two or more client apps   -->>     http:your-server-IP:81  
The client application prompts for both a user name and a passcode.  
The passcode is used as a private encription key. It must match on each  
client.   
  
The encription is a minimized version of ...
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */  
/* Block TEA (xxtea) Tiny Encryption Algorithm                        (c) Chris Veness 2002-2016  */  
/*  - www.movable-type.co.uk/scripts/tea-block.html                                  MIT Licence  */  
/*                                                                                                */  
/* Algorithm: David Wheeler & Roger Needham, Cambridge University Computer Lab                    */  
/*            http://www.cl.cam.ac.uk/ftp/papers/djw-rmn/djw-rmn-tea.html (1994)                  */  
/*            http://www.cl.cam.ac.uk/ftp/users/djw3/xtea.ps (1997)                               */  
/*            http://www.cl.cam.ac.uk/ftp/users/djw3/xxtea.ps (1998)                              */  
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */  
  
If the clients passcodes don't match, the application works but will only show mangled text.  
Click the Help-link for a help screen.  The list does not scroll. To trim the list size,   
click on any list item to delete it.
