#! /bin/bash

EXPORTER_VERSION="0.21.0"
wget https://github.com/prometheus/blackbox_exporter/releases/download/v${EXPORTER_VERSION}/blackbox_exporter-${EXPORTER_VERSION}.linux-amd64.tar.gz
tar -xvf blackbox_exporter-${EXPORTER_VERSION}.linux-amd64.tar.gz 
cd blackbox_exporter-${EXPORTER_VERSION}.linux-amd64

mkdir -p /etc/blackbox
mv blackbox_exporter /usr/local/bin/
mv blackbox.yml /etc/blackbox/
useradd -rs /bin/false blackbox
chown blackbox:blackbox /usr/local/bin/blackbox_exporter
chown -R blackbox:blackbox /etc/blackbox/*

cat >>/etc/systemd/system/blackbox.service <<END
[Unit]
Description=Blackbox Exporter Service
Wants=network-online.target
After=network-online.target

[Service]
Type=simple
User=blackbox
Group=blackbox
ExecStart=/usr/local/bin/blackbox_exporter --config.file=/etc/blackbox/blackbox.yml --web.listen-address=":9115"
StartLimitIntervalSec=0
Restart=always

[Install]
WantedBy=multi-user.target
END

systemctl daemon-reload
systemctl enable blackbox.service
systemctl start blackbox.service
