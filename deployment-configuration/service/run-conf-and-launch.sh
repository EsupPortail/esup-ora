#!/bin/bash

# Lancer supervisord
exec /usr/bin/supervisord -n -c /supervisord.conf
