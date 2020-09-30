---
layout: post
title:  "Anonymous Pay-per-view"
date:   2013-02-09 06:15:17 +0800
categories:
   - Crypto
tags:
  - IBE
  - Oblivous Transfer
author: David Wei Shao
mathjax: true
---

* content
{:toc}


Note: This is a re-post of an earlier research project at Stanford with Professor Dan Boneh (in 2009?).





## An implementation of Oblivious Transfer with Blind IBE


We use an Oblivious Transfer technique to implement an anonymous PerPerView service. Here, the anonymity is on the video content rather than the user identity. In other words, a user requests PayPerView service for a particular video. The server can verify the user’s identity and payment information, the server then grants the service but does not know which video is being served.

This might have practical application for the next-generation video services. For example, with Netflix online video service, it can incorporate this anonymous PerPerView feature with the following setup. Netflix provides a set of popular videos to the user in a hard-drive or DVDs. The premium video contents are pre-encrypted. It also provides the video content guide to the user. The user has the data but cannot watch the videos unless they first pay Netflix.

Now, when the user would like to watch a particular video, say the i-th video. He uses the anonymous PayPerView system to request a service from Netflix. Netflix sends back the keying materials for the i-th video after verifying the user's payment. The user is now able to watch the video content after decryption. Netflix, however, does not know the value of i after this transaction. It does not know which video the user has requested. This provides user privacy.

### Oblivious Transfer

In an oblivious transfer, the sender (server) has a set of messages $$M_1, M_2, \cdots, M_n$$. The receiver(client) has an index $$i$$.
They interact in such a way that at the end the receiver obtains $$M_i$$ without learning anything on other messages and that the sender does not learn anything about $$i$$.

Our system is based on the paper from Green and Hohenberger [1].  We use a blind Identity-based Encryption with Boney-Boyen IBE [2]. 

Blind Extract protocol with Boneh-Boyen IBE scheme. See References for details.

![IBE diagram](/assets/2013/IBE.002.jpg)

### Project Setup:
The implementation is based on the Stanford pbc crypto library. Our implementation is in C++, with client server communicating through a socket. In a real implementation, the client server could use RPC (e.g, Facebook Thrift).

We use a program to generate the system parameters. This includes the group parameters, IBE system parameters.
We use 100 short text files to represents N video contents. We generate $$N (N=100)$$ random messages $$M_i$$ in group $$G_T$$. We use these messages as the keying materials for AES encryption of the text files. We make the AES encrypted files available to the client (user).
The client communicates with the server through a socket. The client pick $$i$$ and sends the calculated value $$h$$ to the server.
The server sends back the keying materials.
The client performs the decryption and recover the original message $$M_i$$, which is then used to decrypt the AES-encrypted data file.

### Source Code:

Pease see the source code here. 

### Run Result

Sample Run of client ( To request file #89).

```
./run_client.sh 89

The number to sent to the server is h_prime=[8633978511329523575387684206626733138751358712821907085678162226884512649954265171191706061071422829074082471034730939618426407735674235051108427966508139, 3947695321690140932250083447080394212208169553497941359932477591789439330790815973587465195430324483139363620296783312691908224684142931681957565822516218]

 got from server
d0'= [677669494761430748369194369478334716990984799522980393669326995943558468800463931087378605396090023918954351045142086010109896096595674026631497773976292, 906228326508425701381712512432961472012692072059954327150780019317766340890980561575569678434903779057791094447135471768977124942963667197422331401997064]
 got from server d1'= [2507314483809245200491118508255878024229804197658845549928166904922597065166618062976765436145924784359421376481033145741648023967620983298884258026124841, 5573853683572926329088285358370643529632387675037891981519869056204736359521595894513241930349372471058843280966994574625884479295698452754250603566785671]

d0 = [4296322212998861292692147424809429478895592699301435582393064566111065709569615546332247393242035750748928037405293358072831630799201346470867208953309971, 4973756777619956419801308196424912125379292294537414662095269208531879601383773945611940918770239468544777495712281475798319319139737735900521047716339106]
d1 = [7415266890684539111978527364427265456574709348938139461238919810291162143923088865707066893185047512843457851211646683264139741541706460810070727495435688, 3032636310228493931343751650299646760457979411090335878801892414147144053260980855900230105606324679928485902979534454417089131362219729341926513860534987]

the client verified the keys
The decrypted message is [2355105562521212057426033982810827279524234333792210405244188224203943197535519131879128542946665682293848357316299212777848066792626853681943524912482632, 4555761350831389933592230834401029904162382628199369522373718466135890764625524663124807479797203282194008680772901110498282173458691319827162319093732325]
Received keying materials from server. 
Now, decrypt the original text file : 
This is data file 89.

This simulates the video content data in the clear.
The data will be AES encrypted and the cipher text sent to 
the client. The encryption passphrase is in the 
file pass_89.txt. 

=======
The server side
 $ ./run_server.sh 
Reading an element from client [8633978511329523575387684206626733138751358712821907085678162226884512649954265171191706061071422829074082471034730939618426407735674235051108427966508139, 3947695321690140932250083447080394212208169553497941359932477591789439330790815973587465195430324483139363620296783312691908224684142931681957565822516218]
Writing an element to client d0' = [677669494761430748369194369478334716990984799522980393669326995943558468800463931087378605396090023918954351045142086010109896096595674026631497773976292, 906228326508425701381712512432961472012692072059954327150780019317766340890980561575569678434903779057791094447135471768977124942963667197422331401997064]
Writing an element to  client d1' = [2507314483809245200491118508255878024229804197658845549928166904922597065166618062976765436145924784359421376481033145741648023967620983298884258026124841, 5573853683572926329088285358370643529632387675037891981519869056204736359521595894513241930349372471058843280966994574625884479295698452754250603566785671]
  t0=20000 t1=30000 t2=30000
 elapsed time 0.010000, 0.010000

```



## References



1. Matthew Green and Susan Hohenberger. Blind Identity-Based Encryption and Simulatable Oblivious Transfer. AsiaCrypt 2007
2. Dan Boneh and Xavier Boyen. Efficient selective-ID secure Identity-Based Encryption without random oracle. In EUROCRYPT '04, vol 3027 of LNCS, pages 223-238, 2004.
3. Stanford pbc crypto library. http://crypto.stanford.edu/pbc



