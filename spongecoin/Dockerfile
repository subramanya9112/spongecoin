FROM python:3.7
EXPOSE 80 
COPY ./spongecoin /app
WORKDIR /app
RUN pip install Cmake pycryptodome socketio flask Flask-Cors uuid requests python-socketio[client]
ENV FLASK_APP=app.py
ENV FLASK_ENV=docker
CMD [ "flask", "run" , "--port", "80", "--host", "spongecoin"]
