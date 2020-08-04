# aNSOble

Project goal is to create an automation for NSO deployment and configuration with Ansible.

**This project may be used internally.**

## Usage

### Running aNSOble

To work with the setup first we would need a credentials to log into tail-f and GIT and download NEDs and packages.

User credentials are stored in hashed ansible-vault. To edit the data in the vault you need the go into /aNSOble folder and paste the following:

```ansible-vault edit ./setup_data_secure.yml```

Password of the vault is by default "cisco123".

Then you need to modify the vault file and edit the tail-f and GIT credentials:

```{bash}
#Server credentials and sudo password
ansible_user: cisco
ansible_password: cisco
ansible_become_password: cisco
 
#NEDs Repo Credentials
NEDsRepoUser: <NEDsRepoUser>
NEDsRepoPass: <NEDsRepoPass>
 
#GIT User Access
GITUser: <GITUser>
GITKeyPass: <GITKeyPass>
```

The next step is editing the server addresses used by the aNSOble playbook. You only need to put a proper address under the servers in the ansible_hosts file.

```{bash}
[servers]
10.48.190.167
10.48.190.168
```

Final step is running the aNSOble playbook. To run the playbook you need to run the command:

```ansible-playbook -i ansible_hosts aNSOble.yml --ask-vault-pass -vvv```

If you already have one of the stages already deployed on your setup you only need to add the "skip-tags" option:

```ansible-playbook -i ansible_hosts aNSOble.yml --skip-tags “install-NSO” --ask-vault-pass -vvv```

The content of the aNSOble.yml file is the following:

```{bash}
- hosts: servers
  vars_files:
    - 'setup_data.yml'
    - 'setup_data_secure.yml'
  roles:
    - { role: install-linux-packages, tags: [ 'install-linux-packages' ] }
    - { role: install-NSO, tags: [ 'install-NSO' ] , when: NSOInstallType is defined }
    - { role: install-NEDs, tags: [ 'install-NEDs' ] , when: NEDs is defined }
    - { role: install-repository-packages, tags: [ 'install-repository-packages' ] , when RepositoryURL is defoned }
    - { role: setup-netsim, tags: [ 'setup-netsim' ] , when: NetsimDevices is defined }
    - { role: setup-HA, tags: [ 'setup-HA' ] , when: SetupHA }
```

## Documentation

Full documentation can be found on SCDP page of project: ```https://scdp.cisco.com/conf/pages/viewpage.action?pageId=78614444```

## Contacts

Nicolas Fournier <nfournie@cisco.com>
Michał Dobiecki <mdobieck@cisco.com>
Sofia Athanasiou <sathanas@cisco.com>
Sunpreetsingh Arora <sunparor@cisco.com>
