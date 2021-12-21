
t = """\
set devices device {device_name}
set devices device {device_name} authgroup CARE address {ip} device-type cli ned-id {NED}
set devices device {device_name} state admin-state unlocked
commit
request devices device {device_name} ssh fetch-host-keys
request devices device {device_name} sync-from
"""

auth_template = """\
set devices authgroups group {auth_group}
set devices authgroups group {auth_group} default-map remote-name {auth_user} remote-password {auth_pw}
"""
auth_group = "CARE"
auth_user = "coangel"
auth_pw = "Sn0wB@ll1"
IOS_NED = "cisco-ios-cli-6.74"
IOSXR_NED = "cisco-iosxr-cli-7.33"
devices = [{"name":"fws1-pe-1-a", "ip":"10.16.2.2", "NED": IOSXR_NED}, 
           {"name":"fws1-pe-1-b", "ip":"10.16.2.3", "NED": IOSXR_NED},
           {"name":"fws2-pe-1-a", "ip":"10.16.2.66", "NED": IOSXR_NED}, 
           {"name":"fws2-pe-1-b", "ip":"10.16.2.67", "NED": IOSXR_NED},
           {"name":"fws3-pe-1-a", "ip":"10.16.2.130", "NED": IOSXR_NED}, 
           {"name":"fws3-pe-1-b", "ip":"10.16.2.131", "NED": IOSXR_NED},
           {"name":"bb1-pe-1-a", "ip":"100.1.1.12", "NED": IOSXR_NED}, 
           {"name":"bb1-pe-1-b", "ip":"100.1.1.11", "NED": IOSXR_NED},
           {"name":"bb1-p-1-a", "ip":"100.1.1.10", "NED": IOSXR_NED}, 
           {"name":"bb1-p-1-b", "ip":"100.1.1.9", "NED": IOSXR_NED},]
output = """siteLibraryCopy Cisco_IOS-XR_Router_RTR-Template XR_RTR
siteLibraryCopy Cisco_IOS-XR_Router_NDM-Template XR_NDM
siteLibraryCopy Cisco_IOS-XE_Router_RTR-Template XE_ROUTER_RTR
siteLibraryCopy Cisco_IOS-XE_Router_NDM-Template XE_ROUTER_NDM
"""
output += auth_template.format(auth_group=auth_group, auth_user=auth_user, auth_pw=auth_pw)
for device in devices:
    tmp = t.format(device_name=device["name"], ip=device["ip"], NED=device["NED"])
    output += tmp
with open("output.txt", "w", newline='\n') as f:
    f.write(output)