---
layout: post
title:  "Access Google Drive from Your Local Linux"
date:   2017-07-05 18:14:36 +0800
categories:
   - Software
tags: GDrive FUSE
author: David Wei Shao

---

* content
{:toc}

Google Drive is commonly used by software engineering team for project collaboration on raw data files, output charts/graphs, and CSV files. As programmers, we always prefer not to use any services from the graphical user interfaces. Dragging a dozen of data files from your local Jupyter Notebook data folder to Google Drive is no fun. Programmatic access to Google Drive is more desirable but unfortunately it is not straightforward to set up such access. Level of difficulty varies from OS types and versions, Google account privilege and client side programming languages.





I share some of the options in this post.

## Use Google Drive API

In this approach, we use Google python client library to access Google Drive through OAuth. Unfortunately, Google developer console is source of confusion for most developers in configuring OAuth credentials (client ID and secret).
The good news is that there is a “one-click” quick access to set up Google Drive API from this user guide on [using the python library to access Google Drive API](https://developers.google.com/drive/api/v3/quickstart/python).

![enable gdrive API](/assets/2017/gdrive1.png)

{:.image-caption}
*from Google’s Python QuickStart page*


Follow the above link, and click on the big blue button that reads “Enable the Drive API”, as shown in the above screenshot. You will instantly get the OAuth client credentials, and are ready to start coding. Google provides a sample code (see [link  on Github](https://github.com/gsuitedevs/python-samples/blob/master/drive/quickstart/quickstart.py)) for accessing your Google Drive files.

![enable gdrive API](/assets/2017/gdrive2.png)

{:.image-caption}
*credentials.json file is required for python client to access Google Drive*



This approach is easy to set up. However, Google’s client APIs are not user friendly, to say the least. You can peek at [files APIs here](https://developers.google.com/resources/api-libraries/documentation/drive/v3/python/latest/drive_v3.files.html). I gave up with this approach in less than 5 minutes.


## Use FUSE mount on Linux

If you hate to use Google client API, google-drive-ocamlfus offers another option that allows you to access Google drive through [FUSE(filesystem in user space)](https://en.wikipedia.org/wiki/Filesystem_in_Userspace). The benefit of a file system mount is the easy access through command line tools, traditional GUI file manager, and the standard file-based library calls in python (or other programming languages).
Let’s get started. In the following example, we illustrate the steps on Ubuntu 18.04.

```
sudo add-apt-repository ppa:alessandro-strada/ppa
sudo apt-get update
sudo apt-get install google-drive-ocamlfuse
```

For installation on other platforms, refer to the project’s Github page:

[https://github.com/astrada/google-drive-ocamlfuse/wiki/Installation](https://github.com/astrada/google-drive-ocamlfuse/wiki/Installation)



The authentication of Google Drive access is also based on OAuth. We need to set it up as the next step.

### Case 1: Linux with Graphic Window Manager(e.g, Gnome)

You don’t need to explicitly setup a Google API client ID and secret. Instead, it uses the default browser to prompt for your Google login and authorization. Simply type this command:

```
google-drive-ocamlfuse
```

This will launch Firefox(or the default browser on your system):

![enable gdrive API](/assets/2017/gdrive3.png)

{:.image-caption}
*OAuth prompt screen from your browser*


If you click on "Allow" at this step, you are ready to mount the Google Drive in your account to your local system. Create a mount point (if it does not exist yet):

```
mkdir ~/google-drive
```
Then, mount your Google Drive as:

```
google-drive-ocamlfuse ~/google-drive/
```

Easy setup! But this method is not so helpful to me after all. These days I almost never use Linux with a graphical desktop. My linux box is either a local VM (managed through vagrant), a Docker container, or an AWS EC2 instance.

### Case 2: Headless Linux

You need to setup Google API client ID and credentials. It is not a trivial process. Most tutorials will direct you to Google developer console, where you need to deal with concepts such as projects, credentials, OAuth consent screen, etc. Eventually you might end up with your app isn't verified error.

What you should do is to use the *big blue button* from the [Google Quickstart page](https://developers.google.com/drive/api/v3/quickstart/python) that I mentioned in the earlier section (see the above screenshot). Once you get the client ID and secret from the popup box, let’s record them in environment variables:

```
export GD_CLIENTID=<your clientID here>.apps.googleusercontent.com
export GD_CLIENT_SECRET=<your client secret here>
```

Optionally, you can copy these values in the ~/.gdfuse/default/config file. See the last 2 entries in the following block:

```
acknowledge_abuse=false
apps_script_format=desktop
apps_script_icon=
async_upload_queue=false
async_upload_threads=10
autodetect_mime=true
cache_directory=
client_id= <copy your client ID here>
client_secret= <copy client secret here>
```

I don’t change this default config because I usually need to work with multiple Google accounts (personal v.s. work). The packagegoogle-drive-ocamlfuseallows you to use different profiles using -labelcommand-line option. For example, let’s say I use mydriveas the label name:
google-drive-ocamlfuse -headless -label mydrive -id $GD_CLIENTID -secret $GD_CLIENT_SECRET
Note: you do not need to use label option if you choose to set credential in the default config file.

You will see the prompt as something like this:

```
Please, open the following URL in a web browser: https://accounts.google.com/o/oauth2/auth?client_id=##yourClientID##.apps.googleusercontent.com&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive&response_type=code&access_type=offline&approval_prompt=force
```

Copy the link and open it in a web browser on your client machine (e.g, on Windows or Mac OS X), you will need to Sign In your Google account, and then you will see the consent screen as follows:

![enable gdrive API](/assets/2017/gdrive4.png)

{:.image-caption}
*OAuth consent screen from your browser*

By clicking on “Allow” button, you will get something like the following screen:

![enable gdrive API](/assets/2017/gdrive5.png)

{:.image-caption}
*Copy the authrorization code to your clipboard*

Copy the authorization code in your Clipboard and paste it to the command prompt

```
Please enter the verification code: <paste from the Google page>
```

You should see a message that reads:
```
Access token retrieved correctly.
```

Now, let’s create a mount point, if it does not exist yet.
```
mkdir ~/google-drive
```
Then, mount your Google Drive as:

```
google-drive-ocamlfuse -label mydrive ~/google-drive/
```

Note: you do not need to use label option if you choose to set credential in the default config file.

To make sure it works, check out the listing of the mounted directory:

```
ls -l ~/google-drive
```

This should show all your Google Drive files.

Now that you can manage your Google Drive files from your Linux host. You can read/write files from your python program or Jupyter Notebook IDE.

![enable gdrive API](/assets/2017/gdrive6.png)

{:.image-caption}
*Access your Google Drive files from your local linux*


## Clean Up

After you are done with your project, you can unmount by this command:
fusermount -u ~/google-drive/
It is a also good practice to force the Google authorization credentials to expire if you no longer need it. At anytime, you can review and revoke credential tokens [from this Google page](https://security.google.com/settings/security/permissions?pli=1).

