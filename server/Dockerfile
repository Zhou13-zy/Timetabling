FROM python:3.11.8-alpine3.18 as builder

# Install build dependencies, including C++ compiler
RUN apk add --no-cache gcc musl-dev libffi-dev openssl-dev g++ cmake clang


WORKDIR /usr/src/app

COPY requirements.txt ./

# Upgrade pip and install requirements
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

COPY . .

FROM builder as tester

CMD ["python3", "-m", "pytest"]

FROM builder as final

EXPOSE 5005

CMD ["python3", "app.py"]