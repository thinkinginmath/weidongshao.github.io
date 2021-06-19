---
layout: post
title:  "Development with Azure Kinect on Jetson Nano Board"
date:   2020-07-07 11:12:48 +0800
categories:
   - Software
tags:
   - Azure Kinect
   - Jetson Nano
   - Jetson Xavier NX
   - OpenCV
author: David Wei Shao

---

* content
{:toc}

While Azure Kinect provides a sensor SDK for the ARM system, we can use it as a USB camera in some cases. This would only get the color image from Kinect.
It is useful for easy integration with OpenCV or other deep learning video analytic algorithms.




## JetCam python module (Nvidia)

This module provides a unified interface for CSI and USB cameras on Jetson.
It uses OpenCV and Gstreamer. If your OpenCV does not include the GStreamer support, you may have to compile from source.  see [https://spyjetson.blogspot.com/2020/08/jetson-xavier-nx-opencv-44.html](https://spyjetson.blogspot.com/2020/08/jetson-xavier-nx-opencv-44.html) for reference.

### Check OpenCV build information

```
import cv2

print(cv2.getBuildInformation())

```
The output is long. The relevant portion is illustrated as follows

```
General configuration for OpenCV 4.1.1 =====================================
  Version control:               4.1.1-2-gd5a58aa75

  Platform:
    Timestamp:                   2019-12-13T17:25:11Z
    Host:                        Linux 4.9.140-tegra aarch64
    CMake:                       3.10.2
    CMake generator:             Unix Makefiles
    CMake build tool:            /usr/bin/make
    Configuration:               Release

  CPU/HW features:
    Baseline:                    NEON FP16
      required:                  NEON
      disabled:                  VFPV3

      ...
      ...

Video I/O:
    FFMPEG:                      YES
      avcodec:                   YES (57.107.100)
      avformat:                  YES (57.83.100)
      avutil:                    YES (55.78.100)
      swscale:                   YES (4.8.100)
      avresample:                NO
    GStreamer:                   YES (1.14.5)
    v4l/v4l2:                    YES (linux/videodev2.h)
```


On Jetson host, if you have jetpack 4.x installed, it incudes OpenCV (with Gstreamer). 
If you use it from a container, you can base the image from `nvcr.io/nvidia/dli/dli-nano-ai:v2.0.1-r32.4.4`

The API exposes camera's height/weight/format/value as [traitlets](https://traitlets.readthedocs.io/en/stable/).

```
from jetcam.usb_camera import USBCamera

camera = USBCamera(capture_device=1)
image = camera.read()
```

To register a callback:

```
camera.running = True

def callback(change):
    new_image = change['new']
    # do some processing...

camera.observe(callback, names='value')
```

### Use JetCam from a docker container
If you use the container, for USB camera, pass the `--device` option in docker run. e.g, if the USB camera is at `/dev/video1`, then you use `--device /dev/video0` in docker run command. 

For CSI camera, you need to pass the volume option `--volume /tmp/argus_socket:/tmp/argus_socket`

## Python Wrapper of Kinect Sensor SDK

[https://github.com/etiennedub/pyk4a](https://github.com/etiennedub/pyk4a)

Example code to get depth image:
```
import pyk4a
import cv2
config = pyk4a.Config(
      color_resolution=pyk4a.ColorResolution.OFF,
      depth_mode=pyk4a.DepthMode.NFOV_UNBINNED,
      synchronized_images_only=False
      ) 
k4a = pyk4a.PyK4A(config)
k4a.start()

capture = k4a.get_capture()
if np.any(capture.depth):
   cv2.imshow("k4a", colorize(capture.depth, (None, 5000), cv2.COLORMAP_HSV))

k4a.stop()
```


# Setup torch and torchvision

Nvidia provides python package wheel files for torch v1.7.0. 
See nvidia forum message [https://forums.developer.nvidia.com/t/pytorch-for-jetson-version-1-7-0-now-available/72048](https://forums.developer.nvidia.com/t/pytorch-for-jetson-version-1-7-0-now-available/72048) for more information. 





```
wget https://nvidia.box.com/shared/static/cs3xn3td6sfgtene6jdvsxlr366m2dhq.whl -O torch-1.7.0-cp36-cp36m-linux_aarch64.whl
sudo apt-get install python3-pip libopenblas-base libopenmpi-dev 

# it is recommended that you do the following under a virtual environment
pip3 install Cython
pip3 install numpy torch-1.7.0-cp36-cp36m-linux_aarch64.whl
```

After this, you would need to install torchvision from source. 

```
sudo apt-get install libjpeg-dev zlib1g-dev
```

If you have installed ffmpeg on the host, then you would need to install a few dev packages.

```
sudo apt-get install libavcodec-dev libswscale-dev
```

For torch v1.7.0, choose torchvision 0.8.0. Get the source code and then install the package

```
git clone -b v0.8.0 https://github.com/pytorch/vision torchvision
cd torchvision
python setup.py install
```

# Install JupyterLab


```
# run under a virtual environment
pip3 install jupyterlab

jupyter lab --generate-config

# set the password to 'nvidia'
CONFPATH=$HOME/.jupyter/jupyter_notebook_config.json
python3 -c "from notebook.auth.security import set_password; set_password('nvidia', '$CONFPATH')"

```

To start jupyterlab

```
jupyter lab --ip 0.0.0.0 --port 8888
```
