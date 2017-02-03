

eris init 

setenv

eris chains make --account-types=Root:1,Full:1,Developer:1,Validator:1 chaintonic
eris chains make --account-types=Root:2,Full:1 chaintonic
eris chains make --account-types=Root:1,Full:1,Validator:1 chaintonic


set chain_dir=%HOME%\.eris\chains\chaintonic
set chain_dir_this=%chain_dir%\chaintonic_developer_000
set chain_dir_this=%chain_dir%\chaintonic_full_000
eris chains start chaintonic --init-dir %chain_dir_this%

eris chains start chaintonic --init-dir C:\Users\dchavarri\.eris\chains\chaintonic\chaintonic_full_000


eris chains stop chaintonic
eris chains rm chaintonic --data --dir --force

node --inspect --debug-brk erisdbAPIExample.js


==============================================================


Making an Eris network
Requisites
Docker
Eris-cli
How to create the network
Run the following commands
Initialize eris-cli
$ eris init
Initialize eris-keys
$ eris services start keys
Create the chain and initialize it. We are going to assume that the chain name is “marmot”
$ eris chains make -w marmot
$ eris chains new marmot
When we type the first command we need to answer the following questions, in this case the answers are the following:
Are you ready to make your own chain (y/n)? y

Would you like to review each of the account groups before making the chain? (y/n) y

Do you care about setting the number of tokens for each account type? If not, the marmots will set reasonable defaults for you. (y/n) n

After the built in account groups would you like to make your manual (own) account groups with fine tuned permissions? (y/n) n

How many keys do you want in the Developer Group? (6) 0

How many keys do you want in the Full Group? (1) 1

This group appears to be a validating group. How many tokens would you like the Full Group to bond? 300

How many keys do you want in the Participant Group? (25) 2

How many keys do you want in the Root Group? (3) 0

How many keys do you want in the Validator Group? (7) 3

This group appears to be a validating group. How many tokens would you like the Validator Group to bond? 300  

When the chain is created, we need to export al the keys created To see the keys, we must type the following command:
$ eris keys ls

Then, we need to export all the keys, so we must export each key running the following command
$ eris keys export “id_key”

Then, we need to export all the files to our directory. We are going to assume that the new directory is ~/new_network
$ cp -r ~/.eris ~/new_network
$ cp -r ~/.eris/chains/marmot ~/new_network
$ cp  ~/.eris/chains/default/config.tom ~/new_network/marmot

We need to distribute the config .toml file to each node created and then customize this file. Edit the following lines of config.toml like this (leave untouched the rest):
moniker = "marmot_nodeName"
seeds = "ip_node:46656"

