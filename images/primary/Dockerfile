FROM vanbujm/moonbase-balena:v0.1.0
RUN [ "cross-build-start" ]
RUN sudo apt-get install git
RUN sudo apt-get install ssh
RUN sudo apt-get install tar
RUN sudo apt-get install gzip
RUN sudo apt-get install ca-certificates
RUN sudo apt-get install file
RUN yarn global add codecov
LABEL com.circleci.preserve-entrypoint=true
RUN wget https://www.dropbox.com/s/tj5cl6gbjz6u9fo/essential-build-artifacts-arm.zip\?dl\=1 -O ./essential-build-artifacts-arm.zip && unzip essential-build-artifacts-arm.zip && mkdir -p /essential-build-artifacts && rm -rdf /essential-build-artifacts/* && mv essential-build-artifacts/* /essential-build-artifacts/
ENV QEMU_EXECVE=1
ENV OPENCV4NODEJS_DISABLE_AUTOBUILD=1
RUN [ "cross-build-end" ]
ENTRYPOINT ["/usr/bin/qemu-arm-static", "/bin/bash"]
