# Proxy #
----------
Proxy is a node application server for relaying HTTP GET ajax requests to a target host. Proxy is ready to deploy on Azure as a Node JS application.
In response proxy ensures, it has CORS enabled for pre-flight as well as regular GET requests from browsers.


## Version log ##
1.0.0 - First version of proxy.

## Using Proxy ##
Latest version of proxy is currently hosted at [proxy](http://cproxy.azurewebsites.net/ "http://cproxy.azurewebsites.net/").
Alternatively, proxy can be hosted locally by

- ensure latest version of [node](https://nodejs.org/en/ "NodeJs") is installed on your machine.
  
- open command prompt and change directory to proxy root folder.

- run

			node server


Proxy takes in a query parameter **host** for relaying the GET call its value.

Here is an example for making cross domain http ajax get call, using jquery ajax method.

    	    var targeturl = ''; // desired url begining with http  
    		var proxyurl = <proxyurl> + '?host=' + encodeURI(targeturl);
    		$.ajax({
    				url: proxyurl,
    				type: 'GET'
    			});