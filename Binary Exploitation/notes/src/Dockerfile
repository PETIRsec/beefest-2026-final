FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y --no-install-recommends socat && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN useradd -m ctf
WORKDIR /home/ctf

COPY notes /home/ctf/challenge
COPY flag.txt /home/ctf/flag.txt

RUN HASH=$(md5sum /home/ctf/flag.txt | awk '{print $1}') && \
    mv /home/ctf/flag.txt /home/ctf/flag-${HASH}.txt

RUN chown -R root:root /home/ctf && \
    chmod -R 555 /home/ctf

USER ctf

EXPOSE 4919

CMD ["socat", "TCP-LISTEN:4919,reuseaddr,fork", "EXEC:/home/ctf/challenge"]
