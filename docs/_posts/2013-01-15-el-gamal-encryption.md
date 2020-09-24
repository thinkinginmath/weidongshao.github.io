---
layout: post
title:  "ElGamal Encrytion"
date:   2013-01-15 08:15:17 +0800
categories:
   - Crypto
tags:
  - ElGamal
  - threshold crypto
author: David Wei Shao
mathjax: true
---

* content
{:toc}


The ElGamal encryption scheme is based on computational Diffie-Hellman problem (see [wiki page on CDH](http://en.wikipedia.org/wiki/Computational_Diffie%E2%80%93Hellman_assumption)): Given a cyclic group, a generator $$g$$, and two integers $$a$$ and $$b$$, it is difficult to find the element $$g^{ab}$$ when only $$g^a$$ and $$g^b$$ are known, and not $$a$$ and $$b$$.

It is built out of the following components:




- a cyclic group $$G$$ of prime order $$q$$ with generator $$g\in  G$$,
- a symmetric cipher $$E_s = (E_s, D_s)$$, defined over $$(K, M, C)$$. $$K, M, C$$ are key space, message space, cipher space respectively. 
- a hash function $$ H: G_2 \rightarrow K$$.
- a key-gen algorithm as follows:

<p>
\[
 α \xleftarrow{R} \mathbb{Z}_q, u = g^α,  pk=u, sk=α
\]
</p>

where $$(pk, sk)$$ is the public-private key pair.

## Encryption

For a given public key $$u$$ and a message $$m$$, the encrypted output is $$(v, c)$$ as follows:
<p>
\[
\beta \xleftarrow{R} \mathbb{Z}_q, v=g^\beta, w=u^\beta, k=H(v,w), c=E_s(k,m)

\]
</p>
where $$E_s$$ is the symmetric encryption.

The decryption would use the corresponding private key $$\alpha$$. Given the cipher $$(v, c)$$, the original message $$m$$ is recovered as:

<p>
\[
w = v^\alpha, k = H(v,w), m= D_s(k,c)
\]
</p>

This works because $$w=g^{\alpha\beta} = u^\beta = v^\alpha$$.

Note that the above algorithm differs from the original scheme. See below for details. 

## Thereshold Decryption

In a threshold cryptosystem, a message is encrypted using a public key, and the corresponding private key is shared among the participating parties. With a threshold cryptosystem, in order to decrypt an encrypted message or to sign a message, several parties (more than some threshold number) must cooperate in the decryption or signature protocol. In a typical setup, e.g,  3-out-of-5 or 5-out-of-8, decryption can proceed  if only $t$ of the $s$ shares are available, for some $$0 < t ≤ s$$. However, any $$t−1$$ shares should reveal nothing about the secret key, and should not help the adversary decrypt ciphertexts.

See [Shamir's Secret Sharing](https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing) for an example of threshold-based secret sharing. A $$k$$ out of $$n$$ sharing of a secrect value $$a$$ can be achieved through polynomial interpolation from a polynomial of degree $$k-1$$.


ElGamal threshold decryption of  t-out-of-s system can be setup as follows: for the typical ElGamal crypto setup as above, use t-out-of-s Shamir secret sharing of the private key
$$\alpha \in \mathbb{Z}_q$$. The resulting shares, $$(x_i, y_i)$$ for $$i = 1, \cdots , s$$  are the shares of the decryption key $$\alpha$$. These can be distributed to different entities.

How to decrypt the ciphertext $$(v,c)$$?

1. Each party $i$ sends its partial decryption as $$(x_i, v^{y_i})$$
2. The combiner receives all $$t$$ partial decryption results.
3. The combiner computes $$w = (vy_1)^{\lambda_1} · (vy_2)^{\lambda_2} \cdots (vy_t)^{\lambda_t}$$, where $\lambda_i$'s are the  Lagrange coefficients in Shamir's secret sharing of the private key (i.e, the original ElGamal decryption key) $$\alpha$$
4. The combiner computes $$w=v^{y_1\lambda_1 +  y_2\lambda_2 + \cdots + y_t\lambda_t} =v$$. Now, the original message is retrieved in the same way as in regular ElGamal decryption, i.e., $$k = H(v,w), m= D_s(k,c)$$.

Even though the secret key $$\alpha$$ is shared among $$t$$ parties, the combiner does not need to recover $$\alpha$$ in order to decrypt the message from the partial decryption provided by $$t$$ parties. This avoids any single party in becoming single-point-of-failure and thus single source of security vulnerabilities.


## Application to Oblivious Transfer

An oblivious transfer (OT) protocol is a type of protocol in which a sender transfers one of potentially many pieces of information to a receiver, but remains oblivious as to what piece (if any) has been transferred. See more details from [Wiki page Oblivious transfer](https://en.wikipedia.org/wiki/Oblivious_transfer).

ElGamal encryption can be used to achieve  1-out-of-n OT protocol. The sender encrypts all $$n$$ messages using different public keys, but the protocol only allows the receiver to access the private  key corresponding to message $$i$$ and thus be able to retrieve message $$i$$. The receiver is not able to decrypt any other messages. In the meantime,  the sender does not know the value of $$i$$, achieving 1-out-of-n OT.

In order for the receiver to only  receive message $$i$$, the sender follows the following protocol:

| Preparation | the sender has $$n$$ messages, the receiver wishes to receive message $$i$$ |
| Sender      | chooses $$\beta\xleftarrow{R} Z_q$$, computes $$v=g^\beta$$, and publishes  $$v$$. |
| Receiver    | chooses $$\alpha\xleftarrow{R} Z_q$$, computes $$u=g^\alpha v^{-i}$$, and sends $u$. Note: $$\alpha$$ is the private(decryption) key |   
| Sender      | computes $$n$$ ciphertexts for $$n$$ messages. <br> Details described below.                                                          |
| Receiver    | for $$i$$th message, $$u_i=g^\alpha$$, decrypt $$c_i$$ as <br> $$ w=v^\alpha, k=H(v, w), m = D_s(k, c_i)$$ |


where, the sender encrypts $$j$$th  messages as

<p>
\[   u_j = uv^j \]
\[   w_j =  u\beta^j \]
\[ k_j = H(v,w_j), c_j =  E_s(k_j, m_j)\]
</p>


Note that there is not key generation phase in this protocol. The public key is computed based on the data exchanged by the sender and receiver.  For the $$i$$th message,  the public key is $$u_i = uv_i = g^\alpha v^{-i} v^i = g^\alpha $$, where the private key $$\alpha$$  was picked  by the receiver in the protocol. For all other messages, the receiver would not be able to compute the private key. 

During this protocol, the sender knows $$u$$ from the receiver, where $$ u = g^\alpha v^{-i}$$, since $$\alpha$$ is picked randomly, $$u$$ does not reveal the value of $$i$$.

## Original  Scheme and Homomorphic Encryption

The ElGamal encryption described above is different from the original scheme.



Elgamal proposed the original scheme in 1984 while he was at Stanford. See [Wiki page on ElGamal encryption](https://en.wikipedia.org/wiki/ElGamal_encryption). Or the [original paper](https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.476.4791&rep=rep1&type=pdf). In the original paper, the author mainly  introduced ElGamal signature scheme. He introduced the public key cryptosystem in section II of the paper.


### Setup
In its original form, the algorithm is built out of the following components:

- a cyclic group $$G$$ of prime order $$q$$ with generator $$g\in  G$$,
- a key-gen algorithm as follows:

<p>
\[
 α \xleftarrow{R} \mathbb{Z}_q, u = g^α,  pk=u, sk=α
\]
</p>

### Encrytion

For a given message $$m$$  (in group G),

1. Pick $$\beta$$ at random $$ \beta\xleftarrow{R} \mathbb{Z}_q $$, compute $$s = u^\beta$$, this is the shared scret.
2. $$ v = g^\beta, c= m \cdot s $$. The cipher is $$(v, c)$$


The decyption can be done, with knowledge of private key $$\alpha$$ as follows. The first step is to recover $$s$$, with $$ s =v\alpha $$. This is because $$v\alpha = (g^beta)^\alpha = g^{\alpha\beta} = u^\beta = s$$. Then, the message is recovered as $$m = c \cdot s^{-1} $$.



In its original  form, like RSA,  ElGamal provides a (partial) homomorphic scheme.
For example, for messages $$m_1, m_2$$, the ciphertexts are $$ (v_1, c_1), (v_2, c_2)$$.
Then $$ (v_1\cdot v2, c_1 \cdot c_2) = (g^{\beta_1 + \beta_2}, u^{\beta_1 + \beta_2}\cdot  (m1\cdot m2))$$ which is a cipher text for $$m_1 \cdot m_2$$. So the ElGammal encryption is homomorphic with multiplication. 


Similarly, if we use exponential rather than muiltiplication in the encryption step, e.g, $$ c = s\cdot g^m$$, we can achieve additive homomorphic encryption. The only issue, though, is that the decryption has to solve the discrete log in order to retrieve $$m$$ from $$g^m$$. This is only feasible if $$m$$ is small enough.

The partial homomorphic property of ElGammal is utilized in some of the electronic election (e-voting) systems. Another cypto that is used in some e-voting system is the Pailliar encyption, which also has additive homomorphic property. It is based on the composite-residuosity.  


## References

[Stanford CS355](https://crypto.stanford.edu/cs355/18sp/)

[Dan Boneh's publications](https://crypto.stanford.edu/~dabo/pubs/pubs.html)


