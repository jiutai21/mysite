from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
import psutil,time,os,subprocess
import json

# Create your views here.

def get_net_io(request):
    p = subprocess.Popen("ifstat 1/1 1",shell=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
    msg = p.stdout.readlines()
    msg = msg[2].decode()
    li = msg.split(' ')
    net={"in":li[4],"out":li[-1].strip('\n')}
    return JsonResponse(net)

def index(request):
    cpu = '90'
    return render(request,'index.html',{'cpu':cpu})
