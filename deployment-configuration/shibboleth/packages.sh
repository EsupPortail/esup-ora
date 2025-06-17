#!/bin/bash

spawn apt-get install -y \
    apache2 \
    libapache2-mod-shib2 \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

expect << EOF
spawn tzselect
expect "Please select the geographic area in which you live"
send "7\r"
expect "Please select a country whose clocks agree with yours."
send "15\r"
expect "Is the above information OK?"
send "1\r"
expect eof
EOF