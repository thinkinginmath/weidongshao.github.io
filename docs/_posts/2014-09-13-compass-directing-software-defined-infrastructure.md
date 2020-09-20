---
layout: post
title:  "Compass: Directing Software Defined Infrastructure"
date:   2014-09-12 11:40:18 +0800
categories: DevOps
tags: Compass DevOps OpenStack Ansible
author: David Wei Shao

---

* content
{:toc}

# We are in for OpenStack Summit - Paris


I am glad that our Compass team has released v1.0 with support of OpenStack deployment automation. We will be demonstrating it at OpenStack Summit Paris in November.

{% include youtubePlayer.html id="UArzko_cd5c" %}



This has been a learning experience for me. It is the first project where I have to own things in addition to the technical design and implementation of the system. I had to promote the project internally as this is one of Huawei's first project in OpenStack source program. I also had the opportunities to work with our partners for stratgic alliance. 

Many thanks to my team! Shuo, Xicheng, Xiaodong, Grace, Lawrence, Rocky, Jiahua, Lu-Cong!

## Overview 


Compass itself is a distributed system that provides data modeling, configuration API, and WebUI to the end users in bootstrapping and managing a software defined data center infrastructure. Compass follows the modern software architecture design practice and it is modular and extensible.

Major components in Compass include:

- A RESTful API server, currently implemented in Python Flask.
- A demo Web UI which consumes the RESTful APIs. It is a pure JavaScript WebApp developed with AngularJS. A 3rd-party application can have a different UI using the same APIs.
- A meta-data module that allows a developer to extend the core functionality and provide custom data model for OpenStack configurations, for example, with or without HA, single controller vs multi-node etc. The RESTful API layer provides the updated API automatically, based on the metadata. No code change is required at the API layer.
- An adapter interface for automatic resource discovery. Current discovery mechanism is based on stanard MIB over SNMP query to ToR switches. Other mechanisms (such as IPMI, or Intel's next-gen RSA) are possible by adding plugins.
- An adapter interface for configuration management tools. Currently we support Chef-based and Ansible-based CM tools. Other mechanisms (such as Puppet) are possible by adding plugins.
- A Cobbler interface for OS provisioning. We hide the configuration details of kickstart files or seed files and provide a user-friendly OS-level provisioning.

## Open-Source and Open Community

Compass is part of OpenStack open source program. We are collaborating with Intel's RSA(Rack-Scale Architecture) on data center application deployment,  and with PlumGrid on NFV.

## Major Modules

![Compass modules](/assets/2014/CompassModules.png)

## Update:
Project Compass was moved to OPNFV project by Huawei's team.

Archived code on github: [https://github.com/openstack-archive/compass-core](https://github.com/openstack-archive/compass-core)