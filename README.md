# drupal-docker-seed
Seed repository for starting Drupal sites using Docker.

# Installing Docker
## Windows 7 and Server < 2012
Download Docker Toolbox from here: https://www.docker.com/products/docker-toolbox

This will install Docker using a variety of tools.  Docker will run VMs using Virtualbox that creates machines using a special Linux distribution with Docker tools installed on it.

You'll also have some command line utilities installed in your PATH with this installation.  You can access docker commands in two ways:
1. Use the Docker Quickstart Terminal to boot into a session on the Virtual Machine where you can run Docker commands like you will see in documentation.
2. Use docker-machine commands to set your current terminal environment so that it will run Docker commands against the machine.

There are benefits to both options.  The second option is more advanced and takes more effort, but it's concepts and workflow will also be useful when you lauch Docker into cloud environments.

## Windows 10 and Server >= 2012
Download and install Docker from here: https://store.docker.com/editions/community/docker-ce-desktop-windows

Docker can run natively on these Windows environments.  This will install tools into your PATH and you will be all set to go!

## Mac
Download and install Docker from here: https://store.docker.com/editions/community/docker-ce-desktop-mac

Docker can run natively on MAc environments.  This will install tools into your PATH and you will be all set to go! 

# Using this repository
From the directory you've cloned this repository into, run the following command: "docker-compose up"
 
Navigate to localhost:8080 (native Docker) or (probably) 192.168.99.100:8080 (Docker Toolbox).

Install Drupal as you are used to doing.  You'll have a Postgres database available with the following configuration changes:
Database name: postgres
Database username: postgres
Database password: example
ADVANCED OPTIONS: Database host: postgres

## What happened?
Docker set up a few containers to help you out and this Dockerfile copies some configuration options over to get everything set up.
There is a Postgres database, a container to absorb and display e-mails using mailhog, and the Drupal web server (8.3.x on an Apache web server).

#More Docker information
https://docs.docker.com/

https://github.com/docker/labs/tree/master
