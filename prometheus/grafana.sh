#! /bin/bash

apt-get update
apt-get install -y apt-transport-https
apt-get install -y software-properties-common wget
wget -qO - https://packages.grafana.com/gpg.key | apt-key add -
apt-get update
echo "deb https://packages.grafana.com/oss/deb stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list
apt-get update
apt-get install grafana
systemctl start grafana-server
