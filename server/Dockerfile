FROM python:3-alpine3.19

WORKDIR /server

COPY . .

RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD python ./server.py