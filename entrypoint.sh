#!/bin/sh
if [[ ! -z "${LOG_FILE}" ]]; then

    # Prepare log directory
    LOG_DIRECTORY="$(dirname "${LOG_FILE}")"
    [ -d "$LOG_DIRECTORY" ] || (mkdir "$LOG_DIRECTORY" && chown -R node:node "$LOG_DIRECTORY")
    [ -f "/var/run/application.pid" ] || (touch /var/run/application.pid && chown -R node:node /var/run/application.pid)

    # Setup logrotate
    set -e
    envsubst < /etc/application.logrotate.conf.template > /etc/application.logrotate.conf
    cat > /etc/periodic/hourly/application.logrotate.cron <<- EOM
#!/bin/sh
/usr/sbin/logrotate /etc/application.logrotate.conf
exit 0
EOM
    chmod +x /etc/periodic/hourly/application.logrotate.cron
    /usr/sbin/crond -f -l 2 > /dev/stdout 2> /dev/stderr &
fi

# start application
su node -c "cd /usr/src/app && dumb-init node dist/src/main.js"