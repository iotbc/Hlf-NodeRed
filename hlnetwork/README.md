## Hyperledger Network Definition 

To define your own network and test it locally, you have to install some neccessary development environments by following tutorial that is provided by Hyperledger Community
[Development Tools](https://hyperledger.github.io/composer/installing/development-tools.html)

After setting up environment you can clone this directory to modify according to your needs. Some suggestions based on modifying as follows:

* Update package.json
	* Edit this file to change the name to MyNetworkName
	* The description to MyNetworkName
	* Modify the prepublish script to change the name of the business network archive to MyNetworkName.bna at the end

* Update README.md
	* It is not neccessary but for the rest of community you can change the description.

* Update models/sample.cto
	* Create your own asset types, participant types etc.

* Update lib/sample.js
	* It is the programmatic part that describes logic under your network


* Update permissions.acl
	* For granting access to other to reach your network 

* Go to top directory and 
	>> npm install

* Update Unit tests 
	test/sample.js

* Generate Bna File
	>>mkdir dist
	>>composer archive create -a dist/MyNetworkName.bna --sourceType dir --sourceName .

* Deploy to running Hyperledger Fabric
	>>cd dist
	>>composer network deploy -a MyNetworkName.bna -p hlfv1 -i PeerAdmin -s randomString -A admin -S	
	

	Note : rm node-modules if got version mismatch and npm install again

* Generate REST API
	Start
	>>composer-rest-server
	Restart
	>>composer-rest-server -p hlfv1 -n MyNetworkName -i admin -s adminpw -N never -w true


After testing locally, you can  deploy it to IBM container service by following [this tutorial](https://ibm-blockchain.github.io/)


