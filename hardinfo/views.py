from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
import psutil,time,os,subprocess,sys
import json

# Create your views here.
def run_the_cmd(cmd):
    p = subprocess.Popen(cmd,shell=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
    msg = p.stdout.readlines()
    li = []
    for x in msg:
        li.append(x.decode())
    return li


def get_bios_info(request):
    msg = run_the_cmd("dmidecode -t bios | grep -E 'Vendor|Version|Date|ROM Size'")
    msg = list(map(lambda x:x.replace("：",":").split(':')[1].lstrip(' ').strip('\n'),msg))
    bios_info = {}
    bios_info['vendor'] = msg[0]
    bios_info['ver'] = msg[1]
    bios_info['date'] = msg[2]
    bios_info['size'] = msg[3]
    return JsonResponse(bios_info)


def get_eth_info(request):
    msg = run_the_cmd("lspci | grep 'Ethernet'")
    eth_info = {}
    i=0
    for x in msg:
        msg = x.split(':')[-1:][0].strip('\n')
        eth_info['eht%d' % i] = msg
        i+=1
    return JsonResponse(eth_info)

#没有考虑多显卡
def get_vga_info(request):
    msg = run_the_cmd("lspci | grep 'VGA'")
    msg = msg[0].split(':')[-1:][0].strip('\n')
    return JsonResponse({'vga':msg})

def get_board_info(request):
    msg = run_the_cmd("lspci | grep 'Host bridge'")
    msg = msg[0].split(':')[-1:][0].strip('\n')
    return JsonResponse({'board':msg})

def get_cpu_info(request):
    msg = run_the_cmd("lscpu")
    msg = list(map(lambda x:x.replace("：",":").split(':')[1].lstrip(' ').strip('\n'),msg))
    cpu_info = {}
    cpu_info['arch'] = msg[0]
    cpu_info['core'] = msg[3]
    cpu_info['company'] = msg[9]
    cpu_info['model'] = msg[12]
    cpu_info['clock'] = msg[14]
    cpu_info['flags'] = msg[23]
    return JsonResponse(cpu_info)

def get_processes_info(request):
    proc_info = {}
    for proc in psutil.process_iter():
        pinfo = proc.as_dict(attrs=['pid','name'])
        proc_info['%d'%pinfo['pid']] = pinfo['name']
    return JsonResponse(proc_info)


def get_disk_usage(request):
    disk = psutil.disk_partitions()
    disk_info = {}
    i = 0
    for x in disk:
        disk_info['part%d'%i] = x.device.replace("/dev/","")
        disk_info['mount%d'%i] = x.mountpoint
        usage = psutil.disk_usage(x.mountpoint)
        disk_info['part_free%d'%i] = usage.free/(1024*1024)
        disk_info['part_usage%d'%i] = usage.used/(1024*1024)
        i+=1
    disk_info['part_count'] = i
    return JsonResponse(disk_info)

def get_swap_usage(request):
    swap = psutil.swap_memory().total/(1024*1024)
    usage = psutil.swap_memory().used/(1024*1024)
    return JsonResponse({"total":swap,"usage":usage})

def get_ram_usage(request):
    ram = psutil.virtual_memory().total/(1024*1024)
    usage = psutil.virtual_memory().used/(1024*1024)
    free = psutil.virtual_memory().free/(1024*1024)
    return JsonResponse({"total":ram,"usage":usage,"free":free})

def get_cpu_usage(request):
    cpu_count = psutil.cpu_count()
    usage = {}
    for x in range(cpu_count):
        usage['cpu%d' % x] = psutil.cpu_percent(x,False)
    usage['count'] = cpu_count
    return JsonResponse(usage)


def get_boot_time(request):
    mic = psutil.boot_time()
    boot_time = {}
    boot_time['mic'] = mic * 1000
    return JsonResponse(boot_time)

def get_eth_name_s():
    eth_info = psutil.net_io_counters(pernic=True).keys()
    eth_list = []
    for x in eth_info:
        if x != 'lo':
            eth_list.append(x)
    eth_list.sort()
    return eth_list

def get_eth_name(request):
    eth_list = get_eth_name_s()
    return JsonResponse({'eth':eth_list})

def get_net_io(request):
    eth_info = get_eth_name_s()
    old_recv = {}
    old_sent = {}
    recv = {}
    sent = {}
    for key in eth_info:
        old_recv.setdefault(key, psutil.net_io_counters(pernic=True).get(key).bytes_recv)
        old_sent.setdefault(key, psutil.net_io_counters(pernic=True).get(key).bytes_sent)
    time.sleep(1)
    for key in eth_info:
        re = (psutil.net_io_counters(pernic=True).get(key).bytes_recv - old_recv[key]) / (1024*1024)
        se = (psutil.net_io_counters(pernic=True).get(key).bytes_sent - old_sent[key]) / (1024*1024)
        recv.setdefault(key,re)
        sent.setdefault(key,se)
    net_io = {'eth':eth_info,'recv':recv,'sent':sent}
    return JsonResponse(net_io)

def hardinfo(request):
    return render(request,'hardinfo.html')

def index(request):
    return render(request,'dashboard.html')

