FROM python

WORKDIR /app
RUN apt-get update && apt-get install -y gcc curl && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY main.py .

COPY readflag.c /tmp/readflag.c
RUN echo "BEEFEST{ez_right_rop_chain_tru_libuv_haha}" > /root/flag.txt && \
    chmod 400 /root/flag.txt && \
    gcc /tmp/readflag.c -o /readflag && \
    chown root:root /readflag && \
    chmod 4755 /readflag && \
    rm /tmp/readflag.c

RUN useradd -m ctf
USER ctf

CMD ["python", "main.py"]