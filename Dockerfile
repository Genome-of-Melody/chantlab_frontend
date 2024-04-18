FROM node:20-bullseye

# Copy all project files to the VM
COPY ./src /opt/chantlab_frontend/src
COPY ./.editorconfig /opt/chantlab_frontend/.editorconfig
COPY ./angular.json /opt/chantlab_frontend/angular.json
COPY ./karma.conf.js /opt/chantlab_frontend/karma.conf.js
COPY ./package-lock.json /opt/chantlab_frontend/package-lock.json
COPY ./package.json /opt/chantlab_frontend/package.json
COPY ./tsconfig.app.json /opt/chantlab_frontend/tsconfig.app.json
COPY ./tsconfig.json /opt/chantlab_frontend/tsconfig.json
COPY ./tsconfig.spec.json /opt/chantlab_frontend/tsconfig.spec.json
COPY ./tslint.json /opt/chantlab_frontend/tslint.json

# install all packages
RUN npm install -g npm@latest
RUN cd /opt/chantlab_frontend && npm install

# Change the working directory
WORKDIR /opt/chantlab_frontend

# Create the entrypoint script file and add the content
# Apply sed to remove extra spaces at beginnings that echo command added because of compounding strings
RUN echo '#!/bin/bash\n' \
    '# Script that supervisor uses to keep the chantlab front-end running.\n' \
    'if ! ps ax | grep -v grep | grep -e "ng serve --configuration production --host 0.0.0.0 --port 4200 --public-host $PUBLIC_HOST"' \
                                     '-e "ng serve --host 0.0.0.0 --port 4200 --public-host $PUBLIC_HOST" > /dev/null\n' \
    'then\n' \
    '    # Log restart\n' \
    '    echo "Chantlab frontend down; restarting run_chantlab_frontend.sh"\n' \
    '\n' \
    '    # Set the current BACKEND_URL\n' \
    '    jq ".BACKEND_URL = \"${BACKEND_URL}\"" /chantlab_frontend/src/app/config.json > /chantlab_frontend/src/app/config_tmp.json\n' \
    '    mv "/chantlab_frontend/src/app/config_tmp.json" "/chantlab_frontend/src/app/config.json"\n' \
    '\n' \
    '    # Run angular project\n' \
    '    # Check if DEBUG_MODE environment variable is set to "False"\n'\
    '   if [ "$DEBUG_MODE" = "False" ]; then\n'\
    '       ./node_modules/.bin/ng serve --configuration production --host "0.0.0.0" --port 4200 --public-host $PUBLIC_HOST\n' \
    '   else\n' \
    '       ./node_modules/.bin/ng serve --host "0.0.0.0" --port 4200 --public-host $PUBLIC_HOST\n' \
    '   fi\n' \
    'fi\n' \
    | sed 's/^ //g' \
    > /opt/run_chantlab_frontend.sh
RUN chmod +x /opt/run_chantlab_frontend.sh


# Install Supervisord
RUN apt-get update && apt-get install -y supervisor \
&& rm -rf /var/lib/apt/lists/*
RUN echo '[program:chantlab_frontend]\n' \
    'command=/opt/run_chantlab_frontend.sh\n' \
    'autostart=true\n' \
    'autorestart=true\n' \
    'stderr_logfile=/var/log/run_chantlab_frontend.err.log\n' \
    'stdout_logfile=/var/log/run_chantlab_frontend.out.log\n' \
    | sed 's/^ //g' \
    > "/etc/supervisor/conf.d/supervisord.conf"


# Install jq for updating backend url in when the application is restarted
RUN apt-get update && \
    apt-get install -y jq && \
    apt-get clean

# Set default ENV variables if not set yet (for instance in docker compose)
ENV PUBLIC_HOST="localhost"
ENV BACKEND_URL="localhost:8000/api/chants"
ENV DEBUG_MODE="True"

# Expose port 4200
EXPOSE 4200

CMD ["/usr/bin/supervisord","-n", "-c", "/etc/supervisor/supervisord.conf"]