FROM dockerfile/python

# Install Node.js
WORKDIR 	/tmp
RUN 		wget -O node.tar.gz http://nodejs.org/dist/v0.10.28/node-v0.10.28.tar.gz
RUN 		tar xvzf node.tar.gz
RUN 		rm node.tar.gz
RUN 		mv node-* node
WORKDIR 	/tmp/node
RUN 		./configure
RUN 		CXX="g++ -Wno-unused-local-typedefs" make
RUN 		CXX="g++ -Wno-unused-local-typedefs" make install

# Start app dir
RUN 		mkdir /app

# Install app dependencies
ADD 		./package.json /app/package.json
RUN			cd /app; npm install -d

RUN 		npm install -g gulp

# Load app dependencies
ADD 		. /app/src
RUN 		ln -s /app/src /src
RUN 		cd /app/src; gulp compile

EXPOSE  	3000

WORKDIR		/app/src

CMD 		["npm", "start"]