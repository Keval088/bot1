# # Use an official Node.js runtime as a parent image
# FROM node:18-buster

# # Set environment variables
# ENV LOG_LEVEL=DEBUG
# ENV DISPLAY=:99

# # Install necessary packages
# RUN apt-get update && apt-get install -y \
#     firefox-esr \
#     wget \
#     xvfb \
#     libgtk-3-0 \
#     libdbus-glib-1-2 \
#     git \
#     sudo \
#     cython3 \
#     build-essential \
#     libffi-dev \
#     libbz2-dev \
#     libreadline-dev \
#     libsqlite3-dev \
#     zlib1g-dev \
#     libncurses5-dev \
#     libgdbm-dev \
#     libssl-dev \
#     liblzma-dev \
#     libtk8.6 \
#     && rm -rf /var/lib/apt/lists/*

# # Install Python 3.8 from source
# RUN wget https://www.python.org/ftp/python/3.8.18/Python-3.8.18.tgz \
#     && tar xzf Python-3.8.18.tgz \
#     && cd Python-3.8.18 \
#     && ./configure --enable-optimizations \
#     && make altinstall \
#     && cd .. \
#     && rm -rf Python-3.8.18 \
#     && rm Python-3.8.18.tgz

# # Install pip for Python 3.8
# RUN wget https://bootstrap.pypa.io/get-pip.py \
#     && python3.8 get-pip.py \
#     && rm get-pip.py

# # Install TorGhost
# RUN git clone https://github.com/SusmithKrishnan/torghost.git \
#     && cd torghost \
#     && chmod +x build.sh \
#     && ./build.sh \
#     && cp torghost /usr/local/bin/ \
#     && cd .. \
#     && rm -rf torghost

# # Set the working directory
# WORKDIR /app

# # Copy the Node.js application files
# COPY . .

# # Install Node.js dependencies
# RUN npm install

# # Start Xvfb, TorGhost, and then launch the Node.js application with a custom script
# CMD ["sh", "-c", "Xvfb :99 -screen 0 1920x1080x24 & torghost -s & npm start"]


#####################################################################################################################
# Base Image
FROM ubuntu:20.04

# Ensure the container runs as the root user
USER root

# Set Environment Variables
ENV LOG_LEVEL=DEBUG
ENV DISPLAY=:99
ENV DEBIAN_FRONTEND=noninteractive

# Update and Install Dependencies
RUN apt-get update && apt-get install -y \
    wget \
    sudo \
    curl \
    gnupg \
    lsb-release \
    software-properties-common \
    xvfb \
    firefox \
    git \
    cython3 \
    iptables \
    nano \
    build-essential \
    python3.8 \
    python3.8-dev \
    python3-pip \
    python3.8-distutils \
    libgtk-3-0 \
    libdbus-glib-1-2 \
    libgconf-2-4 \
    libncurses5-dev \
    libssl-dev \
    zlib1g-dev \
    libnss3 \
    libasound2 \
    cron \
    tor \
    python3-setuptools \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install Python 3.8
RUN wget https://www.python.org/ftp/python/3.8.18/Python-3.8.18.tgz \
    && tar xzf Python-3.8.18.tgz \
    && cd Python-3.8.18 \
    && ./configure --enable-optimizations \
    && make altinstall

# Install pip and Python packages
RUN wget https://bootstrap.pypa.io/get-pip.py \
    && python3.8 get-pip.py \
    && rm get-pip.py \
    && pip3 install packaging

# Upgrade pip, setuptools, and wheel
RUN python3 -m pip install --upgrade pip setuptools wheel \
    && pip3 install packaging
    
# Install GeckoDriver
RUN GECKODRIVER_VERSION=0.33.0 \
    && wget https://github.com/mozilla/geckodriver/releases/download/v$GECKODRIVER_VERSION/geckodriver-v$GECKODRIVER_VERSION-linux64.tar.gz \
    && tar -xzf geckodriver-v$GECKODRIVER_VERSION-linux64.tar.gz \
    && mv geckodriver /usr/local/bin/ \
    && rm geckodriver-v$GECKODRIVER_VERSION-linux64.tar.gz

# Install Torghost
RUN git clone https://github.com/SusmithKrishnan/torghost.git\
    && cd torghost \
    && chmod +x build.sh \
    && ./build.sh 

# Install npm dependencies separately to leverage caching
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Copy Application Code
COPY . .

# Expose Necessary Ports
EXPOSE 3000

# Start Services and Application
CMD ["sh", "-c", "Xvfb :99 -screen 0 1920x1080x24 & /app/loop.sh"]





####################################################################################

# # Use the official Node.js image as the base image
# FROM node:18-buster

# # Install necessary dependencies
# RUN apt-get update && apt-get install -y \
#     systemd-sysv \
#     cron \
#     git \
#     iptables \
#     cython3 \
#     wget \
#     xvfb \
#     libgtk-3-0 \
#     libdbus-glib-1-2 \
#     build-essential \
#     libffi-dev \
#     libbz2-dev \
#     libreadline-dev \
#     libsqlite3-dev \
#     libssl-dev \
#     zlib1g-dev \
#     curl \
#     python3-pip

# # Upgrade pip, setuptools, and wheel
# RUN python3 -m pip install --upgrade pip setuptools wheel

# # Install packaging
# RUN pip3 install packaging

# # Clone TorGhost repository and build
# RUN git clone https://github.com/SusmithKrishnan/torghost.git && \
#     cd torghost && \
#     chmod +x build.sh && \
#     ./build.sh && \
#     cp torghost /usr/local/bin/ && \
#     cd .. && \
#     rm -rf torghost

# # Install Tor from Tor Project's official repository
# RUN echo "deb https://deb.torproject.org/torproject.org $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/tor.list && \
#     curl https://deb.torproject.org/torproject.org/$(lsb_release -cs)/main.asc | gpg --dearmor | tee /etc/apt/trusted.gpg.d/tor.gpg && \
#     apt-get update && \
#     apt-get install -y tor

# # Install Node.js packages
# COPY . /app
# WORKDIR /app
# RUN npm install

# # Expose necessary ports
# EXPOSE 3000

# # Run the Node.js application
# CMD ["node", "index.js"]
