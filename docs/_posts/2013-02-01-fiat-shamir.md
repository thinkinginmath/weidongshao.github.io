---
layout: post
title:  "Fiat-Shamir Heuristics"
date:   2013-02-01 15:15:17 +0800
categories:
   - Crypto
tags:
  - Fiat-Shamir
  - ZK proof
author: David Wei Shao
mathjax: true
---

* content
{:toc}

In cryptography, the Fiat–Shamir heuristic is a technique for taking an interactive proof of knowledge and creating a digital signature based on it.

The concept behind it is simple: If you have an interactive proof protocol (e.g, for user identification), the verifier plays an important role in the process by providing a random challenge to the prover.
With  the Fiat–Shamir heuristic, we  turn this protocol into a digital signature scheme by replacing the verifier's random challenge with some hash value that can be derived from the message. The hash function is modeled as a random oracle.




One example is to turn the Schnorr identification protocol to a digital signature algorithm. 
In the Schnorr identification protocol, the prover has a private key $$\alpha  \in \mathbb{Z}_q$$, and the corresponding public verification key is $$u = g^{\alpha} \in G$$. The two roles  roughly follow the following steps:

|Step | Prover                                              |    | Verifier               |
|-|-------------------------------------------------------------------|---------------------------|
|0| $$\alpha_t \xleftarrow{R} \mathbb{Z}_q, u_t \leftarrow g^{\alpha_t} $$  |
|------------------------------------------------------------------------|---------------------------|
|1|     |  $$\xrightarrow{\text{send }u_t}$$                         | |
|2|     |  $$\xleftarrow{\text{send }  c }$$                         | $$c \xleftarrow{ R } \mathcal{C}$$ |
|3| $$\alpha_z =\alpha_t + \alpha c $$    | $$ \xrightarrow{ \text{send } \alpha_z} $$  | verify $$g^{\alpha_z} = u_t  u^{c}$$ |

(Note: the security is based on [Discrete Log assumption](https://en.wikipedia.org/wiki/Discrete_logarithm). 

In this case, the signer will play the "Prover" role,  but  would use a hashing function  to get the challenge $c$ instead of relying on the "Verifier" in the interactive sigma protocol. $$ c= H(m, u_t)$$, where $H$ is SHA-256 or some other established hash algorithm. The verifier still uses same validation method as in the Step 3.

To sign a message $$m$$, the  flow is something like the following.

|Step | Signer                                                                | 
|-----|-----------------------------------------------------------------------|
|1| $$\alpha_t \xleftarrow{R} \mathbb{Z}_q, u_t \leftarrow g^{\alpha_t}, $$ $$u_t$$ is considered a committment| |
|------------------------------------------------------------------------|---------------------------|
|2|      $$c = H(m, u_t)$$                         |
|3| $$\alpha_z =\alpha_t + \alpha c $$, signature is $$\sigma = (u_t, \alpha_z) $$    |


$$c=H(m)$$

It is also used in constructing non-interactive zero-knowledge proof. Usually, the prover makes a commitment,
then hashes both the commitment and the statement to be proved.