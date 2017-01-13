from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$',views.index,name='index'),
    url(r'^hardinfo/$',views.hardinfo,name='index_hardinfo'),
    url(r'^process/$',views.process,name='index_process'),
    url(r'^page/$',views.page,name='index_page'),

    url(r'^get_net_io/$',views.get_net_io,name='get_net_io'),
    url(r'^get_vga_info/$',views.get_vga_info,name='get_vga_info'),
    url(r'^get_bios_info/$',views.get_bios_info,name='get_bios_info'),
    url(r'^get_eth_info/$',views.get_eth_info,name='get_eth_info'),
    url(r'^get_eth_name/$',views.get_eth_name,name='get_eth_name'),
    url(r'^get_board_info/$',views.get_board_info,name='get_board_info'),
    url(r'^get_cpu_info/$',views.get_cpu_info,name='get_cpu_info'),
    url(r'^get_processes_info/$',views.get_processes_info,name='get_processes_info'),

    url(r'^get_disk_usage/$',views.get_disk_usage,name='get_disk_usage'),
    url(r'^get_swap_usage/$',views.get_swap_usage,name='get_swap_usage'),
    url(r'^get_ram_usage/$',views.get_ram_usage,name='get_ram_usage'),
    url(r'^get_cpu_usage/$',views.get_cpu_usage,name='get_cpu_usage'),
    url(r'^get_boot_time/$',views.get_boot_time,name='get_boot_time'),
    url(r'^get_info/$',views.get_info,name='get_info'),
]


