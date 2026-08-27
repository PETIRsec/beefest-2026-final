FROM ubuntu:latest

RUN apt-get update 
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN useradd -U -m -s /bin/sh baby1

WORKDIR /home/baby1

COPY ./chall .
COPY ./ynetd /usr/bin/ynetd

RUN chown root:baby1 /usr/bin/ynetd
RUN chmod 750 /usr/bin/ynetd

RUN chmod -R 750 /home/baby1
RUN echo "LKSJ{c0e23a74ac4b0b25706a6cced1cabea2}" > ./flag.txt
RUN chmod 440 flag.txt
RUN chown -R root:baby1 /home/baby1

# ENSURE THE PORT YOU WANT TO USE IS NOT CURRENTLY USED BY ANOTHER CHALLENGE
# IF YOU ARE NOT SURE, CHECK THE SHEETS OR CONTACT THE HIGHER UPS   
EXPOSE 11101

CMD ["/usr/bin/ynetd", "-u","baby1", "-p", "11101", "/home/baby1/chall"]
